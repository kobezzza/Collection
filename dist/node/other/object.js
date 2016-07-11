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

var _hacks = require('../consts/hacks');

var _types = require('../helpers/types');

var _gcc = require('../helpers/gcc');

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
 *   *) [withAccessors = false] - if true, then accessors will be copied too;
 *   *) [withProto = false] - if true, then properties will be copied with prototypes;
 *   *) [deepOrParams.concatArray = false] - if true, then array properties will be concatenated
 *        (only if extending by an another array);
 *
 *   *) [deepOrParams.traits = false] - if true, then will be copied only new properties, or if -1, only old;
 *   *) [deepOrParams.deep = false] - if true, then properties will be copied recursively.
 *
 * @param {Object} target - source object
 * @param {...Object} args - objects for extending
 * @return {!Object}
 */
_core2.default.extend = function (deepOrParams, target, args) {
	const params = (0, _gcc.any)(deepOrParams);

	let concatArray = false,
	    withAccessors = false,
	    withProto = false,
	    traits = false,
	    deep;

	if (deepOrParams && !(0, _types.isBoolean)(deepOrParams)) {
		const p = deepOrParams;
		withProto = p.withProto;
		withAccessors = p.withAccessors && _hacks.DESCRIPTORS_SUPPORT;
		concatArray = Boolean(p.concatArray);
		traits = p.traits || false;
		deep = Boolean(p.deep);
	} else {
		deep = deepOrParams || false;
	}

	const current = (0, _gcc.any)((0, _types.isObjectInstance)(target) ? target : (0, _types.isArray)(arguments[2]) ? [] : {}),
	      length = arguments.length;

	let i = 1;
	while (++i < length) {
		const arg = arguments[i];

		if (arg) {
			for (const key in arg) {
				if (withAccessors) {
					const descriptor = Object.getOwnPropertyDescriptor(arg, key);
					if (descriptor && (descriptor.set || descriptor.get)) {
						Object.defineProperty(current, key, {
							get: descriptor.get,
							set: descriptor.set
						});

						continue;
					}
				}

				let src = current[key];

				const copy = arg[key];

				if (current === copy || copy === arg) {
					continue;
				}

				let copyIsArray;
				if (deep && copy && typeof copy === 'object' && ((copyIsArray = (0, _types.isArray)(copy)) || (0, _types.isExtensible)(copy))) {
					const isObj = src && typeof src === 'object',
					      isPlainObj = isObj && (0, _types.isExtensible)(src);

					if (withProto && isPlainObj && !current.hasOwnProperty(key)) {
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

						if (!srcIsArray && withProto && concatArray) {
							construct = isObj && Object.getPrototypeOf(src);
							srcIsArray = construct && (0, _types.isArray)(construct) && (isProto = true);
						}

						if (srcIsArray) {
							if (concatArray) {
								current[key] = (isProto ? construct : src).concat(copy);
								continue;
							} else {
								clone = src;
							}
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

					current[key] = _core2.default.extend(params, clone, copy);
				} else if (copy !== undefined) {
					if (traits) {
						if (key in current === (traits === -1)) {
							current[key] = copy;
						}
					} else {
						current[key] = copy;
					}
				}
			}
		}
	}

	return current;
};

Object.assign(_core2.default, { extend: _core2.default.extend, clone: _core2.default.clone });