'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

exports.__esModule = true;
exports.CACHE_VERSION_KEY = exports.CACHE_KEY = exports.CACHE_VERSION = exports.ON_ERROR = exports.FN_LENGTH = exports.LENGTH_REQUEST = exports.NAMESPACE = undefined;

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

var _links = require('./links');

var _hacks = require('./hacks');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const NAMESPACE = exports.NAMESPACE = '__COLLECTION_NAMESPACE__https_github_com_kobezzza_Collection';
_links.GLOBAL[NAMESPACE] = _core2.default;

const LENGTH_REQUEST = exports.LENGTH_REQUEST = _hacks.SYMBOL_SUPPORT ? Symbol('Data length query') : '__COLLECTION_TMP__lengthQuery',
      FN_LENGTH = exports.FN_LENGTH = _hacks.SYMBOL_SUPPORT ? Symbol('Function length') : '__COLLECTION_TMP__length',
      ON_ERROR = exports.ON_ERROR = _hacks.SYMBOL_SUPPORT ? Symbol('Function length') : '__COLLECTION_TMP__onError';

const CACHE_VERSION = exports.CACHE_VERSION = 36,
      CACHE_KEY = exports.CACHE_KEY = '__COLLECTION_CACHE__',
      CACHE_VERSION_KEY = exports.CACHE_VERSION_KEY = '__COLLECTION_CACHE_VERSION__';