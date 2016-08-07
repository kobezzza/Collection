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
	cached = require('gulp-cached');

require('sugar').extend();
require('./gulp/other');
require('./gulp/predefs');
require('./gulp/build');
require('./gulp/compile');
require('./gulp/test');

global.headRgxp = /(\/\*![\s\S]*?\*\/\n{2})/;
global.readyToWatcher = null;

gulp.task('watch', ['build', 'bump', 'yaspeller', 'npmignore'], () => {
	async.whilst(
		() =>
			readyToWatcher === false,

		(cb) =>
			setTimeout(cb, 500),

		() => {
			gulp.watch('./src/**/*.js', ['build']).on('change', unbind('build'));
			gulp.watch('./src/core.js', ['bump']);
			gulp.watch('./*.md', ['yaspeller']);
			gulp.watch('./.gitignore', ['npmignore']);
		}
	);

	function unbind(name) {
		return (e) => {
			if (e.type === 'deleted') {
				delete cached.caches[name][e.path];
			}
		};
	}
});

gulp.task('default', ['copyright', 'head', 'full-build', 'bump', 'yaspeller', 'npmignore']);
