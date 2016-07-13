'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

module.exports = require('./dist/node/core').default;
require('./dist/node/iterators/cache');
require('./dist/node/iterators/forEach');
require('./dist/node/iterators/helpers');
require('./dist/node/other/object');
require('./dist/node/iterators/map');
require('./dist/node/iterators/get');
require('./dist/node/iterators/reduce');
require('./dist/node/iterators/every');
require('./dist/node/iterators/some');
require('./dist/node/iterators/search');
require('./dist/node/iterators/includes');
require('./dist/node/iterators/group');
require('./dist/node/iterators/remove');
require('./dist/node/iterators/set');
require('./dist/node/iterators/thread');

