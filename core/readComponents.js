import fs from 'fs';
import path from 'path';
import glob from 'glob';
import { isDirectory, isFile, isExternal } from './is';

/**
 * Check all components and read deps then  write map.
 *
 * @param {Object} task
 *
 * @return {undefined}
 */

export default (task) => {
	const { paths, store } = task;
	const deps = (store.deps = {});
	const root = paths._root;

	glob.sync(`${paths._app}/**/deps.js`).forEach((file) => {
		const component = path.basename(path.dirname(file));
		if (
			!isDirectory(paths.components(component)) ||
			!isDirectory(path.dirname(file))
		) {
			return;
		}

		if (isFile(file)) {
			delete require.cache[require.resolve(file)];

			const data = require(file);

			if (data && Array.isArray(data.modules)) {
				data.modules.forEach((module) => {
					if (!module || module.constructor !== Object) {
						return;
					}

					if (!module.from || typeof module.from !== 'string') {
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
						components: Array.isArray(data.nodes) ? data.nodes : [],
						modules: Array.isArray(data.modules)
							? data.modules
							: [],
					};
			} else {
				if (data)
					deps[component] = {
						components: Array.isArray(data.nodes)
							? deps[component].nodes.concat(data.nodes)
							: deps[component].nodes,
						modules: Array.isArray(data.modules)
							? deps[component].modules.concat(data.modules)
							: deps[component].modules,
					};
			}
		}
	});
};
