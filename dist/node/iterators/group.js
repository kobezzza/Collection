'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

var _core = require('../core');

var _links = require('../consts/links');

var _base = require('../consts/base');

var _types = require('../helpers/types');

var _gcc = require('../helpers/gcc');

var _link = require('../other/link');

//#endif

/**
 * Groups elements in the collection by the specified condition and returns a new collection
 *
 * @see Collection.prototype.forEach
 * @param {($$CollectionLink|$$CollectionCb)=} [opt_field] - link for the group field or a function which returns the group field
 * @param {($$CollectionFilter|$$Collection_group)=} [opt_filter] - function filter or an array of functions
 * @param {?$$Collection_group=} [opt_params] - additional parameters:
 *
 *   *) [saveKeys = false] - if true, then will be saved keys, but not values
 *   *) [useMap = false] - if true, then for saving data will be used Map
 *
 * @return {(!Object|!Map|!Promise<(!Object|!Map)>)}
 */
_core.Collection.prototype.group = function (opt_field, opt_filter, opt_params) {
	const field = opt_field || (el => el);

	let p = opt_params || {};

	if (!(0, _types.isArray)(opt_filter) && !(0, _types.isFunction)(opt_filter)) {
		p = opt_filter || p;
		opt_filter = null;
	}

	this.filter(p && p.filter, (0, _gcc.any)(opt_filter));
	p = (0, _gcc.any)(Object.assign(Object.create(this.p), p, { mult: true }));

	const isFunc = (0, _types.isFunction)(field),
	      res = p.result = p.useMap ? new _links.GLOBAL['Map']() : {};

	let action;
	if (p.useMap) {
		action = function (el, key) {
			const param = isFunc ? field.apply(null, arguments) : (0, _link.byLink)(el, field),
			      val = p.saveKeys ? key : el;

			if (res.has(param)) {
				res.get(param).push(val);
			} else {
				res.set(param, [val]);
			}
		};
	} else {
		action = function (el, key) {
			const param = isFunc ? field.apply(null, arguments) : (0, _link.byLink)(el, field),
			      val = p.saveKeys ? key : el;

			if (res[param]) {
				res[param].push(val);
			} else {
				res[param] = [val];
			}
		};
	}

	if (isFunc) {
		action[_base.FN_LENGTH] = action.length > field.length ? action.length : field.length;
	}

	const returnVal = (0, _gcc.any)(this.forEach((0, _gcc.any)(action), p));

	if (returnVal !== this) {
		return returnVal;
	}

	return p.result;
};

//#if link