'use strict';

/* eslint-disable eqeqeq */

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

gulp.task('bump', () =>
	gulp.src('./@(package-lock|package).json')
		.pipe(plumber())
		.pipe($.bump({version: require('./helpers').getVersion()}))
		.pipe(gulp.dest('./'))
);

gulp.task('npmignore', () =>
	gulp.src('./.npmignore')
		.pipe(plumber())
		.pipe($.replace(/([\s\S]*?)(?=# NPM ignore list)/, `${require('fs').readFileSync('./.gitignore')}\n`))
		.pipe(gulp.dest('./'))
);
