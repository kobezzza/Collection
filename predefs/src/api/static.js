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

/**
 * @typedef {{
 *   withAccessors: (boolean|undefined),
 *   withProto: (boolean|undefined),
 *   concatArray: (boolean|undefined),
 *   traits: (boolean|number|null|undefined),
 *   deep: (boolean|undefined)
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

/** @typedef {(?|Array)} */
var $$CollectionLink;

