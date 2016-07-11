'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import { Collection } from '../core';

/**
 * Appends a filter to the operation
 *
 * @param {$$CollectionFilter} filter - filter or an array of filters
 * @return {!Collection}
 */
Collection.prototype.filter = function (filter) {
	this.p.filter = this.p.filter.concat(filter);
	return this;
};

/**
 * Marks the operation as thread
 *
 * @param {?string=} [opt_priority] - thread priority (low, normal, hight, critical)
 * @return {!Collection}
 */
Collection.prototype.thread = function (opt_priority) {
	this.p.thread = true;

	if (opt_priority) {
		this.p.priority = opt_priority;
	}

	return this;
};
