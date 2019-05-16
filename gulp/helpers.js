'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

const
	gulp = require('gulp'),
	$ = require('gulp-load-plugins')();

const
	path = require('path'),
	fs = require('fs');

module.exports = {
	headRgxp: /(\/\*![\s\S]*?\*\/\n{2})/,

	getBuilds() {
		delete require.cache[require.resolve('../builds')];
		return Object(require('../builds'));
	},

	getHead(opt_version, opt_key) {
		return (
			'/*!\n' +
			` * Collection${opt_version ? ` v${this.getVersion()}` : ''}${opt_key ? ` (${opt_key})` : ''}\n` +
			' * https://github.com/kobezzza/Collection\n' +
			' *\n' +
			' * Released under the MIT license\n' +
			' * https://github.com/kobezzza/Collection/blob/master/LICENSE\n'
		);
	},

	getVersion() {
		const
			file = fs.readFileSync(path.join(__dirname, '../src/core.js')),
			v = /VERSION\s*[:=]\s*\[(.*?)]/.exec(file)[1].split(/\s*,\s*/);

		return v.slice(0, 3).join('.') + (v[3] ? `-${eval(v[3])}` : '');
	},

	test(type, dev) {
		return () => {
			return gulp.src(type === 'node' ? './collection.js' : `./dist/collection${dev ? '' : '.min'}.js`)
				.pipe($.istanbul())
				.pipe($.istanbul.hookRequire())
				.on('finish', runTests);

			function runTests() {
				return gulp.src(`./spec/${type + (dev ? '-dev' : '')}-spec.js`)
					.pipe($.plumber())
					.pipe($.jasmine())
					.pipe($.istanbul.writeReports());
			}
		};
	}
};
