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
 * @implements {$$Collection}
 * @param {$$CollectionType} obj
 */
export function Collection(obj) {
	this.data = obj;
	this.p = {filter: []};
}

/**
 * Library version
 * @const
 */
Collection.prototype.VERSION = [6, 0, 0];

/**
 * Creates an instance of Collection
 * @param {$$CollectionType} obj
 */
export default function $C(obj) {
	return new Collection(obj);
}
