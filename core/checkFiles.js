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
	const importExtnames = {
		styles: ['.css', config.component.styles],
		scripts: ['.js', config.component.scripts],
	};

	if (!tree) {
		return;
	}

	pages.forEach((page) => {
		if (!page) {
			return;
		}

		const nodes = tree[page];
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
		});
	});
};
