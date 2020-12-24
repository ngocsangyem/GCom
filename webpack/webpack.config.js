const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const glob = require('glob');
const webpack = require('webpack');

const { isDev } = require('../gulp/utils');
const { paths, config } = require('../core/index');

const extname = config.component.scripts.extension;

const getEntry = () => {
	if (!config.build.bundles.includes('js')) {
		let mainBundle = config.build.mainBundle;
		return { [mainBundle]: paths.app(`${mainBundle}${extname}`) };
	} else {
		const files = {};
		glob.sync(paths.pages(`**/*${extname}`))
			.filter(function (file) {
				return /\.component\.(js)$/i.test(file);
			})
			.map(function (file) {
				files[path.basename(path.dirname(file))] = `${file}`;
			});
		return files;
	}
};

const WebpackConfig = {
	devtool: isDev ? 'eval-source-map' : false,
	mode: isDev ? 'development' : 'production',
	plugins: [
		new webpack.DefinePlugin({
			PRODUCTION: JSON.stringify(true),
		}),
	],
	module: {
		rules: [],
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx'],
	},
};

if (extname === '.js') {
	WebpackConfig.module.rules.push({
		test: /\.js$/,
		exclude: /(node_modules|bower_components)/,
		use: {
			loader: 'babel-loader',
			options: {
				presets: ['@babel/preset-env'],
			},
		},
	});
} else if (extname === '.ts') {
	WebpackConfig.module.rules.push({
		test: /\.tsx?$/,
		exclude: /(node_modules|bower_components)/,
		use: {
			loader: 'awesome-typescript-loader',
		},
	});
}

if (!isDev) {
	WebpackConfig.plugins.push(
		new TerserPlugin({
			cache: true,
			parallel: true,
			extractComments: false,
		})
	);
}

module.exports = { WebpackConfig };
