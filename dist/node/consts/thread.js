'use strict';
/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.priorities = exports.MAX_PRIORITY = void 0;
const MAX_PRIORITY = 40;
exports.MAX_PRIORITY = MAX_PRIORITY;
const priorities = {
  'low': MAX_PRIORITY / 8,
  'normal': MAX_PRIORITY / 4,
  'hight': MAX_PRIORITY / 2,
  'critical': MAX_PRIORITY
};
exports.priorities = priorities;