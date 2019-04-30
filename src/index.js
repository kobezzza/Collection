'use strict';

/* eslint-disable no-useless-rename */

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import $C from './core';
export default $C;

import { IS_NODE } from './consts/hacks';

if (IS_NODE) {
	module.exports = exports = $C;
	exports.default = $C;
}

import './iterators/cache';
import './iterators/for-each';
import './iterators/helpers';

//#if iterators/extend
import './iterators/extend';
//#endif

//#if iterators/map
import './iterators/map';
//#endif

//#if iterators/get
import './iterators/get';
//#endif

//#if iterators/reduce
import './iterators/reduce';
//#endif

//#if iterators/every
import './iterators/every';
//#endif

//#if iterators/some
import './iterators/some';
//#endif

//#if iterators/search
import './iterators/search';
//#endif

//#if iterators/includes
import './iterators/includes';
//#endif

//#if iterators/group
import './iterators/group';
//#endif

//#if iterators/remove
import './iterators/remove';
//#endif

//#if iterators/set
import './iterators/set';
//#endif

//#if iterators/async
//#if iterators/thread
import './iterators/thread';
//#endif
//#endif
