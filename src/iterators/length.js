'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import $C from '../core';

$C.prototype.length = function (opt_filter, opt_params) {
	const p = opt_params || {};
	p.filter = opt_filter;

	let length = 0;
	const calc = () => {
		length++;
		this.result = length;
	};

	p.inject = length;
	calc['__COLLECTION_TMP__lengthQuery'] = true;

	/** @type {?} */
	const returnVal = this.forEach(calc, p);

	if (calc['__COLLECTION_TMP__lengthQuery'] !== true) {
		this.result = length = calc['__COLLECTION_TMP__lengthQuery'];
		p.onComplete && p.onComplete.call(this, length);
	}

	if (returnVal !== this) {
		return returnVal;
	}

	return length;
};
