const dependencyTemplate = `// Dependency of [capitalize-name]Component\n\nmodule.exports = {\n\n\tnodes: [],\n\n\tmodules: [],\n\n}\n`;

const jsonTemplate = '{\n\t"data":{}\n}';

const sassTemplate = '\n.[name]';
const scssTemplate = '\n.[name] {}';

const componentTemplate = `mixin [name](data)\n\t- data = data || {}\n\t- data.class = data.class || ''\n\t- data.content = data.content || 'Some content here'\n\n\t.[name](class=data.class)&attributes(attributes)\n\t\tif block\n\t\t\tblock\n\t\telse\n\t\t\t!= data.content`;

const testTemplate = `import { [capitalize-name]Component } from '../[name].component';\n\ndescribe('[capitalize-name]Component View', function() {\n\n\tbeforeEach(() => {\n\t\tthis.[capitalize-name] = new [capitalize-name]Component();\n\t});\n\n\tit('Should run a few assertions', () => {\n\t\texpect(this.[capitalize-name]).to.exist;\n\t});\n\n});`;

const jsTemplateClass = `export class [capitalize-name]Component {\n\tconstructor() {\n\t\tconsole.log('[name] component');\n\t}\n}`;

const jsTemplateFunction = `const [capitalize-name]Component = () => {\n\tconsole.log('This is [capitalize-name]');\n};\n\nexport { [capitalize-name]Component }`;

const pageTemplate = `extends ../../layouts/layout.pug\n\nblock var\n\t- title = '[upper-first-name]'\n\t- bodyClass = '[name]'\n\nblock main`;
const pageScssTemplate = '\n.[name] {}';
const pageSassTemplate = '\n.[name]';

export {
	dependencyTemplate,
	jsonTemplate,
	sassTemplate,
	scssTemplate,
	componentTemplate,
	testTemplate,
	jsTemplateClass,
	jsTemplateFunction,
	pageTemplate,
	pageScssTemplate,
	pageSassTemplate,
};
