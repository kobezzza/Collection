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

	test(plumber, type, dev) {
		return (cb) => {
			const src = type !== 'node' ? `./dist/collection.node${dev ? '' : '.min'}.js` : [
				'./collection.js',
				'./dist/node/**/*.js',
				'!./dist/node/**/*.tmp.js'
			];

			gulp.src(src)
				.pipe($.istanbul())
				.pipe($.istanbul.hookRequire())
				.on('finish', runTests);

			function runTests() {
				return gulp.src(`./spec/${type + (dev ? '-dev' : '')}-spec.js`)
					.pipe($.plumber())
					.pipe($.jasmine())
					.pipe($.istanbul.writeReports())
					.on('finish', cb);
			}
		};
	}
};
