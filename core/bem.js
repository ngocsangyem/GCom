/**
 * Check class on BEM notation.
 *
 * @param {String} cls
 *
 * @return {Boolean} or {String}
 */

const isModifier = (cls) => {
	return /([a-z\d])(_|--)([a-z\d])/i.test(cls); // {Boolean}
};

const isElement = (cls) => {
	return /([a-z\d])__([a-z\d])/i.test(cls) && !this.isModifier(cls); // {Boolean}
};

const delModifier = (cls) => {
	return cls.replace(
		/([a-z\d-]+|[a-z\d-]+__[a-z\d-]+)(_|--)([a-z\d](.)+)/i,
		'$1'
	); // {String}
};

const getComponent = (cls) => {
	if (typeof cls !== 'string') {
		return '';
	}
	return delModifier(cls).split('__')[0]; // {String}
};

const isComponent = (cls) => {
	return !isElement(cls) && !isModifier(cls); // {Boolean}
};

export { isModifier, isElement, getComponent, isComponent, delModifier };
