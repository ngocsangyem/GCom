/*
 * @param {String} seconds
 * @return string
 */

const formatSeconds = (seconds) =>
	[
		parseInt(seconds / 60 / 60),
		parseInt((seconds / 60) % 60),
		parseInt(seconds % 60),
	]
		.join(':')
		.replace(/\b(\d)\b/g, '0$1');

export { formatSeconds };
