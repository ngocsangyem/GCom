const isIE = () => {
	const ua = window.navigator.userAgent;
	return ua.indexOf('MSIE') > -1 || ua.indexOf('Trident') > -1;
};

export { isIE };
