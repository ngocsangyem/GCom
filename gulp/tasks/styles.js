import fs from 'fs';
export default {
	name: 'task:styles',
	build: 2,
	init() {
		fs.writeFile('./store.json', JSON.stringify(this.store), (err) => {
			if (err) {
				console.log(err);
			}
		});
		// console.log('index', this.store.pages['index'].components);
		// console.log('about', this.store.pages['about'].components);
	},
};
