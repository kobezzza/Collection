'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

var _core = require('../core');

var _base = require('../consts/base');

var _types = require('../helpers/types');

var _gcc = require('../helpers/gcc');

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
_core.Collection.prototype.map = function (cb, opt_params) {
	let p = opt_params || {};

	if (!(0, _types.isFunction)(cb)) {
		p = cb || p;
		cb = el => el;
	}

	if ((0, _types.isArray)(p) || (0, _types.isFunction)(p)) {
		p = { filter: p };
	}

	this._filter(p)._isThread(p);
	p = (0, _gcc.any)(Object.assign(Object.create(this.p), p));

	let type = 'object';
	if ((p.use || p.notOwn) && !p.initial) {
		p.initial = {};
	} else if (p.initial) {
		type = (0, _types.getType)(p.initial);
	} else {
		type = (0, _types.getType)(this.data, p.use);
	}

	const source = p.initial || this.data;

	let res;
	switch (type) {
		case 'object':
			res = {};
			break;

		case 'array':
			if ((0, _types.isArray)(source)) {
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

	let fn;
	switch (type) {
		case 'array':
			fn = function () {
				const val = cb.apply(null, arguments);

				if (p.thread && (0, _types.isPromise)(val)) {
					return val.then(val => res.push(val), fn[_base.ON_ERROR]);
				}

				res.push(val);
			};

			fn[_base.FN_LENGTH] = cb.length;
			break;

		case 'object':
			fn = function (el, key) {
				const val = cb.apply(null, arguments);

				if (p.thread && (0, _types.isPromise)(val)) {
					return val.then(val => res[key] = val, fn[_base.ON_ERROR]);
				}

				res[key] = val;
			};

			fn[_base.FN_LENGTH] = fn.length > cb.length ? fn.length : cb.length;
			break;

		case 'map':
		case 'weakMap':
			fn = function (el, key) {
				const val = cb.apply(null, arguments);

				if (p.thread && (0, _types.isPromise)(val)) {
					return val.then(val => res.set(key, val), fn[_base.ON_ERROR]);
				}

				res.set(key, val);
			};

			fn[_base.FN_LENGTH] = fn.length > cb.length ? fn.length : cb.length;
			break;

		case 'set':
		case 'weakSep':
			fn = function () {
				const val = cb.apply(null, arguments);

				if (p.thread && (0, _types.isPromise)(val)) {
					return val.then(val => res.add(val), fn[_base.ON_ERROR]);
				}

				res.add(val);
			};

			fn[_base.FN_LENGTH] = cb.length;
			break;
	}

	p.result = res;

	const returnVal = (0, _gcc.any)(this.forEach((0, _gcc.any)(fn), p));

	if (returnVal !== this) {
		return returnVal;
	}

	return p.result;
};