'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

exports.__esModule = true;
exports.OBJECT_KEYS_NATIVE_SUPPORT = exports.LOCAL_STORAGE_SUPPORT = exports.BLOB_SUPPORT = exports.IS_BROWSER = exports.IS_NODE = undefined;

var _types = require('../helpers/types');

var _gcc = require('../helpers/gcc');

const IS_NODE = exports.IS_NODE = (() => {
	try {
		return typeof process === 'object' && {}.toString.call(process) === '[object process]';
	} catch (ignore) {
		return false;
	}
})();

const IS_BROWSER = exports.IS_BROWSER = !IS_NODE && typeof window === 'object',
      BLOB_SUPPORT = exports.BLOB_SUPPORT = IS_BROWSER && typeof Blob === 'function' && typeof URL === 'function',
      LOCAL_STORAGE_SUPPORT = exports.LOCAL_STORAGE_SUPPORT = !IS_NODE && typeof localStorage === 'object',
      OBJECT_KEYS_NATIVE_SUPPORT = exports.OBJECT_KEYS_NATIVE_SUPPORT = _types.isNative.test(Object.keys && (0, _gcc.any)(Object.keys).toString());