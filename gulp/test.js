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
	$ = require('gulp-load-plugins')(),
	{test} = require('./helpers');

gulp.task('test:node', gulp.series('build:node', test('node')));
gulp.task('test:node:fast', test('node'));

gulp.task('test:browser', gulp.series('build:compile', test('browser')));
gulp.task('test:browser:fast', test('browser'));

gulp.task('test:browser:dev', gulp.series('build:browser', test('browser', true)));
gulp.task('test:browser:dev:fast', test('browser', true));

gulp.task('yaspeller', () => $.run('yaspeller ./').exec().on('error', console.error));
