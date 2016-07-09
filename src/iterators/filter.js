'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import './map';
import $C from '../core';

$C.prototype.filter = function (opt_filter, opt_params) {
	const p = opt_params || {};
	p.filter = opt_filter;
	delete p.inject;
	return this.map((el) => el, p);
};
