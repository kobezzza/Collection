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
	$ = require('gulp-load-plugins')();

const
	helpers = require('./helpers'),
	fullHead = `${helpers.getHead()} */\n\n`;

gulp.task('predefs:build', () =>
	gulp.src('./predefs/src/index.js')
		.pipe(plumber())
		.pipe($.monic())
		.pipe($.replace(helpers.headRgxp.addFlags('g'), ''))
		.pipe(gulp.dest('./predefs/build'))
);

gulp.task('predefs:externs', () =>
	gulp.src('./predefs/src/index.js')
		.pipe(plumber())
		.pipe($.monic({flags: {externs: true}}))
		.pipe($.replace(helpers.headRgxp.addFlags('g'), ''))
		.pipe($.replace(/(\s)+$/, '$1'))
		.pipe($.header(fullHead))
		.pipe($.rename('externs.js'))
		.pipe(gulp.dest('./'))
);

gulp.task('predefs', gulp.parallel(
	'predefs:build',
	'predefs:externs'
));

gulp.task('head', () => {
	function filter(file) {
		return !helpers.headRgxp.exec(file.contents.toString()) || RegExp.$1 !== fullHead;
	}

	const paths = [
		'./@(src|gulp)/**/*.js',
		'./predefs/src/**/*.js',
		'./collection.js',
		'./collection.d.ts'
	];

	return gulp.src(paths, {base: './'})
		.pipe(plumber())
		.pipe($.ignore.include(filter))
		.pipe($.replace(helpers.headRgxp, ''))
		.pipe($.header(fullHead))
		.pipe(gulp.dest('./'));
});
