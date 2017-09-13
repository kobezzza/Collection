'use strict';

/* eslint-disable prefer-template */

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

const
	gulp = require('gulp'),
	plumber = require('gulp-plumber');

gulp.task('build', (cb) => {
	const
		rollup = require('gulp-rollup'),
		monic = require('gulp-monic'),
		babelRollup = require('rollup-plugin-babel'),
		replace = require('gulp-replace'),
		rename = require('gulp-rename'),
		header = require('gulp-header'),
		eol = require('gulp-eol');

	const
		async = require('async'),
		del = require('del'),
		helpers = require('./helpers');

	const
		builds = helpers.getBuilds(),
		tasks = [];

	Object.keys(builds).forEach((key) => {
		const name = `${key}.tmp`;
		const fullHead =
			helpers.getHead(true, key !== 'collection' ? key.replace(/^collection\./, '') : '') +
			' *\n' +
			` * Date: '${new Date().toUTCString()}\n` +
			' */\n\n';

		tasks.push((cb) => {
			gulp.src('./src/index.js')
				.pipe(plumber())
				.pipe(monic({flags: builds[key]}))
				.pipe(rename(name))
				.pipe(gulp.dest('./src'))
				.on('end', buildSrc);

			function buildSrc() {
				gulp.src(`./src/${name}`)
					.pipe(plumber())
					.pipe(rollup({
						allowRealFiles: true,
						input: `./src/${name}`,
						format: 'umd',
						amd: {id: 'Collection'},
						name: '$C',
						plugins: [babelRollup()]
					}))

					.pipe(replace(/(\\t)+/g, ''))
					.pipe(replace(/(\\n){2,}/g, '\\n'))
					.pipe(replace(/(@param {.*?}) \[([$\w.]+)=.*]/g, '$1 $2'))
					.pipe(replace(headRgxp.addFlags('g'), ''))
					.pipe(header(fullHead))
					.pipe(eol('\n'))
					.pipe(rename({extname: '.js'}))
					.pipe(gulp.dest('./dist'))
					.on('end', clean);
			}

			function clean() {
				del(`./src/${name}`).then(() => cb());
			}
		});
	});

	async.parallel(tasks, cb);
});

gulp.task('buildNode', (cb) => {
	const
		babel = require('gulp-babel');

	gulp.src('./src/**/*.js')
		.pipe(plumber())
		.pipe(babel({
			babelrc: false,
			plugins: [['transform-es2015-modules-commonjs', {loose: true}]]
		}))

		.pipe(gulp.dest('./dist/node'))
		.on('end', cb);
});
