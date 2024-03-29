'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import { any } from '../helpers/gcc';
import { isNative } from '../helpers/types';

export const
	GLOBAL = new Function('return this')();

export const IS_NODE = (() => {
	try {
		return typeof process === 'object' && {}.toString.call(process) === '[object process]';

	} catch {
		return false;
	}
})();

export const
	IS_BROWSER = !IS_NODE && typeof window === 'object',
	BLOB_SUPPORT = IS_BROWSER && typeof Blob === 'function' && typeof URL === 'function',
	OBJECT_KEYS_NATIVE_SUPPORT = isNative.test(Object.keys && any(Object.keys).toString()),
	OBJECT_ASSIGN_NATIVE_SUPPORT = isNative.test(Object.assign && any(Object.assign).toString()),
	SYMBOL_NATIVE_SUPPORT = typeof Symbol === 'function' && isNative.test(Symbol.toString());

export const LOCAL_STORAGE_SUPPORT = !IS_NODE && (() => {
	const
		mod = String(Math.random());

	try {
		localStorage.setItem(mod, mod);
		localStorage.removeItem(mod);
		return true;

	} catch {
		return false;
	}
})();
