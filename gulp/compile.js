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

gulp.task('compile', ['build', 'predefs'], compile);
gulp.task('fastCompile', compile);

function compile(cb) {
	const
		plumber = require('gulp-plumber'),
		wrap = require('gulp-wrap'),
		replace = require('gulp-replace'),
		header = require('gulp-header'),
		cached = require('gulp-cached'),
		gcc = require('gulp-closure-compiler'),
		eol = require('gulp-eol');

	const
		glob = require('glob'),
		async = require('async'),
		helpers = require('./helpers');

	const
		builds = helpers.getBuilds(),
		tasks = [];

	Object.keys(builds).forEach((key) => {
		const
			name = key !== 'collection' ? ` (${key.replace(/^collection\./, '')})` : '';

		tasks.push((cb) => {
			const
				config = Object.assign({fileName: `${key}.min.js`}, require('../gcc.json'));

			const head =
				`/*! Collection v${helpers.getVersion()}${name}` +
				' | https://github.com/kobezzza/Collection/blob/master/LICENSE */\n';

			gulp.src(`./dist/${key}.js`)
				.pipe(plumber())
				.pipe(cached('compile'))
				.pipe(gcc(Object.assign(config, {compilerPath: glob.sync(config.compilerPath)})))
				.pipe(replace(/^\/\*[\s\S]*?\*\//, ''))
				.pipe(wrap('(function(){\'use strict\';<%= contents %>}).call(this);'))
				.pipe(header(head))
				.pipe(eol('\n'))
				.pipe(gulp.dest('./dist'))
				.on('end', cb);
		});
	});

	async.parallel(tasks, cb);
}
