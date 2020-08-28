/*
 * @param {String} str
 * @return boolean
 * @example
 * console.log(isISODate('2015-02-21T00:52:43.822Z')); => true
 * console.log(isISODate('2015-02-21T00:52:43.822')); => false
 * console.log(isISODate('2015-02-21T00:52:43Z')); => true
 * console.log(isISODate('2015-02-21T00:52:43')); => false
 * console.log(isISODate('2015-02-21T00:52Z')); => true
 * console.log(isISODate('2015-02-21T00:52')); => false
 * console.log(isISODate('2015-02-21T00Z')); => false
 */

// github: https://github.com/honeinc/is-iso-date
// stackoverflow: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
const isISODate = (str) => {
	const isoDateRegExp = new RegExp(
		/(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
	);
	return isoDateRegExp.test(str);
};

export { isISODate };
