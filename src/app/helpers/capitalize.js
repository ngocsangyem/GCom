const capitalize = ([first, ...rest], lowerRest = false) =>
	first.toUpperCase() +
	(lowerRest ? rest.join('').toLowerCase() : rest.join(''));

// capitalize('fooBar'); // 'FooBar'
// capitalize('fooBar', true); // 'Foobar'

export { capitalize };
