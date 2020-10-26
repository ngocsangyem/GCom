export class linkCardComponent {
	constructor() {
		console.log('link-card component');
	}
	static init() {
		const link_card = new linkCardComponent();
		return link_card;
	}
}
(function () {
	linkCardComponent.init();
})();
