const clickOutside = (el, callback) => {
	document.addEventListener('click', function (evt) {
		const isClickedOutside = !el.contains(evt.target);
		if (isClickedOutside) {
			callback();
		}
	});
};

export { clickOutside };
