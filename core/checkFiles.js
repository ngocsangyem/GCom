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
	const { store, paths, config, isDev, mainBundle, fs, isDirectory } = task;
	const { tree, deps, levels } = store;
	const needBundles = config.build.bundles.includes(
		type === 'scripts' ? 'js' : 'css'
	);
	const extname =
		type === 'scripts'
			? config.component[type].extension
			: config.component[type];
	const imports = store[type];
	const pages = !isDev && needBundles ? Object.keys(tree) : [mainBundle];
	const pagesStore = Object.keys(store.pages);
	const importExtnames = {
		styles: ['.css', config.component.styles],
		scripts: ['.js', config.component.scripts.extension],
	};

	if (!tree) {
		return;
	}

	pages.forEach((page) => {
		if (!page) {
			return;
		}

		const components = tree[page];
		const array = (imports[page] = []);

		if (!components) {
			return;
		}

		Object.keys(components).forEach((c) => {
			const component = BEM.getComponent(c);
			if (BEM.isComponent(component) && deps[component]) {
				checkModules(
					component,
					'import',
					store.pages && store.pages[page],
					deps,
					task,
					importExtnames[type],
					array
				);
			}

			levels.forEach((level) => {
				const files = [component].concat(components[component]);

				files.forEach((item) => {
					const file = paths.app(
						level,
						component,
						item + config.component.prefix + extname
					);

					if (fs.existsSync(file) && array.indexOf(file) === -1) {
						array.push(file);
					}
				});
			});
		});

		if (page === mainBundle) {
			pagesStore.forEach((page) => {
				const file = paths.pages(
					page,
					page + config.component.prefix + extname
				);
				if (fs.existsSync(file) && array.indexOf(file) === -1) {
					array.push(file);
				}
			});
		}
	});
};
