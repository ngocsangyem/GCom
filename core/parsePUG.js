module.exports = function (file, task) {
	const {
		store,
		config,
		parsePug,
		lexer,
		glob,
		removeExtension,
		path,
		fs,
	} = task;
	const name = removeExtension(
		path.basename(file.path, path.extname(file.path))
	);
	const filePage = file.path.replace(/\.[^/.]+$/, '');
	const page = (store.pages[name] = {
		name: name,
		template: filePage + config.component.templates,
		components: {},
		BEM_tree: {},
		styles: [],
		scripts: [],
		assets: [],
		symbol: [],
		temp: {
			styles: [],
			scripts: [],
		},
	});

	page.styles.push(filePage + config.component.styles);
	page.scripts.push(filePage + config.component.scripts.extension);

	const filename = file.path;
	const src = fs.readFileSync(filename).toString();
	const tokens = lexer(src, { filename });
	let ast = parsePug(tokens, { filename, src });

	const resolve = (filename, source) => {
		filename = filename.trim();
		if (filename[0] !== '/' && !source) {
			throw new Error(
				'the "filename" option is required to use includes and extends with "relative" paths'
			);
		}

		filename = path.join(
			filename[0] === '/' ? options.basedir : path.dirname(source.trim()),
			filename
		);

		return filename;
	};

	ast.nodes.forEach((node) => {
		if (node.type === 'NamedBlock') {
			let includes = node.nodes.filter((nod) => nod.type === 'Include');
			includes.forEach((include) => {
				let name = removeExtension(
					path.basename(
						include.file.path,
						path.extname(include.file.path)
					)
				);
				const absolutePath = resolve(
					include.file.path,
					include.file.filename
				);
				const parentPath = path.dirname(absolutePath);
				const styles = glob
					.sync(`${parentPath}/**/*${config.component.styles}`)
					.filter(function (file) {
						return /\.(s?css|sass|stylus|less)$/i.test(file);
					});
				const scripts = glob
					.sync(
						`${parentPath}/**/*${config.component.scripts.extension}`,
						{
							ignore: [
								`${parentPath}/**/*.test.js`,
								`${parentPath}/**/deps.js`,
							],
						}
					)
					.filter(function (file) {
						return /\.(j|t)s$/i.test(file);
					});
				page.components[name] = {
					name,
					relativePath: include.file.path,
					template: absolutePath,
					styles,
					scripts,
				};
			});
		}
	});
};
