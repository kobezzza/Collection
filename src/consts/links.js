/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

'use strict';

import { Collection } from '../core';

export const
	GLOBAL = Function('return this')();

export const
	TRUE = Collection.prototype.TRUE = {},
	FALSE = Collection.prototype.FALSE = {},
	NULL = Collection.prototype.NULL = {};
