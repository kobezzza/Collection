'use strict';

/* eslint-disable prefer-template, eqeqeq */

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import $C from '../core';
import { returnCache } from './compile';

import { localCacheAttrs, LOCAL_CACHE } from '../consts/cache';
import { NAMESPACE, CACHE_KEY, CACHE_VERSION_KEY } from '../consts/symbols';
import { IS_NODE, IS_BROWSER, LOCAL_STORAGE_SUPPORT } from '../consts/env';

if (LOCAL_CACHE) {
	if (IS_BROWSER && LOCAL_STORAGE_SUPPORT && document.readyState === 'loading') {
		try {
			const
				version = localStorage.getItem(CACHE_VERSION_KEY),
				cache = localStorage.getItem(CACHE_KEY);

			if (cache && version == $C.CACHE_VERSION) {
				$C.cache.str = JSON.parse(cache);

				let
					attrs = '';

				for (const key in localCacheAttrs) {
					if (!localCacheAttrs.hasOwnProperty(key)) {
						continue;
					}

					const val = localCacheAttrs[key];
					attrs += val != null ? ` ${key}=${val}` : ` ${key}`;
				}

				document.write(
					`<script type="text/javascript" ${attrs}>` +
					returnCache($C.cache.str) +
					`${NAMESPACE}.ready = true;` +
					/* eslint-disable-next-line */
					'<\/script>'
				);

			} else {
				localStorage.removeItem(CACHE_KEY);
				localStorage.removeItem(CACHE_VERSION_KEY);
			}

		} catch {

		} finally {
			$C.ready = true;
		}

	} else if (IS_NODE) {
		try {
			//#if isNode

			const
				cache = require(require('path').join(__dirname, 'collection.tmp.js'));

			if (cache['version'] === $C.CACHE_VERSION) {
				cache['exec']();
				$C.cache.str = cache['cache'];
			}

			//#endif

		} catch {

		} finally {
			$C.ready = true;
		}
	}
}
