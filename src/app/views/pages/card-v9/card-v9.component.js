export class cardV9Component {
	constructor() {
		console.log('card-v9 component');
	}
	static init() {
		const card_v9 = new cardV9Component();
		return card_v9;
	}
}
(function () {
	cardV9Component.init();
})();
