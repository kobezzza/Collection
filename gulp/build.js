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
	$ = require('gulp-load-plugins')();

gulp.task('build:node', () =>
	gulp.src('./src/**/*.js', {since: gulp.lastRun('build:node')})
		.pipe($.babel({
			babelrc: false,
			plugins: [['transform-es2015-modules-commonjs', {loose: true}]]
		}))

		.pipe(gulp.dest('./dist/node'))
);

gulp.task('build:client', () => {
	const
		del = require('del'),
		combine = require('stream-combiner2').obj,
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

		tasks.push(
			gulp.src('./src/index.js')
				.pipe($.monic({flags: builds[key]}))
				.pipe($.rename(name))
				.pipe(gulp.dest('./src'))
				.on('end', () =>
					gulp.src(`./src/${name}`)
						.pipe($.rollup({
							allowRealFiles: true,
							input: `./src/${name}`,
							format: 'umd',
							amd: {id: 'Collection'},
							name: '$C',
							plugins: [require('rollup-plugin-babel')()]
						}))

						.pipe($.replace(/(\\t)+/g, ''))
						.pipe($.replace(/(\\n){2,}/g, '\\n'))
						.pipe($.replace(/(@param {.*?}) \[([$\w.]+)=.*]/g, '$1 $2'))
						.pipe($.replace(headRgxp.addFlags('g'), ''))
						.pipe($.header(fullHead))
						.pipe($.eol('\n'))
						.pipe($.rename({extname: '.js'}))
						.pipe(gulp.dest('./dist'))
						.on('end', () => del(`./src/${name}`))
				)
		);
	});

	return combine(...tasks);
});

gulp.task('build:compile', gulp.series(gulp.parallel(['build:client', 'predefs']), compile));
gulp.task('build:compile:fast', compile);

function compile() {
	const
		glob = require('glob'),
		combine = require('stream-combiner2').obj;

	const
		config = require('../gcc.json'),
		helpers = require('./helpers');

	const
		builds = helpers.getBuilds(),
		tasks = [];

	Object.keys(builds).forEach((key) => {
		const
			name = key !== 'collection' ? ` (${key.replace(/^collection\./, '')})` : '',
			gccFlags = Object.assign({fileName: `${key}.min.js`}, config);

		const head =
			`/*! Collection v${helpers.getVersion()}${name}` +
			' | https://github.com/kobezzza/Collection/blob/master/LICENSE */\n';

		tasks.push(
			gulp.src(`./dist/${key}.js`)
				.pipe($.closureCompiler(Object.assign(gccFlags, {compilerPath: glob.sync(gccFlags.compilerPath)})))
				.pipe($.replace(/^\/\*[\s\S]*?\*\//, ''))
				.pipe($.wrap('(function(){\'use strict\';<%= contents %>}).call(this);'))
				.pipe($.header(head))
				.pipe($.eol('\n'))
				.pipe(gulp.dest('./dist'))
		);
	});

	return combine(...tasks);
}

gulp.task('build', gulp.parallel(['build:compile', 'build:node']));
