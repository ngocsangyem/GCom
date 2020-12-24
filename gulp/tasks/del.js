module.exports = {
	build: 0,
	name: 'task:clean',
	init() {
		return require('del')([
			this.paths._tmp,
			this.paths._build,
			this.paths._build + '.zip',
		]);
	},
};
