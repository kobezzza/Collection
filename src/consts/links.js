'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import $C from '../core';

export const
	GLOBAL = Function('return this')();

export const
	TRUE = $C.prototype.TRUE = {},
	FALSE = $C.prototype.FALSE = {},
	NULL = $C.prototype.NULL = {};
