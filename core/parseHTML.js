/**
 * Parse HTML code from the given `file`.
 *
 * @param {Object} file
 * @param {Object} task
 *
 * @return {undefined}
 */

export default (file, task) => {
	const {
		path,
		paths,
		store,
		isDev,
		removeExtension,
		htmlparser2,
		parseDeps,
		parseAsset,
		parseClass,
		injectToHTML,
		parseXlink,
	} = task;

	const name = removeExtension(
		path.basename(file.path, path.extname(file.path))
	);
	const code = String(file.contents);
	const page = store.pages[name];

	const parse = new htmlparser2.Parser(
		{
			onopentag(tag, attrs) {
				// Parse assets from attrs

				if (tag === 'use') {
					return parseXlink(attrs['xlink:href'], page, paths);
				}

				if (!isDev) {
					Object.keys(attrs).forEach((attr) => {
						parseAsset(attrs[attr], page, paths);
					});
				}

				Object.keys(attrs).forEach((attr) => {
					if (attr === 'src') {
						attrs[attr];
					}
				});

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
				if (!isDev) {
					return;
				}

				const injected = injectToHTML(code, page, task);

				file.contents = Buffer.from(injected);
			},
		},
		{ decodeEntities: true }
	);

	parse.write(code);
	parse.end();
};
