const toggleEl = (el) => {
	const display = el.style.display;
	el.style.display = display === 'none' ? 'block' : 'none';
};

export { toggleEl };
