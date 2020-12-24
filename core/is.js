const fs = require('fs');
const c = require('ansi-colors');

/**
 * Check file and directory.
 *
 * @param {String}
 *
 * @return {Boolean}
 */

module.exports = {
	isFile(filePath) {
		let file = false;
		try {
			file = fs.statSync(filePath);
		} catch (error) {
			console.log(c.red(error));
		}

		return file && !file.isDirectory();
	},

	isDirectory(directoryPath) {
		let stats = false;

		try {
			stats = fs.lstatSync(directoryPath);
		} catch (error) {
			// console.log(c.red(error));
		}

		return stats && stats.isDirectory();
	},

	isExternal(url) {
		if (typeof url !== 'string') {
			console.log(c.red(`${url} must be string`));
			return false;
		}
		return (
			/^(?:https?\:)?\/\//i.test(url) ||
			url.indexOf('data:') === 0 ||
			url.charAt(0) === '#'
		);
	},
};
