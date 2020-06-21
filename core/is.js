import fs from 'fs';
import c from 'ansi-colors';

/**
 * Check file and directory.
 *
 * @param {String}
 *
 * @return {Boolean}
 */

const isFile = (filePath) => {
	let file = false;
	try {
		file = fs.statSync(filePath);
	} catch (error) {
		console.log(c.red(error));
	}

	return file && !file.isDirectory();
};

const isDirectory = (directoryPath) => {
	let stats = false;

	try {
		stats = fs.lstatSync(directoryPath);
	} catch (error) {
		console.log(c.red(error));
	}

	return stats && stats.isDirectory();
};

const isExternal = (url) => {
	if (typeof url !== 'string') {
		console.log(c.red(`${url} must be string`));
		return false;
	}
	return (
		/^(?:https?\:)?\/\//i.test(url) ||
		url.indexOf('data:') === 0 ||
		url.charAt(0) === '#'
	);
};

export { isFile, isDirectory, isExternal };
