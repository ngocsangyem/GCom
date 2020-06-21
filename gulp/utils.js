import browserSyncLib from 'browser-sync';
import minimist from 'minimist';
import gulpLoadPlugins from 'gulp-load-plugins';
import notify from 'gulp-notify';
import c from 'ansi-colors';
import beeper from 'beeper';

// Load all gulp plugins based on their names
// EX: gulp-copy -> copy
const plugins = gulpLoadPlugins();

// Get config.js custom configuration
// const cfg = Object.assign({}, config);

// Gather arguments passed to gulp commands
const args = minimist(process.argv.slice(2));

// Alias config directories
const dirs = config.directories;

// Create a new browserSync instance
const browserSync = browserSyncLib.create();

// Error handle
const reportError = function (error) {
	// [log]
	//console.log(error);

	// Format and ouput the whole error object
	//console.log(error.toString());

	// ----------------------------------------------
	// Pretty error reporting

	var report = '\n';
	var chalk = c.white.bgRed;

	if (error.plugin) {
		report += chalk('PLUGIN:') + ' [' + error.plugin + ']\n';
	}

	if (error.message) {
		report += chalk('ERROR: ') + ' ' + error.message + '\n';
	}

	console.error(report);

	// ----------------------------------------------
	// Notification

	if (error.line && error.column) {
		var notifyMessage = 'LINE ' + error.line + ':' + error.column + ' -- ';
	} else {
		var notifyMessage = '';
	}

	notify({
		title: 'FAIL: ' + error.plugin,
		message: `${notifyMessage}${error.message}`,
		sound: 'Frog', // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
	}).write(error);

	beeper.beep(); // System beep (backup)

	// ----------------------------------------------
	// Prevent the 'watch' task from stopping

	this.emit('end');
};

export { args, plugins, dirs, browserSync, reportError };
