// https://htmldom.dev/scroll-to-an-element-smoothly/
const scrollToTarget = function (target, duration = 500, easing) {
	const top = target.getBoundingClientRect().top;
	const startPos = window.pageYOffset;
	const diff = top;

	let startTime = null;
	let requestId;

	const loop = function (currentTime) {
		if (!startTime) {
			startTime = currentTime;
		}

		// Elapsed time in miliseconds
		const time = currentTime - startTime;

		const percent = Math.min(time / duration, 1);
		// use EasingFunctions to annimate
		window.scrollTo(0, startPos + diff * percent * easing(percent));

		if (time < duration) {
			// Continue moving
			requestId = window.requestAnimationFrame(loop);
		} else {
			window.cancelAnimationFrame(requestId);
		}
	};
	requestId = window.requestAnimationFrame(loop);
};

export { scrollToTarget };
