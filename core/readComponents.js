import fs from 'fs';
import path from 'path';
import glob from 'glob';
import { isDirectory, isFile, isExternal } from './is';
import { removeExtension } from './helpers/remove-extension';
import { toSnakeCase } from './helpers/toSnakeCase';

/**
 * Check all components and read deps then  write map.
 *
 * @param {Object} task
 *
 * @return {undefined}
 */

export default (task) => {
	const { paths, store, config } = task;
	const deps = (store.deps = {});
	const jsons = (store.jsons = {});
	const levels = (store.levels = []);
	const componentsFolder = config.build.components;
	const root = paths._root;
	const sortLevels = config.levels;

	const isModule = (module) => module && module.constructor === Object;
	const isArray = (module) => Array.isArray(module);
	const isFrom = (module) => module.from && typeof module.from === 'string';
	const isExternalFrom = (module) =>
		module.external && typeof module.external === 'boolean';

	glob.sync(`${paths._app}/**/deps.js`).forEach((file) => {
		const component = path.basename(path.dirname(file));

		if (!isDirectory(path.dirname(file))) {
			return;
		}

		if (isFile(file)) {
			delete require.cache[require.resolve(file)];

			const data = require(file);

			if (data && isArray(data.modules)) {
				data.modules.forEach((module) => {
					if (!isModule(module)) {
						return;
					}

					if (!isFrom(module)) {
						return (module.from = path.dirname(file) + '/assets');
					}

					if (isExternal(module.from)) {
						return;
					}

					return (module.from = path.join(root, module.from));
				});
			}

			if (!deps[component]) {
				if (data)
					deps[component] = {
						components: isArray(data.components)
							? data.components
							: [],
						modules: Array.isArray(data.modules)
							? data.modules
							: [],
					};
			} else {
				if (data)
					deps[component] = {
						components: isArray(data.components)
							? deps[component].components.concat(data.components)
							: deps[component].components,
						modules: Array.isArray(data.modules)
							? deps[component].modules.concat(data.modules)
							: deps[component].modules,
					};
			}
		}
	});

	glob.sync(`${paths._app}/**/*.json`).forEach((file) => {
		const filename = toSnakeCase(removeExtension(path.basename(file)));

		if (!isDirectory(path.dirname(file))) {
			return;
		}

		if (isFile(file)) {
			try {
				const data = JSON.parse(fs.readFileSync(file));

				if (!jsons[filename]) {
					jsons[filename] = data;
				} else {
					jsons[filename] = Object.assign(jsons[filename], data);
				}
			} catch (e) {
				throw new Error(
					`\n\n\x1b[41mFAIL\x1b[0m: A JSON "\x1b[36m${path.basename(
						file
					)}\x1b[0m" have SyntaxError:\n${e.message}\n\n`
				);
			}
		}
	});

	componentsFolder.forEach((folder) => {
		if (!isDirectory(paths.app(folder))) {
			return;
		}

		levels.push(folder);
	});

	// Sort levels

	levels.sort((one, two) => {
		const a = (sortLevels && sortLevels[one]) || 2;
		const b = (sortLevels && sortLevels[two]) || 2;

		if (a > b) {
			return 1;
		}
		if (a < b) {
			return -1;
		}
	});
};
