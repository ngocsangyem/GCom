const isAbsoluteURL = (url) => {
	return /^[a-z][a-z0-9+.-]*:/.test(url);
};

// isAbsoluteURL('https://google.com'); // true
// isAbsoluteURL('ftp://www.myserver.net'); // true
// isAbsoluteURL('/foo/bar'); // false

export { isAbsoluteURL };
