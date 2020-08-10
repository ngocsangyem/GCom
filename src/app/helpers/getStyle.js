const getStyle = (el, ruleName) => getComputedStyle(el)[ruleName];

// getStyle(document.querySelector('p'), 'font-size'); // '16px'

export { getStyle };
