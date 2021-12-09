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
exports.byLink = byLink;
exports.splice = exports.slice = exports.hasOwnProperty = void 0;

var _core = _interopRequireWildcard(require("../core"));

var _types = require("./types");

var _gcc = require("./gcc");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const slice = [].slice,
      splice = [].splice,
      hasOwnProperty = {}.hasOwnProperty;
/**
 * Sets a value as an object property by the specified link or returns/deletes the property.
 * At changing or deleting the property returns an object:
 *
 * ```js
 * ({
 *   result: boolean,
 *   key,
 *   value
 * })
 * ```
 *
 * @param {?} obj
 * @param {$$CollectionLink} link - source link:
 *   STRING-LINK:
 *   a.foo.bar ~ obj['foo']['bar']
 *
 *   ARRAY-LINK:
 *   [{}, 1, null] ~ obj[{}][1][null]
 *
 * @param {$$Collection_byLink=} [opt_params] - additional parameters:
 *
 *   [value] - value to set
 *   [delete = delete] - if true, then the property will be deleted
 *   [create = false] - if true, then the property will be created if it's not defined
 *   [test = false] - if is true, then will be returned false if the property is not defined
 *   [error = false] - if is true, then will be thrown an exception if the property is not defined
 *
 * @return {({result: boolean, key, value, notFound: (boolean|undefined)}|?)}
 */

exports.hasOwnProperty = hasOwnProperty;
exports.splice = splice;
exports.slice = slice;

function byLink(obj, link, opt_params) {
  const p = opt_params || {};
  const linkList = (0, _types.isString)(link) ? (0, _gcc.any)(link).split('.') : [].concat(link),
        length = linkList.length,
        last = length - 1;
  let pre, preKey;

  for (let i = -1; ++i < length;) {
    const el = linkList[i];

    if (obj == null) {
      if (p.test) {
        return false;
      }

      if (p.error) {
        throw new ReferenceError(`"${el}" is not defined`);
      }

      if (p.delete) {
        return {
          notFound: true,
          result: false,
          key: undefined,
          value: undefined
        };
      }

      return;
    }

    const isTest = i === last && p.test;

    if (isTest) {
      pre = obj;
      preKey = el;
    }

    const objIsMap = (0, _types.isMap)(obj),
          objIsSet = (0, _types.isSet)(obj);
    const isAMap = objIsMap || (0, _types.isWeakMap)(obj),
          isASet = objIsSet || (0, _types.isWeakSet)(obj); // Set or delete

    if (!isTest && i === last && (p.delete || 'value' in p)) {
      const cache = {
        key: isASet ? null : el,
        result: isAMap || isASet ? obj.has(el) : el in obj,
        value: isAMap ? obj.get(el) : isASet ? el : obj[el]
      };

      if ('value' in p) {
        cache.newValue = p.value;
      }

      if (p.delete) {
        if (cache.result) {
          if (isAMap || isASet) {
            obj.delete(el);
            cache.result = !obj.has(el);
          } else {
            if ((0, _types.isLikeArray)(obj) && !isNaN(Number(el))) {
              cache.key = Number(cache.key);

              if ((0, _types.isArray)(obj)) {
                obj.splice(el, 1);
              } else {
                splice.call(obj, el, 1);
              }
            } else {
              cache.key = String(cache.key);
              delete obj[el];
            }

            cache.result = el in obj === false || obj[el] !== cache.value;
          }
        }
      } else {
        if (isAMap) {
          if (obj.get(el) !== p.value) {
            obj.set(el, p.value);
            cache.result = obj.get(el) === p.value;
          } else {
            cache.result = false;
          }
        } else if (isASet) {
          const has = obj.has(el);
          cache.result = false;
          cache.value = has ? el : undefined;

          if (!obj.has(p.value)) {
            if (has) {
              obj.delete(el);
            }

            obj.add(p.value);
            cache.result = obj.has(p.value);
          }
        } else {
          if ((0, _types.isLikeArray)(obj) && !isNaN(Number(cache.key))) {
            cache.key = Number(cache.key);
          } else {
            cache.key = String(cache.key);
          }

          if (obj[el] !== p.value) {
            obj[el] = p.value;
            cache.result = obj[el] === p.value;
          } else {
            cache.result = false;
          }
        }
      }

      return cache;
    }

    if (isAMap) {
      obj = obj.get(el);
    } else if (isASet) {
      if (obj.has(el)) {
        obj = el;
      } else {
        obj = undefined;
      }
    } else {
      if (p.create && obj[el] === undefined) {
        obj[el] = {};
      }

      obj = obj[el];
    }
  }

  if (p.test) {
    if ((0, _types.isMap)(pre) || (0, _types.isWeakMap)(pre) || (0, _types.isSet)(pre) || (0, _types.isWeakSet)(pre)) {
      return pre.has(preKey);
    }

    return preKey in pre;
  }

  return obj;
}
/**
 * Returns true if the passed object contains a property by the specified link
 *
 * @see byLink
 * @param {$$CollectionLink} link - source link
 * @param {!Object} obj - source object
 * @return {boolean}
 */


_core.default.in = function (link, obj) {
  return byLink(obj, link, {
    test: true
  });
};

Object.assign(_core.default, {
  in: _core.default.in
});
/**
 * Returns true if the collection contains a property by the specified link
 *
 * @see byLink
 * @param {$$CollectionLink} link - source link
 * @return {boolean}
 */

_core.Collection.prototype.in = function (link) {
  return byLink(this.data, link, {
    test: true
  });
};