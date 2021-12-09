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

import { LENGTH_REQUEST } from '../consts/symbols';

/**
 * Returns the number of elements in the collection by the specified parameters
 *
 * @see Collection.prototype.forEach
 * @param {($$CollectionFilter|$$CollectionSingleBase)=} [opt_filter] - function filter or an array of functions
 * @param {?$$CollectionSingleBase=} [opt_params] - additional parameters
 * @return {(number|!Promise<number>)}
 */
Collection.prototype.length = function (opt_filter, opt_params) {
	let p = opt_params || {};

	if (!isArray(opt_filter) && !isFunction(opt_filter)) {
		p = opt_filter || p;
		opt_filter = null;
	}

	this._initParams(p, opt_filter);
	p = any(Object.assign(Object.create(this.p), p, {result: 0}));

	const calc = () => p.result++;
	calc[LENGTH_REQUEST] = true;

	const
		returnVal = any(this.forEach(calc, p));

	if (calc[LENGTH_REQUEST] !== true) {
		p.result = calc[LENGTH_REQUEST];
		p.onComplete && p.onComplete(p.result);
	}

	if (returnVal !== this) {
		return returnVal;
	}

	return p.result;
};
