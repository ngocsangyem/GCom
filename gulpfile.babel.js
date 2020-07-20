import { series, parallel, watch, src, dest, lastRun, task } from 'gulp';
import glob from 'glob';
import path from 'path';

import c from 'ansi-colors';
import foldero from 'foldero';
import log from 'fancy-log';
import { isDev, args, plugins } from './gulp/utils';
import { config, paths } from './core/index';
import { isDirectory } from './core/is';
import { pipe } from './core/pipe';

const gulp = {};
const builds = []; // Build tasks
const watchers = []; // Watch tasks
const store = {};
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
		task.mainBundle = config.build.mainBundle;
		task.store = store;
		task.config = config;
		task.path = path;
		task.paths = paths;
		task.isDev = isDev;
		task.isDirectory = isDirectory;
		task.foldero = foldero;
		task.args = args;
		task.log = log;
		task.glob = glob;
		task.pipe = pipe;
		task.plugins = plugins;

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
