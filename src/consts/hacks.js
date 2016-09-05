'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import { isNative } from '../helpers/types';
import { any } from '../helpers/gcc';

export const IS_NODE = (() => {
	try {
		return typeof process === 'object' && {}.toString.call(process) === '[object process]';

	} catch (ignore) {
		return false;
	}
})();

export const
	IS_BROWSER = !IS_NODE && typeof window === 'object',
	BLOB_SUPPORT = IS_BROWSER && typeof Blob === 'function' && typeof URL === 'function',
	OBJECT_KEYS_NATIVE_SUPPORT = isNative.test(Object.keys && any(Object.keys).toString());

export const LOCAL_STORAGE_SUPPORT = !IS_NODE && (() => {
	const
		mod = Math.random();

	try {
		localStorage.setItem(mod, mod);
		localStorage.removeItem(mod);
		return true;

	} catch (ignore) {
		return false;
	}
})();
