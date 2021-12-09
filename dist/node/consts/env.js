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
exports.SYMBOL_NATIVE_SUPPORT = exports.OBJECT_KEYS_NATIVE_SUPPORT = exports.OBJECT_ASSIGN_NATIVE_SUPPORT = exports.LOCAL_STORAGE_SUPPORT = exports.IS_NODE = exports.IS_BROWSER = exports.GLOBAL = exports.BLOB_SUPPORT = void 0;

var _gcc = require("../helpers/gcc");

var _types = require("../helpers/types");

const GLOBAL = new Function('return this')();
exports.GLOBAL = GLOBAL;

const IS_NODE = (() => {
  try {
    return typeof process === 'object' && {}.toString.call(process) === '[object process]';
  } catch {
    return false;
  }
})();

exports.IS_NODE = IS_NODE;

const IS_BROWSER = !IS_NODE && typeof window === 'object',
      BLOB_SUPPORT = IS_BROWSER && typeof Blob === 'function' && typeof URL === 'function',
      OBJECT_KEYS_NATIVE_SUPPORT = _types.isNative.test(Object.keys && (0, _gcc.any)(Object.keys).toString()),
      OBJECT_ASSIGN_NATIVE_SUPPORT = _types.isNative.test(Object.assign && (0, _gcc.any)(Object.assign).toString()),
      SYMBOL_NATIVE_SUPPORT = typeof Symbol === 'function' && _types.isNative.test(Symbol.toString());

exports.SYMBOL_NATIVE_SUPPORT = SYMBOL_NATIVE_SUPPORT;
exports.OBJECT_ASSIGN_NATIVE_SUPPORT = OBJECT_ASSIGN_NATIVE_SUPPORT;
exports.OBJECT_KEYS_NATIVE_SUPPORT = OBJECT_KEYS_NATIVE_SUPPORT;
exports.BLOB_SUPPORT = BLOB_SUPPORT;
exports.IS_BROWSER = IS_BROWSER;

const LOCAL_STORAGE_SUPPORT = !IS_NODE && (() => {
  const mod = String(Math.random());

  try {
    localStorage.setItem(mod, mod);
    localStorage.removeItem(mod);
    return true;
  } catch {
    return false;
  }
})();

exports.LOCAL_STORAGE_SUPPORT = LOCAL_STORAGE_SUPPORT;