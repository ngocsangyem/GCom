import through from 'through2';
import PluginError from 'plugin-error';

/**
 * Run `handler` for every file in pipe.
 *
 * @param {Function} handler
 * @param {Object} options
 * @param {String} handlerName
 *
 * @return {Object}
 */

export const pipe = (handler, options, handlerName) => {
	const name = handlerName || (handler && handler.displayName) || 'core:pipe';

	if (typeof handler !== 'function') {
		return through.obj();
	}

	return through.obj(function (file, enc, cb) {
		if (file.isStream()) {
			return cb(new PluginError(name, 'Streaming not supported'));
		}

		if (file.isBuffer()) {
			try {
				handler(file, options);
			} catch (e) {
				console.log('pipe -> e', e);
				return cb(new PluginError(name, e));
			}
		}

		return cb(null, file);
	});
};
