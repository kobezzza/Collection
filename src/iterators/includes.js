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

/**
 * Returns true if the specified element contains in the collection
 *
 * @see Collection.prototype.forEach
 * @param {?} searchElement - element for search
 * @param {($$CollectionFilter|$$CollectionSingleBase)=} [opt_filter] - function filter or an array of functions
 * @param {?$$CollectionSingleBase=} [opt_params] - additional parameters
 * @return {(boolean|!Promise<boolean>)}
 */
Collection.prototype.includes = function (searchElement, opt_filter, opt_params) {
	let p = opt_params || {};

	if (!isArray(opt_filter) && !isFunction(opt_filter)) {
		p = opt_filter || p;
		opt_filter = null;
	}

	const
		f = Number.isNaN(searchElement) ? (el) => Number.isNaN(el) : (el) => el === searchElement;

	this._initParams(p, opt_filter, f);
	p = any(Object.assign(Object.create(this.p), p, {mult: true, result: false}));

	const
		returnVal = any(this.forEach(() => p.result = true, p));

	if (returnVal !== this) {
		return returnVal;
	}

	return p.result;
};
