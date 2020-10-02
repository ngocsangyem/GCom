export class cardV6Component {
	constructor() {
		console.log('card-v6 component');
	}
	static init() {
		const card_v6 = new cardV6Component();
		return card_v6;
	}
}
(function() {
	cardV6Component.init()
})();
