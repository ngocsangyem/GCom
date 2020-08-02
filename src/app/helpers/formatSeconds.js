const formatSeconds = (s) =>
	[parseInt(s / 60 / 60), parseInt((s / 60) % 60), parseInt(s % 60)]
		.join(':')
		.replace(/\b(\d)\b/g, '0$1');

export { formatSeconds };
