export class cardV7Component {
	constructor() {
		console.log('card-v7 component');
	}
	static init() {
		const card_v7 = new cardV7Component();
		return card_v7;
	}
}
(function () {
	cardV7Component.init();
})();
