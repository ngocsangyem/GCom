// https://gomakethings.com/how-to-get-all-parent-elements-with-vanilla-javascript/
const parents = (element, selector) => {
	// Element.matches() polyfill
	if (!Element.prototype.matches) {
		Element.prototype.matches =
			Element.prototype.matchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msMatchesSelector ||
			Element.prototype.oMatchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			function(s) {
				var matches = (
						this.document || this.ownerDocument
					).querySelectorAll(s),
					i = matches.length;
				while (--i >= 0 && matches.item(i) !== this) {}
				return i > -1;
			};
	}

	// Set up a parent array
	var parents = [];

	// Push each parent element to the array
	for (; element && element !== document; element = element.parentNode) {
		if (selector) {
			if (element.matches(selector)) {
				parents.push(element);
			}
			continue;
		}
		parents.push(element);
	}

	// Return our parent array
	return parents;
};

export { parents };
