export default (task) => {
	const { config, mainBundle, paths, fs, log, c } = task;
	// const noBundlesStyles = !config.build.bundles.includes('css');

	const stylesExtname = config.component.styles.slice(1);
	const filename = paths.app(`${mainBundle}.${stylesExtname}`);
	const content = `// Inject:start\n\n// Inject:end`;
	if (!fs.existsSync(filename)) {
		fs.writeFile(filename, content, (err) => {
			if (err) {
				log.error(c.redBright(err));
				return;
			}
			log.info(
				c.greenBright(
					`${mainBundle}.${stylesExtname} is created in app folder`
				)
			);
		});
	}
};
