'use strict';
/* eslint-disable no-loop-func */

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

var _core = _interopRequireWildcard(require("../core"));

var _types = require("../helpers/types");

var _link = require("../helpers/link");

var _gcc = require("../helpers/gcc");

var _primitives = require("../consts/primitives");

var _env = require("../consts/env");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const simpleType = {
  'array': true,
  'object': true
};
const {
  create,
  defineProperty,
  getPrototypeOf,
  assign
} = Object;
/**
 * Extends the collection by another objects
 *
 * @param {(boolean|?$$Collection_extend)} deepOrParams - if true, then properties will be copied recursively
 *   OR additional parameters for extending:
 *
 *   * [withUndef = false] - if true, then the original value can be rewritten to undefined
 *   * [withDescriptor = false] - if true, then the descriptor of a property will be copied too
 *   * [withAccessors = false] - if true, then property accessors will be copied too, but not another descriptor properties;
 *   * [withProto = false] - if true, then properties will be copied with prototypes
 *   * [concatArray = false] - if true, then array properties will be concatenated (only if extending by an another array)
 *   * [concatFn = Array.prototype.concat] - function that will be concatenate arrays
 *   * [extendFilter] - function that will be filtering values for deep extending
 *   * [traits = false] - if true, then will be copied only new properties, or if -1, only old
 *   * [deep = false] - if true, then properties will be copied recursively
 *
 * @param {...Object} args - objects for extending
 * @return {(!Object|!Promise)}
 */

_core.Collection.prototype.extend = function (deepOrParams, args) {
  let p = (0, _gcc.any)(deepOrParams);

  if (p instanceof _core.P === false) {
    if ((0, _types.isBoolean)(p)) {
      p = {
        deep: p
      };
    } else {
      p = p || {};
    }

    this._initParams(p);

    p = (0, _gcc.any)(assign(Object.create(this.p), p));
  } else {
    p = (0, _gcc.any)(Object.create(p));

    this._initParams(p, false);
  }

  const withDescriptor = p.withDescriptor && !p.withAccessors;

  if (p.withAccessors) {
    p.withDescriptor = true;
  }

  if (p.withProto) {
    p.notOwn = true;
  }

  let {
    data
  } = this,
      {
    type
  } = p;

  if (!type || data === _primitives.EMPTY) {
    for (let i = 1; i < arguments.length; i++) {
      type = (0, _types.getType)(arguments[i], p.use);

      if (type) {
        break;
      }
    }

    switch (type) {
      case 'object':
        data = {};
        break;

      case 'weakMap':
        data = new WeakMap();
        break;

      case 'weakSet':
        data = new WeakSet();
        break;

      case 'map':
        data = new Map();
        break;

      case 'set':
        data = new Set();
        break;

      default:
        data = [];
    }
  }

  const dataIsSimple = simpleType[type];
  p.result = data;

  if (!p.deep && p.withUndef && p.mult && dataIsSimple && _env.OBJECT_ASSIGN_NATIVE_SUPPORT && !p.concatArray && !p.withProto && !p.withDescriptor && !p.withAccessors && !p.traits && !p.extendFilter && !p.filter.length && !p.async && !p.from && !p.count && !p.startIndex && !p.endIndex && !p.notOwn && !p.reverse) {
    const args = [];

    for (let i = 1; i < arguments.length; i++) {
      args.push(arguments[i]);
    }

    return assign(data, ...args);
  }

  let setVal;

  switch (type) {
    case 'weakMap':
    case 'map':
      setVal = (data, key, val) => {
        if (p.traits && data.has(key) !== (p.traits === -1)) {
          return;
        }

        data.set(key, val);
      };

      break;

    case 'weakSet':
    case 'set':
      setVal = (data, key, val) => {
        if (p.traits && data.has(val) !== (p.traits === -1)) {
          return;
        }

        data.add(val);
      };

      break;

    default:
      setVal = (data, key, val) => {
        if (p.traits && key in data !== (p.traits === -1)) {
          return;
        }

        if (p.withUndef || val !== undefined) {
          data[key] = val;
        }
      };

  }

  let promise = {
    then(cb) {
      cb();
      return this;
    }

  };

  if (p.async) {
    promise = Promise.resolve();
  }

  if (p.notOwn && !dataIsSimple) {
    p.notOwn = false;
  }

  for (let i = 1; i < arguments.length; i++) {
    const arg = arguments[i];

    if (!arg) {
      continue;
    }

    const isSimple = simpleType[(0, _types.getType)(arg)];
    promise = promise.then(() => (0, _core.default)(arg).forEach((el, key) => {
      if (key === '__proto__') {
        return;
      }

      if (dataIsSimple && isSimple && (withDescriptor || p.withAccessors && (el.get || el.set))) {
        if (p.traits && key in data !== (p.traits === -1)) {
          return;
        }

        if (p.withAccessors) {
          defineProperty(data, key, {
            get: el.get,
            set: el.set
          });
        } else if ('value' in el === false || el.value !== undefined || p.withUndef) {
          defineProperty(data, key, el);
        }

        return;
      }

      let src = (0, _link.byLink)(data, [key]);
      const val = isSimple ? arg[key] : el;

      if (data === val || val === arg) {
        return;
      }

      let canExtend = Boolean(val);

      if (canExtend && p.extendFilter) {
        canExtend = p.extendFilter(data, val, key);
      }

      let valIsArray, struct;

      if (canExtend) {
        valIsArray = (0, _types.isArray)(val);
        struct = valIsArray ? [] : (0, _types.getSameAs)(val);
      }

      if (p.deep && canExtend && (valIsArray || struct)) {
        const isExtProto = p.withProto && dataIsSimple && (0, _types.canExtendProto)(src);
        let srcIsArray = (0, _types.isArray)(src);

        if (isExtProto && !(data.hasOwnProperty ? data.hasOwnProperty(key) : _link.hasOwnProperty.call(data, key))) {
          src = srcIsArray ? src.slice() : create(src);
          (0, _link.byLink)(data, [key], {
            value: src
          });
        }

        let clone;

        if (valIsArray) {
          let isProto = false,
              construct;

          if (!srcIsArray && isExtProto && p.concatArray) {
            construct = getPrototypeOf(src);
            srcIsArray = isProto = construct && (0, _types.isArray)(construct);
          }

          if (srcIsArray) {
            if (p.concatArray) {
              const o = isProto ? construct : src;
              data[key] = p.concatFn ? p.concatFn(o, val, key) : o.concat(val);
              return;
            }

            clone = src;
          } else {
            clone = [];
          }
        } else {
          clone = (0, _types.isStructure)(src) ? src : struct || {};
        }

        const childExt = (0, _core.default)(clone).extend(p, val);

        if (p.async) {
          return childExt.then(value => (0, _link.byLink)(data, [key], {
            value
          }));
        }

        (0, _link.byLink)(data, [key], {
          value: childExt
        });
      } else {
        setVal(data, key, val);
      }
    }, p));
  }

  return p.async ? promise.then(() => data) : data;
};
/**
 * Clones an object
 *
 * @param {?} obj - source object
 * @return {?}
 */


_core.default.clone = function (obj) {
  return JSON.parse(JSON.stringify(obj));
};
/**
 * Extends the specified object by another objects
 *
 * @see Collection.prototype.extend
 * @param {(boolean|?$$Collection_extend)} deepOrParams - additional parameters
 * @param {Object} target - source object
 * @param {...Object} args - objects for extending
 * @return {(!Object|!Promise)}
 */


_core.default.extend = function (deepOrParams, target, args) {
  args = [deepOrParams];

  for (let i = 2; i < arguments.length; i++) {
    args.push(arguments[i]);
  }

  const obj = (0, _core.default)(target == null ? _primitives.EMPTY : target);
  return obj.extend.apply(obj, args);
};

Object.assign(_core.default, {
  extend: _core.default.extend,
  clone: _core.default.clone
});