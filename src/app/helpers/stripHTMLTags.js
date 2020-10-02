/*
 * @param {String} str
 * @return string
 * @desc
 * Removes HTML/XML tags from string.
 * Use a regular expression to remove HTML/XML tags from a string.
 */

const stripHTMLTags = (str) => str.replace(/<[^>]*>/g, '');

export { stripHTMLTags };
