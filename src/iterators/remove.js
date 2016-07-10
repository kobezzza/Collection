'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import { Collection } from '../core';
import { isLink } from '../helpers/link';
import { getType, isFunction, isArray, isNumber } from '../helpers/types';
import { any } from '../helpers/gcc';

//#if link
import { byLink } from '../other/link';
//#endif

/**
 * Removes elements from the collection by the specified condition/link
 *
 * @see Collection.prototype.forEach
 * @param {($$CollectionFilter|$$CollectionBase|$$CollectionLink)=} [opt_filter] - link, function filter or an array of functions
 * @param {?$$CollectionBase=} [opt_params] - additional parameters
 * @return {({result, key, value}|!Array<{result, key, value}>|!Promise<(({result, key, value}|!Array<{result, key, value}>)>)}
 */
Collection.prototype.remove = function (opt_filter, opt_params) {
	let p = any(opt_params || {});

	if (
		isLink(opt_filter) ||
		!isFunction(opt_filter) && (
			isArray(opt_filter) && !isFunction(opt_filter[1]) ||
			opt_filter != null && typeof opt_filter !== 'object'
		)

	) {
		const tmp = byLink(this.data, opt_filter, {delete: true});
		p.onComplete && p.onComplete(tmp);
		return tmp;
	}

	if (!isArray(opt_filter) && !isFunction(opt_filter)) {
		p = opt_filter || p;
		opt_filter = null;
	}

	const
		type = getType(this.data, p.use);

	if ({'iterator': true, 'generator': true}[type]) {
		throw new TypeError('Incorrect data type');
	}

	const
		mult = p.mult !== false,
		res = [],
		splice = [].splice;

	if (mult) {
		p.result = res;
	}

	let action;
	switch (type) {
		case 'map':
			action = (value, key, data) => {
				data.delete(key);
				const o = {
					result: !data.has(key),
					key,
					value
				};

				if (mult) {
					res.push(o);

				} else {
					p.result = o;
				}
			};

			break;

		case 'set':
			action = (value, key, data) => {
				data.delete(value);
				const o = {
					result: !data.has(value),
					key: null,
					value
				};

				if (mult) {
					res.push(o);

				} else {
					p.result = o;
				}
			};

			break;

		case 'array':
			if (p.reverse) {
				action = (value, key, data) => {
					splice.call(data, key, 1);
					const o = {
						result: data[key] !== value,
						key,
						value
					};

					if (mult) {
						res.push(o);

					} else {
						p.result = o;
					}
				};

			} else {
				let rm = 0;
				if (p.live) {
					action = (value, key, data, ctx) => {
						splice.call(data, key, 1);
						ctx.i(-1);
						const o = {
							result: data[key] !== value,
							key: key + rm,
							value
						};

						if (mult) {
							res.push(o);

						} else {
							p.result = o;
						}

						rm++;
					};

				} else {
					action = (value, key, data, ctx) => {
						const ln = ctx.length();
						const fn = (length) => {
							if (rm === length) {
								return false;
							}

							splice.call(data, key, 1);
							ctx.i(-1);
							const o = {
								result: data[key] !== value,
								key: key + rm,
								value
							};

							if (mult) {
								res.push(o);

							} else {
								p.result = o;
							}

							rm++;
						};

						if (isNumber(ln)) {
							fn(ln);

						} else {
							ctx.wait(ln).then(fn);
						}
					};
				}
			}

			break;

		default:
			action = (value, key, data) => {
				delete data[key];
				const o = {
					result: key in data === false,
					key,
					value
				};

				if (mult) {
					res.push(o);

				} else {
					p.result = o;
				}
			};
	}

	p.filter = opt_filter;

	const
		returnVal = any(this.forEach(action, p));

	if (returnVal !== this) {
		return returnVal;
	}

	return p.result;
};