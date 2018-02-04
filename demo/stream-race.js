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

$C(fs.src('./*', {read: false})).race(2)
	.forEach(
		(el) => console.log(el),
		{onIterationEnd: (o) => o.cursor.destroy()}
	)

	.then(
		() => console.log('Stream completed!'),
		(err) => console.error(err)
	);
