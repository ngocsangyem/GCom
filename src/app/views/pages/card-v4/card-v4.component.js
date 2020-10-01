export class cardV4Component {
	constructor() {
		console.log('card-v4 component');
	}
	static init() {
		const card_v4 = new cardV4Component();
		return card_v4;
	}
}
(function() {
	cardV4Component.init()
})();
