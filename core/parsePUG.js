import parse from 'pug-parser';
import lexer from 'pug-lexer';
import walk from 'pug-walk';
import fs from 'fs';
import path from 'path';
import { removeExtension } from './helpers/remove-extension';
import glob from 'glob';

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

export default function (file, task) {
	const { paths, store, isDev, config } = task;
	const name = removeExtension(
		path.basename(file.path, path.extname(file.path))
	);
	const code = String(file.contents);

	const page = (store.pages[name] = {
		name: name,
		template: file.path,
		components: {},
		BEM_tree: {},
		styles: {
			main: '',
			components: [],
		},
		scripts: {
			main: '',
			components: [],
		},
		assets: [],
	});

	const filename = file.path;
	const src = fs.readFileSync(filename).toString();
	const tokens = lexer(src, { filename });
	let ast = parse(tokens, { filename, src });

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

				page.styles.components.push(...page.components[name].styles);
				page.scripts.components.push(...page.components[name].scripts);
			});
		}
	});
}
