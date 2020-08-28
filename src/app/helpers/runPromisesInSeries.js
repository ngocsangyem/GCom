/*
 * @param {Array} promises
 * @return array
 * @example
 * const delay = (d) => new Promise((r) => setTimeout(r, d));
 * runPromisesInSeries([() => delay(1000), () => delay(2000)]); => Executes each promise sequentially, taking a total of 3 seconds to complete
 */

const runPromisesInSeries = (promises) =>
	promises.reduce((promise, next) => promise.then(next), Promise.resolve());

export { runPromisesInSeries };
