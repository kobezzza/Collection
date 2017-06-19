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
	through = require('through2'),
	replace = require('gulp-replace'),
	header = require('gulp-header');

const
	helpers = require('./helpers'),
	fullHead = `${helpers.getHead()} */\n\n`;

gulp.task('predefs', (cb) => {
	const
		monic = require('gulp-monic'),
		rename = require('gulp-rename'),
		async = require('async'),
		run = require('gulp-run');

	async.parallel([
		(cb) => {
			gulp.src('./predefs/src/index.js')
				.pipe(plumber())
				.pipe(monic())
				.pipe(replace(headRgxp.addFlags('g'), ''))
				.pipe(gulp.dest('./predefs/build'))
				.on('end', cb);
		},

		(cb) => {
			gulp.src('./predefs/src/index.js')
				.pipe(plumber())
				.pipe(monic({flags: {externs: true}}))
				.pipe(replace(headRgxp.addFlags('g'), ''))
				.pipe(replace(/(\s)+$/, '$1'))
				.pipe(header(fullHead))
				.pipe(rename('externs.js'))
				.pipe(gulp.dest('./'))
				.on('end', cb);
		},

		(cb) => {
			run('bower install').exec()
				.pipe(plumber())
				.on('finish', cb);
		}

	], cb);
});

gulp.task('head', (cb) => {
	global.readyToWatcher = false;

	function test() {
		return through.obj(function (file, enc, cb) {
			if (!headRgxp.exec(file.contents.toString()) || RegExp.$1 !== fullHead) {
				this.push(file);
			}

			return cb();
		});
	}

	gulp.src(['./@(src|gulp)/**/*.js', './predefs/src/**/*.js', './collection.js'], {base: './'})
		.pipe(test())
		.pipe(replace(headRgxp, ''))
		.pipe(header(fullHead))
		.pipe(gulp.dest('./'))
		.on('end', () => {
			global.readyToWatcher = true;
			cb();
		});
});
