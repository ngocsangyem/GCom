module.exports = {
	build: 2,
	name: 'task:symbol',
	globs: function () {
		return ['**', '*', this.buildPath.symbols, '*.svg'];
	},

	init(done) {
		let files = this.store.symbol || [];
		let ready = this.symbolReady.bind(this, done);

		// In dev all files

		if (this.isDev) {
			files = this.paths.app(...this.globs());
		} else {
			const always = this.globs()
				.join('::')
				.replace('*.svg', '*@always.svg')
				.split('::');

			files.push(this.paths.app(...always));
		}

		if (files.length === 0) {
			return done();
		}

		return this.gulp
			.src(files)
			.pipe(this.plumber())
			.pipe(this.symbol())
			.pipe(this.dest())
			.on('end', ready);
	},

	watch() {
		return {
			files: this.paths.app(...this.globs()),
			tasks: this.name,
		};
	},

	dest() {
		return this.gulp.dest((file) => {
			this.store.svg = String(file.contents);

			return this.paths._root;
		});
	},

	symbol() {
		const config = {
			svg: {
				namespaceClassnames: false,
			},
			shape: {
				id: {
					generator: this.generateID.bind(this),
				},
			},
			mode: {
				symbol: {
					dest: this.paths._symbol,
					sprite: 'symbol.svg',
					render: false,
					svg: {
						xmlDeclaration: false,
						doctypeDeclaration: false,
						rootAttributes: {
							style:
								'position:absolute;top:0;left:0;width:1px;height:1px;visibility:hidden;opacity:0;',
							'aria-hidden': 'true',
						},
						transform: [this.transformSVG.bind(this)],
					},
				},
			},
		};

		return require('gulp-svg-sprite')(config);
	},

	generateID(name, file) {
		const path = this.path;
		const extname = path.extname(name);
		const basename = path.basename(name, extname).replace('@always', '');
		const block = name.split(path.sep)[1];

		return `${block}__${basename}`;
	},

	transformSVG(svg) {
		const fs = this.fs;
		const path = this.path;
		const prependPath = this.paths.app('symbol', 'prepend.svg');
		const appendPath = this.paths.app('symbol', 'append.svg');
		const prepend = this.fs.existsSync(prependPath)
			? fs.readFileSync(prependPath)
			: '';
		const append = this.fs.existsSync(appendPath)
			? fs.readFileSync(appendPath)
			: '';
		const pattern = /(<svg*\b[^>]*>)(.*)(<\/svg>)/gi;

		if (prepend || append) {
			svg = svg.replace(
				pattern,
				(str, start, body, end) =>
					`${start}${prepend}${body}${append}${end}`
			);
		}

		return svg;
	},

	symbolReady(done) {
		if (!this.isDev) {
			return done();
		}

		const pages = this.store.pages || {};
		const editTime = require(this.paths.core('editTime'));

		Object.keys(pages).forEach((page) => {
			if (page === this.mainBundle) {
				return;
			}

			if ('symbol' in pages[page].BEM_tree)
				return editTime(
					this.paths.pages(
						page,
						page +
							this.config.component.prefix +
							this.config.component.templates
					)
				);
		});

		return done();
	},
};
