/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

/**
 * @abstract
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
 * @typedef {{
 *   withAccessors: (?boolean|undefined),
 *   withDescriptor: (?boolean|undefined),
 *   withProto: (?boolean|undefined),
 *   concatArray: (?boolean|undefined),
 *   concatFn: (?function(!Array, !Array): ?|undefined),
 *   traits: (boolean|number|null|undefined),
 *   deep: (?boolean|undefined),
 *   filter: $$CollectionFilter,
 *   mult: (?boolean|undefined),
 *   count: (number|number|null|undefined),
 *   from: (number|number|null|undefined),
 *   startIndex: (number|number|null|undefined),
 *   endIndex: (number|number|null|undefined),
 *   reverse: (?boolean|undefined),
 *   inverseFilter: (?boolean|undefined),
 *   notOwn: (boolean|number|null|undefined),
 *   live: (?boolean|undefined),
 *   use: (?string|undefined),
 *   length: (?boolean|undefined),
 *   thread: (?boolean|undefined),
 *   priority: (?string|undefined),
 *   onChunk: (?$$CollectionThreadCb|undefined),
 *   onIterationEnd: (?$$CollectionThreadCb|undefined),
 *   result
 * }}
 */
var $$Collection_extend;

/** @type {?} */
var withAccessors;

/** @type {?} */
var withProto;

/** @type {?} */
var concatArray;

/** @type {?} */
var concatFn;

/** @type {?} */
var traits;

/** @type {?} */
var deep;

/**
 * @abstract
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
 * @abstract
 * @param {$$CollectionLink} link
 * @param {!Object} obj
 * @return {boolean}
 */
$C.in = function (link, obj) {};

/**
 * @abstract
 * @param {(Generator|?)} obj
 * @return {boolean}
 */
$C.destroy = function (obj) {};
