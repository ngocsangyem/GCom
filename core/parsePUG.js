import parse from 'pug-parser';
import lexer from 'pug-lexer';

export const parsePug = (file, task) => {
	const { paths, store, isDev } = task;
	const name = path.basename(file.path, path.extname(file.path));
	const code = String(file.contents);

	const page = (store.pages[name] = {
		name: name,
		components: {},
		styles: [],
		scripts: [],
		symbol: [],
		assets: [],
	});

	console.log('parsePug');
};
