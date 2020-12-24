module.exports = {
	name: 'task:styles',
	build: 3,
	extname: function () {
		return this.config.component.styles.slice(1);
	},
	init(done) {
		const styles = (this.store.styles = {});
		const checkFiles = require(this.paths.core('checkFiles'));
		checkFiles('styles', this);
		if (!this.config.build.bundles.includes('css')) {
			const files = styles[this.mainBundle] || [];
			return this.compileBundle(files, this.mainBundle, done);
		} else {
			return this.compileBundles(styles);
		}
	},

	watch() {
		return [
			{
				files: this.paths.app('**', `*{.css,.${this.extname()}}`),
				tasks: this.name,
			},
		];
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
			// since: this.gulp.lastRun('task:styles'),
		};

		return this.gulp
			.src(files, options)
			.pipe(this.plumber())
			.pipe(this.sourcemapInit())
			.pipe(this.compile())
			.pipe(this.cached())
			.pipe(this.depend())
			.pipe(this.parseURLs())
			.pipe(this.concat(bundle))
			.pipe(this.removeDuplicate())
			.pipe(this.sourcemapWrite())
			.pipe(this.postcss(bundle))
			.pipe(this.cssnano())
			.pipe(this.rename())
			.pipe(this.dest())
			.on('end', done);
	},

	compileBundles(bundles) {
		const promises = [];
		Object.keys(bundles).forEach((bundle) => {
			if (bundle !== this.mainBundle) {
				const files = bundles[bundle] || [];
				const promise = new Promise((resolve, reject) => {
					this.compileBundle(files, bundle, resolve);
				});

				return promises.push(promise);
			}
		});
		return Promise.all(promises);
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

	cached() {
		return this.cache('style_compile');
	},

	depend() {
		return this.dependents();
	},

	css() {
		this.preprocessor = false;
		return this.pipe();
	},

	sass() {
		const Fiber = require('fibers');
		return require('gulp-sass')({
			fiber: Fiber,
			outputStyle: 'expanded',
			precision: 10,
		});
	},

	less() {
		return require('gulp-less')({
			rewriteUrls: 'all',
		});
	},

	postcss(bundle) {
		const postcss = require('gulp-postcss');
		const plugins = [
			require('autoprefixer')({
				remove: false,
			}),
			require('css-declaration-sorter')({
				order: 'concentric-css',
			}),
			require('postcss-sort-media-queries')(),
			this.generateSprites(bundle),
		];

		return require('gulp-if')(!this.isDev, postcss(plugins));
	},

	removeDuplicate() {
		const discardDuplicates = require('postcss-discard-duplicates');
		const compileDuplicates = require('postcss-combine-duplicated-selectors');

		return require('gulp-postcss')([
			compileDuplicates(),
			discardDuplicates(),
		]);
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
		return require('gulp-if')(
			this.isDev,
			require('gulp-sourcemaps').init({ largeFile: true })
		);
	},

	sourcemapWrite() {
		return require('gulp-if')(
			this.isDev,
			require('gulp-sourcemaps').write()
		);
	},

	sortMediaQuery() {
		return require('gulp-if')(
			!this.isDev,
			require('gulp-group-css-media-queries')()
		);
	},

	concat(bundle) {
		return require('gulp-concat')({
			path: this.path.join(this.paths._root, `${bundle}.css`),
		});
	},

	rename() {
		const ext = this.isDev ? '.css' : '.min.css';
		return require('gulp-rename')(function (path) {
			path.basename = path.basename.replace(/\.[^/.]+$/, '');
			path.extname = ext;
		});
	},

	forMinify(file) {
		return !this.isDev && this.path.extname(file.path) === '.css';
	},

	generateSprites(bundle) {
		return require('postcss-sprites')({
			spriteName: bundle,
			spritePath: this.paths._img,
			stylesheetPath: this.paths._styles,
			spritesmith: {
				padding: 1,
				algorithm: 'binary-tree',
			},
			svgsprite: {
				shape: {
					spacing: {
						padding: 1,
					},
				},
			},
			retina: true,
			verbose: false,
			filterBy: this.checkIsSprite.bind(this),
			hooks: {
				onSaveSpritesheet: this.onSaveSpritesheet.bind(this),
			},
		});
	},

	checkIsSprite(image) {
		if (image.url.indexOf(this.path.join('img', 'sprite')) !== -1) {
			return Promise.resolve();
		}

		return Promise.reject();
	},

	onSaveSpritesheet(config, spritesheet) {
		if (spritesheet.groups.length === 0) spritesheet.groups.push('');

		const basename = `sprite_${config.spriteName}`;
		const extname = spritesheet.groups
			.concat(spritesheet.extension)
			.join('.');

		return this.path.join(config.spritePath, basename + extname);
	},

	parseURLs() {
		const parseCssUrl = require(this.paths.core('parseCssUrl'));

		if (!this.store.imgs) {
			this.store.images = [];
		}
		if (!this.store.fonts) {
			this.store.fonts = [];
		}

		return require('gulp-postcss')([
			require('postcss-url')({
				url: parseCssUrl.bind(this),
			}),
		]);
	},
};
