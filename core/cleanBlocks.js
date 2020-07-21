import fs from 'fs';
import path from 'path';
import glob from 'glob';
import * as BEM from './bem';
import { isDirectory } from './is';

/**
 * Check all components and del unnecessary files.
 *
 * @param {Object} task
 *
 * @return {undefined}
 */

export default (task) => {
	const { paths, store, config, mainBundle } = task;

	const components = paths._components;
	const tree = store.tree[mainBundle];
	const clean = [];

	if (!tree) {
		return;
	}

	glob.sync(`${paths._app}/**/deps.js`).forEach((file) => {});
};
