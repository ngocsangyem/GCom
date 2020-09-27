import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import glob from 'glob';
import webpack from 'webpack';

import { args, isDev } from '../gulp/utils';
import { paths, config } from '../core/index';

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

export { WebpackConfig };
