'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { Collection } from '../core';

export const
	GLOBAL = Function('return this')();

export const
	TRUE = Collection.prototype.TRUE = {},
	FALSE = Collection.prototype.FALSE = {},
	NULL = Collection.prototype.NULL = {};
