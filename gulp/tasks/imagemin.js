export default {
	build: 4,
	name: 'task:imagemin',

	init(done) {
		const files = [];
		const minify = (this.minify = this.config.build.imagemin);
		const ignore = (this.ignore = this.config.optimization.ignore);

		if (minify.length > 0) {
			let names = '*';

			if (ignore.length > 0) {
				names = `!(${ignore.join('|')})`;
			}

			files.push(this.paths.dist(`**/${names}.{${minify.join(',')}}`));
		}

		if (this.isDev || files.length === 0) {
			return done();
		}

		return this.gulp
			.src(files)
			.pipe(this.plumber())
			.pipe(this.imagemin())
			.pipe(this.dest());
	},

	dest() {
		return this.gulp.dest((file) => file.base);
	},

	imagemin() {
		const imagemin = require('gulp-imagemin');
		const plugins = [];

		if (this.minify.includes('svg')) {
			plugins.push(
				imagemin.svgo({ plugins: this.config.optimization.svg })
			);
		}

		if (this.minify.includes('jpg')) {
			plugins.push(imagemin.jpegtran(this.config.optimization.jpg));
		}

		if (this.minify.includes('png')) {
			plugins.push(imagemin.optipng(this.config.optimization.png));
		}

		if (this.minify.includes('gif')) {
			plugins.push(imagemin.gifsicle(this.config.optimization.gif));
		}

		return imagemin(plugins, { verbose: true });
	},
};
