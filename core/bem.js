/**
 * Check class on BEM notation.
 *
 * @param {String} cls
 *
 * @return {Boolean} or {String}
 */

module.exports = {
	isBEM(cls) {
		return /^\.[a-z]([a-z0-9-]+)?(__([a-z0-9]+-?)+)?(--([a-z0-9]+-?)+){0,2}$/i.test(
			cls
		);
	},

	isModifier(cls) {
		return /([a-z\d])(_|--)([a-z\d])/i.test(cls); // {Boolean}
	},

	delModifier(cls) {
		return cls.replace(
			/([a-z\d-]+|[a-z\d-]+__[a-z\d-]+)(_|--)([a-z\d](.)+)/i,
			'$1'
		); // {String}
	},

	isElement(cls) {
		return /([a-z\d])__([a-z\d])/i.test(cls) && !isModifier(cls); // {Boolean}
	},

	getComponent(cls) {
		if (typeof cls !== 'string') {
			return '';
		}
		return this.delModifier(cls).split('__')[0]; // {String}
	},

	isComponent(cls) {
		return !this.isElement(cls) && !this.isModifier(cls); // {Boolean}
	},
};
