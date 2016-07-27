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

var _link = require('../helpers/link');

var _gcc = require('../helpers/gcc');

/**
 * Sets a new value for collection elements by the specified condition/link
 *
 * @see Collection.prototype.forEach
 * @param {(?|$$CollectionCb)} value - new value (function will execute)
 * @param {($$CollectionFilter|$$Collection_set|$$CollectionLink)=} filter - link, function filter or an array of functions
 * @param {?$$Collection_set=} [opt_params] - additional parameters:
 *
 *   *) [key] - key (null for array.push) of a new element (if search elements nof found)
 *   *) [create = true] - if false, in the absence of the requested property will be thrown an exception, otherwise it will be created
 *
 * @return {($$CollectionSetReport|!Promise<$$CollectionSetReport>)}
 */
_core.Collection.prototype.set = function (value, filter, opt_params) {
	let p = opt_params || {};

	const { data } = this;

	if (!(0, _types.isFunction)(filter) && ((0, _types.isArray)(filter) && !(0, _types.isFunction)(filter[1]) || filter != null && typeof filter !== 'object')) {
		return (0, _link.byLink)(data, filter, { value, create: p.create !== false, error: true });
	}

	if (!(0, _types.isArray)(filter) && !(0, _types.isFunction)(filter)) {
		p = filter || p;
		filter = null;
	}

	this._filter(p, filter)._isThread(p);
	p = (0, _gcc.any)(Object.assign(Object.create(this.p), p));

	const type = (0, _types.getType)(data, p.use),
	      isFunc = (0, _types.isFunction)(value),
	      isAsync = p.thread || p.async;

	const mult = p.mult !== false,
	      report = [];

	if (mult) {
		p.result = report;
	} else {
		p.result = {
			notFound: true,
			result: false,
			key: undefined,
			value: undefined
		};
	}

	let fn;
	if (isFunc) {
		switch (type) {
			case 'map':
				fn = function (el, key, data) {
					const res = value.apply(null, arguments);

					if (isAsync && (0, _types.isPromise)(res)) {
						return res.then(res => {
							let status = res === undefined;

							if (res !== undefined && data.get(key) !== res) {
								data.set(key, res);
								status = data.get(key) === res;
							}

							const o = {
								key,
								value: el,
								newValue: res,
								result: status
							};

							if (mult) {
								report.push(o);
							} else {
								p.result = o;
							}
						}, fn[_base.ON_ERROR]);
					}

					let status = res === undefined;

					if (res !== undefined && data.get(key) !== res) {
						data.set(key, res);
						status = data.get(key) === res;
					}

					const o = {
						key,
						value: el,
						newValue: res,
						result: status
					};

					if (mult) {
						report.push(o);
					} else {
						p.result = o;
					}
				};

				break;

			case 'set':
				fn = function (el, key, data) {
					const res = value.apply(null, arguments);

					if (isAsync && (0, _types.isPromise)(res)) {
						return res.then(res => {
							let status = res === undefined;

							if (res !== undefined && !data.has(res)) {
								data.delete(el);
								data.add(res);
								status = data.has(res);
							}

							const o = {
								key: null,
								value: el,
								newValue: res,
								result: status
							};

							if (mult) {
								report.push(o);
							} else {
								p.result = o;
							}
						}, fn[_base.ON_ERROR]);
					}

					let status = res === undefined;

					if (res !== undefined && !data.has(res)) {
						data.delete(el);
						data.add(res);
						status = data.has(res);
					}

					const o = {
						key: null,
						value: el,
						newValue: res,
						result: status
					};

					if (mult) {
						report.push(o);
					} else {
						p.result = o;
					}
				};

				break;

			default:
				fn = function (el, key, data) {
					const res = value.apply(null, arguments);

					if (isAsync && (0, _types.isPromise)(res)) {
						return res.then(res => {
							let status = res === undefined;

							if (res !== undefined && data[key] !== res) {
								data[key] = res;
								status = data[key] === res;
							}

							const o = {
								key,
								value: el,
								newValue: res,
								result: status
							};

							if (mult) {
								report.push(o);
							} else {
								p.result = o;
							}
						}, fn[_base.ON_ERROR]);
					}

					let status = res === undefined;

					if (res !== undefined && data[key] !== res) {
						data[key] = res;
						status = data[key] === res;
					}

					const o = {
						key,
						value: el,
						newValue: res,
						result: status
					};

					if (mult) {
						report.push(o);
					} else {
						p.result = o;
					}
				};
		}

		fn[_base.FN_LENGTH] = fn.length > value.length ? fn.length : value.length;
	} else {
		switch (type) {
			case 'map':
				fn = (el, key, data) => {
					let result = false;
					if (data.get(key) !== value) {
						data.set(key, value);
						result = data.get(key) === value;
					}

					const o = {
						key,
						value: el,
						newValue: value,
						result
					};

					if (mult) {
						report.push(o);
					} else {
						p.result = o;
					}
				};

				break;

			case 'set':
				fn = (el, key, data) => {
					let result = false;
					if (!data.has(value)) {
						data.delete(el);
						data.add(value);
						result = data.has(value);
					}

					const o = {
						key: null,
						value: el,
						newValue: value,
						result
					};

					if (mult) {
						report.push(o);
					} else {
						p.result = o;
					}
				};

				break;

			default:
				fn = (el, key, data) => {
					let result = false;
					if (data[key] !== value) {
						data[key] = value;
						result = data[key] === value;
					}

					const o = {
						key,
						value: el,
						newValue: value,
						result
					};

					if (mult) {
						report.push(o);
					} else {
						p.result = o;
					}
				};
		}
	}

	const { onIterationEnd } = p;
	p.onIterationEnd = ctx => {
		if ((mult ? p.result.notFound : !p.result.length) && 'key' in p) {
			if (p.key == null && (0, _types.isArray)(data)) {
				p.key = data.length;
			}

			const res = (0, _link.byLink)(data, p.key, {
				value: isFunc ? value(undefined, undefined, data, ctx) : value,
				create: p.create !== false
			});

			if (mult) {
				p.result.push(res);
			} else {
				p.result = res;
			}
		}

		onIterationEnd && onIterationEnd(ctx);
	};

	const returnVal = (0, _gcc.any)(this.forEach((0, _gcc.any)(fn), p));

	if (returnVal !== this) {
		return returnVal;
	}

	return p.result;
};