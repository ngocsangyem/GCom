/*
 * @param {HTMLElement} parent
 * @param {HTMLElement} child
 * @return boolean
 * @desc
 * Check that parent is not the same element as child, use parent.contains(child) to check if the parent element contains the child element.
 */

const elementContains = (parent, child) =>
	parent !== child && parent.contains(child);

export { elementContains };
