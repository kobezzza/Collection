'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import { Collection } from '../core';
import { isFunction, isArray } from '../helpers/types';
import { byLink } from '../helpers/link';
import { any } from '../helpers/gcc';

/**
 * Searches elements in a collection by the specified condition/link.
 * The method returns an array of found elements or an element (if mult = false)
 *
 * @see Collection.prototype.forEach
 * @param {($$CollectionFilter|$$CollectionBase|$$CollectionLink)=} [opt_filter] - link, function filter or an array of functions
 * @param {?$$CollectionBase=} [opt_params] - additional parameters
 * @return {(?|!Array|!Promise<(?|!Array)>)}
 */
Collection.prototype.get = function (opt_filter, opt_params) {
	let p = opt_params || {};

	if (
		!isFunction(opt_filter) && (
			isArray(opt_filter) && !isFunction(opt_filter[1]) ||
			opt_filter != null && typeof opt_filter !== 'object'
		)

	) {
		return byLink(this.data, any(opt_filter));
	}

	if (!isArray(opt_filter) && !isFunction(opt_filter)) {
		p = opt_filter || p;
		opt_filter = null;
	}

	this._initParams(p, opt_filter);
	p = any(Object.assign(Object.create(this.p), p));

	let fn;
	if (p.mult !== false) {
		const res = p.result = [];
		fn = (el) => res.push(el);

	} else {
		fn = (el) => p.result = el;
	}

	const
		returnVal = any(this.forEach(any(fn), p));

	if (returnVal !== this) {
		return returnVal;
	}

	return p.result;
};
