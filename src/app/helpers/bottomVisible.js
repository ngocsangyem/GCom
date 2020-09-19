/*
 * @return boolean
 * @desc
 * Returns true if the bottom of the page is visible, false otherwise.
 */

const bottomVisible = () =>
	document.documentElement.clientHeight + window.scrollY >=
	(document.documentElement.scrollHeight ||
		document.documentElement.clientHeight);
