/**
 * imports file to main bundle.
 *
 * @param {Object} file
 * @param {Object} task
 *
 * @return {undefined}
 */

export default (file, task) => {
	const { store, paths, config, path, isFile, mainBundle, fs } = task;

	const extname = path.extname(file.path);
	const content = String(file.contents);
	const pages = store.pages;
	const extension = config.component.styles.slice(1);
	let injected = '';

	if (extname !== config.component.styles) {
		return;
	}
	const stream = fs.createWriteStream(file.path, {
		flags: 'a', // 'a' means appending (old data will be preserved)
	});
	Object.keys(pages).forEach((page) => {
		if (page === mainBundle) {
			return;
		}
		const p = pages[page];
		const dirname = path.dirname(paths.app(`${mainBundle}.${extension}`));
		const file = p.styles;

		if (extension === '.sass') {
			injected += `@import "${paths.slashNormalize(
				path.relative(dirname, file)
			)}";\n`;
		} else {
			injected += `@import "${paths.slashNormalize(
				path.relative(dirname, file)
			)}";\n`;
		}
	});
	file.contents = Buffer.from(injected + content);
	stream.write(file.contents);
};
