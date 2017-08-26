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
import { GLOBAL } from '../consts/links';
import { NAMESPACE, CACHE_VERSION, CACHE_KEY, CACHE_VERSION_KEY } from '../consts/base';
import { IS_NODE, IS_BROWSER, LOCAL_STORAGE_SUPPORT } from '../consts/hacks';
import '../consts/cache';

if (GLOBAL['COLLECTION_LOCAL_CACHE'] !== false) {
	if (IS_BROWSER && LOCAL_STORAGE_SUPPORT) {
		try {
			if (document.readyState === 'loading') {
				const
					version = localStorage.getItem(CACHE_VERSION_KEY),
					cache = localStorage.getItem(CACHE_KEY);

				if (cache && version == CACHE_VERSION) {
					$C.cache.str = JSON.parse(cache);
					document.write(
						'<script type="text/javascript">' +
						returnCache($C.cache.str) +
						`${NAMESPACE}.ready = true;` +
						'</script>'
					);

				} else {
					localStorage.removeItem(CACHE_KEY);
					localStorage.removeItem(CACHE_VERSION_KEY);
					$C.ready = true;
				}
			}

		} catch (_) {}

	} else if (IS_NODE) {
		try {
			const
				cache = require(require('path').join(__dirname, 'collection.tmp.js'));

			if (cache['version'] === CACHE_VERSION) {
				cache['exec']();
				$C.cache.str = cache['cache'];
			}

		} catch (_) {

		} finally {
			$C.ready = true;
		}
	}
}
