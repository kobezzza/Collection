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
	fs = require('vinyl-fs'),
	Transform = require('stream').Transform;

$C(fs.src('./*', {read: false})).async.map(
	(el) => el,

	{initial: new Transform({
		readableObjectMode: true,
		writableObjectMode: true,
		transform(data, enc, cb) {
			console.log(data);
			cb(null, data);
		}
	})}

).then(
	() => console.log('Stream completed!'),
	(err) => console.error(err)
);
