'use strict';
/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

var _core = require("../core");

var _types = require("../helpers/types");

var _gcc = require("../helpers/gcc");

/**
 * Returns true if the specified element contains in the collection
 *
 * @see Collection.prototype.forEach
 * @param {?} searchElement - element for search
 * @param {($$CollectionFilter|$$CollectionSingleBase)=} [opt_filter] - function filter or an array of functions
 * @param {?$$CollectionSingleBase=} [opt_params] - additional parameters
 * @return {(boolean|!Promise<boolean>)}
 */
_core.Collection.prototype.includes = function (searchElement, opt_filter, opt_params) {
  let p = opt_params || {};

  if (!(0, _types.isArray)(opt_filter) && !(0, _types.isFunction)(opt_filter)) {
    p = opt_filter || p;
    opt_filter = null;
  }

  const f = Number.isNaN(searchElement) ? el => Number.isNaN(el) : el => el === searchElement;

  this._initParams(p, [].concat(opt_filter || [], f));

  p = (0, _gcc.any)(Object.assign(Object.create(this.p), p, {
    mult: false,
    result: false
  }));
  const returnVal = (0, _gcc.any)(this.forEach(() => p.result = true, p));

  if (returnVal !== this) {
    return returnVal;
  }

  return p.result;
};