import path from 'path';
import { isExternal } from './is';

/**
 * Parse CSS url and try to find assets.
 *
 * @this - task object
 *
 * @param {Object} asset - original url object
 * @param {Object} dir - postcss dir object
 * @param {Object} options - postcss-url matched options
 * @param {Object} decl - related postcss declaration object
 *
 * @return {String}
 */

export default (asset, dir, options, decl) => {
	console.log('asset', asset);
	if (!asset.url || isExternal(asset.url)) {
		return;
	}

	const extname = path.extname(asset.absolutePath);
	const isFont =
		decl.prop === 'src' &&
		['.eot', '.svg', '.ttf', '.woff', '.woff2'].includes(extname);
	const isSprite =
		asset.absolutePath.indexOf(path.join('img', 'sprite')) !== -1;
	const isModule = asset.absolutePath.indexOf(this.paths._app) === -1;
	const basename = path.basename(asset.url);

	if (isSprite && !this.isDev) {
		return this.paths.slashNormalize(
			path.relative(this.paths._root, asset.absolutePath)
		);
	}

	let name = '';
	let dist = '';

	if (isFont) {
		if (
			(!this.isDev || (this.isDev && isModule)) &&
			this.store.fonts.indexOf(asset.absolutePath) === -1
		) {
			this.store.fonts.push(asset.absolutePath);
		}
		dist = path.relative(this.paths._styles, this.paths._fonts);
		name = basename;
	} else {
		const component = path
			.relative(
				isModule ? this.paths._root : this.paths._app,
				asset.absolutePath
			)
			.split(path.sep)[1];

		if (
			(!this.isDev || (this.isDev && isModule)) &&
			this.store.images.indexOf(asset.absolutePath) === -1
		) {
			this.store.images.push(asset.absolutePath);
		}

		dist = path.relative(this.paths._styles, this.paths._img);
		name = (isSprite ? 'sprite_' : '') + `${component}_${basename}`;
	}
	return this.paths.slashNormalize(path.join(dist, name));
};
