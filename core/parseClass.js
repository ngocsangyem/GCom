const BEM = require('./bem');

/**
 * Parse class from HTML component and add to BEM tree.
 *
 * @param {String} cls
 * @param {Object} page
 * @param {Array} mix
 *
 * @return {undefined}
 */

module.exports = function (cls, page, mix, attrs, tag) {
	if (!cls) {
		return;
	}

	const isBEM = BEM.isBEM(cls);
	const isModifier = BEM.isModifier(cls);
	const node = isModifier ? BEM.delModifier(cls) : cls;

	if (!page.BEM_tree[node]) {
		page.BEM_tree[node] = { name: node, mod: [], mix: [], attrs, tag };
	}

	if (isBEM) {
		if (isModifier) {
			if (page.BEM_tree[node].mod.indexOf(cls) === -1) {
				page.BEM_tree[node].mod.push(cls);
			}
		} else {
			if (mix && mix.length > 0) {
				mix.forEach((item) => {
					if (page.BEM_tree[node].mix.indexOf(item) === -1) {
						page.BEM_tree[node].mix.push(item);
					}
				});
			}

			if (mix && mix.indexOf(cls) === -1) {
				mix.push(cls);
			}
		}
	}
};
