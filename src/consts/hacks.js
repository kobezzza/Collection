/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

'use strict';

import { ws } from '../helpers/string';
import { any } from '../helpers/gcc';

export const IS_NODE = (() => {
	try {
		return typeof process === 'object' && {}.toString.call(process) === '[object process]';

	} catch (ignore) {
		return false;
	}
})();

export const
	IS_BROWSER = !IS_NODE && typeof window === 'object',
	BLOB_SUPPORT = IS_BROWSER && typeof Blob === 'function' && typeof URL === 'function',
	LOCAL_STORAGE_SUPPORT = !IS_NODE && typeof localStorage === 'object',
	OBJECT_KEYS_NATIVE_SUPPORT = (Object.keys && any(Object.keys).toString()) === '[native code]';

export const MAP_SUPPORT = (() => {
	try {
		const
			tmp = new Map(),
			key = {};

		tmp.set(key, true);
		return tmp.get(key);

	} catch (ignore) {
		return false;
	}
})();

export const SET_SUPPORT = (() => {
	try {
		const
			tmp = new Set(),
			key = {};

		tmp.add(key);
		return tmp.has(key);

	} catch (ignore) {
		return false;
	}
})();

export const DESCRIPTORS_SUPPORT = (() => {
	try {
		return Object.getOwnPropertyDescriptor(Object.create(null, {foo: {enumerable: false}}), 'foo').enumerable === false;

	} catch (ignore) {
		return false;
	}
})();

export const JSON_SUPPORT = (() => {
	try {
		return JSON.parse(JSON.stringify({foo: 'bar'})).foo === 'bar';

	} catch (ignore) {
		return false;
	}
})();

export const CALLEE_SUPPORT = Boolean(eval(ws`
	(function () {
		'use strict';
		var res = true;

		try {
			arguments.callee;

		} catch (ignore) {
			res = false;
		}

		return res;
	})();
`));
