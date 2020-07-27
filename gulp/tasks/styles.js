export default {
	name: 'task:styles',
	build: 2,
	extname: function () {
		return this.config.component.styles.slice(1);
	},
	init(done) {
		// this.fs.writeFileSync('./store.json', JSON.stringify(this.store));

		if (this.isDev || !this.config.build.bundles.includes('css')) {
			const mainBundleStyles = require(this.paths.core(
				'mainBundleStyles'
			));
			let files;
			mainBundleStyles(this);
			if (this.extname() === 'css') {
				files = this.store.pages[this.mainBundle] || [];
			} else {
				files = this.paths.app(`${this.mainBundle}.${this.extname()}`);
			}
			return this.compileBundle(files, this.mainBundle, done);
		} else {
			const styles = this.store.pages;
			return this.compileBundles(styles);
		}
	},

	watch() {
		return {
			files: this.paths.app('**', `*{.css,.${this.extname()}}`),
			tasks: this.name,
		};
	},

	dest() {
		return this.gulp.dest(this.paths._styles);
	},

	compileBundle(files, bundle, done) {
		if (files.length === 0) {
			return done();
		}

		const options = {
			sourcemaps: this.config.build.sourcemaps.includes('css'),
		};

		return this.gulp
			.src(files, options)
			.pipe(this.plumber())
			.pipe(this.addGlobal())
			.pipe(this.sourcemapInit())
			.pipe(this.compile())
			.pipe(this.rename())
			.pipe(this.sourcemapWrite())
			.pipe(this.concat(bundle))
			.pipe(this.sortMediaQuery())
			.pipe(this.postcss())
			.pipe(this.cssnano())
			.pipe(this.dest())
			.on('end', done);
	},

	compileBundles(bundles) {
		const promises = [];

		Object.keys(bundles).forEach((bundle) => {
			if (bundle !== this.mainBundle) {
				const files = bundles[bundle].styles;

				if (!files) {
					return;
				}

				const promise = new Promise((resolve, reject) => {
					this.compileBundle(files, bundle, resolve);
				});

				return promises.push(promise);
			}
		});

		return Promise.all(promises);
	},

	addGlobal() {
		if (!this.isDev || this.config.build.bundles.includes('css')) {
			return this.pipe();
		}

		return this.pipe(
			require(this.paths.core('injectCSSHelper')),
			this,
			'injectCSSHelper'
		);
	},

	compile() {
		let extname = this.config.component.styles.slice(1);

		if (extname === 'scss') {
			extname = 'sass';
		}

		if (typeof this[extname] === 'function') {
			return this[extname]();
		}

		console.log(
			`\nSorry, for now support only sass files, you must tune "${this.name}" task for compile another CSS preprocessors!\n`
		);

		return this.css();
	},

	sass() {
		const Fiber = require('fibers');
		return require('gulp-sass')({
			fiber: Fiber,
			outputStyle: 'expanded',
			precision: 10,
		});
	},

	css() {
		this.preprocessor = false;
		return this.pipe();
	},

	postcss() {
		const postcss = require('gulp-postcss');
		const autoprefixer = require('autoprefixer');
		const cssDeclarationSorter = require('css-declaration-sorter');
		const plugins = [
			autoprefixer({
				grid: true,
			}),
			cssDeclarationSorter({
				order: 'concentric-css',
			}),
		];

		return require('gulp-if')(!this.isDev, postcss(plugins));
	},

	cssnano() {
		const config = {
			reduceTransforms: false,
			discardUnused: false,
			convertValues: false,
			normalizeUrl: false,
			autoprefixer: false,
			reduceIdents: false,
			mergeIdents: false,
			zindex: false,
			calc: false,
		};
		return require('gulp-if')(
			this.forMinify.bind(this),
			require('gulp-cssnano')(config)
		);
	},

	sourcemapInit() {
		return require('gulp-if')(this.isDev, this.sourcemaps.init());
	},

	sourcemapWrite() {
		return require('gulp-if')(this.isDev, this.sourcemaps.write('.'));
	},

	sortMediaQuery() {
		return require('gulp-if')(
			!this.isDev,
			require('gulp-group-css-media-queries')()
		);
	},

	concat(bundle) {
		return require('gulp-if')(
			this.extname() === 'css',
			require('gulp-concat')(`${bundle}.css`)
		);
	},

	rename() {
		return require('gulp-rename')(
			function (path) {
				path.basename = path.basename.replace(/\.[^/.]+$/, '');
				if (this.isDev) {
					path.extname = '.css';
				} else {
					path.extname = '.min.css';
				}
			}.bind(this)
		);
	},

	forMinify(file) {
		return !this.isDev && this.path.extname(file.path) === '.css';
	},
};
