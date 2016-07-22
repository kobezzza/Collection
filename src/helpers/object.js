'use strict';

/* eslint-disable no-loop-func */

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import $C from '../core';
import { isArray, isBoolean, isObjectInstance, isExtensible } from './types';
import { isThread } from '../iterators/helpers';
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
 *   *) [withAccessors = false] - if true, then property accessors will be copied too, but not another descriptor properties;
 *   *) [withProto = false] - if true, then properties will be copied with prototypes
 *   *) [concatArray = false] - if true, then array properties will be concatenated (only if extending by an another array)
 *   *) [concatFn = Array.prototype.concat] - function that will be concatenate arrays
 *   *) [traits = false] - if true, then will be copied only new properties, or if -1, only old
 *   *) [deep = false] - if true, then properties will be copied recursively
 *
 * @param {Object} target - source object
 * @param {...Object} args - objects for extending
 * @return {(!Object|!Promise)}
 */
$C.extend = function (deepOrParams, target, args) {
	const
		p = isThread(isBoolean(deepOrParams) ? {deep: any(deepOrParams)} : deepOrParams || {}),
		withDescriptor = p.withDescriptor && !p.withAccessors;

	if (p.withAccessors) {
		p.withDescriptor = true;
	}

	if (p.withProto) {
		p.notOwn = true;
	}

	const
		current = any(isObjectInstance(target) ? target : isArray(arguments[2]) ? [] : {}),
		{create, defineProperty, getPrototypeOf} = Object;

	let promise = {then(cb) {
		cb();
		return this;
	}};

	if (p.thread) {
		promise = Promise.resolve();
	}

	let i = 1;
	while (++i < arguments.length) {
		const
			arg = arguments[i];

		if (!arg) {
			continue;
		}

		promise = promise.then(() =>
			$C(arg).forEach((el, key) => {
				if (p.withDescriptor && (el.get || el.set)) {
					if (p.withAccessors) {
						defineProperty(current, key, {
							get: el.get,
							set: el.set
						});

					} else {
						defineProperty(current, key, el);
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
							current[key] = src = create(current[key]);
						}
					}

					let clone;
					if (copyIsArray) {
						let
							srcIsArray = isArray(src),
							isProto = false,
							construct;

						if (!srcIsArray && p.withProto && p.concatArray) {
							construct = isObj && getPrototypeOf(src);
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
								defineProperty(current, key, el);

							} else {
								current[key] = copy;
							}
						}

					} else {
						if (withDescriptor) {
							el.value = copy;
							defineProperty(current, key, el);

						} else {
							current[key] = copy;
						}
					}
				}
			}, p)
		);
	}

	return p.thread ? promise.then(() => current) : current;
};

Object.assign($C, {extend: $C.extend, clone: $C.clone});
