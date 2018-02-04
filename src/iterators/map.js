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
import { getType, isArray, isFunction, isPromise } from '../helpers/types';
import { any } from '../helpers/gcc';

/**
 * Creates a new collection based on the current by the specified parameters
 *
 * @see Collection.prototype.forEach
 * @param {($$CollectionCb|$$Collection_map)=} opt_cb - callback function
 * @param {($$Collection_map|$$CollectionFilter)=} [opt_params] - additional parameters:
 *   *) [initial] - initial object for adding elements
 *
 * @return {(!Object|!Promise<!Object>)}
 */
Collection.prototype.map = function (opt_cb, opt_params) {
	let p = opt_params || {};

	if (!isFunction(opt_cb)) {
		p = opt_cb || p;
		opt_cb = (el) => el;
	}

	if (isArray(p) || isFunction(p)) {
		p = {filter: p};
	}

	this._filter(p)._isThread(p);
	p = any(Object.assign(Object.create(this.p), p));

	let type = 'object';
	if ((p.use || p.notOwn) && !p.initial) {
		p.initial = {};

	} else if (p.initial) {
		type = getType(p.initial);

	} else {
		type = getType(this.data, p.use);
	}

	const
		source = p.initial || this.data,
		isAsync = p.thread || p.async;

	let res;
	switch (type) {
		case 'object':
			res = {};
			break;

		case 'array':
			if (isArray(source)) {
				res = [];

			} else {
				res = {};
				type = 'object';
			}

			break;

		case 'generator':
		case 'iterator':
		case 'asyncIterator':
		case 'idbRequest':
		case 'stream':
			res = [];
			type = 'array';
			break;

		default:
			res = new source.constructor();
	}

	let fn;
	switch (type) {
		case 'array':
			fn = function () {
				const
					val = opt_cb.apply(null, arguments);

				//#if iterators.async

				if (isAsync && isPromise(val)) {
					return val.then((val) => res.push(val), fn[ON_ERROR]);
				}

				//#endif

				res.push(val);
			};

			fn[FN_LENGTH] = opt_cb.length;
			break;

		case 'object':
			fn = function (el, key) {
				const
					val = opt_cb.apply(null, arguments);

				//#if iterators.async

				if (isAsync && isPromise(val)) {
					return val.then((val) => res[key] = val, fn[ON_ERROR]);
				}

				//#endif

				res[key] = val;
			};

			fn[FN_LENGTH] = fn.length > opt_cb.length ? fn.length : opt_cb.length;
			break;

		case 'map':
		case 'weakMap':
			fn = function (el, key) {
				const
					val = opt_cb.apply(null, arguments);

				//#if iterators.async

				if (isAsync && isPromise(val)) {
					return val.then((val) => res.set(key, val), fn[ON_ERROR]);
				}

				//#endif

				res.set(key, val);
			};

			fn[FN_LENGTH] = fn.length > opt_cb.length ? fn.length : opt_cb.length;
			break;

		case 'set':
		case 'weakSet':
			fn = function () {
				const
					val = opt_cb.apply(null, arguments);

				//#if iterators.async

				if (isAsync && isPromise(val)) {
					return val.then((val) => res.add(val), fn[ON_ERROR]);
				}

				//#endif

				res.add(val);
			};

			fn[FN_LENGTH] = opt_cb.length;
			break;
	}

	p.result = res;

	const
		returnVal = any(this.forEach(any(fn), p));

	if (returnVal !== this) {
		return returnVal;
	}

	return p.result;
};
