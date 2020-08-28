/*
 * @param {HTML Element} el
 * @param {String} ruleName
 * @return string
 * @example
 * getStyle(document.querySelector('p'), 'font-size'); => '16px'
 */

const getStyle = (el, ruleName) => getComputedStyle(el)[ruleName];

export { getStyle };
