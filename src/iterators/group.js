'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import $C from '../core';
import { GLOBAL } from '../consts/links';
import { isFunction } from '../helpers/types';

//#if link
import { byLink } from '../other/link';
//#endif

$C.prototype.group = function (field, opt_filter, opt_params) {
	const p = opt_params || {};
	p.filter = opt_filter;

	const
		isFunc = isFunction(field),
		res = p.useMap ? new GLOBAL['Map']() : {};

	let action;
	if (p.useMap) {
		action = function (el, key) {
			const
				param = isFunc ? field.apply(this, arguments) : byLink(el, field),
				val = p.saveKeys ? key : el;

			if (res.has(param)) {
				res.get(param).push(val);

			} else {
				res.set(param, [val]);
			}
		};

	} else {
		action = function (el, key) {
			const
				param = isFunc ? field.apply(this, arguments) : byLink(el, field),
				val = p.saveKeys ? key : el;

			if (res[param]) {
				res[param].push(val);

			} else {
				res[param] = [val];
			}
		};
	}

	if (isFunc) {
		action['__COLLECTION_TMP__length'] = action.length > field.length ? action.length : field.length;
	}

	p.mult = true;
	p.inject = res;

	const {onComplete} = p;
	p.onComplete = function () {
		onComplete && onComplete.call(this, res);
	};

	const returnVal = this.forEach(action, p);

	if (returnVal !== this) {
		return returnVal;
	}

	return res;
};
