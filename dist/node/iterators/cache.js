'use strict';

/* eslint-disable prefer-template, eqeqeq */

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

var _compile = require('./compile');

var _links = require('../consts/links');

var _base = require('../consts/base');

var _hacks = require('../consts/hacks');

require('../consts/cache');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (_links.GLOBAL['COLLECTION_LOCAL_CACHE'] !== false) {
	if (_hacks.IS_BROWSER && _hacks.LOCAL_STORAGE_SUPPORT) {
		try {
			if (document.readyState === 'loading') {
				const version = localStorage.getItem(_base.CACHE_VERSION_KEY),
				      cache = localStorage.getItem(_base.CACHE_KEY);

				if (cache && version == _base.CACHE_VERSION) {
					_core2.default.cache.str = JSON.parse(cache);
					document.write('<script type="text/javascript">' + (0, _compile.returnCache)(_core2.default.cache.str) + `${ _base.NAMESPACE }.ready = true;` + '</script>');
				} else {
					localStorage.removeItem(_base.CACHE_KEY);
					localStorage.removeItem(_base.CACHE_VERSION_KEY);
					_core2.default.ready = true;
				}
			}
		} catch (ignore) {}
	} else if (_hacks.IS_NODE) {
		try {
			const cache = require(require('path').join(__dirname, 'collection.tmp.js'));

			if (cache['version'] === _base.CACHE_VERSION) {
				cache['exec']();
				_core2.default.cache.str = cache['cache'];
			}
		} catch (ignore) {} finally {
			_core2.default.ready = true;
		}
	}
}