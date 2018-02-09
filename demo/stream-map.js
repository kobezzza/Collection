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

$C(fs.src('./*', {read: false})).toStream(true).map()
	.addListener('data', (data) => console.log(data))
	.addListener('end', () => console.log('Stream completed!'));
