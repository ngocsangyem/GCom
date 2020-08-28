/*
 * @param {Array} promises
 * @return array
 */

const promisesSequence = (promises) =>
	promises.reduce(
		(p, c) => p.then((rp) => c.then((rc) => [...rp, rc])),
		Promise.resolve([])
	);

export { promisesSequence };
