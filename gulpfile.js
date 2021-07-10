'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

const
	gulp = require('gulp');

require('sugar').extend();
require('./gulp/other');
require('./gulp/predefs');
require('./gulp/build');
require('./gulp/test');

gulp.task('default', gulp.parallel(
	gulp.series(
		gulp.parallel('bump', 'head'),
		'build:test'
	),

	'yaspeller',
	'npmignore'
));

gulp.task('node', gulp.parallel(
	gulp.series(
		gulp.parallel('bump', 'head'),
		'build:test:node'
	),

	'yaspeller',
	'npmignore'
));

gulp.task('watch', gulp.series('default', () => {
	gulp.watch('./src/**/*.js', gulp.series('bump', 'build'));
	gulp.watch('./*.md', gulp.series('yaspeller'));
	gulp.watch('./.gitignore', gulp.series('npmignore'));
}));

gulp.task('watch:node', gulp.series('node', () => {
	gulp.watch('./src/**/*.js', gulp.series('bump', 'build:node'));
	gulp.watch('./*.md', gulp.series('yaspeller'));
	gulp.watch('./.gitignore', gulp.series('npmignore'));
}));
