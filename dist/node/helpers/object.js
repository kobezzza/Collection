'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

var _types = require('./types');

var _gcc = require('./gcc');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
 * @param {Object} target - source object
 * @param {...Object} args - objects for extending
 * @return {!Object}
 */
_core2.default.extend = function (deepOrParams, target, args) {
	const p = (0, _types.isBoolean)(deepOrParams) ? { deep: (0, _gcc.any)(deepOrParams) } : deepOrParams || {},
	      withDescriptor = p.withDescriptor && !p.withAccessors;

	if (p.withAccessors) {
		p.withDescriptor = true;
	}

	if (p.withProto) {
		p.notOwn = true;
	}

	const current = (0, _gcc.any)((0, _types.isObjectInstance)(target) ? target : (0, _types.isArray)(arguments[2]) ? [] : {});

	let i = 1;
	while (++i < arguments.length) {
		const arg = arguments[i];

		if (!arg) {
			continue;
		}

		(0, _core2.default)(arg).forEach((el, key) => {
			if (p.withDescriptor && (el.get || el.set)) {
				if (p.withAccessors) {
					Object.defineProperty(current, key, {
						get: el.get,
						set: el.set
					});
				} else {
					Object.defineProperty(current, key, el);
				}

				return;
			}

			let src = current[key];

			const copy = arg[key];

			if (current === copy || copy === arg) {
				return;
			}

			let copyIsArray;
			if (p.deep && copy && typeof copy === 'object' && ((copyIsArray = (0, _types.isArray)(copy)) || (0, _types.isExtensible)(copy))) {
				const isObj = src && typeof src === 'object',
				      isPlainObj = isObj && (0, _types.isExtensible)(src);

				if (p.withProto && isPlainObj && !current.hasOwnProperty(key)) {
					if ((0, _types.isArray)(current[key])) {
						current[key] = src = current[key].slice();
					} else {
						current[key] = src = Object.create(current[key]);
					}
				}

				let clone;
				if (copyIsArray) {
					let srcIsArray = (0, _types.isArray)(src),
					    isProto = false,
					    construct;

					if (!srcIsArray && p.withProto && p.concatArray) {
						construct = isObj && Object.getPrototypeOf(src);
						srcIsArray = construct && (0, _types.isArray)(construct) && (isProto = true);
					}

					if (srcIsArray) {
						if (p.concatArray) {
							const o = isProto ? construct : src;
							current[key] = p.concatFn ? p.concatFn(o, copy) : o.concat(copy);
							return;
						}

						clone = src;
					} else {
						clone = [];
					}
				} else {
					if (src && isPlainObj && !(0, _types.isArray)(src)) {
						clone = src;
					} else {
						clone = {};
					}
				}

				current[key] = _core2.default.extend(p, clone, copy);
			} else if (copy !== undefined) {
				if (p.traits) {
					if (key in current === (p.traits === -1)) {
						if (withDescriptor) {
							el.value = copy;
							Object.defineProperty(current, key, el);
						} else {
							current[key] = copy;
						}
					}
				} else {
					if (withDescriptor) {
						el.value = copy;
						Object.defineProperty(current, key, el);
					} else {
						current[key] = copy;
					}
				}
			}
		}, p);
	}

	return current;
};

Object.assign(_core2.default, { extend: _core2.default.extend, clone: _core2.default.clone });