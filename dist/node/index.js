'use strict';
/* eslint-disable no-useless-rename */

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
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _core.default;
  }
});

var _core = _interopRequireDefault(require("./core"));

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