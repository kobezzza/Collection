'use strict';

/* eslint-disable no-useless-rename */

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

export { default as default } from './core';

import './iterators/forEach';
import './iterators/map';
import './iterators/filter';
import './iterators/get';
import './iterators/reduce';
import './iterators/every';
import './iterators/some';
import './iterators/search';
import './iterators/includes';
import './iterators/group';
import './iterators/remove';
import './iterators/set';

//#if iterators.thread
import './iterators/thread';
//#endif
