export class contactV2Component {
	constructor() {
		console.log('contact-v2 component');
	}
	static init() {
		const contact_v2 = new contactV2Component();
		return contact_v2;
	}
}
(function () {
	contactV2Component.init();
})();
