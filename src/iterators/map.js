'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import { Collection } from '../core';
import { getType, isArray, isFunction } from '../helpers/types';

Collection.prototype.map = function (cb, opt_params) {
	cb = cb || ((el) => el);

	let p;
	if (isArray(opt_params) || isFunction(opt_params)) {
		p = {filter: opt_params};

	} else {
		p = opt_params || {};
	}

	const
		{data} = this;

	let type = 'object';
	if ((p.use || p.notOwn) && !p.initial) {
		p.initial = {};

	} else if (p.initial) {
		type = getType(p.initial);

	} else {
		type = getType(data, p.use);
	}

	const
		source = p.initial || data;

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
				res.push(cb.apply(this, arguments));
			};

			action['__COLLECTION_TMP__length'] = cb.length;
			break;

		case 'object':
			action = function (el, key) {
				res[key] = cb.apply(this, arguments);
			};

			action['__COLLECTION_TMP__length'] = action.length > cb.length ? action.length : cb.length;
			break;

		case 'map':
		case 'weakMap':
			action = function (el, key) {
				res.set(key, cb.apply(this, arguments));
			};

			action['__COLLECTION_TMP__length'] = action.length > cb.length ? action.length : cb.length;
			break;

		case 'set':
		case 'weakSep':
			action = function () {
				res.add(cb.apply(this, arguments));
			};

			action['__COLLECTION_TMP__length'] = cb.length;
			break;
	}

	const
		{onComplete} = p;

	p.result = res;
	p.onComplete = function () {
		onComplete && onComplete.call(this, res);
	};

	const
		returnVal = this.forEach(action, p);

	if (returnVal !== this) {
		return returnVal;
	}

	return res;
};
