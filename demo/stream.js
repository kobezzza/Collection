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

$C(fs.src('./*.js', {read: false})).forEach((el, key) => {
	console.log(el, key);
});
