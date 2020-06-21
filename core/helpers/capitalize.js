import { removeVietnamese } from './remove-vietnamese';

const capitalizeWord = (word) => {
	if (typeof word !== 'string') return '';
	if (word.includes('-')) {
		return transformWordWithMinus(word);
	} else if (word.includes(' ')) {
		const removeWhiteSpace = removeVietnamese(word);
		return transformWordWithMinus(removeWhiteSpace);
	} else {
		return word[0].toUpperCase() + word.slice(1).toLowerCase();
	}
};

const transformWordWithMinus = (word) => {
	const wordToArray = word.split('-');

	return wordToArray
		.map(
			(string) => string[0].toUpperCase() + string.slice(1).toLowerCase()
		)
		.join('');
};

export { capitalizeWord };
