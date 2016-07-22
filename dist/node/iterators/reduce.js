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
 * Reduces the collection by the specified condition
 *
 * @see Collection.prototype.forEach
 * @param {$$CollectionReduceCb} cb - callback function
 * @param {?=} [opt_initialValue] - initial value
 * @param {($$CollectionFilter|$$CollectionBase)=} [opt_filter] - function filter or an array of functions
 * @param {?$$CollectionBase=} [opt_params] - additional parameters
 * @return {(?|!Promise)}
 */
_core.Collection.prototype.reduce = function (cb, opt_initialValue, opt_filter, opt_params) {
	let p = opt_params || {};

	if (!(0, _types.isArray)(opt_filter) && !(0, _types.isFunction)(opt_filter)) {
		p = opt_filter || p;
		opt_filter = null;
	}

	this._filter(p, opt_filter)._isThread(p);
	p = (0, _gcc.any)(Object.assign(Object.create(this.p), p, { result: opt_initialValue }));

	fn[_base.FN_LENGTH] = cb.length - 1;
	function fn(el) {
		if (opt_initialValue == null) {
			p.result = el;
			opt_initialValue = true;
		} else {
			const val = cb.apply(null, [p.result].concat([].slice.call(arguments)));

			if (p.thread && (0, _types.isPromise)(val)) {
				return val.then(val => p.result = val, fn[_base.ON_ERROR]);
			}

			p.result = val;
		}
	}

	const returnVal = (0, _gcc.any)(this.forEach(fn, p));

	if (returnVal !== this) {
		return returnVal;
	}

	return p.result;
};