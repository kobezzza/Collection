'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

exports.__esModule = true;
exports.LOCAL_STORAGE_SUPPORT = exports.SYMBOL_SUPPORT = exports.OBJECT_ASSIGN_NATIVE_SUPPORT = exports.OBJECT_KEYS_NATIVE_SUPPORT = exports.BLOB_SUPPORT = exports.IS_BROWSER = exports.IS_NODE = undefined;

var _types = require('../helpers/types');

var _gcc = require('../helpers/gcc');

const IS_NODE = exports.IS_NODE = (() => {
	try {
		return typeof process === 'object' && {}.toString.call(process) === '[object process]';
	} catch (_) {
		return false;
	}
})();

const IS_BROWSER = exports.IS_BROWSER = !IS_NODE && typeof window === 'object',
      BLOB_SUPPORT = exports.BLOB_SUPPORT = IS_BROWSER && typeof Blob === 'function' && typeof URL === 'function',
      OBJECT_KEYS_NATIVE_SUPPORT = exports.OBJECT_KEYS_NATIVE_SUPPORT = _types.isNative.test(Object.keys && (0, _gcc.any)(Object.keys).toString()),
      OBJECT_ASSIGN_NATIVE_SUPPORT = exports.OBJECT_ASSIGN_NATIVE_SUPPORT = _types.isNative.test(Object.assign && (0, _gcc.any)(Object.assign).toString()),
      SYMBOL_SUPPORT = exports.SYMBOL_SUPPORT = typeof Symbol === 'function';

const LOCAL_STORAGE_SUPPORT = exports.LOCAL_STORAGE_SUPPORT = !IS_NODE && (() => {
	const mod = Math.random();

	try {
		localStorage.setItem(mod, mod);
		localStorage.removeItem(mod);
		return true;
	} catch (_) {
		return false;
	}
})();