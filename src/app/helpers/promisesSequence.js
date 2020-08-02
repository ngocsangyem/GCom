const promisesSequence = (promises) =>
	promises.reduce(
		(p, c) => p.then((rp) => c.then((rc) => [...rp, rc])),
		Promise.resolve([])
	);

// promisesSequence(promises).then((results) => {
// 	// `results` is an array of promise results in the same order
// });

export { promisesSequence };
