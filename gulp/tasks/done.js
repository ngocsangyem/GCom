const fs = require('fs');
export default {
	build: 6,
	name: 'task:done',

	init(done) {
		fs.writeFileSync('./store.json', JSON.stringify(this.store));
		if (this.isDev) {
			return done();
		}

		let banner = [
			' ',
			'/////////////////////////////////////',
			`// ${this.config.app.name}`,
			'/////////////////////////////////////',
			' ',
		].join('\n');

		this.buildDone(banner, done);
	},

	buildDone(banner, done) {
		console.log(`\x1b[32m\nCongratulations!`);
		console.log(`\x1b[33m${banner}`);
		console.log(`\x1b[32mBuild Finished! Press Ctrl+C to exit.`);
		done();
	},
};
