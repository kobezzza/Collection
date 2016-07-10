'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import $C from '../core';

$C.prototype.filter = function (filter) {
	this.p.filter = this.p.filter.concat(filter);
	return this;
};
