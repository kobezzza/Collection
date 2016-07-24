'use strict';

/* eslint-disable no-loop-func */

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import { Collection } from '../core';
import { isArray, isBoolean, isStructure, canExtended, getType } from '../helpers/types';
import { byLink } from '../helpers/link';
import { any } from '../helpers/gcc';

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
Collection.prototype.extend = function (deepOrParams, args) {
	const
		{create, defineProperty, getPrototypeOf} = Object;

	const
		p = isBoolean(deepOrParams) ? {deep: any(deepOrParams)} : deepOrParams || {},
		withDescriptor = p.withDescriptor && !p.withAccessors;

	this
		._filter(p)
		._isThread(p);

	if (p.withAccessors) {
		p.withDescriptor = true;
	}

	if (p.withProto) {
		p.notOwn = true;
	}

	let
		{data} = this,
		type = getType(data);

	if (!type) {
		for (let i = 1; i < arguments.length; i++) {
			type = getType(data, p.use);
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
			setVal = (data, key) => {
				if (p.traits && data.has(key) !== (p.traits === -1)) {
					return;
				}

				data.add(key);
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

	let promise = {then(cb) {
		cb();
		return this;
	}};

	if (p.thread) {
		promise = Promise.resolve();
	}

	const simpleType = {
		'array': true,
		'object': true
	};

	const
		dataIsSimple = simpleType[type];

	for (let i = 1; i < arguments.length; i++) {
		const
			arg = arguments[i];

		if (!arg) {
			continue;
		}

		const
			isSimple = simpleType[getType(arg)];

		promise = promise.then(() => $C(arg).forEach((el, key) => {
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

			let
				src = byLink(data, [key]);

			const
				val = isSimple ? arg[key] : el;

			if (data === val || val === arg) {
				return;
			}

			const
				valIsArray = isArray(val);

			if (p.deep && val && (valIsArray || isStructure(val))) {
				const
					isExt = p.withProto && canExtended(src);

				let
					srcIsArray = isArray(src);

				if (isExt && !data.hasOwnProperty(key)) {
					src = srcIsArray ? src.slice() : create(src);
					byLink(data, [key], {value: src});
				}

				let clone;
				if (valIsArray) {
					let
						isProto = false,
						construct;

					if (!srcIsArray && p.withProto && p.concatArray && isExt) {
						construct = getPrototypeOf(src);
						srcIsArray = isProto = construct && isArray(construct);
					}

					if (srcIsArray) {
						if (p.concatArray) {
							const o = isProto ? construct : src;
							data[key] = p.concatFn ? p.concatFn(o, copy) : o.concat(copy);
							return;
						}

						clone = src;

					} else {
						clone = [];
					}

				} else {
					clone = isStructure(src) ? src : {};
				}

				const
					childExt = $C(clone).extend(p, val);

				if (p.thread) {
					return childExt.then((value) => byLink(data, [key], {value}));
				}

				byLink(data, [key], {value: childExt});

			} else {
				setVal(data, key, val);
			}

		}, p));
	}

	return p.thread ? promise.then(() => data) : data;
};
