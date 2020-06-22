import { slideDown } from './slideDown';
import { slideUp } from './slideUp';
const slideToggle = (target, duration = 500) => {
	if (window.getComputedStyle(target).display === 'none') {
		return slideDown(target, duration);
	} else {
		return slideUp(target, duration);
	}
};

export { slideToggle };
