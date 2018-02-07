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
 * @param {(?|$$CollectionFilter|$$CollectionBase)=} [opt_initialValue] - initial value
 * @param {($$CollectionFilter|$$CollectionBase)=} [opt_filter] - function filter or an array of functions
 * @param {?$$CollectionBase=} [opt_params] - additional parameters
 * @return {(?|!Promise)}
 */
_core.Collection.prototype.reduce = function (cb, opt_initialValue, opt_filter, opt_params) {
	if (this.p.initial != null) {
		opt_params = (0, _gcc.any)(opt_filter);
		opt_filter = (0, _gcc.any)(opt_initialValue);
		opt_initialValue = this.p.initial;
	}

	let p = opt_params || {};

	if (!(0, _types.isArray)(opt_filter) && !(0, _types.isFunction)(opt_filter)) {
		p = opt_filter || p;
		opt_filter = null;
	}

	this._filter(p, opt_filter)._isThread(p);
	p = (0, _gcc.any)(Object.assign(Object.create(this.p), p, { result: opt_initialValue }));

	const isAsync = p.thread || p.async;

	fn[_base.FN_LENGTH] = cb.length - 1;
	function fn(el) {
		if (opt_initialValue == null) {
			p.result = el;
			opt_initialValue = true;
		} else {
			const args = [p.result];

			for (let i = 0; i < arguments.length; i++) {
				args.push(arguments[i]);
			}

			const val = cb.apply(null, args);

			//#if iterators.async

			if (isAsync && (0, _types.isPromise)(val)) {
				return val.then(val => p.result = val);
			}

			//#endif

			p.result = val;
		}
	}

	const returnVal = (0, _gcc.any)(this.forEach(fn, p));

	if (returnVal !== this && !(0, _types.isStream)(p.result)) {
		return returnVal;
	}

	return p.result;
};