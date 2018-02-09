'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import { Collection } from '../core';
import { IS_NODE } from '../consts/hacks';
import { FN_LENGTH } from '../consts/base';
import { getType, isArray, isFunction, isPromise, isStream } from '../helpers/types';
import { any } from '../helpers/gcc';

/**
 * Creates a new collection based on the current by the specified parameters
 *
 * @see Collection.prototype.forEach
 * @param {($$CollectionCb|$$Collection_map)=} opt_cb - callback function
 * @param {($$Collection_map|$$CollectionFilter)=} [opt_params] - additional parameters:
 *   *) [initial] - initial object for adding elements
 *
 * @return {(?|!Promise)}
 */
Collection.prototype.map = function (opt_cb, opt_params) {
	let p = opt_params || {};

	if (!isFunction(opt_cb)) {
		p = opt_cb || p;
		opt_cb = (el) => el;
	}

	if (isArray(p) || isFunction(p)) {
		p = {filter: p};
	}

	this._filter(p)._isAsync(p);
	p = any(Object.assign(Object.create(this.p), p));

	const
		{data} = this,
		hasInitial = p.initial != null,
		source = hasInitial ? p.initial : this.data;

	let
		type = hasInitial ? getType(p.initial) : getType(data, p.use),
		res = p.initial;

	if (!hasInitial) {
		switch (type) {
			case 'object':
				res = {};
				break;

			case 'array':
				if (isArray(source)) {
					res = [];

				} else {
					res = {};
					type = 'object';
				}

				break;

			case 'generator':
			case 'iterator':
			case 'asyncIterator':
			case 'idbRequest':
				res = [];
				type = 'array';
				break;

			default:
				if (type === 'stream') {
					if (IS_NODE) {
						//#if isNode

						const
							{Transform} = require('stream');

						let
							readObj = true,
							writeObj = true;

						if (isStream(data)) {
							if (data._readableState) {
								readObj = data._readableState.objectMode;
							}

							if (data._writableState) {
								writeObj = data._writableState.objectMode;
							}
						}

						res = new Transform({
							readableObjectMode: readObj,
							writableObjectMode: writeObj,
							transform(data, enc, cb) {
								cb(null, data);
							}
						});

						//#endif

					} else {
						res = [];
						type = 'array';
					}

				} else {
					res = new source.constructor();
				}
		}
	}

	let fn;
	p.result = res;

	switch (type) {
		case 'array':
			fn = function () {
				const
					val = opt_cb.apply(null, arguments);

				//#if iterators.async

				if (p.async && isPromise(val)) {
					return val.then((val) => res.push(val));
				}

				//#endif

				res.push(val);
			};

			fn[FN_LENGTH] = opt_cb.length;
			break;

		case 'object':
			fn = function (el, key) {
				const
					val = opt_cb.apply(null, arguments);

				//#if iterators.async

				if (p.async && isPromise(val)) {
					return val.then((val) => res[key] = val);
				}

				//#endif

				res[key] = val;
			};

			fn[FN_LENGTH] = fn.length > opt_cb.length ? fn.length : opt_cb.length;
			break;

		case 'map':
		case 'weakMap':
			fn = function (el, key) {
				const
					val = opt_cb.apply(null, arguments);

				//#if iterators.async

				if (p.async && isPromise(val)) {
					return val.then((val) => res.set(key, val));
				}

				//#endif

				res.set(key, val);
			};

			fn[FN_LENGTH] = fn.length > opt_cb.length ? fn.length : opt_cb.length;
			break;

		case 'set':
		case 'weakSet':
			fn = function () {
				const
					val = opt_cb.apply(null, arguments);

				//#if iterators.async

				if (p.async && isPromise(val)) {
					return val.then((val) => res.add(val));
				}

				//#endif

				res.add(val);
			};

			fn[FN_LENGTH] = opt_cb.length;
			break;

		case 'stream':
			fn = function () {
				return new Promise((resolve) => {
					let
						val = opt_cb.apply(null, arguments);

					function end() {
						clear();
						resolve();
					}

					function clear() {
						res.removeListener('drain', write);
						res.removeListener('error', end);
						res.removeListener('close', end);
					}

					function write() {
						clear();

						try {
							if (res.write(val)) {
								resolve(val);

							} else {
								res.addListener('drain', write);
								res.addListener('error', end);
								res.addListener('close', end);
							}

						} catch (_) {
							end();
						}
					}

					//#if iterators.async

					if (p.async && isPromise(val)) {
						return val.then((res) => {
							val = res;
							write();
						});
					}

					//#endif

					return write();
				});
			};

			fn[FN_LENGTH] = opt_cb.length;
			break;

		default:
			fn = function () {
				const
					val = opt_cb.apply(null, arguments);

				//#if iterators.async

				if (p.async && isPromise(val)) {
					return val.then((val) => res += val);
				}

				//#endif

				p.result = res += val;
			};

			fn[FN_LENGTH] = opt_cb.length;
	}

	const
		returnVal = any(this.forEach(any(fn), p));

	if (returnVal !== this && type !== 'stream') {
		return returnVal;
	}

	return p.result;
};
