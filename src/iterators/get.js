'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import { Collection } from '../core';
import { isLink } from '../helpers/link';
import { isFunction, isArray } from '../helpers/types';

//#if link
import { byLink } from '../other/link';
//#endif

Collection.prototype.get = function (opt_filter, opt_params) {
	const p = opt_params || {};

	/* eslint-disable no-constant-condition */

	if (isLink(opt_filter) || !isFunction(opt_filter) && (isArray(opt_filter) && !isFunction(opt_filter[1]) || true)) {
		const tmp = byLink(this.data, opt_filter);
		p.onComplete && p.onComplete.call(this, tmp);
		return tmp;
	}

	/* eslint-enable no-constant-condition */

	let res = [];

	p.inject = res;
	p.filter = opt_filter;

	const {onComplete} = p;
	p.onComplete = function () {
		if (p.mult === false) {
			res = res[0];
		}

		onComplete && onComplete.call(this, res);
	};

	const
		returnVal = this.forEach((el) => res.push(el), p);

	if (returnVal !== this) {
		return returnVal;
	}

	return res;
};
