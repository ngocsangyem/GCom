const removeVietnamese = (word) => {
	if (typeof word !== 'string') return '';
	let wordTranform = word.toLowerCase().replace(/\s+/g, '-');
	const non_asciis = {
		'-': '[`~!@#$%^&*()_|+=?;:",.<>/]',
		a: '[ảàạảãàáâãäåắặẳằẵấầẩẫậâă]',
		ae: 'æ',
		c: 'ç',
		e: '[èéẹẽẻềệếểễê]',
		d: '[đ]',
		i: '[ìíîïị]',
		n: 'ñ',
		o: '[òóọôõöộồốổỗơởợỡờớôơ]',
		oe: 'œ',
		u: '[ùúûűüủụưửựứừữư]',
		y: '[ýỳỷỵỹ]',
	};
	for (let index in non_asciis) {
		wordTranform = wordTranform.replace(
			new RegExp(non_asciis[index], 'gi'),
			index
		);
	}
	wordTranform = wordTranform.replace(/[^\w\s]/gi, '-');
	return wordTranform;
};

export { removeVietnamese };
