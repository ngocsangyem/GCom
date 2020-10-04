export class contactV1Component {
	constructor() {
		console.log('contact-v1 component');
	}
	static init() {
		const contact_v1 = new contactV1Component();
		return contact_v1;
	}
}
(function () {
	contactV1Component.init();
})();
