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

function test() {
	const
		dev = arguments[0] === true;

	function exec() {
		return gulp.src(`./dist/collection${!dev ? '.min' : ''}.js`)
			.pipe($.istanbul())
			.pipe($.istanbul.hookRequire())
			.on('finish', runTests);

		function runTests() {
			return gulp.src(`./spec/${dev ? 'dev' : 'index'}_spec.js`)
				.pipe($.plumber())
				.pipe($.jasmine())
				.pipe($.istanbul.writeReports());
		}
	}

	if (dev) {
		return exec;
	}

	return exec();
}

gulp.task('test', test);
gulp.task('test:dev', gulp.series(['build:browser', test(true)]));
gulp.task('yaspeller', () => $.run('yaspeller ./').exec().on('error', console.error));
