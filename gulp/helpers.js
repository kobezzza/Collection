'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

module.exports = {
	error(cb) {
		return (err) => {
			console.error(err.message);
			cb();
		};
	},

	getBuilds() {
		delete require.cache[require.resolve('../builds')];
		return Object(require('../builds'));
	},

	getHead(opt_version, opt_key) {
		return (
			'/*!\n' +
			` * Collection${opt_version ? ` v${this.getVersion()}` : ''}${opt_key ? ` (${opt_key})` : ''}\n` +
			' * https://github.com/kobezzza/Collection\n' +
			' *\n' +
			' * Released under the MIT license\n' +
			' * https://github.com/kobezzza/Collection/blob/master/LICENSE\n'
		);
	},

	getVersion() {
		const
			path = require('path'),
			fs = require('fs');

		const
			file = fs.readFileSync(path.join(__dirname, '../src/core.js')),
			v = /VERSION\s*[:=]\s*\[(.*?)]/.exec(file)[1].split(/\s*,\s*/);

		return v.slice(0, 3).join('.') + (v[3] ? `-${eval(v[3])}` : '');
	}
};
