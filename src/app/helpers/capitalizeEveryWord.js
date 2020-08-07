const capitalizeEveryWord = (str) =>
	str.replace(/\b[a-z]/g, (char) => char.toUpperCase());

// capitalizeEveryWord('hello world!'); // 'Hello World!'

export { capitalizeEveryWord };
