/**
 * Parse components from pagesto analyze.
 *
 * @param {Object} task
 *
 * @return {undefined}
 */

export default (task) => {
	const { store } = task;
	const pages = store.pages;
	const siteComponents = (store.site_components = {
		length: 0,
		components: {},
	});

	Object.keys(pages).forEach((page) => {
		if (!page) {
			return;
		}

		Object.keys(pages[page].components).forEach((component) => {
			if (!siteComponents.components[component]) {
				siteComponents.components[component] =
					(siteComponents.components[component] || 0) + 1;
				console.log(Object.values(component));
			}
		});
	});

	siteComponents.length = Object.keys(siteComponents.components).length;
};
