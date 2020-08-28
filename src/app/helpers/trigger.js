/*
 * @param {HTML Element} el
 * @param {String} eventName
 * @return null
 */

const trigger = (el, eventName) => {
	const e = document.createEvent('HTMLEvents');
	e.initEvent(eventName, true, false);
	el.dispatchEvent(e);
};

export { trigger };
