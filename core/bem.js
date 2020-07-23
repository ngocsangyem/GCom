/**
 * Check class on BEM notation.
 *
 * @param {String} cls
 *
 * @return {Boolean} or {String}
 */

const isBEM = (cls) => {
	return /^\.[a-z]([a-z0-9-]+)?(__([a-z0-9]+-?)+)?(--([a-z0-9]+-?)+){0,2}$/i.test(
		cls
	);
};

const isModifier = (cls) => {
	return /([a-z\d])(_|--)([a-z\d])/i.test(cls); // {Boolean}
};

const isElement = (cls) => {
	return /([a-z\d])__([a-z\d])/i.test(cls) && !isModifier(cls); // {Boolean}
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

export { isModifier, isElement, getComponent, isComponent, delModifier, isBEM };
