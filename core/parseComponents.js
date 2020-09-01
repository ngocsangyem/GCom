/**
 * Parse components from pages to analyze.
 *
 * @param {Object} task
 *
 * @return {undefined}
 */

import { findFiles } from './helpers/findFiles';

export default (task) => {
	const { store, mainBundle, path, fs, paths, glob } = task;
	const levels = store.levels;
	const components = [];

	levels.forEach((level) => {
		console.log(findFiles(`${paths.app(level)}`, 'js'));
	});

	// components.forEach((component) => {
	// 	console.log('component', component);
	// });
};
