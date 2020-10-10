export class linkCardComponent {
	constructor() {
		console.log('link-card component');
	}
	static init() {
		const link-card = new linkCardComponent();
		return link-card;
	}
}
(function() {
	linkCardComponent.init()
})();