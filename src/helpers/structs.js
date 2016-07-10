'use strict';

/*!
 * Collection
 * https://github.com/Collection-JS/Collection
 *
 * Released under the MIT license
 * https://github.com/Collection-JS/Collection/blob/master/LICENSE
 */

import { GLOBAL, NULL } from '../consts/links';
import { MAP_SUPPORT, SET_SUPPORT } from '../consts/hacks';

export const Map = MAP_SUPPORT ?
	GLOBAL['Map'] : function () {};

export const WeakMap = GLOBAL['WeakMap'] ?
	GLOBAL['WeakMap'] : function () {};

export const Set = SET_SUPPORT ?
	GLOBAL['Set'] : function () {};

export const WeakSet = GLOBAL['WeakSet'] ?
	GLOBAL['WeakSet'] : function () {};

export let
	STRUCT_OPT = false;

//#if map_set.keys
// Optimisation (+ polyfills) for Map and Set

if (MAP_SUPPORT) {
	STRUCT_OPT = true;
	GLOBAL['Map'] = function (opt_iterable) {
		const
			obj = new Map();

		obj.constructor = GLOBAL['Map'];
		obj._keys = [];
		obj._keysMap = new Map();

		$C(opt_iterable).forEach((el) => {
			obj.set(el[0], el[1]);
		});

		return obj;
	};

	GLOBAL['Map'].prototype = Map.prototype;

	const
		mapSet = Map.prototype.set;

	Map.prototype.set = function (key, val) {
		if (this._keysMap && !this.has(key)) {
			this._keysMap.set(key, this._keys.push(key) - 1);
		}

		return mapSet.apply(this, arguments);
	};

	const
		mapDelete = Map.prototype.delete;

	Map.prototype.delete = function (key) {
		if (this._keysMap && this.has(key)) {
			const
				keys = this._keys,
				map = this._keysMap,
				pos = map.get(key);

			if (pos === keys.length - 1) {
				keys.pop();

			} else {
				keys[pos] = NULL;
			}

			map.delete(key);
		}

		return mapDelete.apply(this, arguments);
	};

	const
		mapClear = Map.prototype.clear;

	Map.prototype.clear = function () {
		if (this._keysMap) {
			const
				map = this._keysMap;

			$C(this._keys).forEach((el, i, keys) => {
				map.delete(el);
				keys.pop();

			}, {reverse: true});
		}

		return mapClear.apply(this, arguments);
	};

	/** @return {{next: function(): {value, done: boolean}}} */
	Map.prototype.keys = function () {
		const
			keys = this._keys;

		let
			i = 0;

		return {
			next() {
				let
					current,
					res = false;

				while (i !== keys.length) {
					current = keys[i];
					i++;

					if (current !== NULL) {
						res = true;
						break;
					}
				}

				return {
					value: res ? current : undefined,
					done: !res
				};
			}
		};
	};
}

if (SET_SUPPORT) {
	GLOBAL['Set'] = function (opt_iterable) {
		const
			obj = new Set();

		obj.constructor = GLOBAL['Set'];
		obj._keys = [];
		obj._keysMap = new Map();

		$C(opt_iterable).forEach((el) => {
			obj.add(el);
		});

		return obj;
	};

	GLOBAL['Set'].prototype = Set.prototype;

	const
		setAdd = Set.prototype.add;

	Set.prototype.add = function (val) {
		if (!this.has(val)) {
			this._keysMap.set(val, this._keys.push(val) - 1);
		}

		return setAdd.apply(this, arguments);
	};

	const
		setDelete = Set.prototype.delete;

	Set.prototype.delete = function (val) {
		if (this.has(val)) {
			const
				keys = this._keys,
				map = this._keysMap,
				pos = map.get(val);

			if (pos === keys.length - 1) {
				keys.pop();

			} else {
				keys[pos] = NULL;
			}

			map.delete(val);
		}

		return setDelete.apply(this, arguments);
	};

	const
		setClear = Set.prototype.clear;

	Set.prototype.clear = function () {
		const
			map = this._keysMap;

		$C(this._keys).forEach((el, i, keys) => {
			map.delete(el);
			keys.pop();

		}, {reverse: true});

		return setClear.apply(this, arguments);
	};

	/** @return {{next: function(): {value, done: boolean}}} */
	Set.prototype.values = function () {
		const
			keys = this._keys;

		let
			i = 0;

		return {
			next() {
				let
					current,
					res = false;

				while (i !== keys.length) {
					current = keys[i];
					i++;

					if (current !== NULL) {
						res = true;
						break;
					}
				}

				return {
					value: res ? current : undefined,
					done: !res
				};
			}
		};
	};

	/** @return {{next: function(): {value, done: boolean}}} */
	Set.prototype.keys = Set.prototype.values;
}

//#endif
