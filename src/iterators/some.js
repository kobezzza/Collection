'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import $C from '../core';

$C.prototype.some = function (opt_filter, opt_params) {
	const
		p = opt_params || {};

	let res = true;
	p.filter = opt_filter;
	p.mult = false;
	p.inject = res;

	/** @type {?} */
	const returnVal = this.forEach(
		() => {
			res = false;
			this.result = res;
		},

		p
	);

	if (returnVal !== this) {
		return returnVal;
	}

	return res;
};
