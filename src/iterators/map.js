'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import { Collection } from '../core';
import { FN_LENGTH } from '../consts/base';
import { getType, isArray, isFunction, isPromise } from '../helpers/types';
import { any } from '../helpers/gcc';

/**
 * Creates a new collection based on the current by the specified parameters
 *
 * @see Collection.prototype.forEach
 * @param {($$CollectionCb|$$Collection_map)} cb - callback function
 * @param {($$Collection_map|$$CollectionFilter)=} [opt_params] - additional parameters:
 *   *) [initial] - initial object for adding elements
 *
 * @return {(!Object|!Promise<!Object>)}
 */
Collection.prototype.map = function (cb, opt_params) {
	let p = opt_params || {};

	if (!isFunction(cb)) {
		p = cb || p;
		cb = (el) => el;
	}

	if (isArray(p) || isFunction(p)) {
		p = {filter: p};
	}

	this._filter(p);
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
		source = p.initial || this.data;

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
			res = [];
			type = 'array';
			break;

		default:
			res = new source.constructor();
	}

	let action;
	switch (type) {
		case 'array':
			action = function () {
				const
					val = cb.apply(null, arguments);

				if (isPromise(val)) {
					val.then((val) => res.push(val));

				} else {
					res.push(val);
				}
			};

			action[FN_LENGTH] = cb.length;
			break;

		case 'object':
			action = function (el, key) {
				const
					val = cb.apply(null, arguments);

				if (isPromise(val)) {
					val.then((val) => res[key] = val);

				} else {
					res[key] = val;
				}
			};

			action[FN_LENGTH] = action.length > cb.length ? action.length : cb.length;
			break;

		case 'map':
		case 'weakMap':
			action = function (el, key) {
				const
					val = cb.apply(null, arguments);

				if (isPromise(val)) {
					val.then((val) => res.set(key, val));

				} else {
					res.set(key, val);
				}
			};

			action[FN_LENGTH] = action.length > cb.length ? action.length : cb.length;
			break;

		case 'set':
		case 'weakSep':
			action = function () {
				const
					val = cb.apply(null, arguments);

				if (isPromise(val)) {
					val.then((val) => res.add(val));

				} else {
					res.add(val);
				}
			};

			action[FN_LENGTH] = cb.length;
			break;
	}

	p.result = res;

	const
		returnVal = any(this.forEach(any(action), p));

	if (returnVal !== this) {
		return returnVal;
	}

	return p.result;
};
