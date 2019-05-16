'use strict';
/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

/**
 * Returns a random number in the specified diapason
 *
 * @param {number} min - minimum
 * @param {number} max - maximum
 * @return {number}
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRandomInt = getRandomInt;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}