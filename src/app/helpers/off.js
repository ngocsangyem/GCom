/*
 * @param {HTMLElement} el
 * @param {String} evt
 * @param {Function} fn
 * @param {Boolean} opts
 * @return undefined
 * @desc
 * Removes an event listener from an element.
 * Use EventTarget.removeEventListener() to remove an event listener from an element. Omit the fourth argument opts to use false or specify it based on the options used when the event listener was added.
 */

const off = (el, evt, fn, opts = false) =>
	el.removeEventListener(evt, fn, opts);

// const fn = () => console.log('!');
// document.body.addEventListener('click', fn);
// off(document.body, 'click', fn); // no longer logs '!' upon clicking on the page

export { off };
