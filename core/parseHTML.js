import path from 'path';
import parseAsset from './parseAsset';
import parseClass from './parseClass';
import { parseDeps } from './parseDeps';
import injectToHTML from './injectToHTML';
import { removeExtension } from './helpers/remove-extension';

const htmlparser2 = require('htmlparser2');

/**
 * Parse HTML code from the given `file`.
 *
 * @param {Object} file
 * @param {Object} task
 *
 * @return {undefined}
 */

export default (file, task) => {
	const { paths, store, isDev, config } = task;

	const name = removeExtension(
		path.basename(file.path, path.extname(file.path))
	);
	const code = String(file.contents);

	const page = (store.pages[name] = {
		name: name,
		template: file.path,
		components: {},
		styles: [],
		scripts: [],
		assets: [],
	});

	const parse = new htmlparser2.Parser(
		{
			onopentag(tag, attrs) {
				// Parse assets from attrs

				if (!isDev) {
					Object.keys(attrs).forEach((attr) =>
						parseAsset(attrs[attr], page, paths)
					);
				}

				// Parse classes

				if (typeof attrs.class === 'string') {
					const mix = [];

					attrs.class.split(' ').forEach((cls) => {
						cls = cls.trim();
						parseClass(cls, page, mix, attrs, tag);
						parseDeps(cls, page, store.deps, task);
					});
				}
			},

			onend() {
				if (!isDev) return;

				const injected = injectToHTML(code, page, task);

				file.contents = Buffer.from(injected);
			},
		},
		{ decodeEntities: true }
	);

	parse.write(code);
	parse.end();
};
