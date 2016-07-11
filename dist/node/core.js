'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

exports.__esModule = true;
exports.Collection = Collection;
exports.default = $C;

var _gcc = require('./helpers/gcc');

var _types = require('./helpers/types');

/**
 * Collection constructor
 *
 * @constructor
 * @implements {$$Collection}
 * @param {$$CollectionType} obj
 */
function Collection(obj) {
  this.data = (0, _gcc.any)((0, _types.isString)(obj) ? obj.split('') : obj);
  this.p = this._init();
}

/**
 * @private
 * @return {!Object}
 */
Collection.prototype._init = function () {
  return Object.assign({
    mult: true,
    count: false,
    from: false,
    startIndex: false,
    endIndex: false,
    reverse: false,
    inverseFilter: false,
    notOwn: false,
    live: false,
    thread: false,
    priority: 'normal',
    length: true,
    filter: []
  }, $C.config);
};

Object.assign($C, { config: {} });

/**
 * Library version
 * @const
 */
Collection.prototype.VERSION = [6, 0, 0, 'beta.1'];

/**
 * Creates an instance of Collection
 * @param {$$CollectionType} obj
 */
function $C(obj) {
  return new Collection(obj);
}