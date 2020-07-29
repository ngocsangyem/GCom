export class IndexComponent {
	constructor() {
		console.log('index component');
	}
	static init() {
		const index = new IndexComponent();
		return index;
	}
}
