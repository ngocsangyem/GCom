export class ProjectComponent {
	constructor() {
		console.log('project component');
	}
	static init() {
		const project = new ProjectComponent();
		return project;
	}
}
(function () {
	ProjectComponent.init();
})();
