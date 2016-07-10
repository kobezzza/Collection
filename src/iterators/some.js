'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import { Collection } from '../core';
import { isArray, isFunction } from '../helpers/types';
import { any } from '../helpers/gcc';

/**
 * Returns true if in the collection exists at least one element which matches by the specified condition
 *
 * @see Collection.prototype.forEach
 * @param {($$CollectionFilter|$$CollectionSingleBase)=} [opt_filter] - function filter or an array of functions
 * @param {?$$CollectionSingleBase=} [opt_params] - additional parameters
 * @return {(boolean|!Promise<boolean>)}
 */
Collection.prototype.some = function (opt_filter, opt_params) {
	let
		p = any(opt_params || {});

	if (!isArray(opt_filter) && !isFunction(opt_filter)) {
		p = opt_filter || p;
		opt_filter = null;
	}

	p.filter = opt_filter;
	p.mult = false;
	p.result = false;

	const
		returnVal = any(this.forEach(() => p.result = true, p));

	if (returnVal !== this) {
		return returnVal;
	}

	return p.result;
};
