'use strict';
/* eslint-disable prefer-const */

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
exports.localCacheAttrs = exports.compiledCycles = exports.LOCAL_CACHE = void 0;

var _core = _interopRequireDefault(require("../core"));

var _env = require("./env");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.assign(_core.default, {
  ready: false,
  cache: {
    str: {},
    cycle: {}
  }
});
const LOCAL_CACHE = _env.GLOBAL['COLLECTION_LOCAL_CACHE'] !== false;
exports.LOCAL_CACHE = LOCAL_CACHE;
const compiledCycles = _core.default.cache.cycle,
      localCacheAttrs = _env.GLOBAL['COLLECTION_LOCAL_CACHE_ATTRS'] || {};
exports.localCacheAttrs = localCacheAttrs;
exports.compiledCycles = compiledCycles;