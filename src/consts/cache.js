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

Object.assign($C, {
	ready: false,
	cache: {
		str: {},
		cycle: {}
	}
});

export const tmpCycle = $C.cache.cycle;
