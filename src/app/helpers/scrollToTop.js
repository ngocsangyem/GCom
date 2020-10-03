/*
 * @return undefined
 * @desc
 * Smooth-scrolls to the top of the page.
 */
const scrollToTop = () => {
	const c = document.documentElement.scrollTop || document.body.scrollTop;
	if (c > 0) {
		window.requestAnimationFrame(scrollToTop);
		window.scrollTo(0, c - c / 8);
	}
};

export { scrollToTop };
