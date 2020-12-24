const fs = require('fs');
const path = require('path');
const notify = require('gulp-notify');
const { isFile, isDirectory } = require('./is');
const c = require('ansi-colors');
const minimist = require('minimist');
const {
	jsonTemplate,
	jsTemplateClass,
	sassTemplate,
	scssTemplate,
	pageTemplate,
	testTemplate,
	componentTemplate,
	pageSassTemplate,
	pageScssTemplate,
	jsPageTemplateClass,
} = require('./templates/files');
const pjson = require('../package.json');

const root = path.resolve(__dirname, '..');
const args = minimist(process.argv.slice(2));
const isDev = args.development;

// Read config

let config = {};

try {
	const appConfig = path.join(root, 'config.js');
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
		url: 'demosite.com',
	};

	config.app = Object.assign(app, config.app);

	// Build component
	const component = {
		templates: '.pug',
		scripts: {
			extension: '.js',
			syntax: 'class',
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

	// Merge build
	const build = {
		addVersions: false,
		bundles: ['js', 'css'],
		imagemin: [],
		mainBundle: 'main',
		mainLevel: 'components',
		globalStyles: false,
		zip: true,
		HTMLRoot: './',
		components: ['components', 'shared'],
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

	// Merge autoCreate

	if (!config.autoCreate) {
		config.autoCreate = {};
	}

	config.autoCreate = {
		onlyOnWatch: true,
		folders: [].concat(config.autoCreate.folders).filter((el) => !!el),
		files: [].concat(config.autoCreate.files).filter((el) => !!el),
		levels: [].concat(config.autoCreate.levels).filter((el) => !!el),
		ignoreComponents: []
			.concat(config.autoCreate.ignoreComponents)
			.filter((el) => !!el),
		ignoreStyle: []
			.concat(config.autoCreate.ignoreStyle)
			.filter((el) => !!el),
		ignoreScript: []
			.concat(config.autoCreate.ignoreScript)
			.filter((el) => !!el),
		ignoreTemplate: []
			.concat(config.autoCreate.ignoreTemplate)
			.filter((el) => !!el),
	};

	// Merge create component

	const addContent = {
		data: jsonTemplate,
		test: testTemplate,
		component: {
			pug: componentTemplate,
			sass: sassTemplate,
			scss: scssTemplate,
			js: jsTemplateClass,
		},
		page: {
			pug: pageTemplate,
			sass: pageSassTemplate,
			scss: pageScssTemplate,
			// js:
			// 	config.component.scripts.syntax === 'function'
			// 		? jsPageTemplateFunction
			// 		: jsPageTemplateClass,
			js: jsPageTemplateClass,
		},
	};

	config.addContent = Object.assign(addContent, config.addContent);

	// Merge directories

	const directories = {
		base: './',
		development: {
			source: 'src',
			app: 'app',
			temporary: 'tmp',
			components: 'components',
			styles: 'styles',
			assets: 'assets',
			scripts: 'scripts',
			images: 'images',
			fonts: 'fonts',
			data: 'data',
			pages: 'pages',
			static: 'static',
			favicons: 'favicons',
			symbols: 'symbols',
		},
		production: {
			destination: 'build',
			styles: 'styles',
			scripts: 'scripts',
			fonts: 'fonts',
			images: 'images',
			assets: 'assets',
			static: 'static',
			favicons: 'favicons',
			symbols: 'symbols',
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
const dirs = config.directories;
const target = !isDev
	? dirs.production.destination
	: dirs.development.temporary;

const buildPath = {
	styles: isDev ? dirs.development.styles : dirs.production.styles,
	scripts: isDev ? dirs.development.scripts : dirs.production.scripts,
	static: isDev ? dirs.development.static : dirs.production.static,
	favicons: isDev ? dirs.development.favicons : dirs.production.favicons,
	images: isDev ? dirs.development.images : dirs.production.images,
	fonts: isDev ? dirs.development.fonts : dirs.production.fonts,
	assets: isDev ? dirs.development.assets : dirs.production.assets,
	symbols: isDev ? dirs.development.symbols : dirs.production.symbols,
};

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

	dist() {
		return path.join(this._dist, ...arguments);
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

	styles() {
		return path.join(this._pages, ...arguments);
	},

	assets() {
		return path.join(this._assets, ...arguments);
	},

	_root: root,
	_core: __dirname,
	_tasks: path.join(root, 'gulp', 'tasks'),
	_dist: path.join(root, target),
	_src: path.join(root, 'src'),
	_app: path.join(root, 'src', 'app'),
	_components: path.join(root, 'src', 'app', 'components'),
	_pages: path.join(root, 'src', 'app', 'views', 'pages'),
	_styles: path.join(root, target, buildPath.styles),
	_scripts: path.join(root, target, buildPath.scripts),
	_static: path.join(root, target, buildPath.static),
	_favicons: path.join(root, target, buildPath.favicons),
	_images: path.join(root, target, buildPath.static, buildPath.images),
	_img: path.join(root, target, buildPath.styles, buildPath.images),
	_fonts: path.join(root, target, buildPath.static, buildPath.fonts),
	_font: path.join(root, target, buildPath.styles, buildPath.fonts),
	_tmp: path.join(root, 'tmp'),
	_build: path.join(root, 'build'),
	_assets: path.join(root, 'src', 'assets'),
	_symbol: path.join(root, target, buildPath.styles, buildPath.images),
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

module.exports = { paths, config, notify, buildPath };
