'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import { Collection } from '../core';

import { isArray, isFunction, isPromise, isStream, isPositive } from '../helpers/types';
import { any } from '../helpers/gcc';

import { FN_LENGTH } from '../consts/symbols';

/**
 * Reduces the collection by the specified condition
 *
 * @see Collection.prototype.forEach
 * @param {$$CollectionReduceCb} cb - callback function
 * @param {(?|$$CollectionFilter|$$CollectionBase)=} [opt_initialValue] - initial value
 * @param {($$CollectionFilter|$$CollectionBase)=} [opt_filter] - function filter or an array of functions
 * @param {?$$CollectionBase=} [opt_params] - additional parameters
 * @return {(?|!Promise)}
 */
Collection.prototype.reduce = function (cb, opt_initialValue, opt_filter, opt_params) {
	if (this.p.initial != null) {
		opt_params = any(opt_filter);
		opt_filter = any(opt_initialValue);
		opt_initialValue = this.p.initial;
	}

	let p = opt_params ?? {};

	if (!isArray(opt_filter) && !isFunction(opt_filter)) {
		p = opt_filter || p;
		opt_filter = null;
	}

	this._initParams(p, opt_filter);
	p = any(Object.assign(Object.create(this.p), p, {result: opt_initialValue}));

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

			//#if iterators/async

			if (p.async && isPromise(val)) {
				return val.then((val) => {
					if (isPositive(val)) {
						p.result = val;
					}
				});
			}

			//#endif

			if (isPositive(val)) {
				p.result = val;
			}
		}
	}

	const
		res = p.result,
		returnVal = any(this.forEach(fn, p));

	if (isStream(res)) {
		returnVal.then(() => res.end(), (err) => res.destroy(err));
		return p.result;
	}

	if (returnVal !== this) {
		return returnVal;
	}

	return p.result;
};
