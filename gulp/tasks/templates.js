export default {
	build: 1,
	name: 'task:templates',
	globs: '!(_*)',
	extname: function () {
		return this.config.component.templates.slice(1).toUpperCase();
	},
	init(done) {
		const files = this.paths.pages(
			'**/*' + this.config.component.templates
		);
		const options = {
			since: this.since.bind(this),
		};
		const ready = this.HTMLReady.bind(this, done);
		return this.gulp
			.src(files, options)
			.pipe(this.plumber())
			.pipe(this.parseTemplate())
			.pipe(this.compile())
			.pipe(this.parse())
			.pipe(this.replacePath())
			.pipe(this.dest())
			.on('end', ready);
	},

	watch() {
		const extname = this.config.component.templates;

		return [
			{
				files: this.paths.pages('**/*' + extname),
				tasks: this.name,
				options: {
					delay: 500,
				},
			},
			{
				files: this.paths.app('**', `deps.js`),
				tasks: [
					'task:templates',
					'task:styles',
					'task:scripts',
					'task:assets',
					'task:copy:fonts:component',
					'task:copy:images:component',
				],
				options: {
					delay: 250,
				},
				on: {
					event: 'change',
					handler: this.checkDeps.bind(this),
				},
			},

			{
				files: this.paths.components(
					'**',
					`*.(json|ya?ml|${extname.slice(1)})`
				),
				on: {
					event: 'change',
					handler: this.checkIsOnPage.bind(this),
				},
			},
		];
	},

	dest() {
		return this.gulp.dest(this.paths._dist);
	},

	compile() {
		const extname = this.config.component.templates.slice(1);
		const readComponents = require(this.paths.core('readComponents'));

		readComponents(this);

		if (typeof this[extname] === 'function') {
			return this[extname]();
		}

		console.log(
			`\nSorry, for now support only pug files, you must tune "${this.name}" task for compile another engine!\n`
		);

		return this.pipe();
	},

	pug() {
		return require('gulp-pug')({
			// https://pugjs.org/api/reference.html
			doctype: 'html',
			basedir: this.paths._app,
			site: {
				data: this.getGlobalData(),
			},
		});
	},

	getGlobalData() {
		let siteData = {};
		const rootFolder = this.paths._app;
		if (this.isDirectory(rootFolder)) {
			// Convert directory to JS Object
			siteData = this.foldero(rootFolder, {
				recurse: true,
				whitelist: () => {
					this.glob
						.sync(rootFolder + '**/*.(json|ya?ml)')
						.filter(function (file) {
							return /\.(json|ya?ml)$/i.test(file);
						});
				},
				loader: function loadAsString(file) {
					let json = {};
					try {
						if (path.extname(file).match(/^.ya?ml$/)) {
							json = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
						} else {
							json = JSON.parse(fs.readFileSync(file, 'utf8'));
						}
					} catch (e) {
						log.error(`Error Parsing DATA file: ${file}`);
						log.error('==== Details Below ====');
						log.error(e);
					}
					return json;
				},
			});

			// Add --debug option to your gulp task to view
			// what data is being loaded into your templates
			if (this.args.debug) {
				this.log.info(
					'==== DEBUG: site.data being injected to templates ===='
				);
				this.log.info(siteData);
			}
		}
	},

	parse() {
		const parseHTML = require(this.paths.core('parseHTML'));

		return this.pipe(parseHTML, this, 'parseHTML');
	},

	parseTemplate() {
		const parseTemplate = require(this.paths.core(
			`parse${this.extname()}`
		));

		if (typeof parseTemplate !== 'function') {
			console.log(
				`\nSorry, support only pug files, you must tune "${this.name}" task for compile another engine!\n`
			);
			return this.pipe();
		}

		if (!this.store.pages) {
			this.store.pages = {};
		}

		return this.pipe(parseTemplate, this, 'parseTemplate');
	},

	replacePath() {
		return require('gulp-rename')(function (path) {
			path.basename = path.basename.replace(/\.[^.]*$/, '');
			path.dirname = '';
		});
	},

	HTMLReady(done) {
		const generateTree = require(this.paths.core('generateTree'));
		const parseComponents = require(this.paths.core('parseComponents'));

		generateTree(this);
		parseComponents(this);

		this.store.depsChanged = false;

		return done();
	},

	checkIsOnPage(file) {
		const path = this.path;
		const pages = this.store.pages || {};
		const editTime = require(this.paths.core('editTime'));
		const prefix = this.config.component.prefix;

		let name = path.basename(file);

		if ([`${name}${prefix}.json`, 'deps.js'].includes(name)) {
			name = path.dirname(file).split(path.sep).pop();
		} else {
			name = path
				.basename(file, path.extname(file))
				.replace(/(\.[^/.]+)+$/, '');
		}

		Object.keys(pages).forEach((page) => {
			if (page === this.mainBundle) {
				return;
			}

			if (name === 'layout' || name in pages[page].components) {
				return editTime(
					this.paths.pages(
						page,
						page + prefix + this.config.component.templates
					)
				);
			}
		});
	},

	since(file) {
		const path = this.path;
		const page = path.basename(file.path);
		console.log('since -> page', page);
		const pageInDeps =
			this.store.depsChanged && this.store.depsChanged.includes(page);
		return pageInDeps ? null : this.gulp.lastRun(this.name);
	},

	checkDeps(file) {
		const path = this.path;
		const pages = this.store.pages || {};
		const component = path.dirname(file).split(path.sep).pop();
		console.log('checkDeps -> component', component);
		const changed = [];

		Object.keys(pages).forEach((page) => {
			if (page === this.mainBundle) {
				return;
			}

			if (!(component in pages[page].components)) {
				return;
			}

			page =
				page +
				this.config.component.prefix +
				this.config.component.templates;

			if (!changed.includes(page)) {
				changed.push(page);
			}
		});

		this.store.depsChanged = changed;
		console.log(
			'checkDeps -> this.store.depsChanged',
			this.store.depsChanged
		);
	},
};
