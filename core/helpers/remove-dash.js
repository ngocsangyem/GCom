const removeDash = (word) => {
	if (typeof word !== 'string') return '';
	return word.replace(/-/g, '');
};

module.exports = { removeDash };
