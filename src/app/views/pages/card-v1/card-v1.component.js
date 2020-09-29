export class cardV1Component {
	constructor() {
		console.log('card-v1 component');
	}
	static init() {
		const card_v1 = new cardV1Component();
		return card_v1;
	}
}
(function () {
	cardV1Component.init();
})();
