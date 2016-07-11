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
	async = require('async'),
	del = require('del'),
	helpers = require('./helpers');

const
	rollup = require('gulp-rollup'),
	monic = require('gulp-monic'),
	babelRollup = require('rollup-plugin-babel'),
	babel = require('gulp-babel'),
	replace = require('gulp-replace'),
	rename = require('gulp-rename'),
	header = require('gulp-header'),
	eol = require('gulp-eol');

gulp.task('build', (cb) => {
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
				.pipe(monic({flags: builds[key]}))
				.on('error', helpers.error(cb))
				.pipe(rename(name))
				.pipe(gulp.dest('./src'))
				.on('end', buildSrc);

			function buildSrc() {
				gulp.src(`./src/${name}`)
					.pipe(rollup({
						allowRealFiles: true,
						entry: `./src/${name}`,
						format: 'umd',
						moduleId: 'Collection',
						moduleName: '$C',
						plugins: [babelRollup()]
					}))

					.on('error', helpers.error(cb))
					.pipe(replace(/(@param {.*?}) \[([$\w.]+)=.*]/g, '$1 $2'))
					.pipe(replace(headRgxp.addFlag('g'), ''))
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

gulp.task('build-node', (cb) => {
	gulp.src('./src/**/*.js')
		.pipe(babel({
			babelrc: false,
			plugins: [['transform-es2015-modules-commonjs', {loose: true}]]
		}))

		.on('error', helpers.error(cb))
		.pipe(gulp.dest('./dist/node'))
		.on('end', cb);
});
