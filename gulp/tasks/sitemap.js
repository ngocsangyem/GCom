export default {
	build: 4,
	name: 'task:sitemap',

	init(done) {
		const files = this.paths.dist('*.html');
		const save = require('gulp-save');

		if (this.isDev) {
			return done();
		}

		return this.gulp
			.src(files, { read: false })
			.pipe(save('before-sitemap'))
			.pipe(this.sitemap()) // Returns sitemap.xml
			.pipe(this.dest())
			.pipe(save.restore('before-sitemap'));
	},

	dest() {
		return this.gulp.dest(this.paths._dist);
	},

	sitemap() {
		return require('gulp-sitemap')({
			siteUrl: this.config.app.url,
		});
	},
};
