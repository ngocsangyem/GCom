export class cardV5Component {
	constructor() {
		console.log('card-v5 component');
	}
	static init() {
		const card_v5 = new cardV5Component();
		return card_v5;
	}
}
(function() {
	cardV5Component.init()
})();
