const path = require('path');
const checkFile = require('./checkFile');
const { isExternal } = require('./is');

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

module.exports = function (
	component,
	type,
	page,
	deps,
	task,
	extnames,
	imports
) {
	const { isDev } = task;
	const modules = (deps[component] && deps[component].modules) || [];
	const async = /@(async|defer)/gi;
	const node = page.components && page.components[component];
	const data = {
		name: component,
		attrs: (node && node.attrs) || {},
		tag: (node && node.tag) || '',
	};
	const isExternalFrom = (module) =>
		module.external && typeof module.external === 'boolean';

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

				if (!checkFile(file, component, item, isDev)) return;

				if (imports.indexOf(file) === -1) {
					imports.unshift(file);
				}
			});
		}

		if (type === 'inject') {
			const scripts = page.temp.scripts;
			const styles = page.temp.styles;
			const assets = page.assets;

			items.forEach((item) => {
				if (typeof item !== 'string') return;

				const fileRaw = isExternal(from)
					? from + item
					: path.join(from, item).replace(async, '');
				const file = isExternal(from)
					? from + item
					: path.join(from, item);
				if (filter && page) {
					let checkFilter = filter(fileRaw, data, page.name, type);
					if (!checkFilter) return;
				}

				if (isExternal(from)) {
					const extname = path.extname(item.replace(async, ''));

					if (extname === '.js' && scripts.indexOf(fileRaw) === -1) {
						scripts.push(file);
					}
					if (extname === '.css' && styles.indexOf(fileRaw) === -1) {
						styles.push(file);
					}
				} else {
					const name = path.basename(file);
					const extname = path.extname(fileRaw);

					if (!checkFile(fileRaw, component, item, isDev)) {
						return;
					}

					if (extname === '.js' && scripts.indexOf(name) === -1) {
						scripts.push(name);
					}
					if (extname === '.css' && styles.indexOf(name) === -1) {
						styles.push(name);
					}
					if (assets.indexOf(fileRaw) === -1) {
						assets.push(fileRaw);
					}
				}
			});
		}
	});
};
