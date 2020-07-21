/**
 * Parse components from pages and generate BEM tree.
 *
 * @param {Object} task
 *
 * @return {undefined}
 */

export default (task) => {
	const { store, isDev, config, mainBundle } = task;
	const assets = (store.assets = []);
	const pages = store.pages;
	const tree = (store.tree = {});

	const app = {};

	if (pages[mainBundle]) delete pages[mainBundle];

	Object.keys(pages).forEach((page) => {
		if (!page) {
			return;
		}

		Object.keys(pages[page].BEM_tree).forEach((component) => {
			if (!app[component]) {
				app[component] = { mod: [], mix: [] };
			}

			pages[page].BEM_tree[component].mod.forEach((mod) => {
				if (app[component].mod.indexOf(mod) === -1) {
					app[component].mod.push(mod);
				}
			});

			pages[page].BEM_tree[component].mix.forEach((mix) => {
				if (app[component].mix.indexOf(mix) === -1) {
					app[component].mix.push(mix);
				}
			});
		});

		pages[page].assets.forEach((asset) => {
			if (assets.indexOf(asset) === -1) {
				assets.push(asset);
			}
		});
	});

	// Parse mix

	const parse = (key, page) => {
		if (pages[page].BEM_tree[key].already) {
			return;
		}

		pages[page].BEM_tree[key].already = true;

		if (!tree[page]) {
			tree[page] = {};
		}

		if (pages[page].BEM_tree[key].mix.length > 0) {
			pages[page].BEM_tree[key].mix.forEach((mix) => parse(mix, page));
		}

		return (tree[page][key] = pages[page].BEM_tree[key].mod);
	};

	Object.keys(pages).forEach((page) => {
		Object.keys(pages[page].BEM_tree).forEach((key) => parse(key, page));
	});
};
