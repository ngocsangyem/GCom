import * as BEM from './bem';
import checkModules from './checkModules';

/**
 * Check a files from bem tree.
 *
 * @param {String} type
 * @param {Object} task
 *
 * @return {undefined}
 */

export default (type, task) => {
	const { store, paths, config, isDev, mainBundle, isFile } = task;
	const { tree, deps, levels } = store;
	const needBundles = config.build.bundles.includes(
		type === 'scripts' ? 'js' : 'css'
	);
	const extname =
		type === 'scripts'
			? config.component[type].extension
			: config.component[type];
	const pages =
		!isDev && needBundles ? Object.keys(store.pages) : [mainBundle];
	const importExtnames = {
		styles: ['.css', config.component.styles],
		scripts: ['.js', config.component.scripts.extension],
	};

	if (!store.pages) {
		return;
	}

	pages.forEach((p) => {
		if (!(p in store.pages)) {
			return;
		}
		const page = store.pages[p];
		// console.log(page['styles']);
		const components = page.components;
		const array = !page[type] ? [] : page[type];

		if (!components) {
			return;
		}

		Object.keys(components).forEach((component) => {
			// If component is component check modules

			if (BEM.isComponent(component) && deps[component]) {
				checkModules(
					component,
					'import',
					store.pages && page,
					deps,
					task,
					importExtnames[type],
					array
				);
			}

			// levels.forEach((level) => {
			// 	const files = [component].concat(components[component]);

			// 	files.forEach((item) => {
			// 		const file = paths.app(level, component, item + extname);

			// 		if (isFile(file) && array.indexOf(file) === -1) {
			// 			array.push(file);
			// 		}
			// 	});
			// });
		});
	});
};
