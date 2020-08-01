import * as BEM from './bem';
import { createComponent } from './createComponent';

/**
 * Creating files and components automatically.
 *
 * @param {Object} task
 *
 * @return {undefined}
 */

export default (task) => {
	const { path, store, config, mainBundle } = task;
	const tree = store.tree[mainBundle];
	const levels = config.autoCreate.levels;
	const files = config.autoCreate.files;

	if (!tree || !files || !levels || levels.length === 0) {
		return;
	}

	const ignore = {
		components: config.autoCreate.ignoreComponents,
		style: config.autoCreate.ignoreStyle,
		script: config.autoCreate.ignoreScript,
		template: config.autoCreate.ignoreTemplate,

		getByExtname(item) {
			const extname = (item[0] === '.'
				? item
				: path.extname(item)
			).toLowerCase();

			if (
				['.css', '.styl', '.less', '.scss', '.sass'].includes(extname)
			) {
				return this.style;
			}

			if (
				[
					'.html',
					'.pug',
					'.jade',
					'.twig',
					'.hbs',
					'.mustache',
					'.haml',
					'.erb',
				].includes(extname)
			) {
				return this.template;
			}

			if (
				[
					'.js',
					'.d.ts',
					'.ts',
					'.litcoffee',
					'.coffee',
					'.dart',
					'.clj',
					'.cljs',
					'.cljc',
					'.edn',
				].includes(extname)
			) {
				return this.script;
			}

			return [];
		},
	};

	// Is ignore

	const isComponentIgnored = function (component, ignore) {
		if (!component || !ignore || ignore.length === 0) {
			return false;
		}

		for (let i = 0; i < ignore.length; i++) {
			if (typeof ignore[i] === 'string' && component === ignore[i]) {
				return true;
			}
			if (
				ignore[i] instanceof RegExp &&
				component.search(ignore[i]) !== -1
			) {
				return true;
			}
		}

		return false;
	};

	// Check tree

	Object.keys(tree).forEach((component) => {
		if (isComponentIgnored(component, ignore.components)) {
			return;
		}

		const components = [component].concat(tree[component]);

		levels.forEach((level) => {
			const command = [0, 0];

			components.forEach((el) => {
				if (isComponentIgnored(el, ignore.components)) {
					return;
				}

				const add = [].concat(
					BEM.isComponent(el) ? config.autoCreate.folders : []
				);

				files.forEach((item) => {
					if (!isComponentIgnored(el, ignore.getByExtname(item)))
						add.push(item);
				});

				if (add.length > 0) command.push(`${el}[${add.join(',')}]`);
			});

			command.push(`+${level}`);

			createComponent.parseArguments(command, false);
		});
	});
};
