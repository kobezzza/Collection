'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import { CALLEE_SUPPORT } from '../consts/hacks';

/**
 * Returns true if the specified value is a function
 *
 * @param {?} obj - source value
 * @return {boolean}
 */
export function isFunction(obj) {
	return typeof obj === 'function';
}

/**
 * Returns true if the specified value is a number
 *
 * @param {?} obj - source value
 * @return {boolean}
 */
export function isNumber(obj) {
	return typeof obj === 'number';
}

/**
 * Returns true if the specified value is a string
 *
 * @param {?} obj - source value
 * @return {boolean}
 */
export function isString(obj) {
	return typeof obj === 'string';
}

/**
 * Returns true if the specified value is a boolean
 *
 * @param {?} obj - source value
 * @return {boolean}
 */
export function isBoolean(obj) {
	return typeof obj === 'boolean';
}

/**
 * Returns true if the specified value is an array
 *
 * @param {?} obj - source value
 * @return {boolean}
 */
export function isArray(obj) {
	return Array.isArray(obj);
}

/**
 * Returns true if the specified value is a Map instance
 *
 * @param {?} obj - source value
 * @return {boolean}
 */
export function isMap(obj) {
	return obj instanceof Map;
}

/**
 * Returns true if the specified value is a WeakMap instance
 *
 * @param {?} obj - source value
 * @return {boolean}
 */
export function isWeakMap(obj) {
	return obj instanceof WeakMap;
}

/**
 * Returns true if the specified value is a Set instance
 *
 * @param {?} obj - source value
 * @return {boolean}
 */
export function isSet(obj) {
	return obj instanceof Set;
}

/**
 * Returns true if the specified value is a WeakSet instance
 *
 * @param {?} obj - source value
 * @return {boolean}
 */
export function isWeakSet(obj) {
	return obj instanceof WeakSet;
}

/**
 * Returns true if the specified value is a plain object
 *
 * @param {?} obj - source value
 * @return {boolean}
 */
export function isPlainObject(obj) {
	return Boolean(obj) && (obj.constructor === Object || obj.constructor.name === 'Object');
}

const objectTypes = {
	'object': true,
	'function': true
};

/**
 * Returns true if the specified value is an object instance
 *
 * @param {?} obj - source value
 * @return {boolean}
 */
export function isObjectInstance(obj) {
	return Boolean(obj) && objectTypes[typeof obj];
}

const
	isFuncRgxp = /\[object Function]/;

/**
 * Returns true if the specified value is an array or like an array
 *
 * @param {?} obj - source value
 * @return {boolean}
 */
export function isLikeArray(obj) {
	const res = isArray(obj) ||
		(obj &&

			// The hack for PhantomJS,
			// because it has strange bug for HTMLCollection and NodeList:
			// typeof 'function' && instanceof Function = false
			isObjectInstance(obj) && !isFuncRgxp.test(toString.call(obj)) &&

			(
				// If the object is like an array
				(obj.length > 0 && 0 in obj) || obj.length === 0
			)
		);

	return Boolean(res);
}

/**
 * Returns true if the specified value is a generator
 *
 * @param {?} obj - source value
 * @return {boolean}
 */
export function isGenerator(obj) {
	return isFunction(obj) && obj.constructor.name === 'GeneratorFunction';
}

/**
 * Returns true if the specified value is an iterator
 *
 * @param {?} obj - source value
 * @return {boolean}
 */
export function isIterator(obj) {
	return Boolean(
		obj && (typeof Symbol === 'function' ? obj[Symbol.iterator] : typeof obj['@@iterator'] === 'function')
	);
}

/**
 * Returns the current type of an object
 *
 * @param {!Object} obj - source object
 * @param {?string=} [opt_use] - cycle type for iteration: for, for of, for in
 * @return {string}
 */
export function getType(obj, opt_use) {
	let type = 'object';

	if (!obj) {
		return type;
	}

	if (CALLEE_SUPPORT && 'callee' in obj && 'length' in obj) {
		return 'array';
	}

	switch (opt_use) {
		case 'for':
			type = 'array';
			break;

		case 'for of':
			type = 'iterator';
			break;

		case 'for in':
			type = 'object';
			break;

		default:
			if (isMap(obj)) {
				type = 'map';

			} else if (isWeakMap(obj)) {
				type = 'weakMap';

			} else if (isSet(obj)) {
				type = 'set';

			} else if (isWeakSet(obj)) {
				type = 'weakSet';

			} else if (isGenerator(obj)) {
				type = 'generator';

			} else if (isLikeArray(obj)) {
				type = 'array';

			} else if (isIterator(obj)) {
				type = 'iterator';
			}
	}

	return type;
}

const nativeNames = {
	'Crypto': true,
	'Number': true,
	'String': true,
	'Boolean': true,
	'Symbol': true,
	'Function': true,
	'Date': true,
	'RegExp': true,
	'Blob': true,
	'Array': true,
	'ArrayBuffer': true,
	'Uint8ClampedArray': true,
	'Uint8Array': true,
	'Uint16Array': true,
	'Uint32Array': true,
	'Int8Array': true,
	'Int16Array': true,
	'Int32Array': true,
	'Map': true,
	'WeakMap': true,
	'Set': true,
	'WeakSet': true,
	'Error': true,
	'EvalError': true,
	'TypeError': true,
	'SyntaxError': true,
	'URIError': true,
	'RangeError': true,
	'ReferenceError': true
};

/**
 * Returns true if the specified object can be extended
 *
 * @param {?} obj - source object
 * @return {boolean}
 */
export function isExtensible(obj) {
	if (!obj) {
		return false;
	}

	if (isArray(obj)) {
		return true;
	}

	const
		constr = obj.constructor;

	if (!isFunction(constr)) {
		return false;
	}

	if (isPlainObject(obj)) {
		return true;
	}

	if (nativeNames[constr.name]) {
		return false;
	}

	return constr.toString() === '[native code]';
}
