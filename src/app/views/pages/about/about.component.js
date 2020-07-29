export class AboutComponent {
	constructor() {
		console.log('about component');
	}
	static init() {
		const about = new AboutComponent();
		return about;
	}
}
