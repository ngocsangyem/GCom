const fs = require('fs');
const path = require('path');
const c = require('ansi-colors');
const BEM = require('./bem');
const { replaceName } = require('./helpers/replace-name');
const { paths, config } = require('./index');

/**
 * Fast generate component with files and folders
 */

const createComponent = {
	sep: Array(16).join('-'),
	message: '',
	componentPrefix: config.component.prefix || '',

	setType(argv) {
		this.type = argv[2] === 'page' ? argv[2] : 'component';
	},

	setItems(argv) {
		let items = argv.slice(this.type === 'page' ? 3 : 2);

		this.items = items.filter((el, i) => items.indexOf(el) === i);
	},

	setLevel() {
		let level;

		this.items.some((el) => {
			if (el[0] === '+') {
				return (level = el);
			}

			return false;
		});

		if (level) {
			this.items = this.items.slice(0, this.items.indexOf(level));
			level = level.slice(1);
		} else {
			level = config.build.mainLevel;
		}

		this.level = level;
	},

	setOptions() {
		let option;

		this.items.some((el) => {
			if (el[0] === ':') {
				return (option = el);
			}

			return false;
		});

		if (option) {
			this.items = this.items.slice(0, this.items.indexOf(option));
			option = option.slice(1);
		}

		this.options = {
			customPath: option === 'customPath' || false,
			noTemplate: option === 'noTemplate' || false,
		};
	},

	checkDirs() {
		try {
			const app = paths._app;
			const pages = paths._pages;
			const components = paths._components;
			const level = path.join(app, this.level);

			if (!fs.existsSync(app)) {
				fs.mkdirSync(app);
			}
			if (!fs.existsSync(pages)) {
				fs.mkdirSync(pages);
			}
			if (!fs.existsSync(components)) {
				fs.mkdirSync(components);
			}
			if (!fs.existsSync(level)) {
				fs.mkdirSync(level);
			}
		} catch (error) {
			console.log(c.redBright(`Create main folder fail: ${error}`));
		}
	},

	addMessage(str) {
		if (typeof str !== 'string') {
			console.log(c.redBright('Content must be string'));
			return;
		}

		const newLine = this.message === '' ? '' : '\n';
		this.message += newLine + str;
	},

	addDirectory(dir) {
		const where = path.relative(paths._src, dir);

		if (fs.existsSync(dir)) {
			return this.addMessage(
				`\x1b[41mFAIL\x1b[0m: Directory "\x1b[36m${where}\x1b[0m" already exist!`
			);
		}
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}

		this.addMessage(
			`\x1b[42mGOOD\x1b[0m: Directory "\x1b[36m${where}\x1b[0m" successfully created!`
		);
	},

	addFile(file, content) {
		const where = path.relative(paths._src, file);
		const what = this.type === 'page' ? 'Page' : 'File';
		const extname = path.extname(file).slice(1);

		if (fs.existsSync(file)) {
			return this.addMessage(
				`\x1b[41mFAIL\x1b[0m: ${what} "\x1b[36m${where}\x1b[0m" already exist!`
			);
		}

		if (this.ignoreTemplate(file).pageSass) {
			fs.writeFileSync(file, '', 'utf8');
		} else if (extname === 'json') {
			fs.writeFileSync(file, content, 'utf8');
		} else {
			fs.writeFileSync(
				file,
				`${
					this.ignoreTemplate(file).template
						? ''
						: this.addGlobalStyles(file) + content
				}`,
				'utf8'
			);
		}

		this.addMessage(
			`\x1b[42mGOOD\x1b[0m: ${what} "\x1b[36m${where}\x1b[0m" successfully created!`
		);
	},

	addGlobalStyles(file) {
		const extname = path.extname(file);
		if (extname !== config.component.styles) {
			return '';
		}

		if (extname === '.css') {
			console.log(
				`\n\x1b[41mFAIL\x1b[0m: Global style option only use for CSS preprocessors"\n`
			);
			return;
		}

		const dirname = path.dirname(file);
		const imports = config.build.globalStyles;
		const array = Array.isArray(imports) ? imports : [imports];
		let injected = '';

		array.forEach((item) => {
			if (typeof item !== 'string') {
				return;
			}

			item = item.trim();

			if (!item) {
				return;
			}

			const file = paths.src(item);

			if (extname === '.sass') {
				injected += `@import "${paths.slashNormalize(
					path.relative(dirname, file)
				)}";\n`;
			} else {
				injected += `@import "${paths.slashNormalize(
					path.relative(dirname, file)
				)}";\n`;
			}
		});

		return injected;
	},

	ignoreTemplate(file) {
		const extname = path.extname(file).slice(1);
		return {
			template:
				!!this.options &&
				this.options.noTemplate | this.options.customPath,
			pageSass:
				this.type === 'page' &&
				(extname === 'scss') | (extname === 'sass'),
		};
	},

	addPage(name) {
		const extname = path.extname(name) || config.component.templates;
		const basename = path.basename(name, extname);
		const file = paths.page(basename + extname);
		const content = replaceName(
			(config.addContent && config.addContent.page) || '',
			basename
		);

		return this.addFile(file, content);
	},

	addComponent(node, extensions, type, prefix) {
		const component = this.options.customPath
			? node
			: BEM.getComponent(node);
		const directory = this.setDirection(component, type);
		let customName = this.parseCustomName(component);
		let dataFile;
		let dataDir;
		let dataContent;
		this.addDirectory(directory);

		extensions = Array.isArray(extensions) ? extensions : [extensions];

		extensions.forEach((extension) => {
			if (
				!extension ||
				!extension.trim() ||
				typeof extension !== 'string'
			) {
				console.log(
					c.redBright(
						'Need extension to generate component \n Ex: header[.js,.sass,.pug]'
					)
				);
				return;
			}

			extension = extension.trim().toLowerCase();
			const isFile = extension[0] === '.' || path.extname(extension);

			if (!isFile) {
				let prev = directory;

				return extension.split(path.sep).forEach((dir) => {
					if (!dir || !dir.trim() || typeof dir !== 'string') {
						return;
					}

					const where = path.join(prev, dir);

					this.addDirectory(where);

					prev = where;
				});
			}

			let extname = path.extname(extension) || extension;
			let name = path.basename(extension, extname) || node;
			let content;
			let file;

			if (type === 'page') {
				content = this.replacePrefix(
					config.addContent.page[extname.slice(1)],
					this.parseNameFromPath(name)
				);
			} else if (type === 'component') {
				content = this.replacePrefix(
					config.addContent.component[extname.slice(1)],
					this.parseNameFromPath(name)
				);
			}

			file = !this.options.customPath
				? path.join(directory, name + prefix + extname)
				: path.join(directory, customName + prefix + extname);
			return this.addFile(file, content);
		});

		if (config.component.test) {
			dataDir = this.setDirection(component + '/__test__', type);
			dataContent = this.replacePrefix(
				config.addContent['test'],
				this.parseNameFromPath(node)
			);

			dataFile = !this.options.customPath
				? path.join(dataDir, node + prefix + '.test.js')
				: path.join(dataDir, customName + prefix + '.test.js');
			this.addDirectory(dataDir);
			this.addFile(dataFile, dataContent);
		}

		if (config.component.data) {
			dataDir = this.setDirection(component + '/data', type);
			dataContent = this.replacePrefix(
				config.addContent['data'],
				this.parseNameFromPath(node)
			);
			dataFile = !this.options.customPath
				? path.join(dataDir, node + prefix + '.json')
				: path.join(dataDir, customName + prefix + '.json');
			this.addDirectory(dataDir);
			this.addFile(dataFile, dataContent);
		}
	},

	setDirection(direction, type) {
		if (type === 'component' && !this.options.customPath) {
			return paths.app(this.level, direction);
		} else if (type === 'page' && !this.options.customPath) {
			return paths.pages(direction);
		} else if (this.options.customPath) {
			return paths.app(direction);
		}
	},

	replacePrefix(condition, name) {
		return replaceName((config.addContent && condition) || '', name);
	},

	parseCustomName(path) {
		if (path.match(/\//g)) {
			const paths = path.split(/\//g);
			// return paths.slice(paths.length - 2, paths.length).join('');
			return paths[paths.length - 1];
		}
		return path;
	},

	parseNameFromPath(name) {
		if (name.match(/\//g)) {
			const names = name.split(/\//g);
			return names.slice(names.length - 2, names.length).join('');
		}
		return name;
	},

	parseArguments(argv, showMessage = true) {
		this.setType(argv);
		this.setItems(argv);
		this.setOptions();
		this.setLevel();
		this.checkDirs();

		if (this.items.length === 0) {
			this.status = false;
			this.message = `\x1b[41mFAIL\x1b[0m: You must write a \x1b[36m${this.type}\x1b[0m name!`;
		} else {
			if (this.items) {
				this.items.forEach((item) => {
					let name = item.split('[')[0];
					let more = (item.split('[')[1] || '').replace(']', '');
					let extra = more.split(',');

					name = name.trim().toLowerCase();
					if (
						config.createComponent &&
						config.createComponent[more]
					) {
						extra = config.createComponent[more];
					}

					return this.addComponent(
						name,
						extra,
						this.type,
						this.componentPrefix
					);
				});
			}
		}

		if (this.message && showMessage) {
			console.log(c.greenBright(this.message));
		}
	},
};

module.exports = { createComponent };
