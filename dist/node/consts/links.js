/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

'use strict';

exports.__esModule = true;
exports.NULL = exports.FALSE = exports.TRUE = exports.GLOBAL = undefined;

var _core = require('../core');

const GLOBAL = exports.GLOBAL = Function('return this')();

const TRUE = exports.TRUE = _core.Collection.prototype.TRUE = {},
      FALSE = exports.FALSE = _core.Collection.prototype.FALSE = {},
      NULL = exports.NULL = _core.Collection.prototype.NULL = {};