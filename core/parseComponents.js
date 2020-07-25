/**
 * Parse components from pages to analyze.
 *
 * @param {Object} task
 *
 * @return {undefined}
 */

export default (task) => {
	const { store, mainBundle, path } = task;
	const pages = store.pages;
	const siteComponents = (store.site_components = {
		length: 0,
		components: {},
	});
	const componentsArray = [];
	let components;

	Object.keys(pages).forEach((page) => {
		if (!page) {
			return;
		}
		componentsArray.push(pages[page].components);
	});

	components = { ...Object.assign({}, ...componentsArray) };

	for (const component in components) {
		if (!siteComponents.components[component]) {
			const templatePath = components[component].template;
			const pathArray = templatePath.split('/');
			const parentIndex = pathArray.findIndex((item) => item === 'app');
			const fileIndex = pathArray.findIndex(
				(item) => item === path.basename(templatePath)
			);
			siteComponents.components[component] = {
				count: (siteComponents.components[component] || 0) + 1,
				destination: pathArray
					.slice(parentIndex + 1, fileIndex)
					.join('/'),
				styles: [...components[component].styles],
				scripts: [...components[component].scripts],
			};

			store.pages[mainBundle].styles.push(
				...siteComponents.components[component].styles
			);
			store.pages[mainBundle].scripts.push(
				...siteComponents.components[component].scripts
			);
		}
	}
	siteComponents.length = Object.keys(siteComponents.components).length;
};
