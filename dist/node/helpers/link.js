'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

exports.__esModule = true;
exports.Link = Link;
exports.isLink = isLink;

var _types = require('./types');

/**
 * Collection context link
 *
 * @constructor
 * @param {$$CollectionLink} link - source link
 */
function Link(link) {
  this.link = (0, _types.isArray)(link) ? [link] : link;
}

/**
 * Returns a context link value
 * @return {?}
 */
Link.prototype.valueOf = function () {
  return this.link;
};

/**
 * Returns true if the specified object is a Link instance
 *
 * @param {?} obj - source object
 * @return {boolean}
 */
function isLink(obj) {
  return obj instanceof Link;
}