import * as BEM from './bem';

/**
 * Parse class from HTML component and add to BEM tree.
 *
 * @param {String} cls
 * @param {Object} page
 * @param {Array} mix
 *
 * @return {undefined}
 */

export default (cls, page, mix, attrs, tag) => {
	if (!cls) {
		return;
	}

	const isBEM = BEM.isBEM(cls);
	const isModifier = BEM.isModifier(cls);
	const node = isModifier ? BEM.delModifier(cls) : cls;

	if (!page.components[node]) {
		page.components[node] = { name: node, mod: [], mix: [], attrs, tag };
	}

	if (isBEM) {
		if (isModifier) {
			if (page.components[node].mod.indexOf(cls) === -1) {
				page.components[node].mod.push(cls);
			}
		} else {
			if (mix && mix.length > 0) {
				mix.forEach((item) => {
					if (page.components[node].mix.indexOf(item) === -1) {
						page.components[node].mix.push(item);
					}
				});
			}

			if (mix && mix.indexOf(cls) === -1) {
				mix.push(cls);
			}
		}
	}
};
