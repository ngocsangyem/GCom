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
	const componentsTree = {};

	const app = {};
	let appComponents = {};

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

	for (const page in pages) {
		const components = pages[page].components;
		for (const component in components) {
			if (components.hasOwnProperty(component)) {
				const c = components[component];
				if (!(c in appComponents)) {
					appComponents[component] = c;
				}
			}
		}
	}

	if (!isDev && config.build.bundles.length > 0 && pages[mainBundle]) {
		throw new Error(
			`\n\n\x1b[41mFAIL\x1b[0m: A page "\x1b[36m${mainBundle}\x1b[0m" have the same name as main bundle, please rename the page or change bundle name in config!`
		);
	}
	pages[mainBundle] = { components: appComponents, BEM_tree: app };

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
