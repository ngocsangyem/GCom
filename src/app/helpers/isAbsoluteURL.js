/*
 * @param {String} url
 * @return boolean
 * @example
 * isAbsoluteURL('https://google.com'); => true
 * isAbsoluteURL('ftp://www.myserver.net'); => true
 * isAbsoluteURL('/foo/bar'); => false
 */

const isAbsoluteURL = (url) => {
	return /^[a-z][a-z0-9+.-]*:/.test(url);
};

export { isAbsoluteURL };
