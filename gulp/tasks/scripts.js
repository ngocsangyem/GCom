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
			files = this.paths.pages(
				'**/*',
				`${this.mainBundle}.${this.extname()}`
			);
		} else {
			files = this.paths.pages(`**/*.${this.extname()}`);
		}

		return this.compile(files, done);

		// return new Promise((resolve, reject) => {
		// 	webpack(WebpackConfig, (err, stats) => {
		// 		if (err) {
		// 			console.log('Webpack', err);
		// 			reject(err);
		// 		}
		// 		console.log(
		// 			stats.toString({
		// 				colors: {
		// 					green: '\u001b[32m',
		// 				},
		// 			})
		// 		);
		// 		resolve();
		// 	});
		// });
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
		return (
			this.gulp
				.src(files)
				.pipe(named())
				.pipe(
					webpack(WebpackConfig, compiler, function (err, stats) {
						/* Use stats to do more things if needed */
					})
				)
				.pipe(this.rename())
				// .pipe(this.sourcemapInit())
				// .pipe(this.through())
				// .pipe(this.sourcemapWrite())
				.pipe(this.dest())
				.on('end', done)
		);
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

	sourcemapInit() {
		return require('gulp-if')(
			this.isDev,
			require('gulp-sourcemaps').init({ loadMaps: true })
		);
	},

	sourcemapWrite() {
		return require('gulp-if')(
			this.isDev,
			require('gulp-sourcemaps').write()
		);
	},

	through() {
		return require('through2').obj(function (file, enc, cb) {
			// Dont pipe through any source map files as it will be handled
			// by gulp-sourcemaps
			const isSourceMap = /\.map$/.test(file.path);
			if (!isSourceMap) this.push(file);
			cb();
		});
	},
};
