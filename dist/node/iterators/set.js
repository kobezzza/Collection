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

var _symbols = require("../consts/symbols");

/**
 * Sets a new value for collection elements by the specified condition/link
 *
 * @see Collection.prototype.forEach
 * @param {(?|$$CollectionCb)} value - new value (function will execute)
 * @param {($$CollectionFilter|$$Collection_set|$$CollectionLink)=} filter - link, function filter or an array of functions
 * @param {?$$Collection_set=} [opt_params] - additional parameters:
 *
 *   * [key] - key (null for array.push) of a new element (if search elements nof found)
 *   * [create = true] - if false, in the absence of the requested property will be thrown an exception, otherwise it will be created
 *
 * @return {($$CollectionSetReport|!Promise<$$CollectionSetReport>)}
 */
_core.Collection.prototype.set = function (value, filter, opt_params) {
  let p = opt_params || {};
  const {
    data
  } = this;

  if (!(0, _types.isFunction)(filter) && ((0, _types.isArray)(filter) && !(0, _types.isFunction)(filter[1]) || filter != null && typeof filter !== 'object')) {
    return (0, _link.byLink)(data, filter, {
      value,
      create: p.create !== false,
      error: true
    });
  }

  if (!(0, _types.isArray)(filter) && !(0, _types.isFunction)(filter)) {
    p = filter || p;
    filter = null;
  }

  this._initParams(p, filter);

  p = (0, _gcc.any)(Object.assign(Object.create(this.p), p));
  const valIsFunc = (0, _types.isFunction)(value);

  if (_types.iterators[p.type]) {
    throw new TypeError('Incorrect data type');
  }

  const mult = p.mult !== false,
        report = [];

  if (mult) {
    p.result = report;
  } else {
    p.result = {
      notFound: true,
      result: false,
      key: undefined,
      value: undefined
    };
  }

  let fn;

  if (valIsFunc) {
    switch (p.type) {
      case 'map':
        fn = function (el, key, data) {
          const res = value.apply(null, arguments); //#if iterators/async

          if (p.async && (0, _types.isPromise)(res)) {
            return res.then(res => {
              let status = false;

              if (data.get(key) !== res) {
                data.set(key, res);
                status = data.get(key) === res;
              }

              const o = {
                key,
                value: el,
                newValue: res,
                result: status
              };

              if (mult) {
                report.push(o);
              } else {
                p.result = o;
              }
            });
          } //#endif


          let status = false;

          if (data.get(key) !== res) {
            data.set(key, res);
            status = data.get(key) === res;
          }

          const o = {
            key,
            value: el,
            newValue: res,
            result: status
          };

          if (mult) {
            report.push(o);
          } else {
            p.result = o;
          }
        };

        break;

      case 'set':
        fn = function (el, key, data) {
          const res = value.apply(null, arguments); //#if iterators/async

          if (p.async && (0, _types.isPromise)(res)) {
            return res.then(res => {
              let status = false;
              data.delete(el);

              if (!data.has(res)) {
                data.add(res);
                status = data.has(res);
              }

              const o = {
                key: null,
                value: el,
                newValue: res,
                result: status
              };

              if (mult) {
                report.push(o);
              } else {
                p.result = o;
              }
            });
          } //#endif


          let status = false;
          data.delete(el);

          if (!data.has(res)) {
            data.add(res);
            status = data.has(res);
          }

          const o = {
            key: null,
            value: el,
            newValue: res,
            result: status
          };

          if (mult) {
            report.push(o);
          } else {
            p.result = o;
          }
        };

        break;

      default:
        fn = function (el, key, data) {
          const res = value.apply(null, arguments); //#if iterators/async

          if (p.async && (0, _types.isPromise)(res)) {
            return res.then(res => {
              let status = false;

              if (data[key] !== res) {
                data[key] = res;
                status = data[key] === res;
              }

              const o = {
                key,
                value: el,
                newValue: res,
                result: status
              };

              if (mult) {
                report.push(o);
              } else {
                p.result = o;
              }
            });
          } //#endif


          let status = false;

          if (data[key] !== res) {
            data[key] = res;
            status = data[key] === res;
          }

          const o = {
            key,
            value: el,
            newValue: res,
            result: status
          };

          if (mult) {
            report.push(o);
          } else {
            p.result = o;
          }
        };

    }

    fn[_symbols.FN_LENGTH] = fn.length > value.length ? fn.length : value.length;
  } else {
    switch (p.type) {
      case 'map':
        fn = (el, key, data) => {
          let result = false;

          if (data.get(key) !== value) {
            data.set(key, value);
            result = data.get(key) === value;
          }

          const o = {
            key,
            value: el,
            newValue: value,
            result
          };

          if (mult) {
            report.push(o);
          } else {
            p.result = o;
          }
        };

        break;

      case 'set':
        fn = (el, key, data) => {
          let result = false;
          data.delete(el);

          if (!data.has(value)) {
            data.add(value);
            result = data.has(value);
          }

          const o = {
            key: null,
            value: el,
            newValue: value,
            result
          };

          if (mult) {
            report.push(o);
          } else {
            p.result = o;
          }
        };

        break;

      default:
        fn = (el, key, data) => {
          let result = false;

          if (data[key] !== value) {
            data[key] = value;
            result = data[key] === value;
          }

          const o = {
            key,
            value: el,
            newValue: value,
            result
          };

          if (mult) {
            report.push(o);
          } else {
            p.result = o;
          }
        };

    }
  }

  const {
    onIterationEnd
  } = p;

  p.onIterationEnd = ctx => {
    if ((mult ? !p.result.length : p.result.notFound) && p.create !== false && 'key' in p) {
      if ((0, _types.isArray)(data) && !p.key && p.key !== 0) {
        p.key = data.length;
      }

      const newVal = valIsFunc ? value(undefined, undefined, data, ctx) : value;

      const create = newVal => {
        const res = (0, _link.byLink)(data, p.key, {
          value: newVal,
          create: true
        });

        if (mult) {
          p.result.push(res);
        } else {
          p.result = res;
        }
      }; //#if iterators/async


      if (valIsFunc && p.async && (0, _types.isPromise)(newVal)) {
        return newVal.then(create);
      } //#endif


      create(newVal);
    }

    onIterationEnd && onIterationEnd(ctx);
  };

  const returnVal = (0, _gcc.any)(this.forEach((0, _gcc.any)(fn), p));

  if (returnVal !== this) {
    return returnVal;
  }

  return p.result;
};