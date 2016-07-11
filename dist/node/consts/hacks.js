/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

'use strict';

exports.__esModule = true;
exports.CALLEE_SUPPORT = exports.JSON_SUPPORT = exports.DESCRIPTORS_SUPPORT = exports.SET_SUPPORT = exports.MAP_SUPPORT = exports.OBJECT_KEYS_NATIVE_SUPPORT = exports.LOCAL_STORAGE_SUPPORT = exports.BLOB_SUPPORT = exports.IS_BROWSER = exports.IS_NODE = undefined;

var _string = require('../helpers/string');

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
      OBJECT_KEYS_NATIVE_SUPPORT = exports.OBJECT_KEYS_NATIVE_SUPPORT = (Object.keys && (0, _gcc.any)(Object.keys).toString()) === '[native code]';

const MAP_SUPPORT = exports.MAP_SUPPORT = (() => {
	try {
		const tmp = new Map(),
		      key = {};

		tmp.set(key, true);
		return tmp.get(key);
	} catch (ignore) {
		return false;
	}
})();

const SET_SUPPORT = exports.SET_SUPPORT = (() => {
	try {
		const tmp = new Set(),
		      key = {};

		tmp.add(key);
		return tmp.has(key);
	} catch (ignore) {
		return false;
	}
})();

const DESCRIPTORS_SUPPORT = exports.DESCRIPTORS_SUPPORT = (() => {
	try {
		return Object.getOwnPropertyDescriptor(Object.create(null, { foo: { enumerable: false } }), 'foo').enumerable === false;
	} catch (ignore) {
		return false;
	}
})();

const JSON_SUPPORT = exports.JSON_SUPPORT = (() => {
	try {
		return JSON.parse(JSON.stringify({ foo: 'bar' })).foo === 'bar';
	} catch (ignore) {
		return false;
	}
})();

const CALLEE_SUPPORT = exports.CALLEE_SUPPORT = Boolean(eval(_string.ws`
	(function () {
		'use strict';
		var res = true;

		try {
			arguments.callee;

		} catch (ignore) {
			res = false;
		}

		return res;
	})();
`));