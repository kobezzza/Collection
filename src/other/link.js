'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import $C, { Collection } from '../core';
import { isLink } from '../helpers/link';
import { isString, isLikeArray, isMap, isWeakMap, isSet, isWeakSet } from '../helpers/types';
import { any } from '../helpers/gcc';

/**
 * Sets a value to an object property by a link or returns/deletes the property.
 * At changing or deleting the property returns an object:
 *
 *   {
 *     result: boolean,
 *     key,
 *     value
 *   }
 *
 * @param {?} obj
 * @param {$$CollectionLink} link - source link:
 *   STRING-LINK:
 *   a.foo.bar ~ obj['foo']['bar']
 *
 *   ARRAY-LINK:
 *   [{}, 1, null] ~ obj[{}][1][null]
 *
 * @param {$$Collection_byLink=} [opt_params] - additional parameters:
 *
 *   [value] - value to set
 *   [delete = delete] - if true, then the property will be deleted
 *   [create = false] - if true, then the property will be created if it's not defined
 *   [test = false] - if is true, then will be returned false if the property is not defined
 *
 * @return {({key, result: boolean, value}|?)}
 */
export function byLink(obj, link, opt_params) {
	const
		p = opt_params || {};

	if (isLink(link)) {
		link = link.valueOf();
	}

	const
		linkList = isString(link) ? any(link).split('.') : [].concat(link),
		length = linkList.length,
		last = length - 1;

	let
		pre,
		preKey;

	for (let i = -1; ++i < length;) {
		const
			el = linkList[i];

		if (obj == null) {
			if (p.test) {
				return false;
			}

			if (p.error) {
				throw new ReferenceError(`${el} is not defined!`);
			}

			return undefined;
		}

		const
			isTest = i === last && p.test;

		if (isTest) {
			pre = obj;
			preKey = el;
		}

		const
			objIsMap = isMap(obj),
			objIsSet = isSet(obj);

		const
			isAMap = objIsMap || isWeakMap(obj),
			isASet = objIsSet || isWeakSet(obj);

		// Set or delete
		if (!isTest && i === last && (p.delete || p.value !== undefined)) {
			const cache = {
				key: isASet ? null : el,
				result: isAMap || isASet ? obj.has(el) : el in obj,
				value: isAMap ? obj.get(el) : isASet ? el : obj[el]
			};

			if (p.delete) {
				if (cache.result) {
					if (isAMap || isASet) {
						obj.delete(el);
						cache.result = !obj.has(el);

					} else {
						if (isLikeArray(obj) && !isNaN(Number(el))) {
							[].splice.call(obj, el, 1);

						} else {
							delete obj[el];
						}

						cache.result = el in obj === false || obj[el] !== cache.value;
					}
				}

			} else {
				if (isAMap) {
					if (obj.get(el) !== p.value) {
						obj.set(el, p.value);
						cache.result = obj.get(el) === p.value;

					} else {
						cache.result = false;
					}

				} else if (isASet) {
					const
						has = obj.has(el);

					cache.result = false;
					cache.value = has ? el : undefined;

					if (!obj.has(p.value)) {
						if (has) {
							obj.delete(el);
						}

						obj.add(p.value);
						cache.result = obj.has(p.value);
					}

				} else {
					if (isLikeArray(obj) && !isNaN(Number(cache.key))) {
						cache.key = Number(cache.key);

					} else {
						cache.key = String(cache.key);
					}

					if (obj[el] !== p.value) {
						obj[el] = p.value;
						cache.result = obj[el] === p.value;

					} else {
						cache.result = false;
					}
				}
			}

			return cache;
		}

		if (isAMap) {
			obj = obj.get(el);

		} else if (isASet) {
			if (obj.has(el)) {
				obj = el;

			} else {
				obj = undefined;
			}

		} else {
			if (p.create && obj[el] === undefined) {
				obj[el] = {};
			}

			obj = obj[el];
		}
	}

	if (p.test) {
		if (isMap(pre) || isWeakMap(pre) || isSet(pre) || isWeakSet(pre)) {
			return pre.has(preKey);
		}

		return preKey in pre;
	}

	return obj;
}

/**
 * Returns true if an object contains a property by a link
 *
 * @see byLink
 * @param {$$CollectionLink} link - source link
 * @param {!Object} obj - source object
 * @return {boolean}
 */
$C.in = function (link, obj) {
	return byLink(obj, link, {test: true});
};

/**
 * Returns true if the collection contains a property by a link
 *
 * @see byLink
 * @param {$$CollectionLink} link - source link
 * @return {boolean}
 */
Collection.prototype.in = function (link) {
	return byLink(this.data, link, {test: true});
};
