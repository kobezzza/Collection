'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import $C from '../core';
import { isSet, isMap } from '../helpers/types';

$C.prototype.search = function (opt_filter, opt_params) {
	const p = opt_params || {};
	p.filter = opt_filter;

	const
		{data} = this;

	const
		dataIsSet = isSet(data),
		size = dataIsSet ? data.size : 0;

	let
		action,
		res = [];

	if (dataIsSet) {
		if (p.reverse) {
			action = (el, key, data, o) => res.push(size - o.i - 1);

		} else {
			action = (el, key, data, o) => res.push(o.i);
		}

	} else {
		action = (el, key) => res.push(key);
	}

	p.inject = res;

	const {onComplete} = p;
	p.onComplete = function () {
		if (p.mult === false) {
			if (0 in res) {
				res = isMap(data) ? {value: res[0]} : res[0];

			} else {
				res = null;
			}
		}

		onComplete && onComplete.call(this, res);
	};

	const
		returnVal = this.forEach(action, p);

	if (returnVal !== this) {
		return returnVal;
	}

	return res;
};
