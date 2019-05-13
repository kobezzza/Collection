'use strict';
/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

exports.__esModule = true;
exports.CACHE_VERSION_KEY = exports.CACHE_KEY = exports.CACHE_VERSION = exports.FN_LENGTH = exports.LENGTH_REQUEST = exports.NAMESPACE = void 0;

var _core = _interopRequireDefault(require("../core"));

var _links = require("./links");

var _hacks = require("./hacks");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const NAMESPACE = '__COLLECTION_NAMESPACE__https_github_com_kobezzza_Collection';
exports.NAMESPACE = NAMESPACE;
_links.GLOBAL[NAMESPACE] = _core.default;
const LENGTH_REQUEST = _hacks.SYMBOL_NATIVE_SUPPORT ? Symbol('Data length query') : '__COLLECTION_TMP__lengthQuery',
      FN_LENGTH = _hacks.SYMBOL_NATIVE_SUPPORT ? Symbol('Function length') : '__COLLECTION_TMP__length';
exports.FN_LENGTH = FN_LENGTH;
exports.LENGTH_REQUEST = LENGTH_REQUEST;
const CACHE_VERSION = 59,
      CACHE_KEY = '__COLLECTION_CACHE__',
      CACHE_VERSION_KEY = '__COLLECTION_CACHE_VERSION__';
exports.CACHE_VERSION_KEY = CACHE_VERSION_KEY;
exports.CACHE_KEY = CACHE_KEY;
exports.CACHE_VERSION = CACHE_VERSION;