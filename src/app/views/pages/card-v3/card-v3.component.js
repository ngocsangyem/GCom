export class cardV3Component {
	constructor() {
		console.log('card-v3 component');
	}
	static init() {
		const card_v3 = new cardV3Component();
		return card_v3;
	}
}
(function () {
	cardV3Component.init();
})();
