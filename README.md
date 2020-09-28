<h1 align="center">Welcome to gulp-component 👋</h1>

-   [Overview](##overview)
-   [Features](##features)
-   [Browser Support](##browser)
-   [Prerequisites](##prerequisites)
-   [Commands](##commands)
-   [Structure](#structure)
-   [Usage](#usage)

## Overview

gulp-component is an opinionated generator for web development. Tools for building a great experience across many devices. A solid starting point for both professionals and newcomers to the industry.

## Features

|                                                   | Available |
| ------------------------------------------------- | :-------: |
| [Browsersync](http://www.browsersync.io/)         |    ✅     |
| [Pug](https://pugjs.org/api/getting-started.html) |    ✅     |
| [Twig](https://twig.symfony.com/)                 |    ✅     |
| [Sass](https://sass-lang.com/)                    |    ✅     |
| [Less](http://lesscss.org/)                       |    ✅     |
| [GulpV4](https://gulpjs.com/)                     |    ✅     |
| [Webpack](https://webpack.js.org/)                |    ✅     |
| [Typescript](https://www.typescriptlang.org/)     |    ✅     |
| JavaScript ES6+ Support                           |    ✅     |
| State Management                                  |    ✅     |
| PostCSS support                                   |    ✅     |
| Live Browser Reloading                            |    ✅     |
| Code spliting                                     |    ✅     |
| Optimize Images                                   |    ✅     |
| Minify Css and Javascript                         |    ✅     |
| Unit test                                         |    ✅     |
| SEO                                               |    ✅     |

## Browser

At present, I officially aim to support the last two versions of the following browsers:

-   Chrome
-   Edge
-   Firefox
-   Safari
-   Internet Explorer

This is not to say that gulp-simple cannot be used in browsers older than those reflected, but merely that my focus will be on ensuring our layouts work great in the above.

## Prerequisites

> NOTE: For OSX users You may have some issues compiling code during installation of packages. Please install Xcode from App Store first. After Xcode is installed, open Xcode and go to Preferences -> Download -> Command Line Tools -> Install to install command line tools.

> NOTE: For Windows users You may have some issues compiling BrowserSync during installation of packages. Please go to http://www.browsersync.io/docs/#windows-users for more information on how to get all the needed dependencies.

**Can not install node-gym**

Open powershell as Administrator

```sh
npm install --global --production windows-build-tools
npm install --global node-gyp
```

### [Node.js](https://nodejs.org)

Bring up a terminal and type `node --version`.
Node should respond with a version at or above 10.x.x.
If you need to install Node, go to [nodejs.org](https://nodejs.org) and click on the big green Install button.

### [Gulp](http://gulpjs.com)

Bring up a terminal and type `gulp --version`.
If Gulp is installed it should return a version number at or above 4.x.x.
If you need to install/upgrade Gulp, open up a terminal and type in the following:

```sh
$ npm install --global gulp
```

```sh
$ npm install --global gulp-cli
```

_This will install Gulp globally. Depending on your user account, you may need to [configure your system](https://github.com/sindresorhus/guides/blob/master/npm-global-without-sudo.md) to install packages globally without administrative privileges._

### Local dependencies

Next, install the local dependencies requires:

```sh
$ npm install
```

That's it! You should now have everything needed to use the gulp-component.  
You may also want to get used to some of the [commands](#commands) available.

## Commands

There are few commands available to help you build and test sites:

### Development mode

Watch For Changes & Automatically Refresh Across Devices

```sh
$ npm start
```

`npm start` task creates the `tmp` folder in the root of the project.
This includes linting as well as image, script, stylesheet and HTML optimization.
Also, a [browsersync](https://browsersync.io/) script will be automatically generated, which will take care of precaching your sites resources.

Create component

```sh
$ npm run add [component_name][files]
```

```sh
$ npm run add header[.js,.pug,.scss]
```

Create page

```sh
$ npm run add page [page_name][files]
```

```sh
$ npm run add index[.js,.pug,.scss]
```

[For more detail]()

### Build (production) mode

Serve the Fully Built & Optimized Site

```sh
$ npm run build
```

`npm run build` task creates the `build` folder in the root of the project with **minifying** files. It will help you to create clear instances of code for the **production** or **further implementation**.

## Structure

```
gulp-component/
│
├── build/               # Build folder for production
├── core/                # core
├── gulp/                # Tasks runner
├── src/                 # Dev source
│
├── config.js            # App's config
├── gulpfile.babel.js
└── package.json
```

`src` has the following file structure:

```
src/
│
├── app/               # Dev goes here
│   ├── components     # Components
│   ├── helpers
│   ├── styles         # Global styles
│   └── views
|       ├── layouts
│       └── pages
|
├── assets/              # Assets
│   │
│   ├── fonts/           # Global fonts
|   └── images/          # Global images
```

`component` has [flat](https://en.bem.info/methodology/filestructure/#flat) structure and all files and folders is optional:

```
component/
│
├── fonts/               # Fonts
│   └── Roboto.woff2
│
├── images/              # Any images for style
│   │
│   ├── sprite/          # Icons for sprite here (png or svg)
│   │   ├── mail.png
│   │   └── mail@2x.png
│   │
│   └── bg.png
│
├── symbols/             # Icons for symbol sprite (only svg)
│   └── arrow.svg
│
├── assets/              # Any assets files
│   └── image.jpg
│
├── components.js
├── components.pug
├── components.scss
│
├── deps.js              # Compoennt dependencies
│
├── data/                # Teamplate data
|   └── *.json
└── _test_               # Test component
```

## Usage

-   [App's config](#apps-config) - [Default settings:](#default-settings)
-   [Templates](#templates) - [JSON data in markup](#json-data-in-markup) - [Pathways](#pathways) - [Automatic insert of scripts and styles](#automatic-insert-of-scripts-and-styles)
-   [Styles](#styles) - [PostCSS](#postcss)
-   [SVG symbols](#svg-symbols) - [Use SVG](#use-svg) - [SVG Transformation](#svg-transformation) - [Get icons for SVG](#get-icons-for-svg)
-   [Component dependencies](#component-dependencies) - [Modules](#modules)
-   [Image optimization](#image-optimization)
-   [Automatic creation of files and components](#automatic-creation-of-files-and-components)
-   [Fast make components and files from terminal](#fast-make-components-and-files-from-terminal)
-   [Default content in new files](#default-content-in-new-files)
-   [Bundles](#bundles)

# App's config

All the basic settings are stored in a single file **config.js**, this approach allows you to use the same builder for different projects and configure each application individually.

> If there is no config.js, then the default settings will be used, after any changes in the configuration, you need to restart the development mode!

### Default settings:

```js
module.exports = {
	// Used technologies
	component: {
		templates: '.pug', // '.html' or '.pug' or '.twig'
		scripts: {
			extension: '.js', // '.js' or '.ts'
			syntax: 'class', // Syntax for generate and code
		},
		styles: '.scss', // '.css' or '.styl' or '.less' or '.scss' or '.sass',
		test: false, // Component's unit test generate
		data: true, // Template data generate
		BEM: false, // Generate BEM folder
		prefix: '.component', // Prefix for file
	},

	// Main build settings
	build: {
		bundles: ['js', 'css'], // code spliting for page
		imagemin: [], // need image optimization, may [ 'png', 'jpg', 'svg', 'gif' ]

		mainBundle: 'main', // main bundle name
		globalStyles: false, // path (from root) for global styles

		zip: true // zip build folder

		addVersions: true, // need versions (?v=23413)
		HTMLRoot: './', // root for paths at static files in HTML
	},

	// Production structure
	directories: {
		base: './',
		development: {
			source: 'src',
			app: 'app',
			temporary: 'tmp',
			components: 'components',
			styles: 'styles',
			assets: 'assets',
			scripts: 'scripts',
			images: 'images',
			fonts: 'fonts',
			data: 'data',
			pages: 'pages',
			static: 'static',
			favicons: 'favicons',
			symbols: 'symbols',
		},
		production: {
			destination: 'build',
			styles: 'styles',
			scripts: 'scripts',
			fonts: 'fonts',
			images: 'images',
			assets: 'assets',
			static: 'static',
			favicons: 'favicons',
			symbols: 'symbols',
		},
	},

	// Settings for default content in files (details below)
	addContent: {},

	// Blanks for creating components from the terminal (details below)
	createComponent: {},

	// Settings for image optimization (details below)
	optimization: {},
};
```

# Templates

Pug / Twig or plain HTML can be used as a template maker.  
Pug is the default, but you can change this in [config.js](#apps-config)

```js
// config.js

component: {
  templates: '.pug', // Pug, I choose you!
  ...
},

```

Now the build will look for pug files.

### JSON data in markup

Each component can have a data file **[component_name].component.json**, this data is available in the markup, for example, we have a **message** compoennt with a json file:

```json
// message.component.json

{
	"greeting": "Hello, world!"
}
```

This data is easily get from a special object **site.jsons**

```pug
// page.component.pug

h1= site.jsons.message.greeting

```

```html
// page.component.html

<h1>@@site.jsons.message.greeting</h1>
```

```twig
// page.component.twig

<h1>{{ site.jsons.message.greeting }}</h1>

```

> html and twig are not supported yet

### Pathways

Each component has its own folder with assets, so you need to specify placeholder before specific file.

> A placeholder consists of a "@" symbol and a component name.

For example, we have a component with a **header/assets/images/1.jpeg** image, in the markup, you need to specify the path like this:

```pug
img(src='@header/images/1.jpeg', alt="")
```

There are also special placeholders:

```sh
@styles - styles folder

@symbol - way to SVG symbol

@scripts - scripts folder

@favicons - favicons folder

```

### Automatic insert of scripts and styles

[The system of dependencies](#component-dependencies) eliminates the need to connect JS and CSS files to the page with your hands, now it is enough to specify a special comment and everything will be done automatically.

```pug
html
	head
		<!-- GULPC:styles -->
		// CSS files will be here
	body
		...
		<!-- GULPC:scripts -->
		// and here JS files
```

# Styles

As a preprocessor for styles, you can use LESS / Sass / Stylus or use plain CSS.  
SCSS is the default, but you can change this in [config.js](#apps-config)

```js
// config.js

use: {
  ...
  styles: '.scss', // Sass I choose you!
},
```

Most likely you have some kind of common file with variables or mixins, but in the conditions of independence of the components it will have to be imported into each style separately. To put it mildly, this is not the most convenient option, so there is a better way - you can specify a specific file (or an array of files) in the settings and it will be imported automatically.

```js
// config.js

build: {
  ...

  globalStyles: 'app/styles/global.scss' // Path from root to variables file
},
```

### PostCSS

The following PostCSS plugins are used by default:

-   [autoprefixer](https://github.com/postcss/autoprefixer) - only in production build
-   [postcss-sprites](https://github.com/2createStudio/postcss-sprites) - only in production build
-   [postcss-sort-media-queries](https://github.com/yunusga/postcss-sort-media-queries) - only in production build
-   [cssnano](https://cssnano.co/) - only in production build
-   [css-declaration-sorter](https://github.com/Siilwyn/css-declaration-sorter) - only in production build

# SVG symbols

In addition to the usual style sprites, you can use SVG symbols in HTML, the icons for this sprite need to be stored in a separate component folder (symbols). For each icon, your ID will be generated according to the **componentName\_\_iconName** pattern, for example:

```
header/symbols/rating.svg → #header__rating
```

### Use SVG

There are several options for use SVG, you can embed directly into the HTML code, for this you need to specify a special comment:

```html
<!-- BEMGO:symbol -->
```

Then in the use tag you need only the ID:

```pug
svg
	use(xlink:href="#header__rating")
```

The second option is an external file, then a special placeholder must be specified in the use tag:

```pug
svg
	use(xlink:href="@symbol#header__rating")
```

### SVG Transformation

If at least one SVG icon is found in the page code, the build will look for a special symbol component at the app development level , you can create two `prepend.svg` and `append.svg` files inside this compoennt and then the contents of these files will be added to the SVG body (at the beginning and at the end).

### Get icons for SVG

In development mode, all icons from all components will be added to the sprite, but only those icons that are in your code (with the «correct» ID) will be included in the production build.

> You can also add a special key @always before expanding the icon, then it will fall into the sprite anyway:

```
header/symbols/rating@always.svg
```

# Component dependencies

For any component, you can specify dependencies (other components or modules) in the deps.js file

```js
// deps.js

module.exports = {
	modules: [], // Modules
};
```

### Modules

Each module is an object with three properties:

```js
// deps.js

module.exports = {
	modules: [
		{
			from: '', // module location (CDN or path from the root)
			inject: [], // list of files to be used as separate files
			import: [], // list of files to be imported into the common bundle
		},
	],
};
```

For example, we have a **slider** component, for full-fledged work, it needs the [slick plugin](http://kenwheeler.github.io/slick/), which in turn uses the jQuery library:

```js
// slider/deps.js

module.exports = {
	modules: [
		{
			from: 'https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/', // jQuery from CDN
			inject: ['jquery.min.js'], // this file will be used on the page separately
		},
		{
			from: 'node_modules/slick-carousel/slick', // get slick from node_modules
			inject: ['slick.min.js'], // this file will be used on the page separately
			import: ['slick.css'], // this file will be imported into the common bundle
		},
	],
};
```

Now when using the slider component on the page, the jQuery library and the slick.min.js plugin will be used too, all the images and fonts from slick.css will automatically be pulled into the build.

-   If the module does not have the from property, then the file search will take place in the component itself (in the assets folder).
-   Files from CDN can not be imported, only used as external files.

If you need to connect the JS file asynchronously, simply add @async or @defer to the end:

```js
{
  from: 'node_modules/slick-carousel/slick',
  inject: [ 'slick.min.js@async' ], // this script will be used on the page with the async attribute.
},
```

For a more subtle use of the module, a special filter function is provided that will be called for each file from inject and import:

```js
filter ( file, node, page, type ) {

  // file - full path of the included file
  // node - component object with all attributes
  // page - page name
  // type - use type, 'inject' or 'import'

  console.log( node ) // { name: 'link', attrs: { class: 'link' }, tag: 'a' }

  return true // the function should return true or false (use or not)
}
```

Suppose I have a **link** component and this component sometimes needs a [lightbox plugin](https://lokeshdhakar.com/projects/lightbox2/), but you need to connect it only under certain conditions - when the component has the **link_zoom** modifier:

```js
// link/deps.js

module.exports = {
	modules: [
		{
			from: 'node_modules/lightbox2/dist/',
			inject: ['js/lightbox.js'],
			import: ['css/lightbox.css'],
			filter(file, node) {
				return node.attrs.class.split(' ').includes('link_zoom'); // check
			},
		},
	],
};
```

A simple check in one line solves the problem, now the module will pull up only at the right moment.

_Noted_: For now, we are not support `import` javascript file. Instead that, you can use ES6 import.

# Image optimization

You can enable image compression in [config.js](#apps-config)

> There will be no optimization in the development mode, only during the production build!

```js
// config.js

build: {
  ...
  imagemin: [ 'svg', 'jpg', 'png', 'gif' ] // support for 4 types
},
```

The [imagemin](https://github.com/sindresorhus/gulp-imagemin) plugin is used for compression, for each type, you can specify your optimization settings, the default will be as follows:

```js
// config.js

optimization: {

  jpg: {
    progressive: true,
    arithmetic: false,
  },

  png: {
    optimizationLevel: 5, // may 0-7
    bitDepthReduction: true,
    colorTypeReduction: true,
    paletteReduction: true,
  },

  gif: {
    optimizationLevel: 1, // may 1-3
    interlaced: true
  },

  // For svg, you need to specify an array with settings!
  svg: [
    { cleanupIDs: false },
    { removeViewBox: false },
    { mergePaths: false },
  ],

  // Here you can specify the names (without extensions) that do not need to be optimized.
  ignore: []

},
```

More information about each type of compression settings can be found in the docs:

-   gif - [gifsicle](https://github.com/imagemin/imagemin-gifsicle#api)
-   jpg - [jpegtran](https://github.com/imagemin/imagemin-jpegtran#api)
-   png - [optipng](https://github.com/imagemin/imagemin-optipng#api)
-   svg - [svgo](https://github.com/svg/svgo#what-it-can-do)

# Automatic creation of files and components

You just write the BEM code, and the components and files are created automatically.  
By default, this feature is turned off, to activate it, you need to add settings to [config.js](#apps-config)

```js
// config.js

autoCreate: {
  onlyOnWatch: true, // create files always or only during watch
  folders: [], // the list of directories of the new component, for example: 'img', 'assets'
  files: [], // list of files of the new node, for example: '.css', '.js', 'data.json'
  levels: [], // levels where components will be created, for example: 'develop'
  ignoreNodes: [], // list of nodes that will be completely ignored **
},

```

> \*\* You can use regular expressions here!

Suppose I need to create components at the components folder, each new component must have a style file, a script and a folder for pictures, but at the same time, you need to ignore the elements and not create files for them:

```js
// config.js

autoCreate: {
  onlyOnWatch: true, // create files only during watch
  folders: [ 'assets' ], // assets folder created for new components
  files: [ '.scss', '.js' ], // new node will have style and script
  levels: [ 'components' ], // new components are created only at components folder
  ignoreNodes: [ /__[\w]/i ], // all elements will be ignored
},

```

Good, but with such settings, each JS and CSS file will also be created for each component modifier, if you do not need it, you can add more settings:

```js
// config.js

autoCreate: {
  onlyOnWatch: true,
  folders: [ 'img', 'assets' ],
  files: [ '.css', '.js' ],
  levels: [ 'develop' ],
  ignoreNodes: [ /__[\w]/i ],
  ignoreStyle: [ /[a-z\d](_|--)[a-z\d]/i ], // ignore modifiers when creating styles
  ignoreScript: [ /[a-z\d](_|--)[a-z\d]/i  ], // ignore modifiers when creating scripts
  ignoreTemplate: [], // by analogy, you can specify for templates
},

```

In fact, we could just ban modifiers as well as elements, but to demonstrate all the possibilities let it be so :)

# Fast make components and files from terminal

If for some reason the [automatic creation of files and components](#automatic-creation-of-files-and-components) does not fit, then you can quickly create components and files from the terminal with a simple command `npm run add`.

> If any files and folders already exist, they will simply be ignored.
> When using the zsh command shell, you need to escape the square brackets or take the command in quotes!

Create a component **header** and **footer** with additional files:

```bash
npm run add header[.scss,.js] footer[.pug]
```

> **Result:**
> A "header" folder will be created  
> A "header/header.component.scss" file will be created  
> A "header/header.component.js" file will be created  
> A "footer" folder will be created  
> A "footer/footer.component.pug" file will be created

You can create elements and modifiers:

```bash
npm run add header__nav[.scss,.js] footer__inner[.scss] footer_home[.scss]
```

> **Result:**
> A "header" folder will be created  
> A "header/header\_\_nav/header\_\_logo.component.css" file will be created  
> A "header/header\_\_nav/header\_\_logo.component.js" file will be created  
> A "footer" folder will be created  
> A "footer/footer\_\_inner/footer\_\_inner.scss" file will be created  
> A "footer/footer\_\_home/footer\_\_home.scss" file will be created

By default, all components are created at the components folder, but you can specify the path directly through the colon:

```bash
npm run add common/card[.js,.scss] :customPath
```

> **Result:**  
> A "common" folder will be created
> A "common/card" folder will be created  
> A "common/card/card.component.js" file will be created  
> A "common/card/card.component.scss" file will be created

```bash
npm run add card[.js,.scss] :shared
```

> **Result:**  
> A "shared" folder will be created
> A "shared/card" folder will be created  
> A "shared/card/card.component.js" file will be created  
> A "shared/card/card.component.scss" file will be created

You can also quickly create pages, for this you need to specify the keyword **page** after add:

```bash
npm run add page index catalog about.html
```

> **Result:**  
> A "pages" folder will be created  
> A "pages/index.component.pug" file will be created _  
> A "pages/catalog.component.pug" file will be created _  
> A "pages/about.component.html" file will be created

\------  
\* If the page extension is not specified, it will be taken from config.js

If you don't want to list files and folders every time, you can create blanks in [config.js](#apps-config)

```js
// config.js

createComponent: {
	b: ['.js', '.scss', '.pug', 'images'];
}
```

Now quite well:

```bash
npm run add header[b]
```

> **Result:**  
> A "header" folder will be created  
> A "header/header.component.js" file will be created  
> A "header/header.component.scss" file will be created  
> A "header/header.component.pug" file will be created  
> A "header/img" folder will be created

# Default content in new files

When creating files [automatically](#automatic-creation-of-files-and-components) or [by hand](#fast-make-components-and-files-from-terminal), its may contain default content, for this you need to add settings in [config.js](#apps-config)

```js
// config.js

addContent: {
  page: {
	  pug: 'I make [name] page.', // [name] will be replaced by the page name
  },
  component: {
	  scss: '.[name] {}' // [name] will be replaced with the name of the scss file
  },
}
```

Now when creating a SCSS file `npm run add header[.scss]` its contents will be:

```css
.header {
}
```

You can specify the empty content directly through the colon: with `notemplate`

```bash
npm run add card[.js,.scss] :noTemplate
```

> By default, when you generate component with the :customPath, it's will not have content

By analogy, you can add content for any new files.

# Bundles

For each page, you can compile scripts and styles separately, for this you need to add settings to [config.js](#apps-config):

```js
// config.js

build: {
  ...
  bundles: [ 'css', 'js' ],
  ...
}
```

Now for each page will be compiled its own CSS and JS.

> In development mode, no bundles are created, only in production build!

Inspiration from [BEMTO](https://github.com/werty1001/bemgo)
