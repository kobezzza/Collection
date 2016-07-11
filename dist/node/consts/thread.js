'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

exports.__esModule = true;
const maxPriority = exports.maxPriority = 40;
const priority = exports.priority = {
  'low': maxPriority / 8,
  'normal': maxPriority / 4,
  'hight': maxPriority / 2,
  'critical': maxPriority
};