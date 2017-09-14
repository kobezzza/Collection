/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

/** @typedef {(Object|string|undefined)} */
var $$CollectionType;

/**
 * @interface
 * @param {$$CollectionType} collection
 */
function $$Collection(collection) {}

/** @type {!Array<number>} */
$$Collection.prototype.VERSION;

/**
 * @typedef {{
 *   true,
 *   false,
 *   $: !Object,
 *   info: !Object,
 *   result: ?,
 *   childResult: !Array,
 *   onError: (function(?)|undefined),
 *   value: ?,
 *   yield: function(?): boolean,
 *   next: function(?): boolean,
 *   child: function(!Promise): boolean,
 *   sleep: function(number, (function($$CollectionCtx): boolean)=, boolean=): !Promise,
 *   race: function((number|!Promise), !Promise=): !Promise,
 *   wait: function((number|!Promise), !Promise=): !Promise,
 *   jump: function(number): (number|boolean),
 *   i: function(number): (number|boolean),
 *   reset: boolean,
 *   break: boolean,
 *   thread: (!Generator|undefined),
 *   length: function(?boolean=): number
 * }}
 */
var $$CollectionCtx;

/** @type {?} */
var $;

/** @type {?} */
var info;

/** @type {?} */
var onError;

/** @type {?} */
var childResult;

/** @type {?} */
var next;

/** @type {?} */
var sleep;

/** @type {?} */
var race;

/** @type {?} */
var wait;

/** @type {?} */
var jump;

/** @type {?} */
var i;

/** @type {?} */
var reset;

/** @type {?} */
var thread;

/** @type {?} */
var length;

/** @typedef {function(?, ?, !Object, $$CollectionCtx): ?} */
var $$CollectionCb;

/** @typedef {function($$CollectionCtx): ?} */
var $$CollectionThreadCb;

/** @typedef {($$CollectionCb|Array<$$CollectionCb>|undefined)} */
var $$CollectionFilter;

/**
 * @typedef {{
 *   filter: $$CollectionFilter,
 *   mult: (?boolean|undefined),
 *   count: (number|number|null|undefined),
 *   from: (number|number|null|undefined),
 *   startIndex: (number|number|null|undefined),
 *   endIndex: (number|number|null|undefined),
 *   reverse: (?boolean|undefined),
 *   inverseFilter: (?boolean|undefined),
 *   withDescriptor: (?boolean|undefined),
 *   notOwn: (boolean|number|null|undefined),
 *   live: (?boolean|undefined),
 *   use: (?string|undefined),
 *   length: (?boolean|undefined),
 *   async: (?boolean|undefined),
 *   thread: (?boolean|undefined),
 *   priority: (?string|undefined),
 *   onChunk: (?$$CollectionThreadCb|undefined),
 *   onIterationEnd: (?$$CollectionThreadCb|undefined),
 *   result
 * }}
 */
var $$Collection_forEach;

/** @type {?} */
var async;

/** @type {?} */
var result;

/**
 * @param {$$CollectionCb} cb
 * @param {?$$Collection_forEach=} [opt_params]
 * @return {(!$$Collection|!Promise)}
 */
$$Collection.prototype.forEach = function (cb, opt_params) {};

/**
 * @typedef {{
 *   filter: $$CollectionFilter,
 *   mult: (?boolean|undefined),
 *   count: (number|number|null|undefined),
 *   from: (number|number|null|undefined),
 *   startIndex: (number|number|null|undefined),
 *   endIndex: (number|number|null|undefined),
 *   reverse: (?boolean|undefined),
 *   inverseFilter: (?boolean|undefined),
 *   withDescriptor: (?boolean|undefined),
 *   notOwn: (boolean|number|null|undefined),
 *   live: (?boolean|undefined),
 *   use: (?string|undefined),
 *   length: (?boolean|undefined),
 *   async: (?boolean|undefined),
 *   thread: (?boolean|undefined),
 *   priority: (?string|undefined),
 *   onChunk: (?$$CollectionThreadCb|undefined),
 *   onIterationEnd: (?$$CollectionThreadCb|undefined)
 * }}
 */
var $$CollectionBase;

/** @type {?} */
var filter;

/** @type {?} */
var mult;

/** @type {?} */
var count;

/** @type {?} */
var from;

/** @type {?} */
var startIndex;

/** @type {?} */
var endIndex;

/** @type {?} */
var reverse;

/** @type {?} */
var inverseFilter;

/** @type {?} */
var withDescriptor;

/** @type {?} */
var notOwn;

/** @type {?} */
var live;

/** @type {?} */
var use;

/** @type {?} */
var priority;

/** @type {?} */
var onChunk;

/** @type {?} */
var onIterationEnd;

/**
 * @typedef {{
 *   filter: $$CollectionFilter,
 *   count: (number|number|null|undefined),
 *   from: (number|number|null|undefined),
 *   startIndex: (number|number|null|undefined),
 *   endIndex: (number|number|null|undefined),
 *   reverse: (?boolean|undefined),
 *   inverseFilter: (?boolean|undefined),
 *   withDescriptor: (?boolean|undefined),
 *   notOwn: (boolean|number|null|undefined),
 *   live: (?boolean|undefined),
 *   use: (?string|undefined),
 *   length: (?boolean|undefined),
 *   async: (?boolean|undefined),
 *   thread: (?boolean|undefined),
 *   priority: (?string|undefined),
 *   onChunk: (?$$CollectionThreadCb|undefined),
 *   onIterationEnd: (?$$CollectionThreadCb|undefined)
 * }}
 */
var $$CollectionSingleBase;

/**
 * @param {($$CollectionFilter|$$CollectionBase)=} [opt_filter]
 * @param {?$$CollectionBase=} [opt_params]
 * @return {(number|!Promise)}
 */
$$Collection.prototype.length = function (opt_filter, opt_params) {};

/**
 * @param {($$CollectionFilter|$$CollectionBase|$$CollectionLink)=} [opt_filter]
 * @param {?$$CollectionBase=} [opt_params]
 * @return {(?|!Array|!Promise)}
 */
$$Collection.prototype.get = function (opt_filter, opt_params) {};

/**
 * @typedef {{
 *   filter: $$CollectionFilter,
 *   mult: (?boolean|undefined),
 *   count: (number|number|null|undefined),
 *   from: (number|number|null|undefined),
 *   startIndex: (number|number|null|undefined),
 *   endIndex: (number|number|null|undefined),
 *   reverse: (?boolean|undefined),
 *   inverseFilter: (?boolean|undefined),
 *   withDescriptor: (?boolean|undefined),
 *   notOwn: (boolean|number|null|undefined),
 *   live: (?boolean|undefined),
 *   use: (?string|undefined),
 *   length: (?boolean|undefined),
 *   async: (?boolean|undefined),
 *   thread: (?boolean|undefined),
 *   priority: (?string|undefined),
 *   onChunk: (?$$CollectionThreadCb|undefined),
 *   onIterationEnd: (?$$CollectionThreadCb|undefined),
 *   initial: (Object|undefined)
 * }}
 */
var $$Collection_map;

/** @type {?} */
var initial;

/**
 * @param {($$CollectionCb|$$Collection_map)} cb
 * @param {($$Collection_map|$$CollectionFilter)=} [opt_params]
 * @return {(?|!Promise)}
 */
$$Collection.prototype.map = function (cb, opt_params) {};

/** @typedef {function(?, ?, ?, !Object, $$CollectionCtx): ?} */
var $$CollectionReduceCb;

/**
 * @param {$$CollectionReduceCb} cb
 * @param {?=} [opt_initialValue]
 * @param {($$CollectionFilter|$$CollectionBase)=} [opt_filter]
 * @param {?$$CollectionBase=} [opt_params]
 * @return {(?|!Promise)}
 */
$$Collection.prototype.reduce = function (cb, opt_initialValue, opt_filter, opt_params) {};

/**
 * @param {($$CollectionFilter|$$CollectionSingleBase)=} [opt_filter]
 * @param {?$$CollectionSingleBase=} [opt_params]
 * @return {(boolean|!Promise)}
 */
$$Collection.prototype.every = function (opt_filter, opt_params) {};

/**
 * @param {($$CollectionFilter|$$CollectionSingleBase)=} [opt_filter]
 * @param {?$$CollectionSingleBase=} [opt_params]
 * @return {(boolean|!Promise)}
 */
$$Collection.prototype.some = function (opt_filter, opt_params) {};

/**
 * @param {($$CollectionFilter|$$CollectionBase)=} [opt_filter]
 * @param {?$$CollectionBase=} [opt_params]
 * @return {(?|!Array|!Promise<(?|!Array)>)}
 */
$$Collection.prototype.search = function (opt_filter, opt_params) {};

/**
 * @param {?} searchElement
 * @param {($$CollectionFilter|$$CollectionSingleBase)=} [opt_filter]
 * @param {?$$CollectionSingleBase=} [opt_params]
 * @return {(boolean|!Promise<boolean>)}
 */
$$Collection.prototype.includes = function (searchElement, opt_filter, opt_params) {};

/**
 * @typedef {{
 *   useMap: (?boolean|undefined),
 *   saveKeys: (?boolean|undefined),
 *   filter: $$CollectionFilter,
 *   count: (number|number|null|undefined),
 *   from: (number|number|null|undefined),
 *   startIndex: (number|number|null|undefined),
 *   endIndex: (number|number|null|undefined),
 *   reverse: (?boolean|undefined),
 *   inverseFilter: (?boolean|undefined),
 *   withDescriptor: (?boolean|undefined),
 *   notOwn: (boolean|number|null|undefined),
 *   live: (?boolean|undefined),
 *   use: (?string|undefined),
 *   length: (?boolean|undefined),
 *   async: (?boolean|undefined),
 *   thread: (?boolean|undefined),
 *   priority: (?string|undefined),
 *   onChunk: (?$$CollectionThreadCb|undefined),
 *   onIterationEnd: (?$$CollectionThreadCb|undefined)
 * }}
 */
var $$Collection_group;

/** @type {?} */
var useMap;

/** @type {?} */
var saveKeys;

/**
 * @param {($$CollectionLink|$$CollectionCb)=} [opt_field]
 * @param {($$CollectionFilter|$$Collection_group)=} [opt_filter]
 * @param {?$$Collection_group=} [opt_params]
 * @return {(!Object|!Map|!Promise<(!Object|!Map)>)}
 */
$$Collection.prototype.group = function (opt_field, opt_filter, opt_params) {};

/** @typedef {({result: boolean, key, value, notFound: (boolean|undefined)}|!Array<{result: boolean, key, value, notFound: (boolean|undefined)}>)} */
var $$CollectionReport;

/** @type {?} */
var notFound;

/**
 * @param {($$CollectionFilter|$$CollectionBase|$$CollectionLink)=} [opt_filter]
 * @param {?$$CollectionBase=} [opt_params]
 * @return {($$CollectionReport|!Promise<$$CollectionReport>)}
 */
$$Collection.prototype.remove = function (opt_filter, opt_params) {};

/** @typedef {({result: boolean, key, value, newValue, notFound: (boolean|undefined)}|!Array<{result: boolean, key, value, newValue, notFound: (boolean|undefined)}>)} */
var $$CollectionSetReport;

/** @type {?} */
var newValue;

/**
 * @typedef {{
 *   filter: $$CollectionFilter,
 *   create: (?boolean|undefined),
 *   key: ($$CollectionLink|undefined),
 *   mult: (?boolean|undefined),
 *   count: (number|number|null|undefined),
 *   from: (number|number|null|undefined),
 *   startIndex: (number|number|null|undefined),
 *   endIndex: (number|number|null|undefined),
 *   reverse: (?boolean|undefined),
 *   inverseFilter: (?boolean|undefined),
 *   withDescriptor: (?boolean|undefined),
 *   notOwn: (boolean|number|null|undefined),
 *   live: (?boolean|undefined),
 *   use: (?string|undefined),
 *   length: (?boolean|undefined),
 *   async: (?boolean|undefined),
 *   thread: (?boolean|undefined),
 *   priority: (?string|undefined),
 *   onChunk: (?$$CollectionThreadCb|undefined),
 *   onIterationEnd: (?$$CollectionThreadCb|undefined)
 * }}
 */
var $$Collection_set;

/** @type {?} */
var create;

/** @type {?} */
var key;

/**
 * @param {(?|$$CollectionCb)} value
 * @param {($$CollectionFilter|$$Collection_set|$$CollectionLink)=} filter
 * @param {?$$Collection_set=} [opt_params]
 * @return {($$CollectionSetReport|!Promise<$$CollectionSetReport>)}
 */
$$Collection.prototype.set = function (value, filter, opt_params) {};

/**
 * @typedef {{
 *   withUndef: (?boolean|undefined),
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
 *   async: (?boolean|undefined),
 *   thread: (?boolean|undefined),
 *   priority: (?string|undefined),
 *   onChunk: (?$$CollectionThreadCb|undefined),
 *   onIterationEnd: (?$$CollectionThreadCb|undefined)
 * }}
 */
var $$Collection_extend;

/** @type {?} */
var withUndef;

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
 * @param {(boolean|$$Collection_extend)} deepOrParams
 * @param {...Object} args
 * @return {!Object}
 */
$$Collection.prototype.extend = function (deepOrParams, args) {};

/**
 * @param {...(($$CollectionFilter|Array<$$CollectionFilter>|undefined))} filter
 * @return {!$$Collection}
 */
$$Collection.prototype.filter = function (filter) {};

/**
 * @param {(?string|$$CollectionThreadCb)=} [opt_priority]
 * @param {?$$CollectionThreadCb=} [opt_onChunk]
 * @return {!$$Collection}
 */
$$Collection.prototype.thread = function (opt_priority, opt_onChunk) {};

/**
 * @param {number} value
 * @return {!$$Collection}
 */
$$Collection.prototype.start = function (value) {};

/**
 * @param {number} value
 * @return {!$$Collection}
 */
$$Collection.prototype.end = function (value) {};

/**
 * @param {number} value
 * @return {!$$Collection}
 */
$$Collection.prototype.from = function (value) {};

/**
 * @param {number} value
 * @return {!$$Collection}
 */
$$Collection.prototype.count = function (value) {};

/**
 * @param {(boolean|number|null)=} [opt_notOwn]
 * @return {!$$Collection}
 */
$$Collection.prototype.object = function (opt_notOwn) {};

/** @type {{get: function (): !$$Collection}} */
$$Collection.prototype.async;

/** @type {{get: function (): !$$Collection}} */
$$Collection.prototype.live;

/** @type {{get: function (): !$$Collection}} */
$$Collection.prototype.descriptor;

/** @type {{get: function (): !$$Collection}} */
$$Collection.prototype.iterator;

/** @type {{get: function (): !$$Collection}} */
$$Collection.prototype.array;

/** @type {{get: function (): !$$Collection}} */
$$Collection.prototype.one;

/** @type {{get: function (): !$$Collection}} */
$$Collection.prototype.inverse;

/** @type {{get: function (): !$$Collection}} */
$$Collection.prototype.reverse;
