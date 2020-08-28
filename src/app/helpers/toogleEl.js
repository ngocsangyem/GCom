/*
 * @param {HTML Element} ele
 * @return null
 */

const toggleEl = (ele) =>
	(ele.style.display = ele.style.display === 'none' ? 'block' : 'none');

export { toggleEl };
