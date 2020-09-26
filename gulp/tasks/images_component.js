export default {
	build: 4,
	name: 'task:copy:images:component',
	globs: function () {
		return [
			'**',
			this.buildPath.images,
			'**',
			'*.{webp,png,jpg,jpeg,svg,gif,ico}',
		];
	},

	init(done) {
		const files = this.store.images || [];
		const options = {
			since: this.since.bind(this),
		};
		// In dev all files

		// if (this.isDev) {
		// 	const all = this.paths.components(...this.globs());

		// 	if (!files.includes(all)) {
		// 		files.push(all);
		// 	}
		// } else {
		// 	const always = this.globs()
		// 		.join('::')
		// 		.replace('*.{', '*@always.{')
		// 		.split('::');

		// 	files.push(this.paths.components(...always));
		// }

		const all = this.paths.components(...this.globs());

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

	watch() {
		return {
			files: this.paths.components(...this.globs()),
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
			const isSprite =
				file.path.indexOf(path.join('img', 'sprite')) !== -1;
			const relative =
				file.path.indexOf(this.paths._app) !== -1
					? this.paths._app
					: this.paths._root;
			const component = path
				.relative(relative, file.path)
				.split(path.sep)[1];
			const name =
				(isSprite ? 'sprite_' : '') + `${component}_${basename}`;

			file.path = path.join(file.base, name);

			return this.paths._img;
		});
	},

	since(file) {
		const isModule = file.path.indexOf(this.paths._components) === -1;
		return isModule ? null : this.gulp.lastRun(this.name);
	},
};
