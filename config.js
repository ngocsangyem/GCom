module.exports = {
	app: {
		name: 'yem',
		version: '1.0.0',
		url: 'https://yem.com',
	},

	component: {
		templates: '.pug',
		scripts: {
			extension: '.js',
			syntax: 'function',
		},
		styles: '.scss',
		data: false,
		BEM: false,
		test: false,
		prefix: '.component',
	},

	build: {
		addVersions: true,
		bundles: ['js', 'css'],
		mainBundle: 'main',
		globalStyles: 'app/styles/styles.scss',
	},

	createComponent: {
		b: ['.js', '.scss', '.pug'],
	},
};
