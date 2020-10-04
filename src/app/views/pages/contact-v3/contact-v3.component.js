export class contactV3Component {
	constructor() {
		console.log('contact-v3 component');
	}
	static init() {
		const contact_v3 = new contactV3Component();
		return contact_v3;
	}
}
(function () {
	contactV3Component.init();
})();
