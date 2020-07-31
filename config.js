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
			syntax: 'class',
		},
		styles: '.scss',
		test: true,
		data: true,
		BEM: false,
		prefix: '.component',
	},

	build: {
		addVersions: false,
		babel: true,
		bundles: ['js', 'css'],
		sourcemaps: [],
		imagemin: [],
		mainBundle: 'main',
		globalStyles: false,
		zip: true,
		HTMLRoot: './',
	},

	createComponent: {
		b: ['.js', '.scss', '.pug'],
	},
};
