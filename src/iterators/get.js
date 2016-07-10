'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import { Collection } from '../core';
import { isLink } from '../helpers/link';
import { isFunction, isArray } from '../helpers/types';
import { any } from '../helpers/gcc';

//#if link
import { byLink } from '../other/link';
//#endif

/**
 * Searches elements in a collection by the specified condition/link.
 * The method returns an array of found elements or an element (if mult = false)
 *
 * @see Collection.prototype.forEach
 * @param {($$CollectionFilter|$$CollectionBase|$$CollectionLink)=} [opt_filter] - link, function filter or an array of functions
 * @param {?$$CollectionBase=} [opt_params] - additional parameters
 * @return {(?|!Array|!Promise)}
 */
Collection.prototype.get = function (opt_filter, opt_params) {
	let p = any(opt_params || {});

	/* eslint-disable no-constant-condition */

	if (isLink(opt_filter) || !isFunction(opt_filter) && (isArray(opt_filter) && !isFunction(opt_filter[1]) || true)) {
		const tmp = byLink(this.data, opt_filter);
		p.onComplete && p.onComplete.call(this, tmp);
		return tmp;
	}

	if (!isArray(opt_filter) && !isFunction(opt_filter)) {
		p = opt_filter || p;
		opt_filter = null;
	}

	/* eslint-enable no-constant-condition */

	const res = p.result = [];
	p.filter = opt_filter;

	const
		returnVal = any(this.forEach(p.mult ? (el) => res.push(el) : (el) => p.result = el, p));

	if (returnVal !== this) {
		return returnVal;
	}

	return res;
};
