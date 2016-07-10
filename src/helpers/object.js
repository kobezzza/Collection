'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import { DESCRIPTORS_SUPPORT } from '../consts/hacks';
import { isArray, isBoolean, isObjectInstance, isExtensible } from './types';
import { any } from './gcc';

/**
 * Clones an object
 *
 * @param {?} obj - source object
 * @return {?}
 */
export function clone(obj) {
	return JSON.parse(JSON.stringify(obj));
}

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
export function extend(deepOrParams, target, args) {
	const
		params = any(deepOrParams);

	let
		concatArray = false,
		withAccessors = false,
		withProto = false,
		traits = false,
		deep;

	if (deepOrParams && !isBoolean(deepOrParams)) {
		const p = deepOrParams;
		withProto = p.withProto;
		withAccessors = p.withAccessors && DESCRIPTORS_SUPPORT;
		concatArray = Boolean(p.concatArray);
		traits = p.traits || false;
		deep = Boolean(p.deep);

	} else {
		deep = deepOrParams || false;
	}

	const
		current = any(isObjectInstance(target) ? target : isArray(arguments[2]) ? [] : {}),
		length = arguments.length;

	let i = 1;
	while (++i < length) {
		const
			arg = arguments[i];

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

				let
					src = current[key];

				const
					copy = arg[key];

				if (current === copy || copy === arg) {
					continue;
				}

				let copyIsArray;
				if (deep && copy && typeof copy === 'object' && ((copyIsArray = isArray(copy)) || isExtensible(copy))) {
					const
						isObj = src && typeof src === 'object',
						isPlainObj = isObj && isExtensible(src);

					if (withProto && isPlainObj && !current.hasOwnProperty(key)) {
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

						if (!srcIsArray && withProto && concatArray) {
							construct = isObj && Object.getPrototypeOf(src);
							srcIsArray = construct && isArray(construct) && (isProto = true);
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
						if (src && isPlainObj && !isArray(src)) {
							clone = src;

						} else {
							clone = {};
						}
					}

					current[key] = extend(params, clone, copy);

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
}
