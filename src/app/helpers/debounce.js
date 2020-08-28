/*
 * @param {Function} fn
 * @param {Number} ms
 * @return Function
 * @desc
 * To improve browser performance. There might be some functionality in a web page which requires time-consuming computations. If such a method is invoked frequently, it might greatly affect the performance of the browser.
 * @example
 */

// window.addEventListener(
// 	'resize',
// 	debounce(() => {
// 	  console.log(window.innerWidth);
// 	  console.log(window.innerHeight);
// 	}, 250)
//   ); // Will log the window dimensions at most every 250ms

const debounce = (fn, ms = 0) => {
	let timeoutId;
	return function (...args) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn.apply(this, args), ms);
	};
};

export { debounce };
