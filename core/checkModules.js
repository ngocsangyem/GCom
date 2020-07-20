import fs from 'fs';
import path from 'path';
import checkFile from './checkFile';
import { isExternal } from './is';

/**
 * Check a modules from component dependency.
 *
 * @param {String} component
 * @param {String} type
 * @param {Object} page
 * @param {Object} deps
 * @param {Object} task
 * @param {Array} extnames
 * @param {Array} imports
 *
 * @return {undefined}
 */

export default (component, type, page, deps, task, extnames, imports) => {
	const { isDev } = task;
	const modules = (deps[component] && deps[component].modules) || [];
	const async = /@(async|defer)/gi;
	const node = page.components && page.components[component];
	const data = {
		name: block,
		attrs: (node && node.attrs) || {},
		tag: (node && node.tag) || '',
	};
};
