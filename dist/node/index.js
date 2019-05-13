'use strict';
/* eslint-disable no-useless-rename */

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

exports.__esModule = true;
exports.default = void 0;

var _core = _interopRequireDefault(require("./core"));

exports.default = _core.default;

require("./iterators/cache");

require("./iterators/for-each");

require("./iterators/helpers");

require("./iterators/extend");

require("./iterators/map");

require("./iterators/get");

require("./iterators/reduce");

require("./iterators/every");

require("./iterators/some");

require("./iterators/search");

require("./iterators/includes");

require("./iterators/group");

require("./iterators/remove");

require("./iterators/set");

require("./iterators/thread");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }