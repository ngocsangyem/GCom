const walkSync = function (dir, filelist) {
	if (dir[dir.length - 1] != '/') dir = dir.concat('/');

	const fs = require('fs'),
		files = fs.readdirSync(dir);
	filelist = filelist || [];
	files.forEach(function (file) {
		if (fs.statSync(dir + file).isDirectory()) {
			filelist = walkSync(dir + file + '/', filelist);
		} else {
			filelist.push(dir + file);
		}
	});
	return filelist;
};

module.exports = { walkSync };
