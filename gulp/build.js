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

const
	path = require('path'),
	{Transform} = require('stream');

gulp.task('build:node', () =>
	gulp.src('./src/**/*.js', {since: gulp.lastRun('build:node')})
		.pipe($.plumber())
		.pipe($.babel({
			babelrc: false,
			plugins: [['@babel/plugin-transform-modules-commonjs', {loose: true}]]
		}))

		.pipe(gulp.dest('./dist/node'))
);

gulp.task('build:browser', () => {
	const
		del = require('del'),
		rollup = require('rollup'),
		helpers = require('./helpers');

	const
		File = require('vinyl'),
		through = require('through2'),
		merge = require('merge2');

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
				.pipe($.plumber())
				.pipe($.monic({flags: builds[key]}))
				.pipe($.rename(name))
				.pipe(gulp.dest('./src'))

				.on('end', () => {
					const stream = new Transform({
						readableObjectMode: true
					});

					rollup.rollup({
						input: `./src/${name}`,
						plugins: [require('rollup-plugin-babel')()]
					})
						.then((bundle) => bundle.generate({
							name: '$C',
							format: 'umd',
							exports: 'named',
							amd: {id: 'Collection'}
						}))

						.then(({output}) => {
							for (let i = 0; i < output.length; i++) {
								const
									el = output[i];

								stream.push(new File({
									path: el.facadeModuleId,
									base: path.dirname(el.facadeModuleId),
									contents: Buffer.from(el.code)
								}));
							}

							stream.push(null);
						})

						.catch((err) => {
							stream.push(err);
							stream.push(null);
						});

					return stream
						.pipe($.plumber())
						.pipe(through.obj((data, enc, cb) => {
							if (data instanceof File) {
								cb(null, data);

							} else {
								cb(data);
							}
						}))

						.pipe($.monic({
							flags: builds[key],
							replacers: [(str) => str.replace(/(\/\/#[a-z].*)/g, '\n$1')]
						}))

						.pipe($.replace(/(\\t)+/g, ''))
						.pipe($.replace(/(\\n){2,}/g, '\\n'))
						.pipe($.replace(/(@param {.*?}) \[([$\w.]+)=.*]/g, '$1 $2'))
						.pipe($.replace(helpers.headRgxp.addFlags('g'), ''))
						.pipe($.header(fullHead))
						.pipe($.eol('\n'))
						.pipe($.rename({extname: '.js'}))
						.pipe(gulp.dest('./dist'))
						.on('end', () => del(`./src/${name}`));
				})
		);
	});

	return merge(tasks);
});

gulp.task('build:compile', gulp.series(gulp.parallel(['build:browser', 'predefs']), compile));
gulp.task('build:compile:fast', compile);

function compile() {
	const
		glob = require('glob'),
		merge = require('merge2');

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
				.pipe($.plumber())
				.pipe($.closureCompiler(Object.assign(gccFlags, {compilerPath: glob.sync(gccFlags.compilerPath)})))
				.pipe($.replace(/^\/\*[\s\S]*?\*\//, ''))
				.pipe($.wrap('(function(){\'use strict\';<%= contents %>}).call(this);'))
				.pipe($.header(head))
				.pipe($.eol('\n'))
				.pipe(gulp.dest('./dist'))
		);
	});

	return merge(tasks);
}

gulp.task('build', gulp.parallel(['build:compile', 'build:node']));
