'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

global.readyToWatcher = null;

const
	gulp = require('gulp');

require('sugar').extend();
require('./gulp/other');
require('./gulp/predefs');
require('./gulp/build');
require('./gulp/test');

gulp.task('default', gulp.parallel([
	'copyright',
	'head',
	'build',
	'bump',
	'yaspeller',
	'npmignore'
]));

gulp.task('dev', gulp.parallel([
	'copyright',
	'head',
	'build:node',
	'build:client',
	'bump',
	'yaspeller',
	'npmignore'
]));

gulp.task('watch', gulp.series(['dev', () => {
	gulp.watch('./src/**/*.js', gulp.parallel(['build:client', 'build:node']));
	gulp.watch('./src/core.js', gulp.series('bump'));
	gulp.watch('./*.md', gulp.series('yaspeller'));
	gulp.watch('./.gitignore', gulp.series('npmignore'));
}]));
