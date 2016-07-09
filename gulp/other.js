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
	helpers = require('./helpers'),
	fs = require('fs');

const
	replace = require('gulp-replace'),
	bump = require('gulp-bump');

gulp.task('copyright', (cb) => {
	gulp.src('./LICENSE')
		.pipe(replace(/(Copyright \(c\) )(\d+)-?(\d*)/, (sstr, intro, from, to) => {
			const year = new Date().getFullYear();
			return intro + from + (to || from !== year ? `-${year}` : '');
		}))

		.pipe(gulp.dest('./'))
		.on('end', cb);
});

gulp.task('bump', (cb) => {
	gulp.src('./@(package|bower).json')
		.pipe(bump({version: helpers.getVersion()}))
		.pipe(gulp.dest('./'))
		.on('end', cb);
});

gulp.task('npmignore', (cb) => {
	gulp.src('./.npmignore')
		.pipe(replace(/([\s\S]*?)(?=# NPM ignore list)/, `${fs.readFileSync('./.gitignore')}\n`))
		.pipe(gulp.dest('./'))
		.on('end', cb);
});
