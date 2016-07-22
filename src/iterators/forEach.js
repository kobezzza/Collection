'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import { Collection } from '../core';
import { tmpCycle } from '../consts/cache';
import { getType, isObjectInstance, isArray, isFunction } from '../helpers/types';
import { FN_LENGTH, LENGTH_REQUEST, ON_ERROR } from '../consts/base';
import { PRIORITY } from '../consts/thread';
import { compileCycle } from './compile';
import { any } from '../helpers/gcc';
import './length';

/**
 * Iterates the collection and calls a callback function for each element that matches for the specified condition
 *
 * @param {$$CollectionCb} cb - callback function
 * @param {?$$Collection_forEach=} [opt_params] - additional parameters:
 *
 *   *) [filter] - function filter or an array of functions
 *   *) [mult = true] - if false, then after the first successful iteration the operation will be broken
 *   *) [count] - maximum number of elements in the response (by default all object)
 *   *) [from = 0] - number of skipping successful iterations
 *   *) [startIndex = 0] - number of skipping successful iterations
 *   *) [endIndex] - end iteration position
 *   *) [inverseFilter = false] - if true, the successful iteration is considered as a negative result of the filter
 *   *) [withDescriptor = false] - if true, then the first element of callback function will be an object of the element descriptor
 *   *) [notOwn = false] - iteration type:
 *
 *     1) if false, then hasOwnProperty test is enabled and all not own properties will be skipped;
 *     2) if true, then hasOwnProperty test is disabled;
 *     3) if -1, then hasOwnProperty test is enabled and all own properties will be skipped.
 *
 *   *) [live = false] - if true, the initial collection length won't be cached (not for all data types),
 *      ie all elements which will be added to the collection during the iteration will be included to the processing
 *
 *   *) [use] - type of the using iterator (for, for of, for in)
 *   *) [length = true] - if false, then function parameters optimization won't be apply
 *   *) [thread = false] - if true, then operation will be executed in a thread (returns a promise)
 *   *) [priority = 'normal'] - thread priority (low, normal, hight, critical)
 *   *) [onChunk] - callback function for chunks
 *   *) [onIterationEnd] - callback function for the end of iterations
 *   *) [result] - parameter that marked as the operation result
 *
 * @return {(!Collection|!Promise)}
 */
Collection.prototype.forEach = function (cb, opt_params) {
	const
		p = any(Object.create(this._init()));

	if (isArray(opt_params) || isFunction(opt_params)) {
		p.filter = p.filter.concat(opt_params);

	} else {
		if (opt_params && opt_params.hasOwnProperty('filter')) {
			opt_params.filter = p.filter.concat(opt_params.filter);
		}

		Object.assign(p, opt_params);
	}

	if (p.notOwn || p.withAccessors) {
		p.use = 'for in';
	}

	this._isThread(p);
	if (!PRIORITY[p.priority]) {
		PRIORITY[p.priority] = 'normal';
	}

	const
		{data} = this;

	const
		type = p.type = getType(data, p.use),
		filters = p.filter;

	if (!isObjectInstance(data) || {'weakMap': true, 'weakSet': true}[type]) {
		throw new TypeError('Incorrect data type');
	}

	// Optimization for the length request
	if (!filters.length && cb[LENGTH_REQUEST]) {
		if (type === 'array') {
			cb[LENGTH_REQUEST] = (
				p.startIndex || p.endIndex !== false ?
					[].slice.call(data, p.startIndex || 0, p.endIndex !== false ? p.endIndex + 1 : data.length) :
					data

			).length;

			return this;

		} else if ({'map': true, 'set': true}[type] && !p.startIndex && p.endIndex === false) {
			cb[LENGTH_REQUEST] = data.size;
			return this;
		}
	}

	let
		cbArgs = false,
		filterArgs = false;

	if (p.length) {
		cbArgs = p.cbArgs = cb[FN_LENGTH] || cb.length;
		p.filterArgs = [];

		for (let i = 0; i < filters.length; i++) {
			p.filterArgs.push(filters[i][FN_LENGTH] || filters[i].length);
		}

		filterArgs = p.filterArgs.length ? p.filterArgs : false;
	}

	let cbLength;
	if (cbArgs && cbArgs > 3) {
		const p = any(Object.assign({}, opt_params, {
			onChunk: null,
			onIterationEnd: null,
			onComplete(val) {
				cbLength.value = val;
			}
		}));

		cbLength = (opt_reset) => {
			if (!cbLength.value || opt_reset) {
				cbLength.value = this.length(filters, p);
			}

			return cbLength.value;
		};
	}

	let fLength;
	if (filterArgs && Math.max.apply(null, any(filterArgs)) > 3) {
		const p = any(Object.assign({}, opt_params, {
			onChunk: null,
			onIterationEnd: null,
			onComplete(val) {
				fLength.value = val;
			}
		}));

		fLength = (opt_reset) => {
			if (!fLength.value || opt_reset) {
				fLength.value = this.length(null, p);
			}

			return fLength.value;
		};
	}

	const key = [
		type,
		cbArgs,
		filters.length,
		filterArgs,
		p.length,
		p.thread,
		p.notOwn,
		p.live,
		p.inverseFilter,
		p.reverse,
		p.mult,
		p.count,
		p.from,
		p.startIndex,
		p.endIndex
	].join();

	const
		link = {},
		fn = any(tmpCycle[key] || compileCycle(key, p));

	const args = {
		data,
		cb,
		cbLength,
		filters,
		fLength,
		link,
		priority: PRIORITY,
		onComplete: p.onComplete,
		onIterationEnd: p.onIterationEnd
	};

	//#if iterators.thread

	if (p.thread) {
		let thread;
		const promise = new Promise((resolve, reject) => {
			function onError(err) {
				thread && thread.destroy();
				reject(err);
			}

			function wrap(fn) {
				if (!fn) {
					return undefined;
				}

				return (el, key, data, o) => {
					try {
						fn[ON_ERROR] = onError;
						return fn(el, key, data, o);

					} catch (err) {
						onError(err);
						throw err;
					}
				};
			}

			for (let i = 0; i < filters.length; i++) {
				filters[i] = wrap(filters[i]);
			}

			args.cb = wrap(cb);
			args.onComplete = resolve;
			args.onIterationEnd = wrap(p.onIterationEnd);
			args.onError = onError;

			thread = link.self = fn.call(this, args, opt_params || p);
			this._addToStack(thread, p.priority, p.onComplete, wrap(p.onChunk));
		});

		promise.thread = thread;
		return promise;
	}

	//#endif

	link.self = fn.call(this, args, opt_params || p);
	return this;
};
