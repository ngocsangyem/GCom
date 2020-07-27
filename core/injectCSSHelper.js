/**
 * imports file to main bundle.
 *
 * @param {Object} file
 * @param {Object} task
 *
 * @return {undefined}
 */

export default (file, task) => {
	const { paths, config, path, isFile } = task;

	const extname = path.extname(file.path);
	const dirname = path.dirname(file.path);
	const content = String(file.contents);

	if (extname !== config.component.styles) {
		return;
	}

	if (file.path.indexOf(paths.components) === -1) {
		return;
	}

	const imports = config.build.globalStyles;
	const array = Array.isArray(imports) ? imports : [imports];

	array.forEach((item) => {
		console.log('item', item);
		if (typeof item !== 'string') return;

		item = item.trim();

		if (!item) return;

		const file = paths.app(item);

		if (!isFile(file)) {
			return console.log(
				`\n\x1b[41mFAIL\x1b[0m: Global style for import "\x1b[36m${item}\x1b[0m" not found!\nFullpath: "${file}"\n`
			);
		}

		injected += `@import "${paths.slashNormalize(
			path.relative(dirname, file)
		)}";\n`;
	});

	file.contents = Buffer.from(injected + content);
};
