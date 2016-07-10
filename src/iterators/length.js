'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import { Collection } from '../core';
import { LENGTH_REQUEST } from '../consts/base';
import { any } from '../helpers/gcc';

Collection.prototype.length = function (opt_filter, opt_params) {
	const
		p = opt_params || {};

	p.filter = opt_filter;
	p.result = 0;

	const calc = () => p.result++;
	calc[LENGTH_REQUEST] = true;

	const
		returnVal = any(this.forEach(calc, p));

	if (calc[LENGTH_REQUEST] !== true) {
		p.result = calc[LENGTH_REQUEST];
		p.onComplete && p.onComplete(p.result);
	}

	if (returnVal !== this) {
		return returnVal;
	}

	return length;
};
