'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

var _core = require('../core');

var _cache = require('../consts/cache');

var _types = require('../helpers/types');

var _base = require('../consts/base');

var _thread = require('../consts/thread');

var _compile = require('./compile');

var _gcc = require('../helpers/gcc');

require('./length');

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
_core.Collection.prototype.forEach = function (cb, opt_params) {
	const p = (0, _gcc.any)(Object.create(this._init())),
	      sp = opt_params || p;

	if ((0, _types.isArray)(opt_params) || (0, _types.isFunction)(opt_params)) {
		p.filter = p.filter.concat(opt_params);
	} else {
		if (opt_params && opt_params.hasOwnProperty('filter')) {
			opt_params.filter = p.filter.concat(opt_params.filter);
		}

		Object.assign(p, opt_params);
	}

	if (p.notOwn) {
		p.use = 'for in';
	}

	this._isThread(p);
	if (!_thread.PRIORITY[p.priority]) {
		_thread.PRIORITY[p.priority] = 'normal';
	}

	const { data } = this;

	const type = p.type = (0, _types.getType)(data, p.use),
	      filters = p.filter;

	if (!(0, _types.isObjectInstance)(data) || { 'weakMap': true, 'weakSet': true }[type]) {
		throw new TypeError('Incorrect data type');
	}

	// Optimization for the length request
	if (!filters.length && cb[_base.LENGTH_REQUEST]) {
		if (type === 'array') {
			cb[_base.LENGTH_REQUEST] = (p.startIndex || p.endIndex !== false ? [].slice.call(data, p.startIndex || 0, p.endIndex !== false ? p.endIndex + 1 : data.length) : data).length;

			return this;
		} else if ({ 'map': true, 'set': true }[type] && !p.startIndex && p.endIndex === false) {
			cb[_base.LENGTH_REQUEST] = data.size;
			return this;
		}
	}

	let cbArgs = false,
	    filterArgs = false;

	if (p.length) {
		cbArgs = p.cbArgs = cb[_base.FN_LENGTH] || cb.length;
		p.filterArgs = [];

		for (let i = 0; i < filters.length; i++) {
			p.filterArgs.push(filters[i][_base.FN_LENGTH] || filters[i].length);
		}

		filterArgs = p.filterArgs.length ? p.filterArgs : false;
	}

	let cbLength;
	if (cbArgs && cbArgs > 3) {
		const p = (0, _gcc.any)(Object.assign({}, opt_params, {
			onChunk: null,
			onIterationEnd: null,
			onComplete(val) {
				cbLength.value = val;
			}
		}));

		cbLength = opt_reset => {
			if (!cbLength.value || opt_reset) {
				cbLength.value = this.length(filters, p);
			}

			return cbLength.value;
		};
	}

	let fLength;
	if (filterArgs && Math.max.apply(null, (0, _gcc.any)(filterArgs)) > 3) {
		const p = (0, _gcc.any)(Object.assign({}, opt_params, {
			onChunk: null,
			onIterationEnd: null,
			onComplete(val) {
				fLength.value = val;
			}
		}));

		fLength = opt_reset => {
			if (!fLength.value || opt_reset) {
				fLength.value = this.length(null, p);
			}

			return fLength.value;
		};
	}

	const key = [type, cbArgs, filters.length, filterArgs, p.length, p.thread, p.withDescriptor, p.notOwn, p.live, p.inverseFilter, p.reverse, p.mult, p.count, p.from, p.startIndex, p.endIndex].join();

	const fn = (0, _gcc.any)(_cache.tmpCycle[key] || (0, _compile.compileCycle)(key, p));

	const args = {
		data,
		cb,
		cbLength,
		filters,
		fLength,
		priority: _thread.PRIORITY,
		onComplete: p.onComplete,
		onIterationEnd: p.onIterationEnd
	};

	//#if iterators.thread

	if (p.thread) {
		let thread;
		const promise = new Promise((resolve, reject) => {
			let error = false;
			function onError(err) {
				if (error) {
					return;
				}

				if (thread) {
					thread.destroy(err);
				} else {
					reject(err);
				}

				error = true;
			}

			function wrap(fn) {
				if (!fn) {
					return undefined;
				}

				return (el, key, data, o) => {
					try {
						fn[_base.ON_ERROR] = onError;
						return fn(el, key, data, o);
					} catch (err) {
						onError(err);
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

			thread = args.self = fn(args, sp);
			this._addToStack(thread, p.priority, reject, wrap(p.onChunk));
		});

		promise.thread = thread;
		return promise;
	}

	//#endif

	fn(args, sp);
	return this;
};