'use strict';
/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

exports.__esModule = true;
exports.IGNORE = exports.FALSE = exports.TRUE = exports.GLOBAL = void 0;
const GLOBAL = new Function('return this')(),
      TRUE = [],
      FALSE = [],
      IGNORE = [];
exports.IGNORE = IGNORE;
exports.FALSE = FALSE;
exports.TRUE = TRUE;
exports.GLOBAL = GLOBAL;