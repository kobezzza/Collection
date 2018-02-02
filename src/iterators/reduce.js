'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import { Collection } from '../core';
import { FN_LENGTH, ON_ERROR } from '../consts/base';
import { isArray, isFunction, isPromise } from '../helpers/types';
import { any } from '../helpers/gcc';

/**
 * Reduces the collection by the specified condition
 *
 * @see Collection.prototype.forEach
 * @param {$$CollectionReduceCb} cb - callback function
 * @param {?=} [opt_initialValue] - initial value
 * @param {($$CollectionFilter|$$CollectionBase)=} [opt_filter] - function filter or an array of functions
 * @param {?$$CollectionBase=} [opt_params] - additional parameters
 * @return {(?|!Promise)}
 */
Collection.prototype.reduce = function (cb, opt_initialValue, opt_filter, opt_params) {
	let p = opt_params || {};

	if (!isArray(opt_filter) && !isFunction(opt_filter)) {
		p = opt_filter || p;
		opt_filter = null;
	}

	this._filter(p, opt_filter)._isThread(p);
	p = any(Object.assign(Object.create(this.p), p, {result: opt_initialValue}));

	const
		isAsync = p.thread || p.async;

	fn[FN_LENGTH] = cb.length - 1;
	function fn(el) {
		if (opt_initialValue == null) {
			p.result = el;
			opt_initialValue = true;

		} else {
			const
				args = [p.result];

			for (let i = 0; i < arguments.length; i++) {
				args.push(arguments[i]);
			}

			const
				val = cb.apply(null, args);

			//#if iterators.async

			if (isAsync && isPromise(val)) {
				return val.then((val) => p.result = val, fn[ON_ERROR]);
			}

			//#endif

			p.result = val;
		}
	}

	const
		returnVal = any(this.forEach(fn, p));

	if (returnVal !== this) {
		return returnVal;
	}

	return p.result;
};
