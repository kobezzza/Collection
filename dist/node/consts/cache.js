'use strict';

/* eslint-disable prefer-const */

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

exports.__esModule = true;
exports.tmpCycle = undefined;

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.assign(_core2.default, {
  ready: false,
  cache: {
    str: {},
    cycle: {}
  }
});const tmpCycle = exports.tmpCycle = _core2.default.cache.cycle;