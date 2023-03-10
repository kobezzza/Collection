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
exports.Collection = Collection;
exports.P = P;
exports.default = $C;

var _gcc = require("./helpers/gcc");

var _types = require("./helpers/types");

/**
 * Collection constructor
 *
 * @constructor
 * @implements {$$Collection}
 * @param {$$CollectionType} obj
 */
function Collection(obj) {
  this._init();

  if ((0, _types.isString)(obj)) {
    this.data = obj.split('');
  } else if ((0, _types.isNumber)(obj)) {
    let i = isFinite(obj) ? Math.abs(obj) : false,
        done = false,
        value;
    this.p.use = 'for of';
    this.data = {
      next: () => {
        done = i === false ? done : done || !i--;
        return {
          done,
          value
        };
      },

      throw(err) {
        throw err;
      },

      return: v => {
        done = true;
        value = v;
      }
    };
  } else {
    this.data = (0, _types.isObjectInstance)(obj) ? (0, _gcc.any)(obj) : [];
  }
}
/**
 * @private
 * @return {!Object}
 */


Collection.prototype._init = function () {
  const old = this.p;
  this.p = new P();
  return old;
};
/** @constructor */


function P() {
  Object.assign(this, {
    mult: true,
    count: false,
    from: false,
    startIndex: false,
    endIndex: false,
    reverse: false,
    inverseFilter: false,
    withDescriptor: false,
    notOwn: false,
    live: false,
    async: false,
    thread: false,
    length: true,
    parallel: false,
    race: false,
    filter: []
  }, $C.config);
}

Object.assign($C, {
  config: {}
});
/**
 * Library version
 * @const
 */

$C.VERSION = [6, 8, 1];
/**
 * Cache version
 * @const
 */

$C.CACHE_VERSION = 66;
/**
 * Creates an instance of Collection
 * @param {$$CollectionType} obj
 */

function $C(obj) {
  return new Collection(obj);
}