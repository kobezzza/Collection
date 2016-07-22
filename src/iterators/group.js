'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import { Collection } from '../core';
import { GLOBAL } from '../consts/links';
import { FN_LENGTH } from '../consts/base';
import { isArray, isFunction, isPromise } from '../helpers/types';
import { any } from '../helpers/gcc';

//#if link
import { byLink } from '../helpers/link';
//#endif

/**
 * Groups elements in the collection by the specified condition and returns a new collection
 *
 * @see Collection.prototype.forEach
 * @param {($$CollectionLink|$$CollectionCb)=} [opt_field] - link for the group field or a function which returns the group field
 * @param {($$CollectionFilter|$$Collection_group)=} [opt_filter] - function filter or an array of functions
 * @param {?$$Collection_group=} [opt_params] - additional parameters:
 *
 *   *) [saveKeys = false] - if true, then will be saved keys, but not values
 *   *) [useMap = false] - if true, then for saving data will be used Map
 *
 * @return {(!Object|!Map|!Promise<(!Object|!Map)>)}
 */
Collection.prototype.group = function (opt_field, opt_filter, opt_params) {
	const
		field = opt_field || ((el) => el);

	let
		p = opt_params || {};

	if (!isArray(opt_filter) && !isFunction(opt_filter)) {
		p = opt_filter || p;
		opt_filter = null;
	}

	this._filter(p, opt_filter);
	p = any(Object.assign(Object.create(this.p), p, {mult: true}));

	const
		isFunc = isFunction(field),
		res = p.result = p.useMap ? new GLOBAL['Map']() : {};

	let fn;
	if (p.useMap) {
		fn = function (el, key) {
			const
				param = isFunc ? field.apply(null, arguments) : byLink(el, field),
				val = p.saveKeys ? key : el;

			if (isPromise(param)) {
				param.then((param) => {
					if (res.has(param)) {
						res.get(param).push(val);

					} else {
						res.set(param, [val]);
					}
				});

			} else {
				if (res.has(param)) {
					res.get(param).push(val);

				} else {
					res.set(param, [val]);
				}
			}
		};

	} else {
		fn = function (el, key) {
			const
				param = isFunc ? field.apply(null, arguments) : byLink(el, field),
				val = p.saveKeys ? key : el;

			if (isPromise(param)) {
				param.then((param) => {
					if (res.hasOwnProperty(param)) {
						res[param].push(val);

					} else {
						res[param] = [val];
					}
				});

			} else {
				if (res.hasOwnProperty(param)) {
					res[param].push(val);

				} else {
					res[param] = [val];
				}
			}
		};
	}

	if (isFunc) {
		fn[FN_LENGTH] = fn.length > field.length ? fn.length : field.length;
	}

	const
		returnVal = any(this.forEach(any(fn), p));

	if (returnVal !== this) {
		return returnVal;
	}

	return p.result;
};
