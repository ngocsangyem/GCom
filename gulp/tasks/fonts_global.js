export default {
	build: 4,
	name: 'task:copy:fonts:global',
	globs: function () {
		return [this.buildPath.fonts, '**', '*.{eot,svg,ttf,woff,woff2}'];
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
		return this.gulp.dest(this.paths._fonts);
	},

	since(file) {
		const isModule = file.path.indexOf(this.paths._components) === -1;
		return isModule ? null : this.gulp.lastRun(this.name);
	},
};
