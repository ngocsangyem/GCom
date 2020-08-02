const debounce = (fn, ms = 0) => {
	let timeoutId;
	return function (...args) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn.apply(this, args), ms);
	};
};

export { debounce };

// window.addEventListener(
// 	'resize',
// 	debounce(() => {
// 	  console.log(window.innerWidth);
// 	  console.log(window.innerHeight);
// 	}, 250)
//   ); // Will log the window dimensions at most every 250ms
