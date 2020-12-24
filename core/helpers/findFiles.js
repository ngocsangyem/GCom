const { join } = require('path');
const { readdirSync, statSync } = require('fs');

const findFiles = (base, ext, files, result) => {
	files = files || readdirSync(base);
	result = result || [];

	files.forEach(function (file) {
		const newbase = join(base, file);
		if (statSync(newbase).isDirectory()) {
			result = findFiles(newbase, ext, readdirSync(newbase), result);
		} else if (file.substr(-1 * (ext.length + 1)) == '.' + ext) {
			result.push(newbase);
		}
	});
	return result;
};

module.exports = { findFiles };
