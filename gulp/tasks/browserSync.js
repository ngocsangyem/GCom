export default {
	build: 4,
	name: 'browserSync:watch',
	init(done) {
		if (!this.isDev || !process.env.WATCH) {
			return done();
		}

		const files = this.paths.slashNormalize(this.paths.dist('**', '*.*'));

		this.browserSync.init({
			open: 'local',
			server: this.paths._dist,
			port: process.env.PORT || 3000,
			tunnel: process.env.TUNNEL || false,
			snippetOptions: {
				rule: {
					match: /<\/body>/i,
				},
			},
		});

		this.store.watch = true;

		return this.browserSync
			.watch(files)
			.on('change', this.browserSync.reload);
	},
};
