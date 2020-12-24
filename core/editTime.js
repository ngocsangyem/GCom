'use strict';

// Require

const { utimesSync } = require('fs');

/**
 * Change the file system timestamps at the given `path`.
 *
 * @param {String} path
 *
 * @return {undefined}
 */

module.exports = function (path) {
	try {
		const time = Date.now() / 1000;

		utimesSync(path, time, time);
	} catch (e) {
		console.log(e);
	}
};
