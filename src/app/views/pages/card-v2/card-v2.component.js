export class cardV2Component {
	constructor() {
		console.log('card-v2 component');
	}
	static init() {
		const card_v2 = new cardV2Component();
		return card_v2;
	}
}
(function () {
	cardV2Component.init();
})();
