'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import $C from '../core';

$C.prototype.reduce = function (cb, opt_initialValue, opt_filter, opt_params) {
	const p = opt_params || {};
	p.filter = opt_filter;

	let res = opt_initialValue;
	function fn(el) {
		if (opt_initialValue == null) {
			res = el;
			opt_initialValue = true;

		} else {
			res = cb.apply(this, [res].concat([].slice.call(arguments)));
		}
	}

	fn['__COLLECTION_TMP__length'] = cb.length - 1;
	p.inject = res;

	const {onComplete} = p;
	p.onComplete = function () {
		onComplete && onComplete.call(this, res);
	};

	const
		returnVal = this.forEach(fn, p);

	if (returnVal !== this) {
		return returnVal;
	}

	return res;
};
