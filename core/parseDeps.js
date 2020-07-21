import parseClass from './parseClass';
import checkModules from './checkModules';

/**
 * Parse block dependencies.
 *
 * @param {String} block
 * @param {Object} page
 * @param {Object} deps
 * @param {Object} task
 *
 * @return {undefined}
 */

export const parseDeps = (block, page, deps, task) => {
	if (!deps[block]) {
		return;
	}
	// Check nodes

	const nodes = deps[block].components || [];

	nodes.forEach((node) => {
		if (typeof node !== 'string') return;
		node = node.trim();
		if (page.nodes[node]) return;
		parseClass(node, page);
		parseDeps(node, page, deps, task);
	});

	// Check modules

	checkModules(block, 'inject', page, deps, task);
};
