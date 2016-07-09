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
import './iterators/length';
import './iterators/map';
import './iterators/get';

//#if iterators.thread
import './iterators/thread';
//#endif
