import fs from 'fs';
export default {
	name: 'task:styles',
	build: 2,
	init(done) {
		// const styles = (this.store.styles = {});
		// const checkFiles = require(this.paths.core('checkFiles'));
		// checkFiles('styles', this);
		fs.writeFile('./store.json', JSON.stringify(this.store), (err) => {
			if (err) {
				console.log(err);
			}
		});
		// if (this.isDev || !this.config.build.bundles.includes('css')) {
		// 	const files = styles[this.mainBundle] || [];

		// 	return this.compileBundle(files, this.mainBundle, done);
		// } else {
		// 	return this.compileBundles(styles);
		// }
	},

	compileBundle(files, bundle, done) {
		if (files.length === 0) {
			return done();
		}

		const options = {
			sourcemaps: this.config.build.sourcemaps.includes('css'),
		};

		return (
			this.gulp
				.src(files, options)
				// .pipe(this.plumber())
				// .pipe(this.addGlobalHelper())
				// .pipe(this.compile())
				// .pipe(this.parseURLs())
				// .pipe(this.concat(bundle))
				// .pipe(this.postcss(bundle))
				// .pipe(this.dest(this.isDev ? options.sourcemaps : false))
				// .pipe(this.cssnano())
				// .pipe(this.rename())
				// .pipe(this.minifyDest(options.sourcemaps))
				.on('end', done)
		);
	},

	compileBundles(bundles) {
		const promises = [];

		Object.keys(bundles).forEach((bundle) => {
			const files = bundles[bundle];

			if (files.length === 0) return;

			const promise = new Promise((resolve, reject) => {
				this.compileBundle(files, bundle, resolve);
			});

			return promises.push(promise);
		});

		return Promise.all(promises);
	},
};
