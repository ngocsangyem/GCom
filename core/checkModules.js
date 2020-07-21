import fs from 'fs';
import path from 'path';
import checkFile from './checkFile';
import { isExternal } from './is';

/**
 * Check a modules from component dependency.
 *
 * @param {String} component
 * @param {String} type
 * @param {Object} page
 * @param {Object} deps
 * @param {Object} task
 * @param {Array} extnames
 * @param {Array} imports
 *
 * @return {undefined}
 */

export default (component, type, page, deps, task, extnames, imports) => {
	const { isDev } = task;
	const modules = (deps[component] && deps[component].modules) || [];
	const async = /@(async|defer)/gi;
	const node = page.components && page.components[component];
	const data = {
		name: component,
		attrs: (node && node.attrs) || {},
		tag: (node && node.tag) || '',
	};

	modules.forEach((module) => {
		if (!module || module.constructor !== Object) {
			return console.log(`Dependency must be a object!`);
		}

		const from = module.from;
		const items = Array.isArray(module[type])
			? module[type]
			: [module[type]];
		const filter =
			typeof module.filter === 'function' ? module.filter : false;
		if (type === 'import') {
			items.forEach((item) => {
				if (typeof item !== 'string') {
					return;
				}

				if (isExternal(from)) {
					return;
				}

				item = item.replace(async, '');

				if (!extnames.includes(path.extname(item))) {
					return;
				}

				const file = path.join(from, item);

				if (filter && page) {
					let checkFilter = filter(file, data, page.name, type);
					if (!checkFilter) {
						return;
					}
				}

				if (!checkFile(file, block, item, isDev)) return;

				if (imports.indexOf(file) === -1) {
					imports.push(file);
				}
			});
		}

		if (type === 'inject') {
			const scripts = page.scripts;
			const styles = page.styles;
			const assets = page.assets;

			items.forEach((item) => {
				if (typeof item !== 'string') return;

				const file = isExternal(from)
					? from + item
					: path.join(from, item).replace(async, '');

				if (filter && page) {
					let checkFilter = filter(file, data, page.name, type);
					if (!checkFilter) return;
				}

				if (isExternal(from)) {
					const extname = path.extname(item.replace(async, ''));

					if (extname === '.js' && scripts.indexOf(file) === -1) {
						scripts.push(file);
					}
					if (extname === '.css' && styles.indexOf(file) === -1) {
						styles.push(file);
					}
				} else {
					const name = path.basename(file);
					const extname = path.extname(file);

					if (!checkFile(file, block, item, isDev)) return;

					if (extname === '.js' && scripts.indexOf(name) === -1) {
						scripts.push(name);
					}
					if (extname === '.css' && styles.indexOf(name) === -1) {
						styles.push(name);
					}
					if (assets.indexOf(file) === -1) {
						assets.push(file);
					}
				}
			});
		}
	});
};
