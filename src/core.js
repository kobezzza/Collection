'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import { any } from './helpers/gcc';
import { isString, isNumber, isObjectInstance } from './helpers/types';

/**
 * Collection constructor
 *
 * @constructor
 * @implements {$$Collection}
 * @param {$$CollectionType} obj
 */
export function Collection(obj) {
	this._init();

	if (isString(obj)) {
		this.data = obj.split('');

	} else if (isNumber(obj)) {
		let
			i = isFinite(obj) ? Math.abs(obj) : false,
			done = false,
			value;

		this.p.use = 'for of';
		this.data = {
			next: () => {
				done = i === false ? done : done || !i--;
				return {done, value};
			},

			throw(err) {
				throw err;
			},

			return: (v) => {
				done = true;
				value = v;
			}
		};

	} else {
		this.data = isObjectInstance(obj) ? any(obj) : [];
	}
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
Collection.prototype.VERSION = [6, 6, 9];

/**
 * Creates an instance of Collection
 * @param {$$CollectionType} obj
 */
export default function $C(obj) {
	return new Collection(obj);
}
