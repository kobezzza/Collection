'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import { Collection } from '../core';
import { isFunction, isNumber, getType, asyncTypes } from '../helpers/types';
import { any } from '../helpers/gcc';

/**
 * Appends a filter to the operation
 *
 * @param {...($$CollectionFilter|Array<$$CollectionFilter>|undefined)} filters - function filter
 * @return {!Collection}
 */
Collection.prototype.filter = function (filters) {
	let args = [];
	for (let i = 0; i < arguments.length; i++) {
		const
			el = arguments[i];

		if (el) {
			args = args.concat(el);
		}
	}

	this.p.filter = this.p.filter.concat.apply(this.p.filter, args);
	return this;
};

/**
 * Appends a filter to the operation
 *
 * @private
 * @param {...?} filters - function filter
 * @return {!Collection}
 */
Collection.prototype._filter = function (filters) {
	let args = [];
	for (let i = 0; i < arguments.length; i++) {
		let
			el = arguments[i];

		if (i === 0) {
			if (!el || !el.filter) {
				continue;
			}

			el = [el.filter, delete el.filter][0];
		}

		if (el) {
			args = args.concat(el);
		}
	}

	this.p.filter = this.p.filter.concat.apply(this.p.filter, args);
	return this;
};

/**
 * @private
 * @param {?} p
 * @return {!Collection}
 */
Collection.prototype._isAsync = function (p) {
	if (p.thread == null && (p.priority || p.onChunk)) {
		p.thread = true;
	}

	if (
		p.async == null && (
			p.thread ||
			p.use === 'async for of' ||
			p.parallel != null && p.parallel !== false ||
			p.race != null && p.race !== false
		) ||

		asyncTypes[getType(this.data)] ||
		p.initial && getType(p.initial) === 'stream'

	) {
		this.async = true;
	}

	return this;
};

//#if iterators.async
//#if iterators.thread

/**
 * Marks the operation as thread
 *
 * @param {(?string|$$CollectionThreadCb)=} [opt_priority] - thread priority (low, normal, hight, critical)
 * @param {?$$CollectionThreadCb=} [opt_onChunk] - callback function for chunks
 * @return {!Collection}
 */
Collection.prototype.thread = function (opt_priority, opt_onChunk) {
	if (isFunction(opt_priority)) {
		opt_onChunk = any(opt_priority);
		opt_priority = null;
	}

	this.p.thread = true;

	if (opt_priority) {
		this.p.priority = opt_priority;
	}

	if (opt_onChunk) {
		this.p.onChunk = opt_onChunk;
	}

	return this;
};

//#endif
//#endif

/**
 * Sets .startIndex for the operation
 *
 * @param {number} value - source value
 * @return {!Collection}
 */
Collection.prototype.start = function (value) {
	this.p.startIndex = value;
	return this;
};

/**
 * Sets .endIndex for the operation
 *
 * @param {number} value - source value
 * @return {!Collection}
 */
Collection.prototype.end = function (value) {
	this.p.endIndex = value;
	return this;
};

/**
 * Sets .from for the operation
 *
 * @param {number} value - source value
 * @return {!Collection}
 */
Collection.prototype.from = function (value) {
	this.p.from = value;
	return this;
};

/**
 * Sets .count for the operation
 *
 * @param {number} value - source value
 * @return {!Collection}
 */
Collection.prototype.count = function (value) {
	this.p.count = value;
	return this;
};

/**
 * Sets .use to 'for in' for the operation
 *
 * @param {(boolean|number|null)=} [opt_notOwn] - iteration type:
 *
 *   1) if false, then hasOwnProperty test is enabled and all not own properties will be skipped
 *   2) if true, then hasOwnProperty test is disabled
 *   3) if -1, then hasOwnProperty test is enabled and all own properties will be skipped
 *
 * @return {!Collection}
 */
Collection.prototype.object = function (opt_notOwn) {
	this.p.use = 'for in';

	if (opt_notOwn) {
		this.p.notOwn = opt_notOwn;
	}

	return this;
};

/**
 * Sets .use to 'for of' for the operation
 *
 * @param {?boolean=} [opt_async] - if true, then will be used async for of
 * @return {!Collection}
 */
Collection.prototype.iterator = function (opt_async) {
	this.p.use = `${opt_async ? 'async ' : ''}for off`;
	return this;
};

/**
 * Sets .initial for the operation
 *
 * @param {?} value
 * @return {!Collection}
 */
Collection.prototype.to = function (value) {
	this.p.initial = value;
	return this;
};

/**
 * Sets .initial as a transform stream for the operation
 *
 * @param {?boolean=} [opt_readObj] - readableObjectMode
 * @param {?boolean=} [opt_writeObj=opt_readObj] - writableObjectMode
 * @return {!Collection}
 */
Collection.prototype.toStream = function (opt_readObj, opt_writeObj) {
	opt_readObj = Boolean(opt_readObj != null ? opt_readObj : true);

	//#if isNode

	const
		{Transform} = require('stream');

	this.p.initial = new Transform({
		readableObjectMode: Boolean(opt_readObj),
		writableObjectMode: Boolean(opt_writeObj != null ? opt_writeObj : opt_readObj),
		transform(data, enc, cb) {
			cb(null, data);
		}
	});

	//#endif

	return this;
};

//#if iterators.async

/**
 * Sets .async to true and .parallel for the operation
 *
 * @param {(boolean|number|null)=} [opt_max]
 * @return {!Collection}
 */
Collection.prototype.parallel = function (opt_max) {
	this.p.parallel = isNumber(opt_max) ? opt_max || true : opt_max !== false;
	return this;
};

/**
 * Sets .async to true and .race for the operation
 *
 * @param {(boolean|number|null)=} [opt_max]
 * @return {!Collection}
 */
Collection.prototype.race = function (opt_max) {
	this.p.race = isNumber(opt_max) ? opt_max || true : opt_max !== false;
	return this;
};

//#endif

Object.defineProperties(Collection.prototype, /** @lends {Collection.prototype} */ {
	//#if iterators.async

	async: {
		/**
		 * Sets .async to true for the operation
		 */
		get() {
			this.p.async = true;
			return this;
		}
	},

	//#endif

	live: {
		/**
		 * Sets .live to true for the operation
		 */
		get() {
			this.p.live = true;
			return this;
		}
	},

	descriptor: {
		/**
		 * Sets .withDescriptor to true for the operation
		 */
		get() {
			this.p.withDescriptor = true;
			return this;
		}
	},

	array: {
		/**
		 * Sets .use to 'for' for the operation
		 */
		get() {
			this.p.use = 'for';
			return this;
		}
	},

	one: {
		/**
		 * Sets .mult to false for the operation
		 */
		get() {
			this.p.mult = false;
			return this;
		}
	},

	inverse: {
		/**
		 * Sets .inverseFilter to true for the operation
		 */
		get() {
			this.p.inverseFilter = true;
			return this;
		}
	},

	reverse: {
		/**
		 * Sets .reverse to true for the operation
		 */
		get() {
			this.p.reverse = true;
			return this;
		}
	}
});
