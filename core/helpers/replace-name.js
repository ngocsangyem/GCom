const { capitalizeWord } = require('./capitalize.js');
const { upperFirstLetter } = require('./upper-first-letter');

const replaceName = (string, name) => {
	return string
		.replace(/\[capitalize-name\]/g, capitalizeWord(name))
		.replace(/\[name\]/g, name)
		.replace(/\[upper-first-name\]/g, upperFirstLetter(name));
};

module.exports = { replaceName };
