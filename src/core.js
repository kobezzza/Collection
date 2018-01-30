'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import { any } from './helpers/gcc';
import { isString } from './helpers/types';

/**
 * Collection constructor
 *
 * @constructor
 * @implements {$$Collection}
 * @param {$$CollectionType} obj
 */
export function Collection(obj) {
	this.data = any(isString(obj) ? obj.split('') : obj || []);
	this._init();
}

/**
 * @private
 * @return {!Object}
 */
Collection.prototype._init = function () {
	const old = this.p;
	this.p = new P();
	return old;
};

/** @constructor */
export function P() {
	Object.assign(this, {
		mult: true,
		count: false,
		from: false,
		startIndex: false,
		endIndex: false,
		reverse: false,
		inverseFilter: false,
		withDescriptor: false,
		notOwn: false,
		live: false,
		async: false,
		thread: false,
		length: true,
		parallel: false,
		race: false,
		filter: []
	}, $C.config);
}

Object.assign($C, {config: {}});

/**
 * Library version
 * @const
 */
Collection.prototype.VERSION = [6, 3, 17];

/**
 * Creates an instance of Collection
 * @param {$$CollectionType} obj
 */
export default function $C(obj) {
	return new Collection(obj);
}
