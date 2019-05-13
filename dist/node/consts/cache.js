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
exports.tmpCycle = void 0;

var _core = _interopRequireDefault(require("../core"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.assign(_core.default, {
  ready: false,
  cache: {
    str: {},
    cycle: {}
  }
});
const tmpCycle = _core.default.cache.cycle;
exports.tmpCycle = tmpCycle;