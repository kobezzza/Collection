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
	async = require('async'),
	helpers = require('./helpers');

const
	wrap = require('gulp-wrap'),
	header = require('gulp-header'),
	cached = require('gulp-cached'),
	gcc = require('gulp-closure-compiler'),
	eol = require('gulp-eol');

gulp.task('compile', ['build', 'predefs'], compile);
gulp.task('compile-fast', compile);

function compile(cb) {
	const
		builds = helpers.getBuilds(),
		tasks = [];

	Object.keys(builds).forEach((key) => {
		const name = key !== 'collection' ? ` (${key.replace(/^collection\./, '')})` : '';
		tasks.push((cb) => {
			const
				gccFlags = Object.assign({fileName: `${key}.min.js`}, require('../gcc.json'));

			const head =
				`/*! Snakeskin v${helpers.getVersion()}${name}` +
				' | https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE */\n';

			gulp.src(`./dist/${key}.js`)
				.pipe(cached('compile'))
				.pipe(gcc(gccFlags))
				.pipe(wrap('(function(){\'use strict\';<%= contents %>}).call(this);'))
				.pipe(header(head))
				.pipe(eol('\n'))
				.pipe(gulp.dest('./dist'))
				.on('end', cb);
		});
	});

	async.parallel(tasks, cb);
}
