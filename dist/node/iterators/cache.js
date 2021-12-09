'use strict';
/* eslint-disable prefer-template, eqeqeq */

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

var _core = _interopRequireDefault(require("../core"));

var _compile = require("./compile");

var _cache = require("../consts/cache");

var _symbols = require("../consts/symbols");

var _env = require("../consts/env");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (_cache.LOCAL_CACHE) {
  if (_env.IS_BROWSER && _env.LOCAL_STORAGE_SUPPORT && document.readyState === 'loading') {
    try {
      const version = localStorage.getItem(_symbols.CACHE_VERSION_KEY),
            cache = localStorage.getItem(_symbols.CACHE_KEY);

      if (cache && version == _core.default.CACHE_VERSION) {
        _core.default.cache.str = JSON.parse(cache);
        let attrs = '';

        for (const key in _cache.localCacheAttrs) {
          if (!_cache.localCacheAttrs.hasOwnProperty(key)) {
            continue;
          }

          const val = _cache.localCacheAttrs[key];
          attrs += val != null ? ` ${key}=${val}` : ` ${key}`;
        }

        document.write(`<script type="text/javascript" ${attrs}>` + (0, _compile.returnCache)(_core.default.cache.str) + `${_symbols.NAMESPACE}.ready = true;` +
        /* eslint-disable-next-line */
        '<\/script>');
      } else {
        localStorage.removeItem(_symbols.CACHE_KEY);
        localStorage.removeItem(_symbols.CACHE_VERSION_KEY);
      }
    } catch {} finally {
      _core.default.ready = true;
    }
  } else if (_env.IS_NODE) {
    try {
      //#if isNode
      const cache = require(require('path').join(__dirname, 'collection.tmp.js'));

      if (cache['version'] === _core.default.CACHE_VERSION) {
        cache['exec']();
        _core.default.cache.str = cache['cache'];
      } //#endif

    } catch {} finally {
      _core.default.ready = true;
    }
  }
}