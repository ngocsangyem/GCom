export default {
	build: 2,
	name: 'inject:Script',
	extname: function () {
		return this.config.component.scripts.extension.slice(1);
	},

	init(done) {
		if (!this.config.build.bundles.includes('js')) {
			const mainBundleScripts = require(this.paths.core(
				'mainBundleScripts'
			));
			let files = this.paths.app(`${this.mainBundle}.${this.extname()}`);
			let filesInject = this.paths.pages(`**/*.${this.extname()}`);
			mainBundleScripts(this);
			return this.compile(files, filesInject, done);
		}
		return done();
	},

	watch() {
		return [
			{
				files: this.paths.app(
					'**',
					`!(${this.mainBundle})` + this.extname()
				),
				tasks: this.name,
			},
		];
	},

	dest() {
		return this.gulp.dest(this.paths._app);
	},

	compile(files, filesInject, done) {
		if (files.length === 0) {
			return done();
		}

		return this.gulp
			.src(files)
			.pipe(
				this.inject(
					this.gulp.src(filesInject, {
						read: false,
					})
				)
			)
			.pipe(this.dest());
	},

	inject(source) {
		return require('gulp-inject')(source, {
			starttag: '// Inject:import',
			endtag: '// Inject:end',
			relative: true,
			transform: (filepath, file, i, length) => {
				const name = this.upperFirstLetter(
					this.path.basename(this.path.dirname(filepath))
				);
				return `import { ${name}Component } from './${filepath.replace(
					/\.[^/.]+$/,
					''
				)}';`;
			},
		});
	},
};
