'use strict';
/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ws = ws;
const wsRgxp = /^\s+|[\r\n]+/mg;
/**
 * String tag (for ES6 string templates) to truncate starting white spaces and eol-s
 *
 * @param {!Array<string>} strings
 * @param {...?} expr
 * @return {string}
 */

function ws(strings, expr) {
  expr = [];

  for (let i = 1; i < arguments.length; i++) {
    expr.push(arguments[i]);
  }

  let res = '';

  for (let i = 0; i < strings.length; i++) {
    res += strings[i].replace(wsRgxp, ' ') + (i in expr ? expr[i] : '');
  }

  return res;
}