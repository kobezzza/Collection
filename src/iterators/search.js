'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import { Collection } from '../core';
import { isArray, isFunction, isSet, isMap } from '../helpers/types';
import { any } from '../helpers/gcc';

/**
 * Searches elements in the collection by the specified condition.
 * The method returns an array of found indexes/keys or an index/key (if mult = false) or null.
 * If the data is Map or Set and mult = false, then the method will return an object {value: key} or null
 *
 * @see Collection.prototype.forEach
 * @param {($$CollectionFilter|$$CollectionBase)=} [opt_filter] - function filter or an array of functions
 * @param {?$$CollectionBase=} [opt_params] - additional parameters
 * @return {(?|!Array|!Promise<(?|!Array)>)}
 */
Collection.prototype.search = function (opt_filter, opt_params) {
	let p = opt_params || {};

	if (!isArray(opt_filter) && !isFunction(opt_filter)) {
		p = opt_filter || p;
		opt_filter = null;
	}

	this._initParams(p, opt_filter);
	p = any(Object.assign(Object.create(this.p), p));

	let fn;
	if (p.mult !== false) {
		const
			res = p.result = [];

		if (isSet(this.data)) {
			fn = (el) => res.push(el);

		} else {
			fn = (el, key) => res.push(key);
		}

	} else {
		p.result = null;
		fn = (el, key) => p.result = isMap(this.data) ? {value: key} : isSet(this.data) ? {value: el} : key;
	}

	const
		returnVal = any(this.forEach(any(fn), p));

	if (returnVal !== this) {
		return returnVal;
	}

	return p.result;
};
