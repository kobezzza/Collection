'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

/**
 * Collection constructor
 *
 * @constructor
 * @param {?} collection - source collection
 */
export default function $C(collection) {
	if (!this || this instanceof $C === false) {
		return new $C(collection);
	}

	this.data = collection;
}

/**
 * Library version
 * @const
 */
$C.prototype.VERSION = [6, 0, 0];
