export default {
	components: [],
	modules: [
		{
			import: 'normalize.css',
		},
		{
			from: 'https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/', // jQuery from CDN
			inject: ['jquery.min.js'], // this file will be used on the page separately
		},
		{
			from: 'node_modules/swiper', // get swiper from node_modules
			inject: ['swiper-bundle.js'], // this file will be used on the page separately
			import: ['swiper-bundle.css'], // this file will be imported into the common bundle
		},
	],
};
