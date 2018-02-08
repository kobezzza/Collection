/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

/**
 * @param {$$CollectionType=} collection
 * @return {!$$Collection}
 */
function $C(collection) {}

/** @type {?} */
$C.cache = {
	/** @type {?} */
	cycle: {},

	/** @type {?} */
	str: {}
};

/** @type {?} */
$C.ready;

/** @type {?} */
$C.config = {};

/**
 * @param {(boolean|$$Collection_extend)} deepOrParams
 * @param {Object} target
 * @param {...Object} args
 * @return {!Object}
 */
$C.extend = function (deepOrParams, target, args) {};

/**
 * @param {?} obj
 * @return {?}
 */
$C.clone = function clone(obj) {};

/** @typedef {(?|Array)} */
var $$CollectionLink;

/**
 * @typedef {{
 *   test: (boolean|undefined),
 *   error: (boolean|undefined),
 *   delete: (boolean|undefined),
 *   value: (?|undefined),
 *   create: (boolean|undefined)
 * }}
 */
var $$Collection_byLink;

/**
 * @param {$$CollectionLink} link
 * @param {!Object} obj
 * @return {boolean}
 */
$C.in = function (link, obj) {};

/**
 * @param {(Generator|?)} obj
 * @return {(!Error|boolean)}
 */
$C.destroy = function (obj) {};
