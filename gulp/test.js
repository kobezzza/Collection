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

gulp.task('test', test('browser'));
gulp.task('build:test', gulp.series('build', test('browser')));

gulp.task('test:node', test('node'));
gulp.task('build:test:node', gulp.series('build:node', test('node')));

gulp.task('test:browser', test('browser'));
gulp.task('build:test:browser', gulp.series('build:browser:compile', test('browser')));

gulp.task('test:browser:dev', test('browser', true));
gulp.task('build:test:browser:dev', gulp.series('build:browser', test('browser', true)));

gulp.task('yaspeller', () => $.run('yaspeller ./').exec().on('error', console.error));
