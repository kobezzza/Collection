'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

/** @type {(function($$CollectionType): $$Collection)} */
module.exports = exports = require('./dist/collection.node.min');
exports.default = exports;

/** @type {function(?): ?} */
exports.clone;

/** @type {function((boolean|?$$Collection_extend), Object, ...Object): !Object} */
exports.extend;
