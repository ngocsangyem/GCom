const delegate = (elSelector, eventName, selector, fn) => {
	elSelector.addEventListener(eventName, function (event) {
		var possibleTargets = element.querySelectorAll(selector);
		var target = event.target;

		for (var i = 0, l = possibleTargets.length; i < l; i++) {
			var el = target;
			var p = possibleTargets[i];

			while (el && el !== element) {
				if (el === p) {
					return fn.call(p, event);
				}

				el = el.parentNode;
			}
		}
	});
};

export { delegate };
