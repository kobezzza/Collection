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
import { any } from '../helpers/gcc';

//#if link
import { byLink } from '../helpers/link';
//#endif

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

	//#if link

	if (
		!isFunction(opt_filter) && (
			isArray(opt_filter) && !isFunction(opt_filter[1]) ||
			opt_filter != null && typeof opt_filter !== 'object'
		)

	) {
		const tmp = byLink(this.data, any(opt_filter));
		p.onComplete && p.onComplete(tmp);
		return tmp;
	}

	//#endif

	if (!isArray(opt_filter) && !isFunction(opt_filter)) {
		p = opt_filter || p;
		opt_filter = null;
	}

	this._filter(p, opt_filter);
	p = any(Object.assign(Object.create(this.p), p));

	let action;
	if (p.mult !== false) {
		const res = p.result = [];
		action = (el) => res.push(el);

	} else {
		action = (el) => p.result = el;
	}

	const
		returnVal = any(this.forEach(any(action), p));

	if (returnVal !== this) {
		return returnVal;
	}

	return p.result;
};
