'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import $C from '../core';
import { GLOBAL, SYMBOL_NATIVE_SUPPORT } from './env';

export const NAMESPACE = '__COLLECTION_NAMESPACE__https_github_com_kobezzza_Collection';
GLOBAL[NAMESPACE] = $C;

export const
	LENGTH_REQUEST = SYMBOL_NATIVE_SUPPORT ? Symbol('Data length query') : '__COLLECTION_TMP__lengthQuery',
	FN_LENGTH = SYMBOL_NATIVE_SUPPORT ? Symbol('Function length') : '__COLLECTION_TMP__length';

export const
	CACHE_KEY = '__COLLECTION_CACHE__',
	CACHE_VERSION_KEY = '__COLLECTION_CACHE_VERSION__';
