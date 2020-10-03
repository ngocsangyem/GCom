export class cardV10Component {
	constructor() {
		console.log('card-v10 component');
	}
	static init() {
		const card_v10 = new cardV10Component();
		return card_v10;
	}
}
(function () {
	cardV10Component.init();
})();
