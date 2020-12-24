module.exports = {
	build: 4,
	name: 'task:inject',

	init(done) {
		if (this.isDev) {
			return done();
		}
		const files = this.paths.dist('*.html');

		return this.gulp
			.src(files)
			.pipe(this.plumber())
			.pipe(this.inject())
			.pipe(this.dest());
	},

	dest() {
		return this.gulp.dest(this.paths._dist);
	},

	inject() {
		const inject = require(this.paths.core('inject'));

		return this.pipe(inject, this, 'inject');
	},
};
