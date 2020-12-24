const { removeVietnamese } = require('./remove-vietnamese');
const { delModifier } = require('../bem');
const { config } = require('../index');

const camelize = (str) => {
	return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
		if (+match === 0) return ''; // or if (/\s+/.test(match)) for white spaces
		return index === 0 ? match.toLowerCase() : match.toUpperCase();
	});
};

const transformWordWithMinus = (word) => {
	const wordToArray = delModifier(word).split('');
	return wordToArray
		.map(
			(string) => string[0].toUpperCase() + string.slice(1).toLowerCase()
		)
		.join('');
};

const capitalizeWord = (word) => {
	if (typeof word !== 'string') {
		console.log('Must be a string');
		return '';
	}
	if (/\s/.test(word)) {
		const removeWhiteSpace = removeVietnamese(word);
		return transformWordWithMinus(removeWhiteSpace);
	} else {
		let normalize = word
			.split(/[-|_]+/g)
			.join(' ')
			.toLowerCase();
		if (config.component.scripts.syntax === 'function') {
			return camelize(normalize);
		} else {
			return normalize
				.split(/ /g)
				.map(
					(word) =>
						`${word.substring(0, 1).toUpperCase()}${word.substring(
							1
						)}`
				)
				.join('');
		}
	}
};

module.exports = { capitalizeWord };
