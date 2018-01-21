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
	helpers = require('./helpers'),
	fullHead = `${helpers.getHead()} */\n\n`;

gulp.task('predefs:build', () =>
	gulp.src('./predefs/src/index.js')
		.pipe($.monic())
		.pipe($.replace(helpers.headRgxp.addFlags('g'), ''))
		.pipe(gulp.dest('./predefs/build'))
);

gulp.task('predefs:externs', () =>
	gulp.src('./predefs/src/index.js')
		.pipe($.monic({flags: {externs: true}}))
		.pipe($.replace(helpers.headRgxp.addFlags('g'), ''))
		.pipe($.replace(/(\s)+$/, '$1'))
		.pipe($.header(fullHead))
		.pipe($.rename('externs.js'))
		.pipe(gulp.dest('./'))
);

gulp.task('predefs:bower', () =>
	$.run('bower install').exec()
);

gulp.task('predefs', gulp.parallel([
	'predefs:build',
	'predefs:externs',
	'predefs:bower'
]));

gulp.task('head', () => {
	global.readyToWatcher = false;

	function filter(file) {
		return !helpers.headRgxp.exec(file.contents.toString()) || RegExp.$1 !== fullHead;
	}

	return gulp.src([
		'./@(src|gulp)/**/*.js',
		'./predefs/src/**/*.js',
		'./collection.js',
		'collection.d.ts'
	], {base: './'})
		.pipe(
			$.if(filter, $.replace(helpers.headRgxp, '')
				.pipe($.header(fullHead))
				.pipe(gulp.dest('./'))
				.on('end', () => global.readyToWatcher = true)
			)
		);
});
