export class cardV8Component {
	constructor() {
		console.log('card-v8 component');
	}
	static init() {
		const card_v8 = new cardV8Component();
		return card_v8;
	}
}
(function () {
	cardV8Component.init();
})();
