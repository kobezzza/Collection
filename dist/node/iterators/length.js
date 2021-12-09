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

var _symbols = require("../consts/symbols");

/**
 * Returns the number of elements in the collection by the specified parameters
 *
 * @see Collection.prototype.forEach
 * @param {($$CollectionFilter|$$CollectionSingleBase)=} [opt_filter] - function filter or an array of functions
 * @param {?$$CollectionSingleBase=} [opt_params] - additional parameters
 * @return {(number|!Promise<number>)}
 */
_core.Collection.prototype.length = function (opt_filter, opt_params) {
  let p = opt_params || {};

  if (!(0, _types.isArray)(opt_filter) && !(0, _types.isFunction)(opt_filter)) {
    p = opt_filter || p;
    opt_filter = null;
  }

  this._initParams(p, opt_filter);

  p = (0, _gcc.any)(Object.assign(Object.create(this.p), p, {
    result: 0
  }));

  const calc = () => p.result++;

  calc[_symbols.LENGTH_REQUEST] = true;
  const returnVal = (0, _gcc.any)(this.forEach(calc, p));

  if (calc[_symbols.LENGTH_REQUEST] !== true) {
    p.result = calc[_symbols.LENGTH_REQUEST];
    p.onComplete && p.onComplete(p.result);
  }

  if (returnVal !== this) {
    return returnVal;
  }

  return p.result;
};