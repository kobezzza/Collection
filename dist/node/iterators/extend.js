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

var _link = require('../helpers/link');

var _gcc = require('../helpers/gcc');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Extends the collection by another objects
 *
 * @param {(boolean|?$$Collection_extend)} deepOrParams - if true, then properties will be copied recursively
 *   OR additional parameters for extending:
 *
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
	const { create, defineProperty, getPrototypeOf } = Object;

	let p = (0, _types.isBoolean)(deepOrParams) ? { deep: (0, _gcc.any)(deepOrParams) } : deepOrParams || {};

	this._filter(p)._isThread(p);
	p = (0, _gcc.any)(Object.assign({}, this.p, (0, _gcc.any)(p)));

	const withDescriptor = p.withDescriptor && !p.withAccessors;

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
				if (val === undefined || p.traits && key in data !== (p.traits === -1)) {
					return;
				}

				data[key] = val;
			};
	}

	let promise = { then(cb) {
			cb();
			return this;
		} };

	if (p.thread) {
		promise = Promise.resolve();
	}

	const simpleType = {
		'array': true,
		'object': true
	};

	if (p.notOwn && !simpleType[type]) {
		p.notOwn = false;
	}

	const dataIsSimple = simpleType[type];

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
				} else if ('value' in el === false || el.value !== undefined) {
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
			      struct = valIsArray ? [] : (0, _types.getStructure)(val);

			if (p.deep && val && (valIsArray || struct)) {
				const isExt = p.withProto && dataIsSimple && (0, _types.canExtended)(src);

				let srcIsArray = (0, _types.isArray)(src);

				if (isExt && !data.hasOwnProperty(key)) {
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

				if (p.thread) {
					return childExt.then(value => (0, _link.byLink)(data, [key], { value }));
				}

				(0, _link.byLink)(data, [key], { value: childExt });
			} else {
				setVal(data, key, val);
			}
		}, p));
	}

	return p.thread ? promise.then(() => data) : data;
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
	return (0, _core2.default)(target).extend(deepOrParams, ...[].slice.call(arguments, 1));
};

Object.assign(_core2.default, { extend: _core2.default.extend, clone: _core2.default.clone });