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
import { slice } from '../helpers/link';
import { FN_LENGTH, LENGTH_REQUEST, ON_ERROR } from '../consts/base';
import { SYMBOL_SUPPORT } from '../consts/hacks';
import { PRIORITY } from '../consts/thread';
import { compileCycle } from './compile';
import { any } from '../helpers/gcc';
import './length';

const invalidTypes = {
	'weakMap': true,
	'weakSet': true
};

const mapSet = {
	'map': true,
	'set': true
};

const
	TRUE = [],
	FALSE = [],
	IGNORE = [];

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
 *   *) [async = false] - if true, then operation will be executed as async (returns a promise)
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
		p = any(Object.create(this._init())),
		sp = opt_params || p;

	if (isArray(opt_params) || isFunction(opt_params)) {
		p.filter = p.filter.concat(opt_params);

	} else {
		if (opt_params && opt_params.hasOwnProperty('filter')) {
			opt_params.filter = p.filter.concat(opt_params.filter);
		}

		Object.assign(p, opt_params);
	}

	if (!p.use && p.notOwn) {
		p.use = 'for in';
	}

	this._isThread(p);
	if (p.thread && !PRIORITY[p.priority]) {
		p.priority = 'normal';
	}

	let
		{data} = this,
		type = p.type = getType(data, p.use);

	if (!isObjectInstance(data) || invalidTypes[type]) {
		throw new TypeError('Incorrect data type');
	}

	const
		filters = p.filter,
		isStream = type === 'stream',
		isIDBRequest = type === 'idbRequest';

	if (isStream || isIDBRequest) {
		if (!p.thread) {
			p.async = true;
		}

		const
			cursor = data,
			on = `add${isIDBRequest ? 'Event' : ''}Listener`,
			off = `remove${isIDBRequest ? 'Event' : ''}Listener`,
			dataEvent = isStream ? 'data' : 'success';

		cursor[on]('error', (err) => {
			if (data.onError) {
				data.onError(err);

			} else {
				throw err;
			}
		});

		let
			hasEnded = false;

		if (isStream) {
			cursor[on]('end', () => hasEnded = true);
		}

		data = {
			next() {
				if (hasEnded || cursor.readyState === 'done') {
					return {done: true, value: undefined};
				}

				return {
					done: false,
					value: new Promise((resolve, reject) => {
						isStream && cursor[on]('end', end);
						cursor[on](dataEvent, data);
						cursor[on]('error', end);

						function data(data) {
							clear();

							if (isStream) {
								resolve(data);

							} else {
								const
									iterator = data.target.result;

								if (iterator) {
									resolve(iterator.value);
									iterator.continue();

								} else {
									resolve(IGNORE);
								}
							}
						}

						function end() {
							clear();
							resolve(IGNORE);
						}

						function error(err) {
							clear();
							reject(err);
						}

						function clear() {
							isStream && cursor[off]('end', end);
							cursor[off]('error', error);
							cursor[off](dataEvent, data);
						}
					})
				};
			}
		};

		type = p.type = 'iterator';
	}

	// Optimization for the length request
	if (!filters.length && cb[LENGTH_REQUEST]) {
		if (type === 'array') {
			cb[LENGTH_REQUEST] = (
				p.startIndex || p.endIndex !== false ?
					slice.call(data, p.startIndex || 0, p.endIndex !== false ? p.endIndex + 1 : data.length) :
					data

			).length;

			return this;

		} else if (mapSet[type] && !p.startIndex && p.endIndex === false) {
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

	const
		lengthKey = SYMBOL_SUPPORT ? Symbol() : 'value';

	let cbLength;
	if (cbArgs === false || cbArgs > 3) {
		const p = any(Object.assign({}, opt_params, {
			onChunk: null,
			onIterationEnd: null,
			onComplete(val) {
				cbLength.value = val;
			}
		}));

		cbLength = (opt_reset) => {
			if (lengthKey in cbLength === false || opt_reset) {
				return cbLength[lengthKey] = this.length(filters, p);
			}

			return cbLength[lengthKey];
		};
	}

	let fLength;
	if (filterArgs === false || Math.max.apply(null, any(filterArgs)) > 3) {
		const p = any(Object.assign({}, opt_params, {
			onChunk: null,
			onIterationEnd: null,
			onComplete(val) {
				fLength.value = val;
			}
		}));

		fLength = (opt_reset) => {
			if (lengthKey in fLength === false || opt_reset) {
				return fLength[lengthKey] = this.length(null, p);
			}

			return fLength[lengthKey];
		};
	}

	const key = [
		type,
		cbArgs,
		filters.length,
		filterArgs,
		p.length,
		p.async,
		p.thread,
		p.withDescriptor,
		p.notOwn,
		p.live,
		p.inverseFilter,
		p.reverse,
		p.mult,
		Boolean(p.count),
		Boolean(p.from),
		Boolean(p.startIndex),
		p.endIndex !== false
	].join();

	const
		fn = any(tmpCycle[key] || compileCycle(key, p));

	const args = {
		TRUE,
		FALSE,
		IGNORE,
		data,
		cb,
		cbLength,
		filters,
		fLength,
		priority: PRIORITY,
		onComplete: p.onComplete,
		onIterationEnd: p.onIterationEnd,
		count: p.count,
		from: p.from,
		startIndex: p.startIndex,
		endIndex: p.endIndex
	};

	//#if iterators.thread

	if (p.thread || p.async) {
		let thread;
		const promise = new Promise((resolve, reject) => {
			function onError(err) {
				if (thread) {
					thread.destroy(err);

				} else {
					reject(err);
				}
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
					}
				};
			}

			for (let i = 0; i < filters.length; i++) {
				filters[i] = wrap(filters[i]);
			}

			if (isStream || isIDBRequest) {
				data.onError = onError;
			}

			args.cb = wrap(cb);
			args.onComplete = resolve;
			args.onIterationEnd = wrap(p.onIterationEnd);
			args.onError = onError;

			thread = args.self = fn(args, sp);
			thread.value = undefined;
			thread.destroyed = false;
			thread.sleep = null;
			thread.pause = false;
			thread.children = [];

			if (p.thread) {
				this._addToStack(thread, p.priority, reject, wrap(p.onChunk));

			} else {
				thread.destroy = (err) => {
					if (thread.destroyed) {
						return false;
					}

					thread.destroyed = true;

					if (!err) {
						err = new Error('Thread was destroyed');
						err.type = 'CollectionThreadDestroy';
						err.thread = thread;
					}

					try {
						thread.throw(err);

					} catch (_) {}

					reject(err);
					return err;
				};

				thread.next();
			}
		});

		promise.thread = thread;
		return promise;
	}

	//#endif

	fn(args, sp);
	return this;
};
