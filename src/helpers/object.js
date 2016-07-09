'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

/**
 * Clones an object
 *
 * @param {?} obj - source object
 * @return {?}
 */
export function clone(obj) {
	return JSON.parse(JSON.stringify(obj));
}
