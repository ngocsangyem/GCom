/*
 * @param {Number} n
 * @param {String} curr
 * @param {String} LanguageFormat
 * @return string
 * @example
 * toCurrency(123456.789, 'EUR'); => €123,456.79  | currency: Euro | currencyLangFormat: Local
 * toCurrency(123456.789, 'USD', 'en-us'); => $123,456.79  | currency: US Dollar | currencyLangFormat: English (United States)
 * toCurrency(123456.789, 'USD', 'fa'); => ۱۲۳٬۴۵۶٫۷۹ ؜$ | currency: US Dollar | currencyLangFormat: Farsi
 * toCurrency(322342436423.2435, 'JPY'); => ¥322,342,436,423 | currency: Japanese Yen | currencyLangFormat: Local
 * toCurrency(322342436423.2435, 'JPY', 'fi'); => 322 342 436 423 ¥ | currency: Japanese Yen | currencyLangFormat: Finnish
 */

const toCurrency = (n, curr, LanguageFormat = undefined) =>
	Intl.NumberFormat(LanguageFormat, {
		style: 'currency',
		currency: curr,
	}).format(n);

export { toCurrency };
