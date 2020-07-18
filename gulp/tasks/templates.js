import { parsePug } from '../../core/parsePUG';

export default {
	build: 1,
	name: 'task:templates',
	globs: '!(_*)',
	extname: function () {
		return this.config.component.templates.slice(1).toUpperCase();
	},
	init() {
		const files = this.paths.pages(
			this.globs + this.config.component.templates
		);
		const options = {
			// since: this.since.bind(this),
		};
		return this.gulp.src(files, options).pipe(this.parse());
	},
	dest() {
		return this.gulp.dest(this.paths._dist);
	},
	pug() {
		return require('gulp-pug')({
			// https://pugjs.org/api/reference.html
			doctype: 'html',
			basedir: this.paths._app,
			site: {
				data: this.getGlobalData(),
			},
		});
	},
	getGlobalData() {
		let siteData = {};
		const rootFolder = this.paths._app;
		if (this.isDirectory(rootFolder)) {
			// Convert directory to JS Object
			siteData = this.foldero(rootFolder, {
				recurse: true,
				whitelist: function () {
					this.glob.sync(rootFolder).filter(function (file) {
						return /\.(json|ya?ml)$/i.test(file);
					});
				},
				loader: function loadAsString(file) {
					let json = {};
					try {
						if (path.extname(file).match(/^.ya?ml$/)) {
							json = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
						} else {
							json = JSON.parse(fs.readFileSync(file, 'utf8'));
						}
					} catch (e) {
						log.error(`Error Parsing DATA file: ${file}`);
						log.error('==== Details Below ====');
						log.error(e);
					}
					return json;
				},
			});

			// Add --debug option to your gulp task to view
			// what data is being loaded into your templates
			if (this.args.debug) {
				this.log.info(
					'==== DEBUG: site.data being injected to templates ===='
				);
				this.log.info(siteData);
			}
		}
	},

	parse() {
		const parseTemplate = require(this.paths.core(
			`parse${this.extname()}`
		));

		if (!this.store.pages) {
			this.store.pages = {};
		}

		return this.pipe(parseTemplate, this, 'parseTemplate');
	},
};
