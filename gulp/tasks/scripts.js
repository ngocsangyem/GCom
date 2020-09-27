import webpack from 'webpack-stream';
import named from 'vinyl-named';
import compiler from 'webpack';

import { WebpackConfig } from '../../webpack/webpack.config';

export default {
	name: 'task:scripts',
	build: 3,
	extname: function () {
		return this.config.component.scripts.extension.slice(1);
	},

	init(done) {
		const scripts = (this.store.scripts = {});
		const checkFiles = require(this.paths.core('checkFiles'));
		checkFiles('scripts', this);
		// console.log('init -> scripts', scripts);
		if (!this.config.build.bundles.includes('js')) {
			const files = scripts[this.mainBundle] || [];
			return this.compileBundle(files, this.mainBundle, done);
		} else {
			return this.compileBundles(scripts);
		}
	},

	watch() {
		return {
			files: this.paths.app(
				'**',
				'!(deps)' + this.config.component.scripts.extension
			),
			tasks: this.name,
		};
	},

	dest() {
		return this.gulp.dest(this.paths._scripts);
	},

	compileBundle(files, bundle, done) {
		if (files.length === 0) {
			return done();
		}

		return (
			this.gulp
				.src(files)
				// .pipe(named())
				.pipe(
					webpack(WebpackConfig, compiler, function (err, stats) {
						if (err) {
							throw err;
						}
					})
				)
				.pipe(this.concat(bundle))
				.pipe(this.rename())
				.pipe(this.dest())
				.on('end', done)
		);
	},

	compileBundles(bundles) {
		const promises = [];
		Object.keys(bundles).forEach((bundle) => {
			if (bundle !== this.mainBundle) {
				const files = bundles[bundle] || [];
				const promise = new Promise((resolve, reject) => {
					this.compileBundle(files, bundle, resolve);
				});

				return promises.push(promise);
			}
		});

		return Promise.all(promises);
	},

	cached() {
		return require('gulp-cached')('scripts_compile');
	},

	concat(bundle) {
		return require('gulp-concat')({
			path: this.path.join(
				this.paths._root,
				`${bundle}.${this.extname()}`
			),
		});
	},

	rename() {
		const ext = this.isDev
			? `.${this.extname()}`
			: `.min.${this.extname()}`;
		return require('gulp-rename')(function (path) {
			path.basename = path.basename.replace(/\.[^/.]+$/, '');
			path.extname = ext;
		});
	},
};
