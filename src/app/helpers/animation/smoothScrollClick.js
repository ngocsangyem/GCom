import { scrollToTarget } from './scrollToTarget';

const smoothScrollClick = function (e) {
	// Prevent the default action
	e.preventDefault();

	// Get the `href` attribute
	const href = e.target.getAttribute('href');
	const id = href.substr(1);
	const target = document.getElementById(id);

	scrollToTarget(target);
};

export { smoothScrollClick };
