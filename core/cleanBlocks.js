const fs = require('fs');
const path = require('path');
const glob = require('glob');
const BEM = require('./bem');
const { isDirectory } = require('./is');

/**
 * Check all components and del unnecessary files.
 *
 * @param {Object} task
 *
 * @return {undefined}
 */

module.exports = function (task) {
	const { paths, store, config, mainBundle } = task;

	const components = paths._components;
	const tree = store.tree[mainBundle];
	const clean = [];

	if (!tree) {
		return;
	}

	glob.sync(`${paths._app}/**/deps.js`).forEach((file) => {});
};
