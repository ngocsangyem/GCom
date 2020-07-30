export default {
	build: 4,
	name: 'task:copy:fonts:global',
	fontsPath: function () {
		return this.isDev ? this.dirsDev.fonts : this.dirsProd.fonts;
	},
	globs: function () {
		return ['**', this.fontsPath(), '*.{eot,svg,ttf,woff,woff2}'];
	},

	init(done) {
		const files = this.paths.assets(...this.globs());
		const options = {
			since: this.since.bind(this),
		};

		return this.gulp
			.src(files, options)
			.pipe(this.plumber())
			.pipe(this.dest());
	},

	watch() {
		return {
			files: this.paths.assets(...this.globs()),
			tasks: this.name,
			on: {
				event: 'add',
				handler: require(this.paths.core('editTime')),
			},
		};
	},

	dest() {
		return this.gulp.dest(this.paths._static);
	},

	since(file) {
		const isModule = file.path.indexOf(this.paths._components) === -1;
		return isModule ? null : this.gulp.lastRun(this.name);
	},
};
