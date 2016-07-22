'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

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
	LOCAL_STORAGE_SUPPORT = !IS_NODE && typeof localStorage === 'object',
	OBJECT_KEYS_NATIVE_SUPPORT = (Object.keys && any(Object.keys).toString()) === '[native code]';
