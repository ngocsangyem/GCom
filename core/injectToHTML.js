import fs from 'fs';
import path from 'path';
import { isExternal, isFile } from './is';

/**
 * Append styles and scripts to HTML code.
 *
 * @param {String} code
 * @param {Object} page
 * @param {Object} task
 *
 * @return {String}
 */

export default (code, page, task) => {
	const { paths, config, store, isDev, mainBundle, isFile } = task;

	const withGap = /(\s+)?(<!--(\s+)?Inject:([\w]+)(\s+)?-->)/gi;
	const comment = /(\s+)?(<!--(\s+)?GULPC:([\w]+)(\s+)?-->)/gi;
	const pattern = /@(async|defer)/gi;
	const newLine = /(?:\r\n|\r|\n)/g;
	const version =
		!isDev && config.build.addVersions ? `?v=${Date.now()}` : '';
	const arrays = {
		scripts: [],
		styles: [],
	};

	const hrefDev = config.directories.development.scripts;
	const hrefProd = config.directories.development.scripts;
	const srcDev = config.directories.development.scripts;
	const srcProd = config.directories.development.scripts;

	if (isDev) {
		page.styles.unshift(`${mainBundle}.css`);
		page.scripts.push(`${mainBundle}.js`);
	} else {
		const bundles = config.build.bundles;
		const style =
			(bundles.includes('css') ? page.name : mainBundle) + '.min.css';
		const script =
			(bundles.includes('js') ? page.name : mainBundle) + '.min.js';

		if (isFile(path.join(paths._styles, style))) {
			page.styles.unshift(style);
		}
		if (isFile(path.join(paths._scripts, script))) {
			page.scripts.push(script);
		}
	}

	page.scripts.forEach((src) => {
		let script = '<script src="[src]"[attr]></script>';
		let attrs = '';

		if (/@async/gi.test(src)) attrs += ' async';
		if (/@defer/gi.test(src)) attrs += ' defer';

		if (!isExternal(src)) {
			src = `${config.build.HTMLRoot}${isDev ? srcDev : srcProd}/${src}`;
		}

		script = script
			.replace(
				'[src]',
				src.replace(pattern, '') + (isExternal(src) ? '' : version)
			)
			.replace('[attr]', attrs);

		if (arrays.scripts.indexOf(script) === -1) {
			arrays.scripts.push(script);
		}
	});

	page.styles.forEach((href) => {
		let style = '<link rel="stylesheet" href="[href]">';

		if (!isExternal(href)) {
			href = `${config.build.HTMLRoot}${
				isDev ? hrefDev : hrefProd
			}/${href}`;
		}

		style = style.replace(
			'[href]',
			href.replace(pattern, '') + (isExternal(href) ? '' : version)
		);

		if (arrays.styles.indexOf(style) === -1) {
			arrays.styles.push(style);
		}
	});

	let injected = code;

	injected = injected.replace(comment, (str, indent, com, space, name) => {
		if (!indent) {
			indent = '';
		}

		indent = '\n' + indent.replace(newLine, '');
		name = name.trim().toLowerCase();

		let instead = '';

		if (arrays[name] && arrays[name].length > 0) {
			instead = indent + arrays[name].join(indent);
		}

		return instead;
	});

	// Add gap

	injected = injected.replace(withGap, (str, indent, com, space, name) => {
		if (!indent) {
			indent = '';
		}

		indent = '\n\n\n' + indent.replace(newLine, '');

		return indent + `<!-- ${name.trim()} -->`;
	});

	injected = injected.replace(
		/(,|'|"|`| )@([\w-]+)/gi,
		(str, quote, asset) => {
			const paths = {
				styles: isDev ? hrefDev : hrefProd,
				scripts: isDev ? srcDev : srcProd,
			};

			const dist = paths[asset] || `${asset}`;

			return `${quote}${config.build.HTMLRoot}${dist}`;
		}
	);

	return injected;
};
