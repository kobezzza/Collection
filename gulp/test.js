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
	{test} = require('./helpers');

gulp.task('test', test(true, 'browser'));
gulp.task('build:test', gulp.series('build', test(false, 'browser')));

gulp.task('test:node', test(true, 'node'));
gulp.task('build:test:node', gulp.series('build:node', test(false, 'node')));

gulp.task('test:browser', test(true, 'browser'));
gulp.task('build:test:browser', gulp.series('build:browser:compile', test(false, 'browser')));

gulp.task('test:browser:dev', test(true, 'browser', true));
gulp.task('build:test:browser:dev', gulp.series('build:browser', test(false, 'browser', true)));

gulp.task('yaspeller', () => $.run('yaspeller ./').exec().on('error', console.error));
