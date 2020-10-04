/*
 * @param {Number} ms
 * @return string
 * @desc
 * Returns the human readable format of the given number of milliseconds.
 * Divide ms with the appropriate values to obtain the appropriate values for day, hour, minute, second and millisecond. Use Object.entries() with Array.prototype.filter() to keep only non-zero values. Use Array.prototype.map() to create the string for each value, pluralizing appropriately. Use String.prototype.join(', ') to combine the values into a string.
 */

const formatDuration = (ms) => {
	if (ms < 0) ms = -ms;
	const time = {
		day: Math.floor(ms / 86400000),
		hour: Math.floor(ms / 3600000) % 24,
		minute: Math.floor(ms / 60000) % 60,
		second: Math.floor(ms / 1000) % 60,
		millisecond: Math.floor(ms) % 1000,
	};
	return Object.entries(time)
		.filter((val) => val[1] !== 0)
		.map(([key, val]) => `${val} ${key}${val !== 1 ? 's' : ''}`)
		.join(', ');
};

export { formatDuration };
