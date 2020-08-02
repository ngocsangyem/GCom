const setHeight = (el, val) => {
	if (typeof val === 'function') {
		val = val();
	}
	if (typeof val === 'string') {
		el.style.height = val;
	} else {
		el.style.height = val + 'px';
	}
};

export { setHeight };
