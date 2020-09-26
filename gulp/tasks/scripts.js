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
		// const scripts = (this.store.scripts = {});
		// const checkFiles = require(this.paths.core('checkFiles'));
		// checkFiles('scripts', this);
		let files;
		if (!this.config.build.bundles.includes('js')) {
			const mainBundleScripts = require(this.paths.core(
				'mainBundleScripts'
			));
			mainBundleScripts(this);
			files = this.paths.app(
				'**',
				`${this.mainBundle}.${this.extname()}`
			);
		} else {
			files = this.paths.pages(`**/*.${this.extname()}`);
		}

		return this.compile(files, done);
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

	compile(files, done) {
		return this.gulp
			.src(files)
			.pipe(named())
			.pipe(
				webpack(WebpackConfig, compiler, function (err, stats) {
					if (err) {
						throw err;
					}
				})
			)
			.pipe(this.rename())
			.pipe(this.dest())
			.on('end', done);
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
