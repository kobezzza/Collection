'use strict';

/* eslint-disable no-useless-rename */

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

module.exports = require('./core').default;

require('./iterators/cache');
require('./iterators/forEach');
require('./iterators/filter');
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