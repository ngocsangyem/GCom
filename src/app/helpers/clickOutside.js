/*
 * @param {String} el
 * @param {Function} callback
 * @return null
 * @desc
 * Detect click out side the element
 */

const clickOutside = (el, callback) => {
	document.addEventListener('click', function (evt) {
		const isClickedOutside = !el.contains(evt.target);
		if (isClickedOutside) {
			callback();
		}
	});
};

export { clickOutside };
