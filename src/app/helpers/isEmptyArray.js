/*
 * @param {Array} arr
 * @return boolean
 */
const isEmptyArray = (arr) =>
	!(
		Array.isArray(arr) &&
		arr.length > 0 &&
		arr.filter((el) => el === undefined).length > 0
	);

export { isEmptyArray };
