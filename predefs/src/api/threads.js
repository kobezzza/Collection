/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

/**
 * @abstract
 * @return {{value, done: boolean}}
 */
Generator.prototype.next = function () {};

/** @type {boolean} */
Generator.prototype.pause;

/** @type {boolean} */
Generator.prototype.thread;

/** @type {string} */
Generator.prototype.priority;

/** @type {?} */
Generator.prototype.result;

/** @type {?} */
Generator.prototype.sleep;

/** @type {!Array} */
Generator.prototype.children;

/**
 * @abstract
 * @return {boolean}
 */
Generator.prototype.destroy = function () {};

/** @type {?function(this:?, ?)|undefined} */
Generator.prototype.onChunk;

/** @type {?function(this:?, ?)|undefined} */
Generator.prototype.onComplete;
