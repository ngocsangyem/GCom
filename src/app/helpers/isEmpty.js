/*
 * @param {Object} or {Array} val
 * @return boolean
 * @example
 * isEmpty(new Map()); => true
 * isEmpty(new Set()); => true
 * isEmpty([]); => true
 * isEmpty({}); => true
 * isEmpty(''); => true
 * isEmpty([1, 2]); => false
 * isEmpty({ a: 1, b: 2 }); => false
 * isEmpty('text'); => false
 * isEmpty(123); => true - type is not considered a collection
 * isEmpty(true); => true - type is not considered a collection
 */

const isEmpty = (val) => val == null || !(Object.keys(val) || val).length;

export { isEmpty };
