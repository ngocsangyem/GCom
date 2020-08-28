/*
 * @param {String} url
 * @param {String} param
 * @return string
 * @example
 * getParam('http://domain.com?message=hello', 'message'); => 'hello'
 */

const getParam = (url, param) =>
	new URLSearchParams(new URL(url).search).get(param);

export { getParam };
