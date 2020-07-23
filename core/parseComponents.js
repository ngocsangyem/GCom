/**
 * Parse components from pagesto analyze.
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

	Object.keys(pages).forEach((page) => {
		if (!page) {
			return;
		}
		if (page !== mainBundle) {
			Object.keys(pages[page].components).forEach((component) => {
				if (!siteComponents.components[component]) {
					const templatePath =
						pages[page].components[component].template;
					const pathArray = templatePath.split('/');
					const parentIndex = pathArray.findIndex(
						(item) => item === 'app'
					);
					const fileIndex = pathArray.findIndex(
						(item) => item === path.basename(templatePath)
					);
					siteComponents.components[component] = {
						count: (siteComponents.components[component] || 0) + 1,
						destination: pathArray
							.slice(parentIndex + 1, fileIndex)
							.join('/'),
					};
				}
			});
		}
	});

	siteComponents.length = Object.keys(siteComponents.components).length;
};
