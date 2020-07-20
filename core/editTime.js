'use strict';

// Require

import { utimesSync } from 'fs';

/**
 * Change the file system timestamps at the given `path`.
 *
 * @param {String} path
 *
 * @return {undefined}
 */

export default function (path) {
	try {
		const time = Date.now() / 1000;

		utimesSync(path, time, time);
	} catch (e) {
		console.log(e);
	}
}
