export default {
	build: 3,
	name: 'task:assets',
	globs: function () {
		return ['*', '*', this.buildPath.assets, '**', '*.*'];
	},
	init(done) {
		const files = this.store.assets || [];
		const options = {
			since: this.since.bind(this),
		};

		// if (this.isDev) {
		// 	const all = this.paths.app(...this.globs());

		// 	if (!files.includes(all)) {
		// 		files.push(all);
		// 	}
		// } else {
		// 	const always = this.globs()
		// 		.join('::')
		// 		.replace('*.{', '*@always.{')
		// 		.split('::');

		// 	files.push(this.paths.app(...always));
		// }

		const all = this.paths.app(...this.globs());

		if (!files.includes(all)) {
			files.push(all);
		}

		if (files.length === 0) {
			return done();
		}

		return this.gulp
			.src(files, options)
			.pipe(this.plumber())
			.pipe(this.dest());
	},

	since(file) {
		const isModule = file.path.indexOf(this.paths._components) === -1;
		return isModule ? null : this.gulp.lastRun(this.name);
	},

	checkCSS() {
		return require('gulp-if')(
			(file) => this.path.extname(file.path) === '.css',
			this.parseURLs()
		);
	},

	watch() {
		return {
			files: this.paths.app(...this.globs()),
			tasks: this.name,
			on: {
				event: 'add',
				handler: require(this.paths.core('editTime')),
			},
		};
	},

	dest() {
		return this.gulp.dest((file) => {
			const path = this.path;
			const basename = path.basename(file.path).replace('@always', '');
			const extname = path.extname(basename);

			if (extname === '.js') {
				file.path = path.join(file.base, basename);
				return this.paths._scripts;
			} else if (extname === '.css') {
				file.path = path.join(file.base, basename);
				return this.paths._styles;
			} else {
				let array = path
					.relative(this.paths._app, file.path)
					.split(path.sep)
					.slice(1);
				let asset = [array[0]].concat(array.slice(2));

				if (asset.includes('favicons')) {
					file.path = path.join(file.base, basename);

					return this.paths._favicons;
				} else {
					asset = asset.join(path.sep).replace('@always', '');

					file.path = path.join(file.base, asset);

					return this.paths._static;
				}
			}
		});
	},

	parseURLs() {
		const parseCssUrl = require(this.paths.core('parseCssUrl'));

		if (!this.store.imgs) {
			this.store.images = [];
		}
		if (!this.store.fonts) {
			this.store.fonts = [];
		}

		return require('gulp-postcss')([
			require('postcss-url')({
				url: parseCssUrl.bind(this),
			}),
		]);
	},
};
