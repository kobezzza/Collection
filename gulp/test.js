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

gulp.task('test', () => $.run('node test').exec().on('error', console.error));
gulp.task('yaspeller', () => $.run('yaspeller ./').exec().on('error', console.error));
