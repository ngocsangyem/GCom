import webpack from 'webpack';
import { WebpackConfig } from '../../webpack/webpack.config';

export default {
	name: 'task:scripts',
	build: 3,
	extname: function () {
		return this.config.component.scripts.extension.slice(1);
	},

	init(done) {
		const scripts = (this.store.scripts = {});
		const checkFiles = require(this.paths.core('checkFiles'));
		checkFiles('scripts', this);
		if (this.isDev || !this.config.build.bundles.includes('js')) {
			const mainBundleScripts = require(this.paths.core(
				'mainBundleScripts'
			));
			mainBundleScripts(this);
		}

		return new Promise((resolve, reject) => {
			webpack(WebpackConfig, (err, stats) => {
				if (err) {
					console.log('Webpack', err);
					reject(err);
				}
				console.log(
					stats.toString({
						colors: {
							green: '\u001b[32m',
						},
					})
				);
				resolve();
			});
		});
	},

	watch() {
		return {
			files: this.paths.app(
				'**',
				'!(deps)' + this.config.component.scripts.extension
			),
			tasks: this.name,
		};
	},
};
