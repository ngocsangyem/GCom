/*
 * @param {String} first
 * @param {Array} rest
 * @param {Boolean} lowerRest
 * @return string
 * @example
 * capitalize('fooBar'); => 'FooBar'
 * capitalize('fooBar', true); => 'Foobar'
 */

const capitalize = ([first, ...rest], lowerRest = false) =>
	first.toUpperCase() +
	(lowerRest ? rest.join('').toLowerCase() : rest.join(''));

export { capitalize };
