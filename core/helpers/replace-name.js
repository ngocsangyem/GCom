import { capitalizeWord } from './capitalize.js';
import { upperFirstLetter } from './upper-first-letter';

const replaceName = (string, name) => {
	return string
		.replace(/\[capitalize-name\]/g, capitalizeWord(name))
		.replace(/\[name\]/g, name)
		.replace(/\[upper-first-name\]/g, upperFirstLetter(name));
};

export { replaceName };
