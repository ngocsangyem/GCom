/*
 * @param {String} str
 * @param {Number} num
 * @return string
 * @example
 * truncateString('boomerang', 7); => 'boom...'
 */

const truncateString = (str, num) =>
	str.length > num ? str.slice(0, num > 3 ? num - 3 : num) + '...' : str;

export { truncateString };
