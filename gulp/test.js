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
	plumber = require('gulp-plumber'),
	run = require('gulp-run');

gulp.task('fullBuild', ['compile', 'buildNode']);
gulp.task('test', test);

function test(cb) {
	run('node test').exec()
		.pipe(plumber())
		.on('finish', cb);
}

gulp.task('yaspeller', (cb) => {
	run('yaspeller ./').exec()
		.pipe(plumber())
		.on('finish', cb);
});
