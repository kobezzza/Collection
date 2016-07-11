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

var _link = require('../helpers/link');

var _types = require('../helpers/types');

var _gcc = require('../helpers/gcc');

var _link2 = require('../other/link');

//#endif

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
 * @return {($$CollectionReport|!Promise<$$CollectionReport>)}
 */
_core.Collection.prototype.set = function (value, filter, opt_params) {
	let p = (0, _gcc.any)(opt_params || {});

	const { data } = this;

	//#if link

	if ((0, _link.isLink)(filter) || !(0, _types.isFunction)(filter) && ((0, _types.isArray)(filter) && !(0, _types.isFunction)(filter[1]) || filter != null && typeof filter !== 'object')) {
		const tmp = (0, _link2.byLink)(data, filter, { value, create: p.create !== false, error: true });
		p.onComplete && p.onComplete(tmp);
		return tmp;
	}

	//#endif

	if (!(0, _types.isArray)(filter) && !(0, _types.isFunction)(filter)) {
		p = filter || p;
		filter = null;
	}

	const type = (0, _types.getType)(data, p.use),
	      isFunc = (0, _types.isFunction)(value);

	const mult = p.mult !== false && this.p.mult !== false,
	      report = [];

	if (mult) {
		p.result = report;
	}

	let action;
	if (isFunc) {
		switch (type) {
			case 'map':
				action = function (el, key, data) {
					const res = value.apply(null, arguments);

					let status = res === undefined;

					if (res !== undefined && data.get(key) !== res) {
						data.set(key, res);
						status = data.get(key) === res;
					}

					const o = {
						key,
						value: el,
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
				action = function (el, key, data) {
					const res = value.apply(null, arguments);

					let status = res === undefined;

					if (res !== undefined && !data.has(res)) {
						data.delete(el);
						data.add(res);
						status = data.has(res);
					}

					const o = {
						key: null,
						value: el,
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
				action = function (el, key, data) {
					const res = value.apply(null, arguments);

					let status = res === undefined;

					if (res !== undefined && data[key] !== res) {
						data[key] = res;
						status = data[key] === res;
					}

					const o = {
						key,
						value: el,
						result: status
					};

					if (mult) {
						report.push(o);
					} else {
						p.result = o;
					}
				};
		}

		action[_base.FN_LENGTH] = action.length > value.length ? action.length : value.length;
	} else {
		switch (type) {
			case 'map':
				action = (el, key, data) => {
					let result = false;
					if (data.get(key) !== value) {
						data.set(key, value);
						result = data.get(key) === value;
					}

					const o = {
						key,
						value: el,
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
				action = (el, key, data) => {
					let result = false;
					if (!data.has(value)) {
						data.delete(el);
						data.add(value);
						result = data.has(value);
					}

					const o = {
						key: null,
						value: el,
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
				action = (el, key, data) => {
					let result = false;
					if (data[key] !== value) {
						data[key] = value;
						result = data[key] === value;
					}

					const o = {
						key,
						value: el,
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

	p.filter = [].concat(filter || []);
	p.onIterationEnd = ctx => {
		if ((!p.result || !p.result.length) && 'key' in p) {
			if (p.key == null && (0, _types.isArray)(data)) {
				p.key = data.length;
			}

			(0, _link2.byLink)(data, p.key, {
				value: isFunc ? value(undefined, undefined, data, ctx) : value,
				create: p.create !== false
			});
		}

		onIterationEnd && onIterationEnd(ctx);
	};

	const returnVal = (0, _gcc.any)(this.forEach((0, _gcc.any)(action), p));

	if (returnVal !== this) {
		return returnVal;
	}

	return p.result;
};

//#if link