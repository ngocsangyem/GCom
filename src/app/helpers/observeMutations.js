/*
 * @return undefined
 * @desc
 * Returns a new MutationObserver and runs the provided callback for each mutation on the specified element.
 * Use a MutationObserver to observe mutations on the given element. Use Array.prototype.forEach() to run the callback for each mutation that is observed. Omit the third argument, options, to use the default options (all true).
 */

// const obs = observeMutations(document, console.log); // Logs all mutations that happen on the page
// obs.disconnect(); // Disconnects the observer and stops logging mutations on the page

const observeMutations = (element, callback, options) => {
	const observer = new MutationObserver((mutations) =>
		mutations.forEach((m) => callback(m))
	);
	observer.observe(
		element,
		Object.assign(
			{
				childList: true,
				attributes: true,
				attributeOldValue: true,
				characterData: true,
				characterDataOldValue: true,
				subtree: true,
			},
			options
		)
	);
	return observer;
};

export { observeMutations };
