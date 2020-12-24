const fs = require('fs');
const path = require('path');

const { series, parallel, watch, src, dest, lastRun, task } = require('gulp');
const glob = require('glob');
const globby = require('globby');
const parsePug = require('pug-parser');
const lexer = require('pug-lexer');
const c = require('ansi-colors');
const foldero = require('foldero');
const log = require('fancy-log');
const plumber = require('gulp-plumber');
const cache = require('gulp-cached');
const dependents = require('gulp-dependents');

const {
	isDev,
	args,
	plugins,
	reportError,
	browserSync,
} = require('./gulp/utils');
const { config, paths, buildPath, notify } = require('./core/index');
const { isDirectory, isFile } = require('./core/is');
const pipe = require('./core/pipe');
const { removeExtension } = require('./core/helpers/remove-extension');
const injectToHTML = require('./core/injectToHTML');
const parseDeps = require('./core/parseDeps');
const parseAsset = require('./core/parseAsset');
const parseClass = require('./core/parseClass');
const parseXlink = require('./core/parseXlink');
const { upperFirstLetter } = require('./core/helpers/upper-first-letter');

const htmlparser2 = require('htmlparser2');
const gulp = {};
const builds = []; // Build tasks
const watchers = []; // Watch tasks
const store = {};

const setTaskData = (task) => {
	return (
		(task.mainBundle = config.build.mainBundle),
		(task.store = store),
		(task.config = config),
		(task.path = path),
		(task.fs = fs),
		(task.paths = paths),
		(task.isDev = isDev),
		(task.isDirectory = isDirectory),
		(task.isFile = isFile),
		(task.foldero = foldero),
		(task.args = args),
		(task.log = log),
		(task.glob = glob),
		(task.globby = globby),
		(task.pipe = pipe),
		(task.plugins = plugins),
		(task.parsePug = parsePug),
		(task.lexer = lexer),
		(task.removeExtension = removeExtension),
		(task.htmlparser2 = htmlparser2),
		(task.injectToHTML = injectToHTML),
		(task.parseDeps = parseDeps),
		(task.parseAsset = parseAsset),
		(task.parseClass = parseClass),
		(task.c = c),
		(task.plumber = errorHandler),
		(task.browserSync = browserSync),
		(task.upperFirstLetter = upperFirstLetter),
		(task.buildPath = buildPath),
		(task.notify = notify),
		(task.parseXlink = parseXlink),
		(task.cache = cache),
		(task.dependents = dependents)
	);
};

const errorHandler = () => {
	return plumber({
		errorHandler: reportError,
	});
};

glob.sync('./gulp/tasks/**/*.js')
	.filter(function (file) {
		return /\.(js)$/i.test(file);
	})
	.map(function (file) {
		const task = require(file);
		const name =
			task.name || path.basename(file, path.extname(file)) + '.js';

		if (gulp[name]) {
			console.log(c.redBright(`The task [${name}] already exist!`));
			return;
		}

		if (typeof task.init !== 'function') {
			console.log(
				c.redBright(`The task [${name}] must contain init function!`)
			);
			return;
		}

		// Add data to tasks
		setTaskData(task);

		// Add gulp api to tasks
		task.gulp = { series, parallel, src, dest, lastRun };

		// Plugged task init function to task system
		gulp[name] = task.init.bind(task);
		gulp[name].displayName = name;

		// Add watches

		if (isDev && typeof task.watch === 'function') {
			let watcher = task.watch();

			watcher = Array.isArray(watcher) ? watcher : [watcher];

			watchers.push(...watcher);
		}

		// Add builds

		if (typeof task.build === 'number') {
			if (!builds[task.build]) {
				builds[task.build] = [];
			}

			builds[task.build].push(gulp[name]);
		}
	});

if (!!builds && builds.length > 0) {
	const run = [];

	builds.forEach((build) => {
		if (!Array.isArray(build)) {
			return;
		}
		const tasks = build.filter((item) => typeof item === 'function');

		if (tasks.length === 0) {
			return;
		}

		run.push(parallel(...tasks));
	});

	gulp.default = series(...run);
}

// Watch development

if (process.env.WATCH) {
	watchers.forEach((watchItem) => {
		if (!watchItem || watchItem.constructor !== Object) {
			console.log(c.redBright(`Watcher must be a object!`));
			return;
		}

		const files = paths.slashNormalize(watchItem.files);
		const tasks = Array.isArray(watchItem.tasks)
			? watchItem.tasks
			: [watchItem.tasks];
		const options = Object.assign({}, watchItem.options);
		const run = [];

		if (!files) {
			return console.log(
				c.redBright(
					`Watcher must contain a globs for watch on the file system!`
				)
			);
		}

		tasks.forEach((task) => {
			if (typeof task === 'function') {
				return run.push(task);
			}
			if (typeof task === 'string' && gulp[task]) {
				return run.push(gulp[task]);
			}
		});

		const watcher =
			run.length === 0
				? watch(files, options)
				: watch(files, options, series(...run));

		if (watchItem.on && watchItem.on.constructor === Object) {
			if (typeof watchItem.on.event !== 'string') {
				return console.log(`Watcher event name must be a string!`);
			}
			if (typeof watchItem.on.handler !== 'function') {
				return console.log(`Watcher event handler must be a function!`);
			}

			watcher.on(watchItem.on.event, watchItem.on.handler);
		}
	});
}

module.exports = gulp;
