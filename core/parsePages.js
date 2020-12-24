/**
 * Generate pages object.
 *
 * @param {Object} file
 * @param {Object} task
 *
 * @return {undefined}
 */

module.exports = function (file, task) {
	const { config, path, store, removeExtension } = task;
	const name = removeExtension(
		path.basename(file.path, path.extname(file.path))
	);
	const filePage = file.path.replace(/\.[^/.]+$/, '');
	const componentConfig = config.component;

	const page = (store.pages[name] = {
		name: name,
		styles: filePage + componentConfig.styles,
		scripts: filePage + componentConfig.scripts.extension,
		components: {},
		assets: [],
		symbol: [],
		BEM_tree: {},
		temp: {
			styles: [],
			scripts: [],
		},
	});
};
