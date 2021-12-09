'use strict';
/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asyncTypes = void 0;
exports.canExtendProto = canExtendProto;
exports.getSameAs = getSameAs;
exports.getType = getType;
exports.isArray = isArray;
exports.isBoolean = isBoolean;
exports.isFunction = isFunction;
exports.isGenerator = isGenerator;
exports.isIDBRequest = isIDBRequest;
exports.isIterator = isIterator;
exports.isLikeArray = isLikeArray;
exports.isMap = isMap;
exports.isNative = void 0;
exports.isNumber = isNumber;
exports.isObjectInstance = isObjectInstance;
exports.isPlainObject = isPlainObject;
exports.isPositive = isPositive;
exports.isPromise = isPromise;
exports.isSet = isSet;
exports.isStream = isStream;
exports.isString = isString;
exports.isStructure = isStructure;
exports.isWeakMap = isWeakMap;
exports.isWeakSet = isWeakSet;
exports.weakTypes = exports.mapSet = exports.iterators = void 0;

var _primitives = require("../consts/primitives");

const asyncTypes = {
  'stream': true,
  'isIDBRequest': true
};
exports.asyncTypes = asyncTypes;
const mapSet = {
  'map': true,
  'set': true
};
exports.mapSet = mapSet;
const weakTypes = {
  'weakMap': true,
  'weakSet': true
};
exports.weakTypes = weakTypes;
const iterators = {
  'iterator': true,
  'asyncIterator': true,
  'generator': true,
  'stream': true,
  'idbRequest': true
};
/**
 * Returns true if the specified value is a function
 *
 * @param {?} obj - source value
 * @return {boolean}
 */

exports.iterators = iterators;

function isFunction(obj) {
  return typeof obj === 'function';
}
/**
 * Returns true if the specified value is a number
 *
 * @param {?} obj - source value
 * @return {boolean}
 */


function isNumber(obj) {
  return typeof obj === 'number';
}
/**
 * Returns true if the specified value is a string
 *
 * @param {?} obj - source value
 * @return {boolean}
 */


function isString(obj) {
  return typeof obj === 'string';
}
/**
 * Returns true if the specified value is a boolean
 *
 * @param {?} obj - source value
 * @return {boolean}
 */


function isBoolean(obj) {
  return typeof obj === 'boolean';
}
/**
 * Returns true if the specified value is an array
 *
 * @param {?} obj - source value
 * @return {boolean}
 */


function isArray(obj) {
  return Array.isArray(obj) || obj instanceof Array;
}
/**
 * Returns true if the specified value is a Map instance
 *
 * @param {?} obj - source value
 * @return {boolean}
 */


function isMap(obj) {
  return typeof Map === 'function' && obj instanceof Map;
}
/**
 * Returns true if the specified value is a WeakMap instance
 *
 * @param {?} obj - source value
 * @return {boolean}
 */


function isWeakMap(obj) {
  return typeof WeakMap === 'function' && obj instanceof WeakMap;
}
/**
 * Returns true if the specified value is a Set instance
 *
 * @param {?} obj - source value
 * @return {boolean}
 */


function isSet(obj) {
  return typeof Set === 'function' && obj instanceof Set;
}
/**
 * Returns true if the specified value is a WeakSet instance
 *
 * @param {?} obj - source value
 * @return {boolean}
 */


function isWeakSet(obj) {
  return typeof WeakSet === 'function' && obj instanceof WeakSet;
}
/**
 * Returns true if the specified value is a Promise instance
 *
 * @param {?} obj - source value
 * @return {boolean}
 */


function isPromise(obj) {
  return Boolean(obj && isFunction(obj.then) && isFunction(obj.catch));
}
/**
 * Returns true if the specified value is a plain object
 *
 * @param {?} obj - source value
 * @return {boolean}
 */


function isPlainObject(obj) {
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

function isObjectInstance(obj) {
  return Boolean(obj) && objectTypes[typeof obj];
}

const isFuncRgxp = /\[object Function]/,
      toString = {}.toString;
/**
 * Returns true if the specified value is an array or like an array
 *
 * @param {?} obj - source value
 * @return {boolean}
 */

function isLikeArray(obj) {
  const res = isArray(obj) || obj && // The hack for PhantomJS,
  // because it has strange bug for HTMLCollection and NodeList:
  // typeof 'function' && instanceof Function = false
  isObjectInstance(obj) && !isFuncRgxp.test(toString.call(obj)) && ( // If the object is like an array
  obj.length > 0 && 0 in obj || obj.length === 0);
  return Boolean(res);
}
/**
 * Returns true if the specified value is a generator
 *
 * @param {?} obj - source value
 * @return {boolean}
 */


function isGenerator(obj) {
  return isFunction(obj) && obj.constructor.name === 'GeneratorFunction';
}
/**
 * Returns true if the specified value is an iterator
 *
 * @param {?} obj - source value
 * @return {boolean}
 */


function isIterator(obj) {
  return Boolean(obj && (typeof Symbol === 'function' ? obj[Symbol.iterator] : isFunction(obj['@@iterator'])));
}
/**
 * Returns true if the specified value is a stream
 *
 * @param {?} obj - source value
 * @return {boolean}
 */


function isStream(obj) {
  return Boolean(obj && isFunction(obj.addListener) && isFunction(obj.removeListener) && isFunction(obj.destroy) && (isFunction(obj.write) && isFunction(obj.end) || isFunction(obj.pipe) && isFunction(obj.read) && isFunction(obj.pause) && isFunction(obj.resume)));
}
/**
 * Returns true if the specified value is a IDBRequest instance
 *
 * @param {?} obj - source value
 * @return {boolean}
 */


function isIDBRequest(obj) {
  return typeof IDBRequest === 'function' && obj instanceof IDBRequest;
}
/**
 * Returns the current type of an object
 *
 * @param {Object} obj - source object
 * @param {?string=} [opt_use] - cycle type for iteration: for, for in, for of, async for of, sync for of
 * @return {?string}
 */


function getType(obj, opt_use) {
  if (!obj) {
    return null;
  }

  switch (opt_use) {
    case 'for':
      return 'array';

    case 'for in':
      return 'object';

    case 'for of':
      return 'iterator';

    case 'sync for of':
      return 'syncIterator';

    case 'async for of':
      return 'asyncIterator';

    default:
      if (obj === _primitives.EMPTY) {
        return null;
      }

      if (isMap(obj)) {
        return 'map';
      }

      if (isWeakMap(obj)) {
        return 'weakMap';
      }

      if (isSet(obj)) {
        return 'set';
      }

      if (isWeakSet(obj)) {
        return 'weakSet';
      }

      if (isGenerator(obj)) {
        return 'generator';
      }

      if (isLikeArray(obj)) {
        return 'array';
      }

      if (isIterator(obj)) {
        return 'iterator';
      }

      if (isIDBRequest(obj)) {
        return 'idbRequest';
      }

      if (isStream(obj)) {
        return 'stream';
      }

  }

  return 'object';
}

const isNative = /\[native code]/;
/**
 * Returns a new object with the same type as the specified source
 *
 * @param {?} obj - source object
 * @return {?}
 */

exports.isNative = isNative;

function getSameAs(obj) {
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


function isStructure(obj) {
  if (!obj) {
    return false;
  }

  if (isArray(obj) || isPlainObject(obj) || isMap(obj) || isSet(obj)) {
    return true;
  }

  return isFunction(obj.constructor) && !isNative.test(obj.constructor.toString());
}
/**
 * Returns true if a prototype of the specified object can be extended
 *
 * @param {?} obj - source object
 * @return {boolean}
 */


function canExtendProto(obj) {
  if (!obj) {
    return false;
  }

  if (isArray(obj) || isPlainObject(obj)) {
    return true;
  }

  return isFunction(obj.constructor) && !isNative.test(obj.constructor.toString());
}
/**
 * Returns true if the specified object is positive (not equals FALSE and IGNORE)
 *
 * @param {?} obj - source object
 * @return {boolean}
 */


function isPositive(obj) {
  return obj !== _primitives.FALSE && obj !== _primitives.IGNORE;
}