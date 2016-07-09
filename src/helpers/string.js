'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

const
	wsRgxp = /^\s+|[\r\n]+/mg;

/**
 * String tag (for ES6 string templates) for truncate starting whitespaces and eol-s
 *
 * @param {!Array<string>} strings
 * @param {...?} expr
 * @return {string}
 */
export function ws(strings, expr) {
	expr = [].slice.call(arguments, 1);

	let
		res = '';

	for (let i = 0; i < strings.length; i++) {
		res += strings[i].replace(wsRgxp, ' ') + (i in expr ? expr[i] : '');
	}

	return res;
}
