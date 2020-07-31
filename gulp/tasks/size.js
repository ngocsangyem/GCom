export default {
	build: 5,
	name: 'task:size',

	init(done) {
		if (this.isDev) {
			return done();
		}

		const files = this.paths.dist('**/*');

		return this.gulp
			.src(files)
			.pipe(this.size())
			.pipe(this.dest())
			.pipe(this.sizeReport())
			.pipe(
				this.notify({
					onLast: true,
					message: () => `Total size ${this.size().prettySize}`,
				})
			);
	},

	dest() {
		return this.gulp.dest(this.paths._dist);
	},

	size() {
		return require('gulp-size')({
			gzip: true,
		});
	},

	sizeReport() {
		return require('gulp-sizereport')({
			gzip: true,
			'*': {
				maxSize: 100000,
			},
		});
	},
};
