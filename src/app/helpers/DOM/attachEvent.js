const attachEvent = (className, callback) => {
	document.addEventListener("click", event => {
		const target = event.target;
		if (target.classList.contains(className)) {
			callback(event);
		}
	});
};

export { attachEvent };
