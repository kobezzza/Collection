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
		'build'
	),

	'copyright',
	'yaspeller',
	'npmignore'
));

gulp.task('dev', gulp.parallel(
	gulp.series(
		gulp.parallel('bump', 'head'),
		'test:node',
		'test:browser',
	),

	'copyright',
	'yaspeller',
	'npmignore'
));

gulp.task('dev:node', gulp.parallel(
	gulp.series(
		gulp.parallel('bump', 'head'),
		'test:node'
	),

	'copyright',
	'yaspeller',
	'npmignore'
));

gulp.task('watch', gulp.series('dev', () => {
	gulp.watch('./src/**/*.js', gulp.series(
		'bump',
		gulp.parallel('test:browser:dev', 'test:node')
	));

	gulp.watch('./*.md', gulp.series('yaspeller'));
	gulp.watch('./.gitignore', gulp.series('npmignore'));
}));

gulp.task('watch:node', gulp.series('dev:node', () => {
	gulp.watch('./src/**/*.js', gulp.series('bump', 'test:node'));
	gulp.watch('./*.md', gulp.series('yaspeller'));
	gulp.watch('./.gitignore', gulp.series('npmignore'));
}));
