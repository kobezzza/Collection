'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import $C from '../core';
import { isArray, isBoolean, isObjectInstance, isExtensible } from './types';
import { any } from './gcc';

/**
 * Clones an object
 *
 * @param {?} obj - source object
 * @return {?}
 */
$C.clone = function (obj) {
	return JSON.parse(JSON.stringify(obj));
};

/**
 * Extends the specified object by another objects
 *
 * @param {(boolean|?$$Collection_extend)} deepOrParams - if true, then properties will be copied recursively
 *   OR additional parameters for extending:
 *
 *   *) [withDescriptor = false] - if true, then the descriptor of a property will be copied too
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
$C.extend = function (deepOrParams, target, args) {
	const
		p = deepOrParams && !isBoolean(deepOrParams) ? any(deepOrParams) : {},
		withDescriptor = p.withDescriptor && !p.withAccessors;

	const
		current = any(isObjectInstance(target) ? target : isArray(arguments[2]) ? [] : {});

	let i = 1;
	while (++i < arguments.length) {
		const
			arg = arguments[i];

		if (!arg) {
			continue;
		}

		$C(arg).forEach((el, key) => {
			if ((p.withDescriptor || p.withAccessors) && (el.get || el.set)) {
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

			let
				src = current[key];

			const
				copy = arg[key];

			if (current === copy || copy === arg) {
				return;
			}

			let copyIsArray;
			if (p.deep && copy && typeof copy === 'object' && ((copyIsArray = isArray(copy)) || isExtensible(copy))) {
				const
					isObj = src && typeof src === 'object',
					isPlainObj = isObj && isExtensible(src);

				if (p.withProto && isPlainObj && !current.hasOwnProperty(key)) {
					if (isArray(current[key])) {
						current[key] = src = current[key].slice();

					} else {
						current[key] = src = Object.create(current[key]);
					}
				}

				let clone;
				if (copyIsArray) {
					let
						srcIsArray = isArray(src),
						isProto = false,
						construct;

					if (!srcIsArray && p.withProto && p.concatArray) {
						construct = isObj && Object.getPrototypeOf(src);
						srcIsArray = construct && isArray(construct) && (isProto = true);
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
					if (src && isPlainObj && !isArray(src)) {
						clone = src;

					} else {
						clone = {};
					}
				}

				current[key] = $C.extend(p, clone, copy);

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

Object.assign($C, {extend: $C.extend, clone: $C.clone});
