const fs = require('fs');
export default {
	build: 4,
	name: 'task:copy:images:global',
	globs: function () {
		return [
			this.buildPath.images,
			'**',
			'*.{webp,png,jpg,jpeg,svg,gif,ico}',
		];
	},

	init(done) {
		fs.writeFileSync('./store.json', JSON.stringify(this.store));
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
		return this.gulp.dest(this.paths._images);
	},

	since(file) {
		const isModule = file.path.indexOf(this.paths._components) === -1;
		return isModule ? null : this.gulp.lastRun(this.name);
	},
};
