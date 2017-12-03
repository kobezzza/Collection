'use strict';

/* eslint-disable no-loop-func */

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

var _types = require('../helpers/types');

var _hacks = require('../consts/hacks');

var _link = require('../helpers/link');

var _gcc = require('../helpers/gcc');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const simpleType = {
	'array': true,
	'object': true
};

/**
 * Extends the collection by another objects
 *
 * @param {(boolean|?$$Collection_extend)} deepOrParams - if true, then properties will be copied recursively
 *   OR additional parameters for extending:
 *
 *   *) [withUndef = false] - if true, then the original value can be rewritten to undefined
 *   *) [withDescriptor = false] - if true, then the descriptor of a property will be copied too
 *   *) [withAccessors = false] - if true, then property accessors will be copied too, but not another descriptor properties;
 *   *) [withProto = false] - if true, then properties will be copied with prototypes
 *   *) [concatArray = false] - if true, then array properties will be concatenated (only if extending by an another array)
 *   *) [concatFn = Array.prototype.concat] - function that will be concatenate arrays
 *   *) [traits = false] - if true, then will be copied only new properties, or if -1, only old
 *   *) [deep = false] - if true, then properties will be copied recursively
 *
 * @param {...Object} args - objects for extending
 * @return {(!Object|!Promise)}
 */
_core.Collection.prototype.extend = function (deepOrParams, args) {
	const { create, defineProperty, getPrototypeOf, assign } = Object;

	let p = (0, _gcc.any)(deepOrParams);
	if (p instanceof _core.P === false) {
		if ((0, _types.isBoolean)(p)) {
			p = { deep: p };
		} else {
			p = p || {};
		}

		this._filter(p)._isThread(p);
		p = (0, _gcc.any)(assign(Object.create(this.p), p));
	}

	const withDescriptor = p.withDescriptor && !p.withAccessors,
	      isAsync = p.thread || p.async;

	if (p.withAccessors) {
		p.withDescriptor = true;
	}

	if (p.withProto) {
		p.notOwn = true;
	}

	let { data } = this,
	    type = (0, _types.getType)(data);

	if (!type) {
		for (let i = 1; i < arguments.length; i++) {
			type = (0, _types.getType)(data, p.use);
			if (type) {
				break;
			}
		}

		if (!type) {
			return {};
		}

		switch (type) {
			case 'object':
				data = {};
				break;

			case 'weakMap':
				data = new WeakMap();
				break;

			case 'weakSet':
				data = new WeakSet();
				break;

			case 'map':
				data = new Map();
				break;

			case 'set':
				data = new Set();
				break;

			default:
				data = [];
		}
	}

	const dataIsSimple = simpleType[type];
	p.result = data;

	if (!p.deep && p.withUndef && p.mult && dataIsSimple && _hacks.OBJECT_ASSIGN_NATIVE_SUPPORT && !p.concatArray && !p.withProto && !p.withDescriptor && !p.withAccessors && !p.traits && !p.filter.length && !p.async && !p.from && !p.count && !p.startIndex && !p.endIndex && !p.notOwn && !p.reverse) {
		const args = [];

		for (let i = 1; i < arguments.length; i++) {
			args.push(arguments[i]);
		}

		return assign(data, ...args);
	}

	let setVal;
	switch (type) {
		case 'weakMap':
		case 'map':
			setVal = (data, key, val) => {
				if (p.traits && data.has(key) !== (p.traits === -1)) {
					return;
				}

				data.set(key, val);
			};

			break;

		case 'weakSet':
		case 'set':
			setVal = (data, key, val) => {
				if (p.traits && data.has(val) !== (p.traits === -1)) {
					return;
				}

				data.add(val);
			};

			break;

		default:
			setVal = (data, key, val) => {
				if (p.traits && key in data !== (p.traits === -1)) {
					return;
				}

				if (p.withUndef || val !== undefined) {
					data[key] = val;
				}
			};
	}

	let promise = { then(cb) {
			cb();
			return this;
		} };

	if (isAsync) {
		promise = Promise.resolve();
	}

	if (p.notOwn && !dataIsSimple) {
		p.notOwn = false;
	}

	for (let i = 1; i < arguments.length; i++) {
		const arg = arguments[i];

		if (!arg) {
			continue;
		}

		const isSimple = simpleType[(0, _types.getType)(arg)];

		promise = promise.then(() => (0, _core2.default)(arg).forEach((el, key) => {
			if (dataIsSimple && isSimple && (withDescriptor || p.withAccessors && (el.get || el.set))) {
				if (p.traits && key in data !== (p.traits === -1)) {
					return;
				}

				if (p.withAccessors) {
					defineProperty(data, key, {
						get: el.get,
						set: el.set
					});
				} else if ('value' in el === false || el.value !== undefined || p.withUndef) {
					defineProperty(data, key, el);
				}

				return;
			}

			let src = (0, _link.byLink)(data, [key]);

			const val = isSimple ? arg[key] : el;

			if (data === val || val === arg) {
				return;
			}

			const valIsArray = (0, _types.isArray)(val),
			      struct = valIsArray ? [] : (0, _types.getSameAs)(val);

			if (p.deep && val && (valIsArray || struct)) {
				const isExt = p.withProto && dataIsSimple && (0, _types.canExtended)(src);

				let srcIsArray = (0, _types.isArray)(src);

				if (isExt && !(data.hasOwnProperty ? data.hasOwnProperty(key) : _link.hasOwnProperty.call(data, key))) {
					src = srcIsArray ? src.slice() : create(src);
					(0, _link.byLink)(data, [key], { value: src });
				}

				let clone;
				if (valIsArray) {
					let isProto = false,
					    construct;

					if (!srcIsArray && isExt && p.concatArray) {
						construct = getPrototypeOf(src);
						srcIsArray = isProto = construct && (0, _types.isArray)(construct);
					}

					if (srcIsArray) {
						if (p.concatArray) {
							const o = isProto ? construct : src;
							data[key] = p.concatFn ? p.concatFn(o, val) : o.concat(val);
							return;
						}

						clone = src;
					} else {
						clone = [];
					}
				} else {
					clone = (0, _types.isStructure)(src) ? src : struct || {};
				}

				const childExt = (0, _core2.default)(clone).extend(p, val);

				if (isAsync) {
					return childExt.then(value => (0, _link.byLink)(data, [key], { value }));
				}

				(0, _link.byLink)(data, [key], { value: childExt });
			} else {
				setVal(data, key, val);
			}
		}, p));
	}

	return isAsync ? promise.then(() => data) : data;
};

/**
 * Clones an object
 *
 * @param {?} obj - source object
 * @return {?}
 */
_core2.default.clone = function (obj) {
	return JSON.parse(JSON.stringify(obj));
};

/**
 * Extends the specified object by another objects
 *
 * @see Collection.prototype.extend
 * @param {(boolean|?$$Collection_extend)} deepOrParams - additional parameters
 * @param {Object} target - source object
 * @param {...Object} args - objects for extending
 * @return {(!Object|!Promise)}
 */
_core2.default.extend = function (deepOrParams, target, args) {
	args = [deepOrParams];

	for (let i = 2; i < arguments.length; i++) {
		args.push(arguments[i]);
	}

	const obj = (0, _core2.default)(target);
	return obj.extend.apply(obj, args);
};

Object.assign(_core2.default, { extend: _core2.default.extend, clone: _core2.default.clone });