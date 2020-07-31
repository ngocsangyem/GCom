export default {
	build: 4,
	name: 'task:copy:fonts:component',
	fontsPath: function () {
		return this.isDev ? this.dirsDev.fonts : this.dirsProd.fonts;
	},
	globs: function () {
		return ['**', this.fontsPath(), '*.{eot,svg,ttf,woff,woff2}'];
	},

	init(done) {
		const files = this.store.fonts || [];
		const options = {
			// since: this.since.bind(this),
		};

		if (this.isDev) {
			const all = this.paths.app(...this.globs());

			if (!files.includes(all)) {
				files.push(all);
			}
		} else {
			const always = this.globs()
				.join('::')
				.replace('*.{', '*@always.{')
				.split('::');

			files.push(this.paths.app(...always));
		}

		if (files.length === 0) {
			return done();
		}

		return this.gulp
			.src(files, options)
			.pipe(this.plumber())
			.pipe(this.dest());
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

			file.path = path.join(file.base, basename);

			return this.paths._font;
		});
	},

	since(file) {
		const isModule = file.path.indexOf(this.paths._app) === -1;
		return isModule ? null : this.gulp.lastRun(this.name);
	},
};
