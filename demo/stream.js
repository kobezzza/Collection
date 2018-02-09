'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

const
	$C = require('../collection'),
	fs = require('vinyl-fs');

$C(fs.src('./*', {read: false})).forEach((el, key, data, o) => {
	console.log(el);

	o.wait(4, 'foo', new Promise((resolve) => {
		setTimeout(() => {
			console.log(`Fast wait: ${o.i()}`);
			resolve();
		}, 200);
	}));

	o.wait(2, 'bar', new Promise((resolve) => {
		setTimeout(() => {
			console.log(`Slow wait: ${o.i()}`);
			resolve();
		}, 1500);
	}));

}).then(
	() => console.log('Stream completed!'),
	(err) => console.error(err)
);
