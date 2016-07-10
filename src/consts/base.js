'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import $C from '../core';
import { GLOBAL } from './links';

export const NAMESPACE = '__COLLECTION_NAMESPACE__https_github_com_kobezzza_Collection';
GLOBAL[NAMESPACE] = $C;

export const
	LENGTH_REQUEST = '__COLLECTION_TMP__lengthQuery',
	FN_LENGTH = '__COLLECTION_TMP__length';

export const
	CACHE_VERSION = 16,
	CACHE_KEY = '__COLLECTION_CACHE_VERSION__',
	CACHE_VERSION_KEY = '__COLLECTION_CACHE__';
