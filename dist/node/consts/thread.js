'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

exports.__esModule = true;
const MAX_PRIORITY = exports.MAX_PRIORITY = 40;

const PRIORITY = exports.PRIORITY = {
  'low': MAX_PRIORITY / 8,
  'normal': MAX_PRIORITY / 4,
  'hight': MAX_PRIORITY / 2,
  'critical': MAX_PRIORITY
};