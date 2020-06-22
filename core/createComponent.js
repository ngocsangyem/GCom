import fs from 'fs';
import path from 'path';
import c from 'ansi-colors';
import * as BEM from './bem';
import { paths, config, notify } from './index';
import { replaceName } from './helpers/replace-name';

/**
 * Fast generate component with files and folders
 */

export const createComponent = {
	sep: Array(16).join('-'),
	message: '',
	componentPrefix: config.component.prefix || '',
	pagesPrefix: config.pages.prefix || '',

	setType(argv) {
		this.type = argv[2] === 'page' ? argv[2] : 'component';
	},

	setItems(argv) {
		let items = argv.slice(this.type === 'page' ? 3 : 2);

		this.items = items.filter((el, i) => items.indexOf(el) === i);
	},

	setOptions() {
		let option;

		this.items.some((el) => {
			if (el[0] === '--') {
				return (option = el);
			}

			return false;
		});

		if (option) {
			this.items = this.items.slice(0, this.items.indexOf(option));
			option = option.slice(1);
		}

		this.options = {
			custom: option === '--custom' || false,
			noTemplate: option === '--noTemplate' || false,
		};
	},

	checkDirs() {
		try {
			const app = paths._app;
			const pages = paths._pages;
			const components = paths._components;

			if (!fs.existsSync(app)) {
				fs.mkdirSync(app);
			}
			if (!fs.existsSync(pages)) {
				fs.mkdirSync(pages);
			}
			if (!fs.existsSync(components)) {
				fs.mkdirSync(components);
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
		const where =
			this.type === 'page'
				? path.relative(paths._pages, dir).replace('..', '')
				: path.relative(paths._components, dir).replace('..', '');

		if (fs.existsSync(dir)) {
			return this.addMessage(
				`\x1b[41mFAIL\x1b[0m: Directory "\x1b[36m${where}\x1b[0m" already exist!`
			);
		}

		fs.mkdirSync(dir);

		this.addMessage(
			`\x1b[42mGOOD\x1b[0m: Directory "\x1b[36m${where}\x1b[0m" successfully created!`
		);
	},

	addFile(file, content) {
		const where =
			this.type === 'page'
				? path.relative(paths._pages, file).replace('..', '')
				: path.relative(paths._components, file).replace('..', '');
		const what = this.type === 'page' ? 'Page' : 'File';

		if (fs.existsSync(file)) {
			return this.addMessage(
				`\x1b[41mFAIL\x1b[0m: ${what} "\x1b[36m${where}\x1b[0m" already exist!`
			);
		}

		fs.writeFileSync(
			file,
			`${!!this.options && this.options.noTemplate ? '' : content}`,
			'utf8'
		);

		this.addMessage(
			`\x1b[42mGOOD\x1b[0m: ${what} "\x1b[36m${where}\x1b[0m" successfully created!`
		);
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
		const component = !config.component.BEM
			? node
			: `${BEM.getComponent(node)}/${node}`;
		const directory = this.setDirection(component, type);

		if (!fs.existsSync(directory)) {
			this.addDirectory(directory);
		}

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

				return item.split(path.sep).forEach((dir) => {
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
					name
				);
				file = path.join(directory, name + prefix + extname);

				return this.addFile(file, content);
			} else if (type === 'component') {
				content = this.replacePrefix(
					config.addContent.component[extname.slice(1)],
					name
				);
				file = path.join(directory, name + prefix + extname);
				return this.addFile(file, content);
			}
		});

		if (config.component.test) {
			const testDirectory = this.setDirection(
				component + '/__test',
				type
			);
			let testContent = this.replacePrefix(
				config.addContent['test'],
				node
			);

			let testFile = path.join(testDirectory, node + prefix + '.test.js');

			this.addDirectory(testDirectory);
			return this.addFile(testFile, testContent);
		}
		if (config.component.data) {
			let dataContent = this.replacePrefix(
				config.addContent['data'],
				node
			);
			const dataDirectory = this.setDirection(component + '/data', type);

			let dataFile = path.join(dataDirectory, node + prefix + '.json');

			this.addDirectory(dataDirectory);
			return this.addFile(dataFile, dataContent);
		}
	},

	setDirection(direction, type) {
		if (type === 'component') {
			return paths.components(direction);
		} else if (type === 'page') {
			return paths.pages(direction);
		} else if (this.options.custom) {
			return paths.app(direction);
		}
	},

	replacePrefix(condition, name) {
		return replaceName((config.addContent && condition) || '', name);
	},

	parseArguments(argv, showMessage = true) {
		this.setType(argv);
		this.setItems(argv);
		// this.setOptions(argv);
		this.options = this.setOptions(argv);
		this.checkDirs();

		if (this.items.length === 0) {
			this.status = false;
			this.message = `\x1b[41mFAIL\x1b[0m: You must write a \x1b[36m${this.type}\x1b[0m name!`;
		} else {
			// try {
			// } catch (error) {
			// 	console.log(c.red(error));
			// }
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

					if (this.type === 'page') {
						if (config.pages.type === 'component') {
							return this.addComponent(
								name,
								extra,
								this.type,
								this.pagesPrefix
							);
						} else if (config.pages.type === 'single') {
							return this.addPage(name);
						}
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
