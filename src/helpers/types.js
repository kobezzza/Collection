'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

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
	return Array.isArray(obj) || obj instanceof Array;
}

/**
 * Returns true if the specified value is a Map instance
 *
 * @param {?} obj - source value
 * @return {boolean}
 */
export function isMap(obj) {
	return typeof Map === 'function' && obj instanceof Map;
}

/**
 * Returns true if the specified value is a WeakMap instance
 *
 * @param {?} obj - source value
 * @return {boolean}
 */
export function isWeakMap(obj) {
	return typeof WeakMap === 'function' && obj instanceof WeakMap;
}

/**
 * Returns true if the specified value is a Set instance
 *
 * @param {?} obj - source value
 * @return {boolean}
 */
export function isSet(obj) {
	return typeof Set === 'function' && obj instanceof Set;
}

/**
 * Returns true if the specified value is a WeakSet instance
 *
 * @param {?} obj - source value
 * @return {boolean}
 */
export function isWeakSet(obj) {
	return typeof WeakSet === 'function' && obj instanceof WeakSet;
}

/**
 * Returns true if the specified value is a Promise instance
 *
 * @param {?} obj - source value
 * @return {boolean}
 */
export function isPromise(obj) {
	return typeof Promise === 'function' && obj instanceof Promise;
}

/**
 * Returns true if the specified value is a plain object
 *
 * @param {?} obj - source value
 * @return {boolean}
 */
export function isPlainObject(obj) {
	return Boolean(obj) && obj.constructor === Object;
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
	isFuncRgxp = /\[object Function]/,
	toString = {}.toString;

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
 * Returns true if the specified value is a stream
 *
 * @param {?} obj - source value
 * @return {boolean}
 */
export function isStream(obj) {
	return Boolean(
		obj &&
		typeof obj.pipe === 'function' &&
		typeof obj.read === 'function' &&
		typeof obj.addListener === 'function' &&
		typeof obj.removeListener === 'function'
	);
}

/**
 * Returns true if the specified value is a IDBRequest instance
 *
 * @param {?} obj - source value
 * @return {boolean}
 */
export function isIDBRequest(obj) {
	return typeof IDBRequest === 'function' && obj instanceof IDBRequest;
}

/**
 * Returns the current type of an object
 *
 * @param {Object} obj - source object
 * @param {?string=} [opt_use] - cycle type for iteration: for, for of, for in
 * @return {?string}
 */
export function getType(obj, opt_use) {
	if (!obj) {
		return null;
	}

	let type = 'object';
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

			} else if (isStream(obj)) {
				type = 'stream';

			} else if (isIDBRequest(obj)) {
				type = 'idbRequest';
			}
	}

	return type;
}

export const
	isNative = /\[native code]/;

/**
 * Returns a new object with the same type as source
 *
 * @param {?} obj - source object
 * @return {?}
 */
export function getSameAs(obj) {
	if (!obj) {
		return false;
	}

	if (isArray(obj)) {
		return [];
	}

	if (isPlainObject(obj)) {
		return {};
	}

	if (isMap(obj)) {
		return new Map();
	}

	if (isSet(obj)) {
		return new Set();
	}

	return isFunction(obj.constructor) && !isNative.test(obj.constructor.toString()) ? {} : false;
}

/**
 * Returns true if the specified object is one of JS data structures
 *
 * @param {?} obj - source object
 * @return {boolean}
 */
export function isStructure(obj) {
	if (!obj) {
		return false;
	}

	if (isArray(obj) || isPlainObject(obj) || isMap(obj) || isSet(obj)) {
		return true;
	}

	return isFunction(obj.constructor) && !isNative.test(obj.constructor.toString());
}

/**
 * Returns true if the specified object can be extended
 *
 * @param {?} obj - source object
 * @return {boolean}
 */
export function canExtended(obj) {
	if (!obj) {
		return false;
	}

	if (isArray(obj) || isPlainObject(obj)) {
		return true;
	}

	return isFunction(obj.constructor) && !isNative.test(obj.constructor.toString());
}
