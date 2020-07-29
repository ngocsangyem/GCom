// Inject:import

import { ProjectComponent } from './views/pages/project/project.component';

// Inject:end
class Main {
	constructor() {
		// Inject:init:class
		ProjectComponent.init();
		// Inject:end
	}

	static init() {
		const main = new Main();
		return main;
	}
}

(function () {
	Main.init();
})();
