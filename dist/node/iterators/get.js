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

var _link = require("../helpers/link");

var _gcc = require("../helpers/gcc");

/**
 * Searches elements in a collection by the specified condition/link.
 * The method returns an array of found elements or an element (if mult = false)
 *
 * @see Collection.prototype.forEach
 * @param {($$CollectionFilter|$$CollectionBase|$$CollectionLink)=} [opt_filter] - link, function filter or an array of functions
 * @param {?$$CollectionBase=} [opt_params] - additional parameters
 * @return {(?|!Array|!Promise<(?|!Array)>)}
 */
_core.Collection.prototype.get = function (opt_filter, opt_params) {
  let p = opt_params || {};

  if (!(0, _types.isFunction)(opt_filter) && ((0, _types.isArray)(opt_filter) && !(0, _types.isFunction)(opt_filter[1]) || opt_filter != null && typeof opt_filter !== 'object')) {
    return (0, _link.byLink)(this.data, (0, _gcc.any)(opt_filter));
  }

  if (!(0, _types.isArray)(opt_filter) && !(0, _types.isFunction)(opt_filter)) {
    p = opt_filter || p;
    opt_filter = null;
  }

  this._initParams(p, opt_filter);

  p = (0, _gcc.any)(Object.assign(Object.create(this.p), p));
  let fn;

  if (p.mult !== false) {
    const res = p.result = [];

    fn = el => res.push(el);
  } else {
    fn = el => p.result = el;
  }

  const returnVal = (0, _gcc.any)(this.forEach((0, _gcc.any)(fn), p));

  if (returnVal !== this) {
    return returnVal;
  }

  return p.result;
};