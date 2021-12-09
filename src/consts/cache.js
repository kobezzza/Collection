'use strict';

/* eslint-disable prefer-const */

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import $C from '../core';
import { GLOBAL } from './env';

Object.assign($C, {
	ready: false,
	cache: {
		str: {},
		cycle: {}
	}
});

export const
	LOCAL_CACHE = GLOBAL['COLLECTION_LOCAL_CACHE'] !== false;

export const
	compiledCycles = $C.cache.cycle,
	localCacheAttrs = GLOBAL['COLLECTION_LOCAL_CACHE_ATTRS'] || {};
