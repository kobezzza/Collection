'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import { isArray } from './types';

/**
 * Collection context link
 *
 * @constructor
 * @param link - source link
 */
export function Link(link) {
	this.link = isArray(link) ? [link] : link;
}

/**
 * Returns a context link value
 */
Link.prototype.valueOf = function () {
	return this.link;
};

/**
 * Returns true if the specified value is a Link instance
 *
 * @param {?} obj - source value
 * @return {boolean}
 */
export function isLink(obj) {
	return obj instanceof Link;
}
