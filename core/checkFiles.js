import * as BEM from './bem';
import checkModules from './checkModules';
import { isFile } from './is';

/**
 * Check a files from bem tree.
 *
 * @param {String} type
 * @param {Object} task
 *
 * @return {undefined}
 */

export default (type, task) => {
	const { store, paths, config, isDev, mainBundle } = task;
	const { tree, deps } = store;
	const imports = store[type];
	const extname = config.component[type];
	const needBundles = config.build.bundles.includes(
		type === 'scripts' ? 'js' : 'css'
	);
	const pages = !isDev && needBundles ? Object.keys(tree) : [mainBundle];
	const storePages = store.pages;
	// console.log('pages', pages);
	const importExtnames = {
		styles: ['.css', config.component.styles],
		scripts: ['.js', config.component.scripts],
	};
	const siteComponents = store.site_components.components;
	if (!tree) {
		return;
	}

	pages.forEach((page) => {
		// console.log('page', page);
		if (!page) {
			return;
		}

		const nodes = tree['main'];
		const array = (imports[page] = []);

		if (!nodes) {
			return;
		}

		Object.keys(nodes).forEach((node) => {
			const component = BEM.getComponent(node);

			if (BEM.isComponent(node) && deps[node]) {
				checkModules(
					node,
					'import',
					store.pages && store.pages[page],
					deps,
					task,
					importExtnames[type],
					array
				);
			}

			const files = [node].concat(nodes[node]);
			const components = storePages[page].components;

			files.forEach((item) => {
				if (
					typeof components === 'object' &&
					components !== null &&
					components.hasOwnProperty(item)
				) {
					const file = paths.app(
						siteComponents[component].parent,
						item + config.component.prefix + extname
					);
					// console.log('file', file);
					if (isFile(file) && array.indexOf(file) === -1) {
						array.push(file);
					}
				}
			});
		});
	});
};
