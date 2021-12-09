/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */


/** @typedef {(Object|string|number|undefined)} */
var $$CollectionType;

/**
 * @interface
 * @param {$$CollectionType} collection
 */
function $$Collection(collection) {}

/**
 * @typedef {{
 *   true,
 *   false,
 *   cursor: (stream.ReadableStream|IDBRequest),
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
 *   race: function((number|!Promise), (string|symbol|!Promise)=, !Promise=): !Promise,
 *   wait: function((number|!Promise), (string|symbol|!Promise)=, !Promise=): !Promise,
 *   jump: function(number): (number|boolean),
 *   i: function(number): (number|boolean),
 *   id: number,
 *   reset: boolean,
 *   break: boolean,
 *   thread: (!Generator|undefined),
 *   length: function(?boolean=): number
 * }}
 */
var $$CollectionCtx;

/** @type {?} */
var cursor;

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
var id;

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
 *   use: (?'for'|'for of'|'for in'|undefined),
 *   length: (?boolean|undefined),
 *   async: (?boolean|undefined),
 *   parallel: (boolean|number|null|undefined),
 *   race: (boolean|number|null|undefined),
 *   thread: (?boolean|undefined),
 *   priority: (?'low'|'normal'|'hight'|'critical'|undefined),
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

/** @type {?} */
var parallel;

/**
 * @param {?$$CollectionCb=} [opt_cb]
 * @param {?$$Collection_forEach=} [opt_params]
 * @return {(!$$Collection|!Promise)}
 */
$$Collection.prototype.forEach = function (opt_cb, opt_params) {};

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
 *   use: (?'for'|'for of'|'for in'|undefined),
 *   length: (?boolean|undefined),
 *   async: (?boolean|undefined),
 *   parallel: (boolean|number|null|undefined),
 *   race: (boolean|number|null|undefined),
 *   thread: (?boolean|undefined),
 *   priority: (?'low'|'normal'|'hight'|'critical'|undefined),
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
 *   use: (?'for'|'for of'|'for in'|undefined),
 *   length: (?boolean|undefined),
 *   async: (?boolean|undefined),
 *   thread: (?boolean|undefined),
 *   parallel: (boolean|number|null|undefined),
 *   race: (boolean|number|null|undefined),
 *   priority: (?'low'|'normal'|'hight'|'critical'|undefined),
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
 *   use: (?'for'|'for of'|'for in'|undefined),
 *   length: (?boolean|undefined),
 *   async: (?boolean|undefined),
 *   parallel: (boolean|number|null|undefined),
 *   race: (boolean|number|null|undefined),
 *   thread: (?boolean|undefined),
 *   priority: (?'low'|'normal'|'hight'|'critical'|undefined),
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
 * @param {(?|$$CollectionFilter|$$CollectionBase)=} [opt_initialValue]
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
 *   use: (?'for'|'for of'|'for in'|undefined),
 *   length: (?boolean|undefined),
 *   async: (?boolean|undefined),
 *   parallel: (boolean|number|null|undefined),
 *   race: (boolean|number|null|undefined),
 *   thread: (?boolean|undefined),
 *   priority: (?'low'|'normal'|'hight'|'critical'|undefined),
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
 *   use: (?'for'|'for of'|'for in'|undefined),
 *   length: (?boolean|undefined),
 *   async: (?boolean|undefined),
 *   parallel: (boolean|number|null|undefined),
 *   race: (boolean|number|null|undefined),
 *   thread: (?boolean|undefined),
 *   priority: (?'low'|'normal'|'hight'|'critical'|undefined),
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
 *   concatFn: (?function(!Array, !Array, ?): ?|undefined),
 *   extendFilter: (?function(?, ?, ?): ?|undefined),
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
 *   use: (?'for'|'for of'|'for in'|undefined),
 *   length: (?boolean|undefined),
 *   async: (?boolean|undefined),
 *   parallel: (boolean|number|null|undefined),
 *   race: (boolean|number|null|undefined),
 *   thread: (?boolean|undefined),
 *   priority: (?'low'|'normal'|'hight'|'critical'|undefined),
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
var extendFilter;

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

/**
 * @param {?boolean=} [opt_async]
 * @return {!$$Collection}
 */
$$Collection.prototype.iterator = function (opt_async) {};

/**
 * @param {?} value
 * @return {!$$Collection}
 */
$$Collection.prototype.to = function (value) {};

/**
 * @param {?boolean=} [opt_readObj]
 * @param {?boolean=} [opt_writeObj=opt_readObj]
 * @return {!Collection}
 */
$$Collection.prototype.toStream = function (opt_readObj, opt_writeObj) {};

/**
 * @param {(boolean|number|null)=} [opt_max]
 * @return {!$$Collection}
 */
$$Collection.prototype.parallel = function (opt_max) {};

/**
 * @param {(boolean|number|null)=} [opt_max]
 * @return {!$$Collection}
 */
$$Collection.prototype.race = function (opt_max) {};

/** @type {{get: function (): !$$Collection}} */
$$Collection.prototype.live;

/** @type {{get: function (): !$$Collection}} */
$$Collection.prototype.descriptor;

/** @type {{get: function (): !$$Collection}} */
$$Collection.prototype.array;

/** @type {{get: function (): !$$Collection}} */
$$Collection.prototype.one;

/** @type {{get: function (): !$$Collection}} */
$$Collection.prototype.inverse;

/** @type {{get: function (): !$$Collection}} */
$$Collection.prototype.reverse;

/** @type {?} */
var keys;

/** @type {?} */
var value;

/** @type {?} */
var values;

/** @type {?} */
var type;

/** @type {?} */
var done;

/** @type {?} */
var get;

/** @type {?} */
var set;

/** @type {?} */
var call;

/** @type {?} */
var children;

/** @type {?} */
var ctx;

/** @type {?} */
var destroy;

/** @type {?} */
var destroyed;

/** @type {?} */
var localStorage;

/** @type {?} */
var getItem;

/** @type {?} */
var setItem;

/** @type {?} */
var data;

/** @type {?} */
var cb;

/** @type {?} */
var cbLength;

/** @type {?} */
var filters;

/** @type {?} */
var fLength;

/** @type {?} */
var onComplete;

/** @type {?} */
var readableObjectMode;

/** @type {?} */
var writableObjectMode;

/** @type {?} */
var writableLength;

/** @type {?} */
var writableHighWaterMark;

/** @type {?} */
var transform;

/** @type {?} */
var addListener;

/** @type {?} */
var removeListener;

/** @type {?} */
var read;

/** @type {?} */
var pipe;

/** @type {?} */
var resume;

/** @type {?} */
var pause;

/** @type {?} */
var write;

/** @type {?} */
var end;

/** @type {?} */
var notAsync;

/** @type {?} */
var priorities;

/** @type {?} */
var maxParallel;

/** @type {?} */
var TRUE;

/** @type {?} */
var FALSE;

/** @type {?} */
var IGNORE;



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
$C.VERSION;

/** @type {?} */
$C.CACHE_VERSION;

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
