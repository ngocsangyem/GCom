import fs from 'fs';
import path from 'path';
import notify from 'gulp-notify';
import { isFile, isDirectory } from './is';
import c from 'ansi-colors';
import minimist from 'minimist';
import {
	jsonTemplate,
	jsTemplateFunction,
	jsTemplateClass,
	sassTemplate,
	scssTemplate,
	pageTemplate,
	testTemplate,
	componentTemplate,
	pageSassTemplate,
	pageScssTemplate,
} from './templates/files';
import pjson from '../package.json';

const root = path.resolve(__dirname, '..');
const args = minimist(process.argv.slice(2));
const target = args.production ? 'build' : 'tmp';

const paths = {
	slashNormalize(str) {
		const isExtendedLengthPath = /^\\\\\?\\/.test(str);
		const hasNonAscii = /[^\u0000-\u0080]+/.test(str); // eslint-disable-line no-control-regex

		if (isExtendedLengthPath || hasNonAscii) {
			return str;
		}

		return str.replace(/\\/g, '/');
	},

	root() {
		return path.join(this._root, ...arguments);
	},

	core() {
		return path.join(this._core, ...arguments);
	},

	src() {
		return path.join(this._src, ...arguments);
	},

	app() {
		return path.join(this._app, ...arguments);
	},

	components() {
		return path.join(this._components, ...arguments);
	},

	pages() {
		return path.join(this._pages, ...arguments);
	},

	_root: root,
	_core: __dirname,
	_tasks: path.join(root, 'gulp/tasks'),
	_dist: path.join(root, target),
	_src: path.join(root, 'src'),
	_app: path.join(root, 'src', 'app'),
	_components: path.join(root, 'src', 'app', 'components'),
	_pages: path.join(root, 'src', 'app', 'views/pages'),
};

// Add main dirs

try {
	if (!isDirectory(paths._app)) {
		fs.mkdirSync(paths._app);
	}
	if (!isDirectory(paths._components)) {
		fs.mkdirSync(paths._components);
	}
	if (!isDirectory(paths._pages)) {
		fs.mkdirSync(paths._pages);
	}
} catch (error) {
	console.log(c.red(error));
}

// Read config

let config = {};

try {
	const appConfig = paths.root('config.js');
	if (isFile(appConfig)) {
		config = require(appConfig);
	}
} catch (error) {
	console.log(c.red(error));
	notify.onError('Error')(error);
} finally {
	const app = {
		name: pjson.name,
		version: pjson.version,
	};

	config.app = Object.assign(app, config.app);

	// Build component
	const component = {
		templates: '.pug',
		scripts: {
			extension: '.js',
			syntax: 'function',
		},
		styles: '.scss',
		test: false,
		data: true,
		BEM: false,
		prefix: '.component',
	};

	config.component = Object.assign(component, config.component);

	if (config.component.templates[0] !== '.') {
		config.component.templates = '.' + config.component.templates;
	}
	if (config.component.scripts.extension[0] !== '.') {
		config.component.scripts.extension =
			'.' + config.component.scripts.extension;
	}
	if (config.component.styles[0] !== '.') {
		config.component.styles = '.' + config.component.styles;
	}

	// Merge pages
	const pages = {
		type: 'component', // component or single
		build_all: true,
		page_list: [],
		test: false,
		prefix: '.component',
		SEO: true,
	};

	config.pages = Object.assign(pages, config.pages);

	// Merge build
	const build = {
		autoprefixer: ['last 3 versions'],
		babel: true,
		bundles: [],
		sourcemaps: [],
		imagemin: [],
		mainBundle: 'main',
		zip: true,
		HTMLRoot: './',
	};

	config.build = Object.assign(build, config.build);

	if (!Array.isArray(config.build.bundles)) {
		config.build.bundles = [config.build.bundles];
	}
	if (!Array.isArray(config.build.sourcemaps)) {
		config.build.sourcemaps = [config.build.sourcemaps];
	}
	if (!Array.isArray(config.build.autoprefixer)) {
		config.build.autoprefixer = [config.build.autoprefixer];
	}

	config.build.imagemin = []
		.concat(config.build.imagemin)
		.filter((el) => ['png', 'jpg', 'svg', 'gif'].includes(el));
	if (config.build.imagemin.includes('jpg')) {
		config.build.imagemin.push('jpeg');
	}

	// Merge create component

	const addContent = {
		data: jsonTemplate,
		test: testTemplate,
		component: {
			pug: componentTemplate,
			sass: sassTemplate,
			scss: scssTemplate,
			js:
				config.component.scripts.syntax === 'function'
					? jsTemplateFunction
					: jsTemplateClass,
		},
		page: {
			pug: pageTemplate,
			sass: pageSassTemplate,
			scss: pageScssTemplate,
			js:
				config.component.scripts.syntax === 'function'
					? jsTemplateFunction
					: jsTemplateClass,
		},
	};

	config.addContent = Object.assign(addContent, config.addContent);

	// Merge directories

	const directories = {
		base: './',
		entries: {
			script: 'main.js',
			css: 'main.+(sass|scss)',
			data: 'data.json',
		},
		development: {
			source: 'src/',
			app: 'app/',
			temporary: 'tmp/',
			components: 'components/',
			styles: 'styles/',
			assets: 'assets/',
			scripts: 'scripts/',
			images: 'img/',
			fonts: 'fonts/',
			data: 'data/',
			pages: 'pages/',
		},
		production: {
			destination: 'build/',
			styles: 'styles/',
			scripts: 'scripts/',
			fonts: 'fonts/',
			images: 'images/',
			assets: 'assets/',
		},
	};

	config.directories = Object.assign(directories, config.directories);

	// Merge optimization

	const optimization = {
		jpg: {
			progressive: true,
			arithmetic: false,
		},
		png: {
			optimizationLevel: 5,
			bitDepthReduction: true,
			colorTypeReduction: true,
			paletteReduction: true,
		},
		gif: {
			optimizationLevel: 1,
			interlaced: true,
		},
		svg: [
			{
				cleanupIDs: false,
			},
			{
				removeViewBox: false,
			},
			{
				mergePaths: false,
			},
		],
	};

	if (!config.optimization) {
		config.optimization = {};
	}

	config.optimization = {
		jpg: Object.assign(optimization.jpg, config.optimization.jpg),
		png: Object.assign(optimization.png, config.optimization.png),
		gif: Object.assign(optimization.gif, config.optimization.gif),
		svg: [].concat(config.optimization.svg || optimization.svg),
		ignore: [].concat(config.optimization.ignore).filter((el) => !!el),
	};
}

export { paths, config, notify };
