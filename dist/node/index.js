'use strict';

/* eslint-disable no-useless-rename */

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

exports.__esModule = true;
exports.default = undefined;

var _core = require('./core');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_core).default;
  }
});

require('./iterators/cache');

require('./iterators/forEach');

require('./iterators/helpers');

require('./other/object');

require('./iterators/map');

require('./iterators/get');

require('./iterators/reduce');

require('./iterators/every');

require('./iterators/some');

require('./iterators/search');

require('./iterators/includes');

require('./iterators/group');

require('./iterators/remove');

require('./iterators/set');

require('./iterators/thread');

//#endif

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//#if static.object

//#endif

//#if iterators.map

//#endif

//#if iterators.get

//#endif

//#if iterators.reduce

//#endif

//#if iterators.every

//#endif

//#if iterators.some

//#endif

//#if iterators.search

//#endif

//#if iterators.includes

//#endif

//#if iterators.group

//#endif

//#if iterators.remove

//#endif

//#if iterators.set

//#endif

//#if iterators.thread