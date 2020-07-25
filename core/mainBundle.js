export default (task) => {
	const { config, mainBundle, paths, fs, isFile } = task;
	const needBundles = {
		styles: config.build.bundles.includes('css'),
		scripts: config.build.bundles.includes('js'),
	};

	if (needBundles.styles) {
	}
};
