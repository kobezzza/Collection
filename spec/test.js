/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

const
	fs = require('fs'),
	path = require('path'),
	p = (...args) => path.resolve(__dirname, ...args);

module.exports = (generate) => {
	if (!fs.existsSync(p('dist'))) {
		fs.mkdirSync(p('dist'));
	}

	const
		content = [];

	fs.readdirSync(p('cases')).forEach((path) => {
		const
			src = p('cases', path);

		if (generate) {
			content.push(fs.readFileSync(src));

		} else {
			require(src);
		}
	});

	if (generate) {
		const src = p('dist/tests.js');
		fs.writeFileSync(src, content.join('\n\n'));
		require(src);
	}
};

