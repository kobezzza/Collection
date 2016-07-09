'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import $C from '../core';
import { isFunction, isArray } from '../helpers/types';

$C.prototype.includes = function (searchElement, opt_filter, opt_params) {
	const
		p = opt_params || {};

	if (isFunction(opt_filter) || isArray(opt_filter)) {
		p.filter = opt_filter;

	} else {
		p.startIndex = opt_filter;
	}

	p.filter = [
		Number.isNaN(searchElement) ?
			(el) => Number.isNaN(el) :
			(el) => el === searchElement

	].concat(p.filter || []);

	let res = false;
	p.mult = false;
	p.inject = res;

	const returnVal = this.forEach(
		() => {
			res = true;
			this.result = res;
		},

		p
	);

	if (returnVal !== this) {
		return returnVal;
	}

	return res;
};
