/*!
 * Collection v6.8.1 (node)
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 *
 * Date: 'Fri, 10 Mar 2023 14:12:19 GMT
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('Collection', factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.$C = factory());
})(this, (function () { 'use strict';

		/**
	 * Converts the specified object to an unknown type
	 * (for the GCC)
	 *
	 * @param {?} val - source object
	 * @return {?}
	 */

	function any(val) {
	  return val;
	}

	function _typeof(obj) {
	  "@babel/helpers - typeof";

	  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	    _typeof = function (obj) {
	      return typeof obj;
	    };
	  } else {
	    _typeof = function (obj) {
	      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	    };
	  }

	  return _typeof(obj);
	}

	function _taggedTemplateLiteral(strings, raw) {
	  if (!raw) {
	    raw = strings.slice(0);
	  }

	  return Object.freeze(Object.defineProperties(strings, {
	    raw: {
	      value: Object.freeze(raw)
	    }
	  }));
	}

		var TRUE = [],
	    FALSE = [],
	    IGNORE = [],
	    EMPTY = [];

	var asyncTypes = {
	  'stream': true,
	  'isIDBRequest': true
	};
	var mapSet = {
	  'map': true,
	  'set': true
	};
	var weakTypes = {
	  'weakMap': true,
	  'weakSet': true
	};
	var iterators = {
	  'iterator': true,
	  'asyncIterator': true,
	  'generator': true,
	  'stream': true,
	  'idbRequest': true
	};
	/**
	 * Returns true if the specified value is a function
	 *
	 * @param {?} obj - source value
	 * @return {boolean}
	 */

	function isFunction(obj) {
	  return typeof obj === 'function';
	}
	/**
	 * Returns true if the specified value is a number
	 *
	 * @param {?} obj - source value
	 * @return {boolean}
	 */

	function isNumber(obj) {
	  return typeof obj === 'number';
	}
	/**
	 * Returns true if the specified value is a string
	 *
	 * @param {?} obj - source value
	 * @return {boolean}
	 */

	function isString(obj) {
	  return typeof obj === 'string';
	}
	/**
	 * Returns true if the specified value is a boolean
	 *
	 * @param {?} obj - source value
	 * @return {boolean}
	 */

	function isBoolean(obj) {
	  return typeof obj === 'boolean';
	}
	/**
	 * Returns true if the specified value is an array
	 *
	 * @param {?} obj - source value
	 * @return {boolean}
	 */

	function isArray(obj) {
	  return Array.isArray(obj) || obj instanceof Array;
	}
	/**
	 * Returns true if the specified value is a Map instance
	 *
	 * @param {?} obj - source value
	 * @return {boolean}
	 */

	function isMap(obj) {
	  return typeof Map === 'function' && obj instanceof Map;
	}
	/**
	 * Returns true if the specified value is a WeakMap instance
	 *
	 * @param {?} obj - source value
	 * @return {boolean}
	 */

	function isWeakMap(obj) {
	  return typeof WeakMap === 'function' && obj instanceof WeakMap;
	}
	/**
	 * Returns true if the specified value is a Set instance
	 *
	 * @param {?} obj - source value
	 * @return {boolean}
	 */

	function isSet(obj) {
	  return typeof Set === 'function' && obj instanceof Set;
	}
	/**
	 * Returns true if the specified value is a WeakSet instance
	 *
	 * @param {?} obj - source value
	 * @return {boolean}
	 */

	function isWeakSet(obj) {
	  return typeof WeakSet === 'function' && obj instanceof WeakSet;
	}
	/**
	 * Returns true if the specified value is a Promise instance
	 *
	 * @param {?} obj - source value
	 * @return {boolean}
	 */

	function isPromise(obj) {
	  return Boolean(obj && isFunction(obj.then) && isFunction(obj.catch));
	}
	/**
	 * Returns true if the specified value is a plain object
	 *
	 * @param {?} obj - source value
	 * @return {boolean}
	 */

	function isPlainObject(obj) {
	  return Boolean(obj) && obj.constructor === Object;
	}
	var objectTypes = {
	  'object': true,
	  'function': true
	};
	/**
	 * Returns true if the specified value is an object instance
	 *
	 * @param {?} obj - source value
	 * @return {boolean}
	 */

	function isObjectInstance(obj) {
	  return Boolean(obj) && objectTypes[_typeof(obj)];
	}
	var isFuncRgxp = /\[object Function]/,
	    toString = {}.toString;
	/**
	 * Returns true if the specified value is an array or like an array
	 *
	 * @param {?} obj - source value
	 * @return {boolean}
	 */

	function isLikeArray(obj) {
	  var res = isArray(obj) || obj && // The hack for PhantomJS,
	  // because it has strange bug for HTMLCollection and NodeList:
	  // typeof 'function' && instanceof Function = false
	  isObjectInstance(obj) && !isFuncRgxp.test(toString.call(obj)) && ( // If the object is like an array
	  obj.length > 0 && 0 in obj || obj.length === 0);
	  return Boolean(res);
	}
	/**
	 * Returns true if the specified value is a generator
	 *
	 * @param {?} obj - source value
	 * @return {boolean}
	 */

	function isGenerator(obj) {
	  return isFunction(obj) && obj.constructor.name === 'GeneratorFunction';
	}
	/**
	 * Returns true if the specified value is an iterator
	 *
	 * @param {?} obj - source value
	 * @return {boolean}
	 */

	function isIterator(obj) {
	  return Boolean(obj && (typeof Symbol === 'function' ? obj[Symbol.iterator] : isFunction(obj['@@iterator'])));
	}
	/**
	 * Returns true if the specified value is a stream
	 *
	 * @param {?} obj - source value
	 * @return {boolean}
	 */

	function isStream(obj) {
	  return Boolean(obj && isFunction(obj.addListener) && isFunction(obj.removeListener) && isFunction(obj.destroy) && (isFunction(obj.write) && isFunction(obj.end) || isFunction(obj.pipe) && isFunction(obj.read) && isFunction(obj.pause) && isFunction(obj.resume)));
	}
	/**
	 * Returns true if the specified value is a IDBRequest instance
	 *
	 * @param {?} obj - source value
	 * @return {boolean}
	 */

	function isIDBRequest(obj) {
	  return typeof IDBRequest === 'function' && obj instanceof IDBRequest;
	}
	/**
	 * Returns the current type of an object
	 *
	 * @param {Object} obj - source object
	 * @param {?string=} [opt_use] - cycle type for iteration: for, for in, for of, async for of, sync for of
	 * @return {?string}
	 */

	function getType(obj, opt_use) {
	  if (!obj) {
	    return null;
	  }

	  switch (opt_use) {
	    case 'for':
	      return 'array';

	    case 'for in':
	      return 'object';

	    case 'for of':
	      return 'iterator';

	    case 'sync for of':
	      return 'syncIterator';

	    case 'async for of':
	      return 'asyncIterator';

	    default:
	      if (obj === EMPTY) {
	        return null;
	      }

	      if (isMap(obj)) {
	        return 'map';
	      }

	      if (isWeakMap(obj)) {
	        return 'weakMap';
	      }

	      if (isSet(obj)) {
	        return 'set';
	      }

	      if (isWeakSet(obj)) {
	        return 'weakSet';
	      }

	      if (isGenerator(obj)) {
	        return 'generator';
	      }

	      if (isLikeArray(obj)) {
	        return 'array';
	      }

	      if (isIterator(obj)) {
	        return 'iterator';
	      }

	      if (isIDBRequest(obj)) {
	        return 'idbRequest';
	      }

	      if (isStream(obj)) {
	        return 'stream';
	      }

	  }

	  return 'object';
	}
	var isNative = /\[native code]/;
	/**
	 * Returns a new object with the same type as the specified source
	 *
	 * @param {?} obj - source object
	 * @return {?}
	 */

	function getSameAs(obj) {
	  if (!obj) {
	    return false;
	  }

	  if (isArray(obj)) {
	    return [];
	  }

	  if (isPlainObject(obj)) {
	    return {};
	  }

	  if (isMap(obj)) {
	    return new Map();
	  }

	  if (isSet(obj)) {
	    return new Set();
	  }

	  return isFunction(obj.constructor) && !isNative.test(obj.constructor.toString()) ? {} : false;
	}
	/**
	 * Returns true if the specified object is one of JS data structures
	 *
	 * @param {?} obj - source object
	 * @return {boolean}
	 */

	function isStructure(obj) {
	  if (!obj) {
	    return false;
	  }

	  if (isArray(obj) || isPlainObject(obj) || isMap(obj) || isSet(obj)) {
	    return true;
	  }

	  return isFunction(obj.constructor) && !isNative.test(obj.constructor.toString());
	}
	/**
	 * Returns true if a prototype of the specified object can be extended
	 *
	 * @param {?} obj - source object
	 * @return {boolean}
	 */

	function canExtendProto(obj) {
	  if (!obj) {
	    return false;
	  }

	  if (isArray(obj) || isPlainObject(obj)) {
	    return true;
	  }

	  return isFunction(obj.constructor) && !isNative.test(obj.constructor.toString());
	}
	/**
	 * Returns true if the specified object is positive (not equals FALSE and IGNORE)
	 *
	 * @param {?} obj - source object
	 * @return {boolean}
	 */

	function isPositive(obj) {
	  return obj !== FALSE && obj !== IGNORE;
	}

	/**
	 * Collection constructor
	 *
	 * @constructor
	 * @implements {$$Collection}
	 * @param {$$CollectionType} obj
	 */

	function Collection(obj) {
	  this._init();

	  if (isString(obj)) {
	    this.data = obj.split('');
	  } else if (isNumber(obj)) {
	    var i = isFinite(obj) ? Math.abs(obj) : false,
	        done = false,
	        value;
	    this.p.use = 'for of';
	    this.data = {
	      next: function next() {
	        done = i === false ? done : done || !i--;
	        return {
	          done: done,
	          value: value
	        };
	      },
	      throw: function _throw(err) {
	        throw err;
	      },
	      return: function _return(v) {
	        done = true;
	        value = v;
	      }
	    };
	  } else {
	    this.data = isObjectInstance(obj) ? any(obj) : [];
	  }
	}
	/**
	 * @private
	 * @return {!Object}
	 */

	Collection.prototype._init = function () {
	  var old = this.p;
	  this.p = new P();
	  return old;
	};
	/** @constructor */


	function P() {
	  Object.assign(this, {
	    mult: true,
	    count: false,
	    from: false,
	    startIndex: false,
	    endIndex: false,
	    reverse: false,
	    inverseFilter: false,
	    withDescriptor: false,
	    notOwn: false,
	    live: false,
	    async: false,
	    thread: false,
	    length: true,
	    parallel: false,
	    race: false,
	    filter: []
	  }, $C.config);
	}
	Object.assign($C, {
	  config: {}
	});
	/**
	 * Library version
	 * @const
	 */

	$C.VERSION = [6, 8, 1];
	/**
	 * Cache version
	 * @const
	 */

	$C.CACHE_VERSION = 66;
	/**
	 * Creates an instance of Collection
	 * @param {$$CollectionType} obj
	 */

	function $C(obj) {
	  return new Collection(obj);
	}

		var wsRgxp = /^\s+|[\r\n]+/mg;
	/**
	 * String tag (for ES6 string templates) to truncate starting white spaces and eol-s
	 *
	 * @param {!Array<string>} strings
	 * @param {...?} expr
	 * @return {string}
	 */

	function ws(strings, expr) {
	  expr = [];

	  for (var i = 1; i < arguments.length; i++) {
	    expr.push(arguments[i]);
	  }

	  var res = '';

	  for (var _i = 0; _i < strings.length; _i++) {
	    res += strings[_i].replace(wsRgxp, ' ') + (_i in expr ? expr[_i] : '');
	  }

	  return res;
	}

	var GLOBAL = new Function('return this')();
	var IS_NODE = function () {
	  try {
	    return (typeof process === "undefined" ? "undefined" : _typeof(process)) === 'object' && {}.toString.call(process) === '[object process]';
	  } catch (_unused) {
	    return false;
	  }
	}();
	var IS_BROWSER = !IS_NODE && (typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object',
	    BLOB_SUPPORT = IS_BROWSER && typeof Blob === 'function' && typeof URL === 'function',
	    OBJECT_KEYS_NATIVE_SUPPORT = isNative.test(Object.keys && any(Object.keys).toString()),
	    OBJECT_ASSIGN_NATIVE_SUPPORT = isNative.test(Object.assign && any(Object.assign).toString()),
	    SYMBOL_NATIVE_SUPPORT = typeof Symbol === 'function' && isNative.test(Symbol.toString());
	var LOCAL_STORAGE_SUPPORT = !IS_NODE && function () {
	  var mod = String(Math.random());

	  try {
	    localStorage.setItem(mod, mod);
	    localStorage.removeItem(mod);
	    return true;
	  } catch (_unused2) {
	    return false;
	  }
	}();

	Object.assign($C, {
	  ready: false,
	  cache: {
	    str: {},
	    cycle: {}
	  }
	});
	var LOCAL_CACHE = GLOBAL['COLLECTION_LOCAL_CACHE'] !== false;
	var compiledCycles = $C.cache.cycle,
	    localCacheAttrs = GLOBAL['COLLECTION_LOCAL_CACHE_ATTRS'] || {};

	var NAMESPACE = '__COLLECTION_NAMESPACE__https_github_com_kobezzza_Collection';
	GLOBAL[NAMESPACE] = $C;
	var LENGTH_REQUEST = SYMBOL_NATIVE_SUPPORT ? Symbol('Data length query') : '__COLLECTION_TMP__lengthQuery',
	    FN_LENGTH = SYMBOL_NATIVE_SUPPORT ? Symbol('Function length') : '__COLLECTION_TMP__length';
	var CACHE_KEY = '__COLLECTION_CACHE__',
	    CACHE_VERSION_KEY = '__COLLECTION_CACHE_VERSION__';

	var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10, _templateObject11, _templateObject12, _templateObject13, _templateObject14, _templateObject15, _templateObject16, _templateObject17, _templateObject18, _templateObject19, _templateObject20, _templateObject21, _templateObject22, _templateObject23, _templateObject24, _templateObject25, _templateObject26, _templateObject27, _templateObject28, _templateObject29, _templateObject30, _templateObject31, _templateObject32, _templateObject33, _templateObject34, _templateObject35, _templateObject36, _templateObject37, _templateObject38, _templateObject39, _templateObject40, _templateObject41, _templateObject42, _templateObject43, _templateObject44, _templateObject45, _templateObject46, _templateObject47, _templateObject48;
	var cacheTimer;
	var cycles = $C.cache.str;
	/**
	 * Returns a cache string by an object
	 *
	 * @param {?} cache - cache object
	 * @return {string}
	 */

	function returnCache(cache) {
	  var text = '';

	  for (var key in cache) {
	    if (!cache.hasOwnProperty(key)) {
	      continue;
	    }

	    text += cache[key];
	  }

	  return text;
	}
	var cbArgsList = ['el', 'key', 'data', 'ctx'];
	var filterArgsList = ['el', 'key', 'data', 'fCtx'];
	var asyncIterators = {
	  'generator': true,
	  'iterator': true
	};
	/**
	 * Compiles a loop by the specified parameters
	 *
	 * @param {string} key - cache key
	 * @param {!Object} p - compile parameters
	 * @return {!Function}
	 */

	function compileCycle(key, p) {
	  var isMapSet = mapSet[p.type];
	  var cantModI = !(p.type === 'array' || p.reverse || p.type === 'object' && p.notOwn && OBJECT_KEYS_NATIVE_SUPPORT);
	  var cbArgs = cbArgsList.slice(0, p.length ? p.cbArgs : cbArgsList.length),
	      filterArgs = [],
	      fLength = p.filter.length;
	  var needParallel = p.parallel || p.race,
	      parallelFn = p.parallel ? 'wait' : 'race';
	  var maxArgsLength = p.length ? Math.max.apply(null, [].concat(p.cbArgs, p.filterArgs)) : cbArgsList.length,
	      needCtx = maxArgsLength > 3 || needParallel || p.thread;

	  for (var i = 0; i < fLength; i++) {
	    filterArgs.push(filterArgsList.slice(0, p.length ? p.filterArgs[i] : filterArgsList.length));
	  }

	  var resolveFilterVal = 'f = f && f !== FALSE || f === TRUE;',
	      resolveFilterValCb = "".concat(p.inverseFilter ? '!' : '', "f && f !== FALSE || f === TRUE"),
	      callCycleFilter = "filters[fI](".concat(filterArgsList.slice(0, p.length ? maxArgsLength : filterArgsList.length), ")");
	  var iFn = ws(_templateObject || (_templateObject = _taggedTemplateLiteral(["\nvar\ndata = o.data,\ncb = o.cb,\nbaseCb = cb,\nfilters = o.filters;\nvar\ncount = o.count,\nfrom = o.from,\nstartIndex = o.startIndex || 0,\nendIndex = o.endIndex !== false ? o.endIndex : 0;\nvar\nonIterationEnd = o.onIterationEnd,\nonComplete = o.onComplete,\nonError = o.onError;\nvar\nTRUE = o.TRUE,\nFALSE = o.FALSE,\nIGNORE = o.IGNORE;\nvar\ni = -1,\nj = 0,\nn = -1,\nid = 0,\nfI = -1;\nvar\nbreaker = false,\nbrkIf = false;\nvar\nlimit = 1,\nlooper = 0,\nchildResult;\nvar\nfLength = filters.length,\nlength,\nr,\nf;\nvar\nel,\nkey;\n"])));

	  if (p.withDescriptor) {
	    if (p.withProto) {
	      iFn += ws(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\nvar\n_getProto = Object.getPrototypeOf,\n_getDescriptor = Object.getOwnPropertyDescriptor;\nfunction getDescriptor(obj, key) {\nwhile (obj) {\nvar\ndesc = _getDescriptor(obj, key);\nif (desc) {\nreturn desc;\n}\nobj = _getProto(obj);\n}\n}\n"])));
	    } else {
	      iFn += 'var getDescriptor = Object.getOwnPropertyDescriptor;';
	    }
	  } 


	  if (p.async) {
	    iFn += ws(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\nvar\npriorities = o.priorities,\nmaxParallel = o.maxParallel,\nmaxParallelIsNumber = typeof maxParallel === 'number';\nvar\ndone,\ntimeStart,\ntimeEnd,\ntime = 0;\nvar\nthread = o.self,\nthread = o.self,\nyielder = false,\nyieldVal;\nfunction isPromise(obj) {\nreturn obj && typeof obj.then === 'function' && typeof obj.catch === 'function';\n}\nvar\nrCbSet = new Set(),\nrElSet = new Set();\nfunction resolveCb(res) {\nrCbSet.delete(r);\nr = res;\nthread.next();\n}\nfunction resolveEl(res) {\nrElSet.delete(r);\nel = res;\nthread.next();\n}\ncb = function (", ") {\nvar\nf = ", ",\nfIsPromise = !done && isPromise(el),\nres;\nif (el === IGNORE || done) {\nf = FALSE;\nreturn;\n}\nif (fIsPromise) {\nf = el.then(function (val) {\nif (val === IGNORE) {\nreturn FALSE;\n}\nif (brkIf && val === null) {\nbreaker = true;\nreturn FALSE;\n}\nel = val;\nreturn TRUE;\n}, onError);\n}\n"])), cbArgs, fLength ? undefined : true);

	    if (fLength) {
	      if (fLength < 5) {
	        for (var _i = 0; _i < fLength; _i++) {
	          var callFilter = "filters[".concat(_i, "](").concat(filterArgs[_i], ")");
	          iFn += ws(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\nif (", ") {\nif (fIsPromise) {\nf = f.then(function (f) {\n", ";\nif (f) {\nreturn ", ";\n}\nreturn FALSE;\n}, onError);\n} else {\nf = ", ";\nfIsPromise = isPromise(f);\nif (!fIsPromise) {\n", "\n}\n}\n}\n"])), _i ? 'f' : 'f === undefined || f', resolveFilterVal, callFilter, callFilter, resolveFilterVal);
	        }
	      } else {
	        iFn += ws(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\nfor (fI = -1; ++fI < fLength;) {\nif (fIsPromise) {\nf = f.then((function (fI) {\nreturn function (f) {\n", "\nif (f) {\nreturn ", ";\n} else {\nreturn FALSE;\n}\n};\n})(fI), onError);\n} else {\nf = ", ";\nfIsPromise = isPromise(f);\nif (!fIsPromise) {\n", "\n}\nif (!f) {\nbreak;\n}\n}\n}\n"])), resolveFilterVal, callCycleFilter, callCycleFilter, resolveFilterVal);
	      }
	    }

	    var fnCountHelper = '';

	    if (p.from) {
	      fnCountHelper += ws(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\nif (from !== 0) {\nfrom--;\nreturn;\n}\n"])));
	    }

	    if (p.count) {
	      fnCountHelper += ws(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\nif (j === count) {\nreturn;\n}\nj++;\n"])));
	    }

	    if (!p.mult) {
	      fnCountHelper += 'breaker = true;';
	    }

	    iFn += ws(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["\nif (fIsPromise) {\nf = f.then(function (f) {\n", "\nif (", ") {\n", "\nreturn baseCb(", ");\n}\n});\nres = f;\n} else if (", ") {\n", "\nres = baseCb(", ");\n}\n"])), resolveFilterVal, resolveFilterValCb, fnCountHelper, cbArgs, resolveFilterValCb, fnCountHelper, cbArgs);

	    if (needParallel) {
	      
	      iFn += ws(_templateObject9 || (_templateObject9 = _taggedTemplateLiteral(["\nif (maxParallelIsNumber) {\nctx['", "'](maxParallel, null, new Promise(function (r) { r(res); }));\n} else {\nctx['", "'](new Promise((r) => r(res)));\n}\n"])), parallelFn, parallelFn); 
	    } else {
	      iFn += 'return res;';
	    }

	    iFn += '};';
	  } 


	  if (needCtx) {
	    iFn += ws(_templateObject10 || (_templateObject10 = _taggedTemplateLiteral(["\nvar ctx = {\n$: {},\ninfo: {\nfilters: filters.slice(0),\nmult: ", ",\nstartIndex: startIndex,\nendIndex: o.endIndex,\nfrom: from,\ncount: count,\nlive: ", ",\nreverse: ", ",\nwithDescriptor: ", ",\nnotOwn: ", ",\ninverseFilter: ", ",\ntype: '", "',\nasync: ", ",\nthread: ", ",\npriority: ", " && '", "',\nlength: ", "\n},\ntrue: TRUE,\nfalse: FALSE,\ncursor: o.cursor,\nlength: o.cbLength,\nchildResult: childResult,\nonError: onError,\nget result() {\nreturn p.result;\n},\nset result(value) {\np.result = value;\n},\nget value() {\nreturn yieldVal;\n},\njump: function (val) {\nif (", ") {\nreturn false;\n}\nvar diff = i - n;\nn = val - 1;\ni = n + diff;\nreturn i;\n},\ni: function (val) {\nif (val === undefined) {\nreturn i;\n}\nif (", ") {\nreturn false;\n}\nn += val;\ni += val;\nreturn i;\n},\nget id() {\nreturn id;\n},\nget reset() {\nbreaker = true;\nlimit++;\nreturn FALSE;\n},\nget break() {\nbreaker = true;\nreturn FALSE;\n}\n};\nvar fCtx = Object.create(ctx);\nfCtx.length = o.fLength || o.cbLength;\n"])), p.mult, p.live, p.reverse, p.withDescriptor, p.notOwn, p.inverseFilter, p.type, p.async, p.thread, p.thread, p.priority, p.length, cantModI, cantModI);

	    if (p.async) {
	      
	      iFn += ws(_templateObject11 || (_templateObject11 = _taggedTemplateLiteral(["\nctx.thread = thread;\nthread.ctx = ctx;\nvar\nparallelI = {null: {i: 0}},\nraceI = {null: {i: 0}},\nwaiting = false;\nvar\nwaitStore = new Set(),\nraceStore = new Set();\nchildResult = [];\nfunction waitFactory(store, max, label, promise) {\nif (!promise && label) {\npromise = label;\nlabel = null;\n}\nlabel = label || null;\nvar parallel = parallelI[label] = parallelI[label] || {i: 0};\nparallel.max = max;\nfunction end(err) {\nparallel.i && parallel.i--;\nvar canNext = true;\nfor (var key in parallelI) {\nif (!parallelI.hasOwnProperty(key)) {\nbreak;\n}\nif (parallelI[key].i >= parallelI[key].max) {\ncanNext = false;\nbreak;\n}\n}\ncanNext && thread.pause && ctx.next();\n}\nif (promise) {\nparallel.i++;\nif (parallel.i >= parallel.max) {\nctx.yield();\n}\nwaitFactory(store, promise).then(end, function (err) {\nif (err && err.type === 'CollectionThreadDestroy') {\nend();\n}\n});\nreturn promise;\n}\nif (!isPromise(promise = max)) {\npromise = typeof promise.next === 'function' ? promise.next() : promise();\n}\nctx.child(promise);\nstore.add(promise);\npromise.then(\nfunction (res) {\nif (store.has(promise)) {\nchildResult.push(res);\nstore.delete(promise);\n}\nif (waiting) {\nctx.next();\n}\n},\nfunction (err) {\nif (err && err.type === 'CollectionThreadDestroy') {\nstore.delete(promise);\nreturn;\n}\nonError(err);\n}\n);\nreturn promise;\n}\nctx.yield = function (opt_val) {\nyielder = true;\nyieldVal = opt_val;\nreturn true;\n};\nctx.next = function (opt_val) {\nthread.next(opt_val);\nreturn true;\n};\nctx.child = function (obj) {\nif (!obj.thread) {\nreturn false;\n}\nthread.children.push(obj.thread);\nreturn true;\n};\nctx.race = function (max, label, promise) {\nif (!promise) {\npromise = label || max;\nmax = label != null ? max : 1;\nlabel = null;\n}\nlabel = label || null;\nvar race = raceI[label] = raceI[label] || {i: 0};\nrace.max = max;\nwaitFactory(raceStore, promise).then(function () {\nif (race.i < race.max) {\nrace.i++;\nif (race.i === race.max) {\nrace.i = 0;\nraceStore.clear();\ndone = true;\n}\n}\n});\nreturn promise;\n};\nctx.wait = function (max, label, promise) {\nreturn waitFactory(waitStore, max, label, promise);\n};\nctx.sleep = function (time, opt_test, opt_interval) {\nctx.yield();\nreturn new Promise(function (resolve, reject) {\nvar\nsleep = thread.sleep;\nif (sleep != null) {\nsleep.resume();\n}\nsleep = thread.sleep = {\nresume: function () {\nclearTimeout(sleep.id);\nthread.sleep = null;\nresolve();\n},\nid: setTimeout(function () {\nif (opt_test) {\ntry {\nthread.sleep = null;\nvar test = opt_test(ctx);\nif (test) {\nresolve();\nctx.next();\n} else if (opt_interval !== false) {\nctx.sleep(time, opt_test, opt_interval).then(resolve, reject);\n}\n} catch (err) {\nreject(err);\nonError(err);\n}\n} else {\nresolve();\nctx.next();\n}\n}, time)\n};\n});\n};\n"]))); 
	    } else {
	      iFn += ws(_templateObject12 || (_templateObject12 = _taggedTemplateLiteral(["\nctx.yield = ctx.next = ctx.child = ctx.race = ctx.wait = ctx.sleep = o.notAsync;\n"])));
	    }
	  }

	  var threadStart = '',
	      threadEnd = ''; 
	  

	  if (p.async && p.thread) {
	    threadStart = ws(_templateObject13 || (_templateObject13 = _taggedTemplateLiteral(["\nif (timeStart == null) {\ntimeStart = new Date().valueOf();\n}\n"])));
	    threadEnd = ws(_templateObject14 || (_templateObject14 = _taggedTemplateLiteral(["\ntimeEnd = new Date().valueOf();\ntime += timeEnd - timeStart;\ntimeStart = timeEnd;\nif (time > priorities[thread.priority]) {\nyield;\ntime = 0;\ntimeStart = null;\n}\n"])));
	  } 
	  


	  iFn += 'while (limit !== looper) {';
	  var yielder = '',
	      asyncWait = ''; 

	  if (p.async) {
	    iFn += 'done = false;';
	    yielder = ws(_templateObject15 || (_templateObject15 = _taggedTemplateLiteral(["\nif (yielder) {\nyielder = false;\nthread.pause = true;\nyieldVal = yield yieldVal;\n}\n"])));

	    if (needCtx) {
	      asyncWait = ws(_templateObject16 || (_templateObject16 = _taggedTemplateLiteral(["\nwaiting = true;\nwhile (waitStore.size) {\nthread.pause = true;\nyield;\n}\nwhile (raceStore.size) {\nthread.pause = true;\nyield;\n}\n"])));
	    }
	  } 


	  var indexLimits = '';

	  if (p.startIndex) {
	    indexLimits = ws(_templateObject17 || (_templateObject17 = _taggedTemplateLiteral(["\nif (n < startIndex) {\n", "\ncontinue;\n}\n"])), threadEnd);
	  }

	  if (p.endIndex) {
	    indexLimits += ws(_templateObject18 || (_templateObject18 = _taggedTemplateLiteral(["\nif (n > endIndex) {\n", "\nbreak;\n};\n"])), threadEnd);
	  }

	  var defArgs = maxArgsLength || p.async;

	  switch (p.type) {
	    case 'array':
	      iFn += ws(_templateObject19 || (_templateObject19 = _taggedTemplateLiteral(["\nvar\nclone = data,\ndLength = data.length - 1,\nslice = IGNORE.slice;\n"])));

	      if (p.reverse) {
	        iFn += 'clone = slice.call(clone).reverse();';
	      }

	      if ((p.reverse || !p.live) && (p.startIndex || p.endIndex)) {
	        iFn += ws(_templateObject20 || (_templateObject20 = _taggedTemplateLiteral(["\nclone = slice.call(clone, startIndex, endIndex ? endIndex + 1 : data.length);\n"])));
	      }

	      if (!p.reverse && p.live) {
	        iFn += ws(_templateObject21 || (_templateObject21 = _taggedTemplateLiteral(["\nfor (n = startIndex - 1; ++n < clone.length;) {\n", "\ni = n;\n", "\n"])), threadStart, indexLimits);
	      } else {
	        iFn += ws(_templateObject22 || (_templateObject22 = _taggedTemplateLiteral(["\nlength = clone.length;\nfor (n = -1; ++n < length;) {\n", "\ni = n + startIndex;\n"])), threadStart);
	      }

	      if (defArgs) {
	        if (maxArgsLength > 1) {
	          if (p.startIndex) {
	            iFn += "key = ".concat(p.reverse ? 'dLength - (' : '', " n + startIndex ").concat(p.reverse ? ')' : '', ";");
	          } else {
	            iFn += "key = ".concat(p.reverse ? 'dLength - ' : '', " n;");
	          }
	        }

	        if (p.withDescriptor) {
	          iFn += 'el = getDescriptor(clone, n);';
	        } else {
	          iFn += 'el = clone[n];';
	        }
	      }

	      break;

	    case 'object':
	      iFn += ws(_templateObject23 || (_templateObject23 = _taggedTemplateLiteral(["\nvar\nselfHasOwn = data.hasOwnProperty,\nhasOwnProperty = IGNORE.hasOwnProperty;\n"])));

	      if (p.reverse || OBJECT_KEYS_NATIVE_SUPPORT && !p.notOwn) {
	        iFn += 'var tmpArray;';

	        if (!p.notOwn && OBJECT_KEYS_NATIVE_SUPPORT && !p.async) {
	          iFn += 'tmpArray = Object.keys(data);';
	        } else {
	          iFn += 'tmpArray = [];';

	          if (p.notOwn) {
	            if (p.notOwn === -1) {
	              iFn += ws(_templateObject24 || (_templateObject24 = _taggedTemplateLiteral(["\nfor (key in data) {\n", "\nif (selfHasOwn ? data.hasOwnProperty(key) : hasOwnProperty.call(data, key)) {\ncontinue;\n}\ntmpArray.push(key);\n", "\n}\n"])), threadStart, threadEnd);
	            } else {
	              iFn += ws(_templateObject25 || (_templateObject25 = _taggedTemplateLiteral(["\nfor (key in data) {\n", "\ntmpArray.push(key);\n", "\n}\n"])), threadStart, threadEnd);
	            }
	          } else {
	            iFn += ws(_templateObject26 || (_templateObject26 = _taggedTemplateLiteral(["\nfor (key in data) {\n", "\nif (!(selfHasOwn ? data.hasOwnProperty(key) : hasOwnProperty.call(data, key))) {\nbreak;\n}\ntmpArray.push(key);\n", "\n}\n"])), threadStart, threadEnd);
	          }
	        }

	        if (p.reverse) {
	          iFn += 'tmpArray.reverse();';
	        }

	        if (p.startIndex || p.endIndex) {
	          iFn += "tmpArray = tmpArray.slice(startIndex, endIndex ? endIndex + 1 : tmpArray.length);";
	        }

	        iFn += ws(_templateObject27 || (_templateObject27 = _taggedTemplateLiteral(["\nlength = tmpArray.length;\nfor (n = -1; ++n < length;) {\n", "\nkey = tmpArray[n];\nif (key in data === false) {\n", "\ncontinue;\n}\ni = n + startIndex;\n"])), threadStart, threadEnd);
	      } else {
	        iFn += ws(_templateObject28 || (_templateObject28 = _taggedTemplateLiteral(["\nfor (key in data) {\n", "\n"])), threadStart);

	        if (p.notOwn === false) {
	          iFn += ws(_templateObject29 || (_templateObject29 = _taggedTemplateLiteral(["\nif (!(selfHasOwn ? data.hasOwnProperty(key) : hasOwnProperty.call(data, key))) {\n", "\nbreak;\n}"])), threadEnd);
	        } else if (p.notOwn === -1) {
	          iFn += ws(_templateObject30 || (_templateObject30 = _taggedTemplateLiteral(["\nif (selfHasOwn ? data.hasOwnProperty(key) : hasOwnProperty.call(data, key)) {\n", "\ncontinue;\n}"])), threadEnd);
	        }

	        iFn += ws(_templateObject31 || (_templateObject31 = _taggedTemplateLiteral(["\nn++;\ni = n;\n", "\n"])), indexLimits);
	      }

	      if (defArgs) {
	        if (p.withDescriptor) {
	          iFn += 'el = getDescriptor(data, key);';
	        } else {
	          iFn += 'el = data[key];';
	        }
	      }

	      break;

	    case 'map':
	    case 'set':
	    case 'generator':
	    case 'iterator':
	    case 'syncIterator':
	    case 'asyncIterator':
	      if (isMapSet) {
	        iFn += 'var cursor = data.keys();';

	        if (!p.live && !p.reverse) {
	          iFn += 'var size = data.size;';
	        }
	      } else if (p.type === 'generator') {
	        iFn += 'var cursor = data();';
	      } else {
	        iFn += ws(_templateObject32 || (_templateObject32 = _taggedTemplateLiteral(["\nvar\niteratorKey = typeof Symbol !== 'undefined' && Symbol.iterator,\ncursor;\nif (typeof data.next === 'function') {\ncursor = data;\n} else {\ncursor = (iteratorKey ? data[iteratorKey]() : data['@@iterator'] && data['@@iterator']()) || data;\n}\n"])));
	      }

	      iFn += ws(_templateObject33 || (_templateObject33 = _taggedTemplateLiteral(["\n", "\nfor (\nkey = cursor.next(), brkIf = ('done' in key === false);\n'done' in key ? !key.done : key;\nkey = cursor.next()\n) {\n", "\n"])), p.reverse ? 'var tmpArray = [];' : '', threadStart);
	      var asyncIterator = ''; 

	      if (p.type === 'asyncIterator' || asyncIterators[p.type] && p.async) {
	        asyncIterator = ws(_templateObject34 || (_templateObject34 = _taggedTemplateLiteral(["\nwhile (isPromise(el)) {\nif (!rElSet.has(el)) {\nrElSet.add(el);\nel.then(resolveEl, onError);\n}\nthread.pause = true;\nyield;\n}\n"])));
	      } 


	      if (p.reverse) {
	        iFn += "el = 'value' in key ? key.value : key; ".concat(asyncIterator); 

	        if (needParallel) {
	          iFn += ws(_templateObject35 || (_templateObject35 = _taggedTemplateLiteral(["\nif (maxParallelIsNumber) {\nif (isPromise(el)) {\nctx['", "'](maxParallel, null, el);\n}\n", "\n}\n"])), parallelFn, yielder);
	        } 


	        iFn += ws(_templateObject36 || (_templateObject36 = _taggedTemplateLiteral(["\nif (el !== IGNORE) {\nif (brkIf && el === null) {\n", "\nbreak;\n}\ntmpArray.push(el);\n}\n", "\n}\n", "\ntmpArray.reverse();\nvar size = tmpArray.length;\n"])), threadEnd, threadEnd, asyncWait);

	        if (p.startIndex || p.endIndex) {
	          iFn += "tmpArray = tmpArray.slice(startIndex, endIndex ? endIndex + 1 : tmpArray.length);";
	        }

	        iFn += ws(_templateObject37 || (_templateObject37 = _taggedTemplateLiteral(["\nlength = size;\nfor (n = -1; ++n < length;) {\n", "\n", "\ni = n + startIndex;\n"])), threadStart, defArgs ? 'key = tmpArray[n];' : '');
	      } else {
	        iFn += ws(_templateObject38 || (_templateObject38 = _taggedTemplateLiteral(["\n", "\nn++;\ni = n;\n", "\n"])), defArgs ? "key = 'value' in key ? key.value : key;" : '', indexLimits);
	      }

	      if (defArgs) {
	        if (p.type === 'map') {
	          iFn += 'el = data.get(key);';
	        } else {
	          iFn += "el = key; ".concat(asyncIterator);

	          if (maxArgsLength > 1) {
	            if (p.type === 'set') {
	              iFn += 'key = null;';
	            } else if (p.reverse) {
	              iFn += 'key = size - i - 1;';
	            } else {
	              iFn += 'key = i;';
	            }
	          }
	        }
	      }

	      break;
	  }

	  if (needCtx) {
	    iFn += 'id++;';
	  }

	  if (p.count) {
	    iFn += ws(_templateObject39 || (_templateObject39 = _taggedTemplateLiteral(["\nif (j === count) {\n", "\nbreak;\n}\n"])), threadEnd);
	  }

	  var tmp = '';

	  if (!p.async) {
	    if (fLength) {
	      if (fLength < 5) {
	        for (var _i2 = 0; _i2 < fLength; _i2++) {
	          iFn += ws(_templateObject40 || (_templateObject40 = _taggedTemplateLiteral(["\nif (", ") {\nf = filters[", "](", ");\n", "\n}\n"])), _i2 ? 'f' : 'true', _i2, filterArgs[_i2], resolveFilterVal);
	        }
	      } else {
	        iFn += ws(_templateObject41 || (_templateObject41 = _taggedTemplateLiteral(["\nfor (fI = -1; ++fI < fLength;) {\nf = ", ";\n", "\nif (!f) {\nbreak;\n}\n}\n"])), callCycleFilter, resolveFilterVal);
	      }

	      iFn += "if (".concat(resolveFilterValCb, ") {");
	    }

	    if (p.count) {
	      tmp += 'j++;';
	    }
	  }

	  tmp += "r = cb(".concat(cbArgs, ");");

	  if (!p.mult && !p.async) {
	    tmp += 'breaker = true;';
	  }

	  var waitCb = ''; 

	  if (p.async) {
	    waitCb = ws(_templateObject42 || (_templateObject42 = _taggedTemplateLiteral(["\nwhile (isPromise(r)) {\nif (!rCbSet.has(r)) {\nrCbSet.add(r);\nr.then(resolveCb, onError);\n}\nthread.pause = true;\nyield;\n}\n"])));
	    tmp += waitCb;
	  } 


	  if (!p.async && p.from) {
	    iFn += ws(_templateObject43 || (_templateObject43 = _taggedTemplateLiteral(["\nif (from !== 0) {\nfrom--;\n} else {\n", "\n}\n"])), tmp);
	  } else {
	    iFn += tmp;
	  }

	  if (!p.async && fLength) {
	    iFn += '}';
	  }

	  iFn += yielder;

	  if (!p.live && !p.reverse && isMapSet) {
	    iFn += ws(_templateObject44 || (_templateObject44 = _taggedTemplateLiteral(["\nsize--;\nif (!size) {\n", "\nbreak;\n}\n"])), threadEnd);
	  }

	  tmp = ws(_templateObject45 || (_templateObject45 = _taggedTemplateLiteral(["\nif (onIterationEnd) {\nonIterationEnd(", ");\n}\n"])), needCtx ? 'ctx' : ''); 

	  if (p.async) {
	    tmp = ws(_templateObject46 || (_templateObject46 = _taggedTemplateLiteral(["\nif (onIterationEnd) {\nr = onIterationEnd(", ");\n", "\n}\n"])), needCtx ? 'ctx' : '', waitCb);
	  } 


	  iFn += ws(_templateObject47 || (_templateObject47 = _taggedTemplateLiteral(["\n", "\nif (breaker", ") {\nbreak;\n}\n}\nbreaker = false;\nlooper++;\n", "\n"])), threadEnd, p.async ? '|| done' : '', tmp);
	  iFn += ws(_templateObject48 || (_templateObject48 = _taggedTemplateLiteral(["\n", "\n}\n", "\nif (onComplete) {\n", "\nonComplete(p.result);\n}\nreturn p.result;\n"])), yielder, asyncWait, p.async ? 'done = true;' : '');

	  if (p.async) {
	    
	    compiledCycles[key] = new Function("return function *(o, p) { ".concat(iFn, " };"))(); 
	  } else {
	    compiledCycles[key] = new Function('o', 'p', iFn);
	  }

	  if (LOCAL_CACHE && $C.ready) {
	    var delay = 5e3,
	        code = "".concat(NAMESPACE, ".cache.cycle[\"").concat(key, "\"] = ").concat(compiledCycles[key].toString(), ";");
	    cycles[key] = code;

	    if (IS_BROWSER && LOCAL_STORAGE_SUPPORT) {
	      clearTimeout(cacheTimer);
	      cacheTimer = setTimeout(function () {
	        try {
	          localStorage.setItem(CACHE_KEY, JSON.stringify(cycles));
	          localStorage.setItem(CACHE_VERSION_KEY, $C.CACHE_VERSION);

	          if (BLOB_SUPPORT) {
	            var script = document.createElement('script');

	            for (var _key in localCacheAttrs) {
	              if (!localCacheAttrs.hasOwnProperty(_key)) {
	                continue;
	              }

	              var val = localCacheAttrs[_key];
	              script.setAttribute(_key, val != null ? String(val) : '');
	            }

	            script.src = URL.createObjectURL(new Blob([code], {
	              type: 'application/javascript'
	            }));
	            document.head.appendChild(script);
	          }
	        } catch (_unused) {}
	      }, delay);
	    } else if (IS_NODE) {
	      
	      clearTimeout(cacheTimer);
	      cacheTimer = setTimeout(function () {
	        require('fs').writeFile(require('path').join(__dirname, 'collection.tmp.js'), "\nexports.version = ".concat($C.CACHE_VERSION, ";\nexports.cache = ").concat(JSON.stringify(cycles), ";\nexports.exec = function () { ").concat(returnCache(cycles), " };\n"), function () {});
	      }, delay);
	      cacheTimer['unref'](); 
	    }
	  }

	  return compiledCycles[key];
	}

	if (LOCAL_CACHE) {
	  if (IS_BROWSER && LOCAL_STORAGE_SUPPORT && document.readyState === 'loading') {
	    try {
	      var version = localStorage.getItem(CACHE_VERSION_KEY),
	          cache = localStorage.getItem(CACHE_KEY);

	      if (cache && version == $C.CACHE_VERSION) {
	        $C.cache.str = JSON.parse(cache);
	        var attrs = '';

	        for (var key$1 in localCacheAttrs) {
	          if (!localCacheAttrs.hasOwnProperty(key$1)) {
	            continue;
	          }

	          var val = localCacheAttrs[key$1];
	          attrs += val != null ? " ".concat(key$1, "=").concat(val) : " ".concat(key$1);
	        }

	        document.write("<script type=\"text/javascript\" ".concat(attrs, ">") + returnCache($C.cache.str) + "".concat(NAMESPACE, ".ready = true;") +
	        /* eslint-disable-next-line */
	        '<\/script>');
	      } else {
	        localStorage.removeItem(CACHE_KEY);
	        localStorage.removeItem(CACHE_VERSION_KEY);
	      }
	    } catch (_unused) {} finally {
	      $C.ready = true;
	    }
	  } else if (IS_NODE) {
	    try {
	      
	      var _cache = require(require('path').join(__dirname, 'collection.tmp.js'));

	      if (_cache['version'] === $C.CACHE_VERSION) {
	        _cache['exec']();

	        $C.cache.str = _cache['cache'];
	      } 

	    } catch (_unused2) {} finally {
	      $C.ready = true;
	    }
	  }
	}

	/**
	 * Returns the number of elements in the collection by the specified parameters
	 *
	 * @see Collection.prototype.forEach
	 * @param {($$CollectionFilter|$$CollectionSingleBase)=} [opt_filter] - function filter or an array of functions
	 * @param {?$$CollectionSingleBase=} [opt_params] - additional parameters
	 * @return {(number|!Promise<number>)}
	 */

	Collection.prototype.length = function (opt_filter, opt_params) {
	  var p = opt_params || {};

	  if (!isArray(opt_filter) && !isFunction(opt_filter)) {
	    p = opt_filter || p;
	    opt_filter = null;
	  }

	  this._initParams(p, opt_filter);

	  p = any(Object.assign(Object.create(this.p), p, {
	    result: 0
	  }));

	  var calc = function calc() {
	    return p.result++;
	  };

	  calc[LENGTH_REQUEST] = true;
	  var returnVal = any(this.forEach(calc, p));

	  if (calc[LENGTH_REQUEST] !== true) {
	    p.result = calc[LENGTH_REQUEST];
	    p.onComplete && p.onComplete(p.result);
	  }

	  if (returnVal !== this) {
	    return returnVal;
	  }

	  return p.result;
	};

		var MAX_PRIORITY = 40;
	var priorities = {
	  'low': MAX_PRIORITY / 8,
	  'normal': MAX_PRIORITY / 4,
	  'hight': MAX_PRIORITY / 2,
	  'critical': MAX_PRIORITY
	};

	var slice = [].slice,
	    splice = [].splice,
	    hasOwnProperty = {}.hasOwnProperty;
	/**
	 * Sets a value as an object property by the specified link or returns/deletes the property.
	 * At changing or deleting the property returns an object:
	 *
	 * ```js
	 * ({
	 *   result: boolean,
	 *   key,
	 *   value
	 * })
	 * ```
	 *
	 * @param {?} obj
	 * @param {$$CollectionLink} link - source link:
	 *   STRING-LINK:
	 *   a.foo.bar ~ obj['foo']['bar']
	 *
	 *   ARRAY-LINK:
	 *   [{}, 1, null] ~ obj[{}][1][null]
	 *
	 * @param {$$Collection_byLink=} [opt_params] - additional parameters:
	 *
	 *   [value] - value to set
	 *   [delete = delete] - if true, then the property will be deleted
	 *   [create = false] - if true, then the property will be created if it's not defined
	 *   [test = false] - if is true, then will be returned false if the property is not defined
	 *   [error = false] - if is true, then will be thrown an exception if the property is not defined
	 *
	 * @return {({result: boolean, key, value, notFound: (boolean|undefined)}|?)}
	 */

	function byLink(obj, link, opt_params) {
	  var p = opt_params || {};
	  var linkList = isString(link) ? any(link).split('.') : [].concat(link),
	      length = linkList.length,
	      last = length - 1;
	  var pre, preKey;

	  for (var i = -1; ++i < length;) {
	    var el = linkList[i];

	    if (obj == null) {
	      if (p.test) {
	        return false;
	      }

	      if (p.error) {
	        throw new ReferenceError("\"".concat(el, "\" is not defined"));
	      }

	      if (p.delete) {
	        return {
	          notFound: true,
	          result: false,
	          key: undefined,
	          value: undefined
	        };
	      }

	      return;
	    }

	    var isTest = i === last && p.test;

	    if (isTest) {
	      pre = obj;
	      preKey = el;
	    }

	    var objIsMap = isMap(obj),
	        objIsSet = isSet(obj);
	    var isAMap = objIsMap || isWeakMap(obj),
	        isASet = objIsSet || isWeakSet(obj); // Set or delete

	    if (!isTest && i === last && (p.delete || 'value' in p)) {
	      var cache = {
	        key: isASet ? null : el,
	        result: isAMap || isASet ? obj.has(el) : el in obj,
	        value: isAMap ? obj.get(el) : isASet ? el : obj[el]
	      };

	      if ('value' in p) {
	        cache.newValue = p.value;
	      }

	      if (p.delete) {
	        if (cache.result) {
	          if (isAMap || isASet) {
	            obj.delete(el);
	            cache.result = !obj.has(el);
	          } else {
	            if (isLikeArray(obj) && !isNaN(Number(el))) {
	              cache.key = Number(cache.key);

	              if (isArray(obj)) {
	                obj.splice(el, 1);
	              } else {
	                splice.call(obj, el, 1);
	              }
	            } else {
	              cache.key = String(cache.key);
	              delete obj[el];
	            }

	            cache.result = el in obj === false || obj[el] !== cache.value;
	          }
	        }
	      } else {
	        if (isAMap) {
	          if (obj.get(el) !== p.value) {
	            obj.set(el, p.value);
	            cache.result = obj.get(el) === p.value;
	          } else {
	            cache.result = false;
	          }
	        } else if (isASet) {
	          var has = obj.has(el);
	          cache.result = false;
	          cache.value = has ? el : undefined;

	          if (!obj.has(p.value)) {
	            if (has) {
	              obj.delete(el);
	            }

	            obj.add(p.value);
	            cache.result = obj.has(p.value);
	          }
	        } else {
	          if (isLikeArray(obj) && !isNaN(Number(cache.key))) {
	            cache.key = Number(cache.key);
	          } else {
	            cache.key = String(cache.key);
	          }

	          if (obj[el] !== p.value) {
	            obj[el] = p.value;
	            cache.result = obj[el] === p.value;
	          } else {
	            cache.result = false;
	          }
	        }
	      }

	      return cache;
	    }

	    if (isAMap) {
	      obj = obj.get(el);
	    } else if (isASet) {
	      if (obj.has(el)) {
	        obj = el;
	      } else {
	        obj = undefined;
	      }
	    } else {
	      if (p.create && obj[el] === undefined) {
	        obj[el] = {};
	      }

	      obj = obj[el];
	    }
	  }

	  if (p.test) {
	    if (isMap(pre) || isWeakMap(pre) || isSet(pre) || isWeakSet(pre)) {
	      return pre.has(preKey);
	    }

	    return preKey in pre;
	  }

	  return obj;
	}
	/**
	 * Returns true if the passed object contains a property by the specified link
	 *
	 * @see byLink
	 * @param {$$CollectionLink} link - source link
	 * @param {!Object} obj - source object
	 * @return {boolean}
	 */

	$C.in = function (link, obj) {
	  return byLink(obj, link, {
	    test: true
	  });
	};

	Object.assign($C, {
	  in: $C.in
	});
	/**
	 * Returns true if the collection contains a property by the specified link
	 *
	 * @see byLink
	 * @param {$$CollectionLink} link - source link
	 * @return {boolean}
	 */

	Collection.prototype.in = function (link) {
	  return byLink(this.data, link, {
	    test: true
	  });
	};

	function notAsync() {
	  return false;
	}

	function defaultCb() {}
	/**
	 * Iterates the collection and calls a callback function for each element that matches for the specified condition
	 *
	 * @param {($$CollectionCb|$$Collection_forEach|null)=} [opt_cb] - callback function
	 * @param {?$$Collection_forEach=} [opt_params] - additional parameters:
	 *
	 *   * [filter] - function filter or an array of functions
	 *   * [mult = true] - if false, then after the first successful iteration the operation will be broken
	 *   * [count] - maximum number of elements in the response (by default all object)
	 *   * [from = 0] - number of skipping successful iterations
	 *   * [startIndex = 0] - number of skipping successful iterations
	 *   * [endIndex] - end iteration position
	 *   * [reverse] - if true, then the iteration will be from the end
	 *   * [inverseFilter = false] - if true, the successful iteration is considered as a negative result of the filter
	 *   * [withDescriptor = false] - if true, then the first element of callback function will be an object of the element descriptor
	 *   * [notOwn = false] - iteration type:
	 *
	 *     1) if false, then hasOwnProperty test is enabled and all not own properties will be skipped;
	 *     2) if true, then hasOwnProperty test is disabled;
	 *     3) if -1, then hasOwnProperty test is enabled and all own properties will be skipped.
	 *
	 *   * [live = false] - if true, the initial collection length won't be cached (not for all data types),
	 *      ie all elements which will be added to the collection during the iteration will be included to the processing
	 *
	 *   * [use] - type of the using iterator (for, for of, for in)
	 *   * [length = true] - if false, then function parameters optimization won't be apply
	 *   * [async = false] - if true, then the operation will be executed as async (returns a promise)
	 *   * [thread = false] - if true, then the operation will be executed in a thread (returns a promise)
	 *   * [parallel = false] - if true or number, then the operation will be executed as async and parallel
	 *        (number is max parallel operations)
	 *
	 *   *  [race = false] - if true or number, then the operation will be executed as async and parallel with race
	 *        (number is max parallel operations)
	 *
	 *   * [priority = 'normal'] - thread priority (low, normal, hight, critical)
	 *   * [onChunk] - callback function for chunks
	 *   * [onIterationEnd] - callback function for the end of iterations
	 *   * [result] - parameter that marked as the operation result
	 *
	 * @return {(!Collection|!Promise)}
	 */


	Collection.prototype.forEach = function (opt_cb, opt_params) {
	  var _this = this;

	  var cb = opt_cb;

	  if (!isFunction(opt_cb)) {
	    cb = defaultCb;
	    opt_params = any(opt_cb);
	  }

	  var p = any(Object.create(this._init())),
	      sp = opt_params || p;

	  if (isArray(opt_params) || isFunction(opt_params)) {
	    p.filter = p.filter.concat(opt_params);
	  } else if (opt_params) {
	    if (opt_params.filter !== p.filter) {
	      opt_params.filter = p.filter.concat(opt_params.filter || []);
	    }

	    Object.assign(p, opt_params);
	  }

	  this._initParams(p, false);

	  var data = this.data,
	      type = p.type;

	  if (!isObjectInstance(data) || weakTypes[type]) {
	    throw new TypeError('Incorrect data type');
	  }

	  var filters = p.filter,
	      fCount = filters.length;
	  var isAsyncType = asyncTypes[type],
	      isStream = type === 'stream';
	  var cursor; 

	  if (asyncTypes[type]) {
	    cursor = data;
	    var on = "add".concat(isStream ? '' : 'Event', "Listener"),
	        off = "remove".concat(isStream ? '' : 'Event', "Listener"),
	        dataEvent = isStream ? 'data' : 'success';
	    cursor[on]('error', function (err) {
	      if (data.onError) {
	        data.onError(err);
	      } else {
	        throw err;
	      }
	    });
	    var hasEnded = false;

	    if (isStream) {
	      var f = function f() {
	        return hasEnded = true;
	      };

	      cursor[on]('end', f);
	      cursor[on]('close', f);
	    }

	    data = {
	      next: function next() {
	        if (hasEnded || cursor.readyState === 'done') {
	          return {
	            done: true,
	            value: undefined
	          };
	        }

	        return {
	          done: false,
	          value: new Promise(function (resolve, reject) {
	            if (isStream) {
	              cursor[on]('end', end);
	              cursor[on]('close', end);
	              cursor.resume();
	            }

	            cursor[on](dataEvent, data);
	            cursor[on]('error', error);

	            function data(data) {
	              clear();

	              if (isStream) {
	                resolve(data);
	              } else {
	                var iterator = data.target.result;

	                if (iterator) {
	                  resolve(iterator.value);
	                  iterator.continue();
	                } else {
	                  resolve(IGNORE);
	                }
	              }
	            }

	            function end() {
	              clear();
	              resolve(IGNORE);
	            }

	            function error(err) {
	              clear();
	              reject(err);
	            }

	            function clear() {
	              if (isStream) {
	                cursor[off]('end', end);
	                cursor[off]('close', end);
	                cursor.pause();
	              }

	              cursor[off]('error', error);
	              cursor[off](dataEvent, data);
	            }
	          })
	        };
	      }
	    };
	    type = p.type = 'asyncIterator';
	  } 
	  // Optimization for the length request


	  if (!fCount && cb[LENGTH_REQUEST]) {
	    if (type === 'array') {
	      cb[LENGTH_REQUEST] = (p.startIndex || p.endIndex !== false ? slice.call(data, p.startIndex || 0, p.endIndex !== false ? p.endIndex + 1 : data.length) : data).length;
	      return this;
	    } else if (mapSet[type] && !p.startIndex && p.endIndex === false) {
	      cb[LENGTH_REQUEST] = data.size;
	      return this;
	    }
	  }

	  var cbArgs = false,
	      filterArgs = false;

	  if (p.length) {
	    cbArgs = p.cbArgs = cb[FN_LENGTH] || cb.length;
	    p.filterArgs = [];

	    for (var i = 0; i < fCount; i++) {
	      p.filterArgs.push(filters[i][FN_LENGTH] || filters[i].length);
	    }

	    filterArgs = p.filterArgs.length ? p.filterArgs : false;
	  }

	  var lengthKey = SYMBOL_NATIVE_SUPPORT ? Symbol() : 'value';

	  var _cbLength;

	  if (p.thread || cbArgs === false || cbArgs > 3) {
	    var _p = any(Object.assign({}, opt_params, {
	      onChunk: null,
	      onIterationEnd: null,
	      onComplete: function onComplete(val) {
	        _cbLength.value = val;
	      }
	    }));

	    _cbLength = function cbLength(opt_reset) {
	      if (_cbLength[lengthKey] == null || opt_reset) {
	        return _cbLength[lengthKey] = _this.length(filters, _p);
	      }

	      return _cbLength[lengthKey];
	    };
	  }

	  var _fLength;

	  if (p.thread || filterArgs === false || Math.max.apply(null, any(filterArgs)) > 3) {
	    var _p2 = any(Object.assign({}, opt_params, {
	      onChunk: null,
	      onIterationEnd: null,
	      onComplete: function onComplete(val) {
	        _fLength.value = val;
	      }
	    }));

	    _fLength = function fLength(opt_reset) {
	      if (_fLength[lengthKey] == null || opt_reset) {
	        return _fLength[lengthKey] = _this.length(null, _p2);
	      }

	      return _fLength[lengthKey];
	    };
	  }

	  var key = [type, cbArgs, fCount < 5 ? fCount : Boolean(fCount), filterArgs, p.length, p.async, p.thread, p.withDescriptor, p.notOwn, p.live, p.inverseFilter, p.reverse, p.mult, Boolean(p.count), Boolean(p.from), Boolean(p.startIndex), p.endIndex !== false, Boolean(p.parallel), Boolean(p.race)].join();
	  var fn = any(compiledCycles[key] || compileCycle(key, p));
	  var args = {
	    TRUE: TRUE,
	    FALSE: FALSE,
	    IGNORE: IGNORE,
	    notAsync: notAsync,
	    cursor: cursor,
	    data: data,
	    cb: cb,
	    cbLength: _cbLength,
	    filters: filters,
	    fLength: _fLength,
	    priorities: priorities,
	    onComplete: p.onComplete,
	    onIterationEnd: p.onIterationEnd,
	    count: p.count,
	    from: p.from,
	    startIndex: p.startIndex,
	    endIndex: p.endIndex,
	    maxParallel: p.parallel || p.race
	  }; 
	  

	  if (p.async) {
	    var thread;
	    var promise = new Promise(function (resolve, reject) {
	      function onError(err) {
	        if (thread) {
	          thread.destroy(err);
	        } else {
	          reject(err);
	        }
	      }

	      function wrap(fn) {
	        if (!fn) {
	          return;
	        }

	        return function (el, key, data, o) {
	          try {
	            return fn(el, key, data, o);
	          } catch (err) {
	            onError(err);
	          }
	        };
	      }

	      for (var _i = 0; _i < fCount; _i++) {
	        filters[_i] = wrap(filters[_i]);
	      }

	      if (isAsyncType) {
	        data.onError = onError;
	      }

	      args.cb = wrap(cb);

	      args.onComplete = function (res) {
	        isFunction(p.onComplete) && p.onComplete(res);
	        resolve(res);
	      };

	      args.onIterationEnd = wrap(p.onIterationEnd);
	      args.onError = onError;
	      thread = args.self = fn(args, sp);
	      thread.value = undefined;
	      thread.destroyed = false;
	      thread.sleep = null;
	      thread.pause = false;
	      thread.children = [];
	      thread.stream = isStream ? cursor : undefined;

	      if (p.thread) {
	        _this._addToStack(thread, p.priority, reject, wrap(p.onChunk));
	      } else {
	        thread.destroy = function (err) {
	          if (thread.destroyed) {
	            return false;
	          }

	          thread.destroyed = true;

	          if (err) {
	            if (_typeof(err) !== 'object') {
	              err = new Error(err);
	            }
	          } else {
	            err = new Error('Thread was destroyed');
	            err.type = 'CollectionThreadDestroy';
	          }

	          err.thread = thread;

	          if (isStream) {
	            cursor.destroy();
	          }

	          try {
	            thread.throw(err);
	          } catch (_unused) {}

	          reject(err);
	          return err;
	        };

	        thread.next();
	      }
	    });
	    promise.thread = thread;
	    return promise;
	  } 
	  


	  fn(args, sp);
	  return this;
	};

	/**
	 * Appends a filter to the operation
	 *
	 * @param {...($$CollectionFilter|Array<$$CollectionFilter>|undefined)} filters - function filter
	 * @return {!Collection}
	 */

	Collection.prototype.filter = function (filters) {
	  var newFilters = [];

	  for (var i = 0; i < arguments.length; i++) {
	    var el = arguments[i];

	    if (el) {
	      newFilters = newFilters.concat(el);
	    }
	  }

	  this.p.filter = this.p.filter.concat.apply(this.p.filter, newFilters);
	  return this;
	};
	/**
	 * @private
	 * @param {?} p
	 * @param {...?} filters - function filter
	 * @return {!Collection}
	 */


	Collection.prototype._initParams = function (p, filters) {
	  var threadNodDefined = !p.hasOwnProperty('thread') && p.thread === false,
	      asyncNotDefined = !p.hasOwnProperty('async') && p.async === false;

	  if (!p.use && p.notOwn) {
	    p.use = 'for in';
	  }

	  if (threadNodDefined && (p.priority || p.onChunk)) {
	    p.thread = true;
	  }

	  if (p.thread && !priorities[p.priority]) {
	    p.priority = 'normal';
	  }

	  if (p.data !== this.data) {
	    p.data = this.data;
	    p.type = getType(this.data, p.use || this.p.use);
	  }

	  if (p.initial != null && !p.initialType) {
	    var type = _typeof(p.initial);

	    p.initialType = type !== 'object' ? type : getType(p.initial);
	  }

	  if (asyncNotDefined && (p.thread || p.use === 'async for of' || p.parallel != null && p.parallel !== false || p.race != null && p.race !== false) || asyncTypes[p.type] || p.initialType === 'stream') {
	    p.async = true;
	  }

	  if (filters !== false && (p.filter || filters)) {
	    var newFilters = [];

	    for (var i = 0; i < arguments.length; i++) {
	      var el = arguments[i];

	      if (i === 0) {
	        if (!el || !el.filter) {
	          continue;
	        }

	        el = [el.filter, delete el.filter][0];
	      }

	      if (el) {
	        newFilters = newFilters.concat(el);
	      }
	    }

	    this.p.filter = this.p.filter.concat.apply(this.p.filter, newFilters);
	  }

	  return this;
	}; 
	

	/**
	 * Marks the operation as thread
	 *
	 * @param {(?string|$$CollectionThreadCb)=} [opt_priority] - thread priority (low, normal, hight, critical)
	 * @param {?$$CollectionThreadCb=} [opt_onChunk] - callback function for chunks
	 * @return {!Collection}
	 */


	Collection.prototype.thread = function (opt_priority, opt_onChunk) {
	  if (isFunction(opt_priority)) {
	    opt_onChunk = any(opt_priority);
	    opt_priority = null;
	  }

	  var p = this.p;
	  p.async = true;
	  p.thread = true;

	  if (opt_priority) {
	    p.priority = opt_priority;
	  }

	  if (!priorities[p.priority]) {
	    p.priority = 'normal';
	  }

	  if (opt_onChunk) {
	    p.onChunk = opt_onChunk;
	  }

	  return this;
	}; 
	

	/**
	 * Sets .startIndex for the operation
	 *
	 * @param {number} value - source value
	 * @return {!Collection}
	 */


	Collection.prototype.start = function (value) {
	  this.p.startIndex = value;
	  return this;
	};
	/**
	 * Sets .endIndex for the operation
	 *
	 * @param {number} value - source value
	 * @return {!Collection}
	 */


	Collection.prototype.end = function (value) {
	  this.p.endIndex = value;
	  return this;
	};
	/**
	 * Sets .from for the operation
	 *
	 * @param {number} value - source value
	 * @return {!Collection}
	 */


	Collection.prototype.from = function (value) {
	  this.p.from = value;
	  return this;
	};
	/**
	 * Sets .count for the operation
	 *
	 * @param {number} value - source value
	 * @return {!Collection}
	 */


	Collection.prototype.count = function (value) {
	  this.p.count = value;
	  return this;
	};
	/**
	 * Sets .use to 'for in' for the operation
	 *
	 * @param {(boolean|number|null)=} [opt_notOwn] - iteration type:
	 *
	 *   1) if false, then hasOwnProperty test is enabled and all not own properties will be skipped
	 *   2) if true, then hasOwnProperty test is disabled
	 *   3) if -1, then hasOwnProperty test is enabled and all own properties will be skipped
	 *
	 * @return {!Collection}
	 */


	Collection.prototype.object = function (opt_notOwn) {
	  this.p.use = 'for in';

	  if (opt_notOwn) {
	    this.p.notOwn = opt_notOwn;
	  }

	  return this;
	};
	/**
	 * Sets .use to 'for of' for the operation
	 *
	 * @param {?boolean=} [opt_async] - if true, then will be used async for of
	 * @return {!Collection}
	 */


	Collection.prototype.iterator = function (opt_async) {
	  this.p.use = "".concat(opt_async === false ? 'sync ' : opt_async ? 'async ' : '', "for of");

	  if (opt_async) {
	    this.p.async = true;
	  }

	  return this;
	};
	/**
	 * Sets .initial for the operation
	 *
	 * @param {?} value
	 * @return {!Collection}
	 */


	Collection.prototype.to = function (value) {
	  var type = _typeof(value);

	  this.p.initialType = value != null && type !== 'object' ? type : getType(value);
	  this.p.initial = value;
	  return this;
	};
	/**
	 * Sets .initial as a transform stream for the operation
	 *
	 * @param {?boolean=} [opt_readObj] - readableObjectMode
	 * @param {?boolean=} opt_writeObj - writableObjectMode
	 * @return {!Collection}
	 */


	Collection.prototype.toStream = function (opt_readObj, opt_writeObj) {
	  opt_readObj = Boolean(opt_readObj != null ? opt_readObj : true); 

	  var p = this.p,
	      _require = require('stream'),
	      Transform = _require.Transform;

	  p.async = true;
	  p.initialType = 'stream';
	  p.initial = new Transform({
	    readableObjectMode: Boolean(opt_readObj),
	    writableObjectMode: Boolean(opt_writeObj != null ? opt_writeObj : opt_readObj),
	    transform: function transform(data, enc, cb) {
	      cb(null, data);
	    }
	  }); 

	  return this;
	}; 

	/**
	 * Sets .async to true and .parallel for the operation
	 *
	 * @param {(boolean|number|null)=} [opt_max]
	 * @return {!Collection}
	 */


	Collection.prototype.parallel = function (opt_max) {
	  this.p.async = true;
	  this.p.parallel = isNumber(opt_max) ? opt_max || true : opt_max !== false;
	  return this;
	};
	/**
	 * Sets .async to true and .race for the operation
	 *
	 * @param {(boolean|number|null)=} [opt_max]
	 * @return {!Collection}
	 */


	Collection.prototype.race = function (opt_max) {
	  this.p.async = true;
	  this.p.race = isNumber(opt_max) ? opt_max || true : opt_max !== false;
	  return this;
	}; 


	Object.defineProperties(Collection.prototype,
	/** @lends {Collection.prototype} */
	{
	  
	  async: {
	    /**
	     * Sets .async to true for the operation
	     */
	    get: function get() {
	      this.p.async = true;
	      return this;
	    }
	  },
	  
	  live: {
	    /**
	     * Sets .live to true for the operation
	     */
	    get: function get() {
	      this.p.live = true;
	      return this;
	    }
	  },
	  descriptor: {
	    /**
	     * Sets .withDescriptor to true for the operation
	     */
	    get: function get() {
	      this.p.withDescriptor = true;
	      return this;
	    }
	  },
	  array: {
	    /**
	     * Sets .use to 'for' for the operation
	     */
	    get: function get() {
	      this.p.use = 'for';
	      return this;
	    }
	  },
	  one: {
	    /**
	     * Sets .mult to false for the operation
	     */
	    get: function get() {
	      this.p.mult = false;
	      return this;
	    }
	  },
	  inverse: {
	    /**
	     * Sets .inverseFilter to true for the operation
	     */
	    get: function get() {
	      this.p.inverseFilter = true;
	      return this;
	    }
	  },
	  reverse: {
	    /**
	     * Sets .reverse to true for the operation
	     */
	    get: function get() {
	      this.p.reverse = true;
	      return this;
	    }
	  }
	});

	var simpleType = {
	  'array': true,
	  'object': true
	};
	var create = Object.create,
	    defineProperty = Object.defineProperty,
	    getPrototypeOf = Object.getPrototypeOf,
	    assign = Object.assign;
	/**
	 * Extends the collection by another objects
	 *
	 * @param {(boolean|?$$Collection_extend)} deepOrParams - if true, then properties will be copied recursively
	 *   OR additional parameters for extending:
	 *
	 *   * [withUndef = false] - if true, then the original value can be rewritten to undefined
	 *   * [withDescriptor = false] - if true, then the descriptor of a property will be copied too
	 *   * [withAccessors = false] - if true, then property accessors will be copied too, but not another descriptor properties;
	 *   * [withProto = false] - if true, then properties will be copied with prototypes
	 *   * [concatArray = false] - if true, then array properties will be concatenated (only if extending by an another array)
	 *   * [concatFn = Array.prototype.concat] - function that will be concatenate arrays
	 *   * [extendFilter] - function that will be filtering values for deep extending
	 *   * [traits = false] - if true, then will be copied only new properties, or if -1, only old
	 *   * [deep = false] - if true, then properties will be copied recursively
	 *
	 * @param {...Object} args - objects for extending
	 * @return {(!Object|!Promise)}
	 */

	Collection.prototype.extend = function (deepOrParams, args) {
	  var _arguments = arguments;
	  var p = any(deepOrParams);

	  if (p instanceof P === false) {
	    if (isBoolean(p)) {
	      p = {
	        deep: p
	      };
	    } else {
	      p = p || {};
	    }

	    this._initParams(p);

	    p = any(assign(Object.create(this.p), p));
	  } else {
	    p = any(Object.create(p));

	    this._initParams(p, false);
	  }

	  var withDescriptor = p.withDescriptor && !p.withAccessors;

	  if (p.withAccessors) {
	    p.withDescriptor = true;
	  }

	  if (p.withProto) {
	    p.notOwn = true;
	  }

	  var data = this.data,
	      _p = p,
	      type = _p.type;

	  if (!type || data === EMPTY) {
	    for (var i = 1; i < arguments.length; i++) {
	      type = getType(arguments[i], p.use);

	      if (type) {
	        break;
	      }
	    }

	    switch (type) {
	      case 'object':
	        data = {};
	        break;

	      case 'weakMap':
	        data = new WeakMap();
	        break;

	      case 'weakSet':
	        data = new WeakSet();
	        break;

	      case 'map':
	        data = new Map();
	        break;

	      case 'set':
	        data = new Set();
	        break;

	      default:
	        data = [];
	    }
	  }

	  var dataIsSimple = simpleType[type];
	  p.result = data;

	  if (!p.deep && p.withUndef && p.mult && dataIsSimple && OBJECT_ASSIGN_NATIVE_SUPPORT && !p.concatArray && !p.withProto && !p.withDescriptor && !p.withAccessors && !p.traits && !p.extendFilter && !p.filter.length && !p.async && !p.from && !p.count && !p.startIndex && !p.endIndex && !p.notOwn && !p.reverse) {
	    var _args = [];

	    for (var _i = 1; _i < arguments.length; _i++) {
	      _args.push(arguments[_i]);
	    }

	    return assign.apply(void 0, [data].concat(_args));
	  }

	  var setVal;

	  switch (type) {
	    case 'weakMap':
	    case 'map':
	      setVal = function setVal(data, key, val) {
	        if (p.traits && data.has(key) !== (p.traits === -1)) {
	          return;
	        }

	        data.set(key, val);
	      };

	      break;

	    case 'weakSet':
	    case 'set':
	      setVal = function setVal(data, key, val) {
	        if (p.traits && data.has(val) !== (p.traits === -1)) {
	          return;
	        }

	        data.add(val);
	      };

	      break;

	    default:
	      setVal = function setVal(data, key, val) {
	        if (p.traits && key in data !== (p.traits === -1)) {
	          return;
	        }

	        if (p.withUndef || val !== undefined) {
	          data[key] = val;
	        }
	      };

	  }

	  var promise = {
	    then: function then(cb) {
	      cb();
	      return this;
	    }
	  };

	  if (p.async) {
	    promise = Promise.resolve();
	  }

	  if (p.notOwn && !dataIsSimple) {
	    p.notOwn = false;
	  }

	  var _loop = function _loop(_i2) {
	    var arg = _arguments[_i2];

	    if (!arg) {
	      return "continue";
	    }

	    var isSimple = simpleType[getType(arg)];
	    promise = promise.then(function () {
	      return $C(arg).forEach(function (el, key) {
	        if (key === '__proto__') {
	          return;
	        }

	        if (dataIsSimple && isSimple && (withDescriptor || p.withAccessors && (el.get || el.set))) {
	          if (p.traits && key in data !== (p.traits === -1)) {
	            return;
	          }

	          if (p.withAccessors) {
	            defineProperty(data, key, {
	              get: el.get,
	              set: el.set
	            });
	          } else if ('value' in el === false || el.value !== undefined || p.withUndef) {
	            defineProperty(data, key, el);
	          }

	          return;
	        }

	        var src = byLink(data, [key]);
	        var val = isSimple ? arg[key] : el;

	        if (data === val || val === arg) {
	          return;
	        }

	        var canExtend = Boolean(val);

	        if (canExtend && p.extendFilter) {
	          canExtend = p.extendFilter(data, val, key);
	        }

	        var valIsArray, struct;

	        if (canExtend) {
	          valIsArray = isArray(val);
	          struct = valIsArray ? [] : getSameAs(val);
	        }

	        if (p.deep && canExtend && (valIsArray || struct)) {
	          var isExtProto = p.withProto && dataIsSimple && canExtendProto(src);
	          var srcIsArray = isArray(src);

	          if (isExtProto && !(data.hasOwnProperty ? data.hasOwnProperty(key) : hasOwnProperty.call(data, key))) {
	            src = srcIsArray ? src.slice() : create(src);
	            byLink(data, [key], {
	              value: src
	            });
	          }

	          var clone;

	          if (valIsArray) {
	            var isProto = false,
	                construct;

	            if (!srcIsArray && isExtProto && p.concatArray) {
	              construct = getPrototypeOf(src);
	              srcIsArray = isProto = construct && isArray(construct);
	            }

	            if (srcIsArray) {
	              if (p.concatArray) {
	                var o = isProto ? construct : src;
	                data[key] = p.concatFn ? p.concatFn(o, val, key) : o.concat(val);
	                return;
	              }

	              clone = src;
	            } else {
	              clone = [];
	            }
	          } else {
	            clone = isStructure(src) ? src : struct || {};
	          }

	          var childExt = $C(clone).extend(p, val);

	          if (p.async) {
	            return childExt.then(function (value) {
	              return byLink(data, [key], {
	                value: value
	              });
	            });
	          }

	          byLink(data, [key], {
	            value: childExt
	          });
	        } else {
	          setVal(data, key, val);
	        }
	      }, p);
	    });
	  };

	  for (var _i2 = 1; _i2 < arguments.length; _i2++) {
	    var _ret = _loop(_i2);

	    if (_ret === "continue") continue;
	  }

	  return p.async ? promise.then(function () {
	    return data;
	  }) : data;
	};
	/**
	 * Clones an object
	 *
	 * @param {?} obj - source object
	 * @return {?}
	 */


	$C.clone = function (obj) {
	  return JSON.parse(JSON.stringify(obj));
	};
	/**
	 * Extends the specified object by another objects
	 *
	 * @see Collection.prototype.extend
	 * @param {(boolean|?$$Collection_extend)} deepOrParams - additional parameters
	 * @param {Object} target - source object
	 * @param {...Object} args - objects for extending
	 * @return {(!Object|!Promise)}
	 */


	$C.extend = function (deepOrParams, target, args) {
	  args = [deepOrParams];

	  for (var i = 2; i < arguments.length; i++) {
	    args.push(arguments[i]);
	  }

	  var obj = $C(target == null ? EMPTY : target);
	  return obj.extend.apply(obj, args);
	};

	Object.assign($C, {
	  extend: $C.extend,
	  clone: $C.clone
	});

	/**
	 * Creates a new collection based on the current by the specified parameters
	 *
	 * @see Collection.prototype.forEach
	 * @param {($$CollectionCb|$$Collection_map)=} opt_cb - callback function
	 * @param {($$Collection_map|$$CollectionFilter)=} [opt_params] - additional parameters:
	 *   * [initial] - initial object for adding elements
	 *
	 * @return {(?|!Promise)}
	 */

	Collection.prototype.map = function (opt_cb, opt_params) {
	  var p = opt_params || {};

	  if (!isFunction(opt_cb)) {
	    p = opt_cb || p;

	    opt_cb = function opt_cb(el) {
	      return el;
	    };
	  }

	  if (isArray(p) || isFunction(p)) {
	    p = {
	      filter: p
	    };
	  }

	  this._initParams(p);

	  p = any(Object.assign(Object.create(this.p), p));
	  var data = this.data;
	  var type = p.initialType || p.type,
	      res = p.initial;
	  var hasInitial = p.initial != null,
	      source = hasInitial ? p.initial : data;

	  if (!hasInitial) {
	    switch (type) {
	      case 'object':
	        res = {};
	        break;

	      case 'array':
	        if (isArray(source)) {
	          res = [];
	        } else {
	          res = {
	            length: source.length
	          };
	          type = 'object';
	        }

	        break;

	      case 'generator':
	      case 'iterator':
	      case 'syncIterator':
	      case 'asyncIterator':
	      case 'idbRequest':
	        res = [];
	        type = 'array';
	        break;

	      default:
	        if (type === 'stream') {
	          if (IS_NODE) {
	            
	            var _require = require('stream'),
	                Transform = _require.Transform;

	            res = new Transform({
	              readableObjectMode: true,
	              writableObjectMode: true,
	              transform: function transform(data, enc, cb) {
	                cb(null, data);
	              }
	            }); 
	          } else {
	            res = [];
	            type = 'array';
	          }
	        } else {
	          res = new source.constructor();
	        }

	    }
	  }

	  var fn;
	  p.result = res;

	  switch (type) {
	    case 'array':
	      fn = function fn() {
	        var val = opt_cb.apply(null, arguments); 

	        if (p.async && isPromise(val)) {
	          return val.then(function (val) {
	            return isPositive(val) && res.push(val);
	          });
	        } 


	        isPositive(val) && res.push(val);
	      };

	      fn[FN_LENGTH] = opt_cb.length;
	      break;

	    case 'object':
	      fn = function fn(el, key) {
	        var val = opt_cb.apply(null, arguments); 

	        if (p.async && isPromise(val)) {
	          return val.then(function (val) {
	            if (isPositive(val)) {
	              res[key] = val;
	            }
	          });
	        } 


	        if (isPositive(val)) {
	          res[key] = val;
	        }
	      };

	      fn[FN_LENGTH] = fn.length > opt_cb.length ? fn.length : opt_cb.length;
	      break;

	    case 'map':
	    case 'weakMap':
	      fn = function fn(el, key) {
	        var val = opt_cb.apply(null, arguments); 

	        if (p.async && isPromise(val)) {
	          return val.then(function (val) {
	            return isPositive(val) && res.set(key, val);
	          });
	        } 


	        isPositive(val) && res.set(key, val);
	      };

	      fn[FN_LENGTH] = fn.length > opt_cb.length ? fn.length : opt_cb.length;
	      break;

	    case 'set':
	    case 'weakSet':
	      fn = function fn() {
	        var val = opt_cb.apply(null, arguments); 

	        if (p.async && isPromise(val)) {
	          return val.then(function (val) {
	            return isPositive(val) && res.add(val);
	          });
	        } 


	        isPositive(val) && res.add(val);
	      };

	      fn[FN_LENGTH] = opt_cb.length;
	      break;

	    case 'stream':
	      {
	        var writable = true;

	        fn = function fn() {
	          var _arguments = arguments;
	          return new Promise(function (resolve, reject) {
	            var val = opt_cb.apply(null, _arguments);

	            function end() {
	              clear();
	              resolve();
	            }

	            function onError(err) {
	              clear();
	              reject(err);
	            }

	            function clear() {
	              res.removeListener('drain', write);
	              res.removeListener('error', onError);
	              res.removeListener('close', end);
	            }

	            function write() {
	              clear();
	              res.addListener('error', onError);
	              res.addListener('close', end);

	              try {
	                if (!isPositive(val)) {
	                  res.end();
	                  end();
	                  return;
	                }

	                if (writable) {
	                  writable = Boolean(res.write(val, function (err) {
	                    if (err) {
	                      onError(err);
	                      return;
	                    }

	                    clear();
	                    resolve(val);
	                  }));
	                } else {
	                  res.addListener('drain', function () {
	                    writable = true;
	                    write();
	                  });
	                }
	              } catch (err) {
	                onError(err);
	              }
	            } 


	            if (p.async && isPromise(val)) {
	              return val.then(function (res) {
	                val = res;
	                write();
	              });
	            } 


	            return write();
	          });
	        };

	        fn[FN_LENGTH] = opt_cb.length;
	        break;
	      }

	    default:
	      fn = function fn() {
	        var val = opt_cb.apply(null, arguments); 

	        if (p.async && isPromise(val)) {
	          return val.then(function (val) {
	            if (isPositive(val)) {
	              p.result = res += val;
	            }
	          });
	        } 


	        if (isPositive(val)) {
	          p.result = res += val;
	        }
	      };

	      fn[FN_LENGTH] = opt_cb.length;
	  }

	  var returnVal = any(this.forEach(any(fn), p));

	  if (type === 'stream') {
	    returnVal.then(function () {
	      return res.end();
	    }, function (err) {
	      return res.destroy(err);
	    });
	    return p.result;
	  }

	  if (returnVal !== this) {
	    return returnVal;
	  }

	  return p.result;
	};

	/**
	 * Searches elements in a collection by the specified condition/link.
	 * The method returns an array of found elements or an element (if mult = false)
	 *
	 * @see Collection.prototype.forEach
	 * @param {($$CollectionFilter|$$CollectionBase|$$CollectionLink)=} [opt_filter] - link, function filter or an array of functions
	 * @param {?$$CollectionBase=} [opt_params] - additional parameters
	 * @return {(?|!Array|!Promise<(?|!Array)>)}
	 */

	Collection.prototype.get = function (opt_filter, opt_params) {
	  var p = opt_params || {};

	  if (!isFunction(opt_filter) && (isArray(opt_filter) && !isFunction(opt_filter[1]) || opt_filter != null && _typeof(opt_filter) !== 'object')) {
	    return byLink(this.data, any(opt_filter));
	  }

	  if (!isArray(opt_filter) && !isFunction(opt_filter)) {
	    p = opt_filter || p;
	    opt_filter = null;
	  }

	  this._initParams(p, opt_filter);

	  p = any(Object.assign(Object.create(this.p), p));
	  var fn;

	  if (p.mult !== false) {
	    var res = p.result = [];

	    fn = function fn(el) {
	      return res.push(el);
	    };
	  } else {
	    fn = function fn(el) {
	      return p.result = el;
	    };
	  }

	  var returnVal = any(this.forEach(any(fn), p));

	  if (returnVal !== this) {
	    return returnVal;
	  }

	  return p.result;
	};

	/**
	 * Reduces the collection by the specified condition
	 *
	 * @see Collection.prototype.forEach
	 * @param {$$CollectionReduceCb} cb - callback function
	 * @param {(?|$$CollectionFilter|$$CollectionBase)=} [opt_initialValue] - initial value
	 * @param {($$CollectionFilter|$$CollectionBase)=} [opt_filter] - function filter or an array of functions
	 * @param {?$$CollectionBase=} [opt_params] - additional parameters
	 * @return {(?|!Promise)}
	 */

	Collection.prototype.reduce = function (cb, opt_initialValue, opt_filter, opt_params) {
	  if (this.p.initial != null) {
	    opt_params = any(opt_filter);
	    opt_filter = any(opt_initialValue);
	    opt_initialValue = this.p.initial;
	  }

	  var p = opt_params || {};

	  if (!isArray(opt_filter) && !isFunction(opt_filter)) {
	    p = opt_filter || p;
	    opt_filter = null;
	  }

	  this._initParams(p, opt_filter);

	  p = any(Object.assign(Object.create(this.p), p, {
	    result: opt_initialValue
	  }));
	  fn[FN_LENGTH] = cb.length - 1;

	  function fn(el) {
	    if (opt_initialValue == null) {
	      p.result = el;
	      opt_initialValue = true;
	    } else {
	      var args = [p.result];

	      for (var i = 0; i < arguments.length; i++) {
	        args.push(arguments[i]);
	      }

	      var val = cb.apply(null, args); 

	      if (p.async && isPromise(val)) {
	        return val.then(function (val) {
	          if (isPositive(val)) {
	            p.result = val;
	          }
	        });
	      } 


	      if (isPositive(val)) {
	        p.result = val;
	      }
	    }
	  }

	  var res = p.result,
	      returnVal = any(this.forEach(fn, p));

	  if (isStream(res)) {
	    returnVal.then(function () {
	      return res.end();
	    }, function (err) {
	      return res.destroy(err);
	    });
	    return p.result;
	  }

	  if (returnVal !== this) {
	    return returnVal;
	  }

	  return p.result;
	};

	/**
	 * Returns true if all elements in the collection matches by the specified condition
	 *
	 * @see Collection.prototype.forEach
	 * @param {($$CollectionFilter|$$CollectionSingleBase)=} [opt_filter] - function filter or an array of functions
	 * @param {?$$CollectionSingleBase=} [opt_params] - additional parameters
	 * @return {(boolean|!Promise<boolean>)}
	 */

	Collection.prototype.every = function (opt_filter, opt_params) {
	  var p = opt_params || {};

	  if (!isArray(opt_filter) && !isFunction(opt_filter)) {
	    p = opt_filter || p;
	    opt_filter = null;
	  }

	  this._initParams(p, opt_filter);

	  p = any(Object.assign(Object.create(this.p), p, {
	    mult: false,
	    result: true
	  }));
	  p.inverseFilter = !p.inverseFilter;
	  var returnVal = any(this.forEach(function () {
	    return p.result = false;
	  }, p));

	  if (returnVal !== this) {
	    return returnVal;
	  }

	  return p.result;
	};

	/**
	 * Returns true if in the collection exists at least one element which matches by the specified condition
	 *
	 * @see Collection.prototype.forEach
	 * @param {($$CollectionFilter|$$CollectionSingleBase)=} [opt_filter] - function filter or an array of functions
	 * @param {?$$CollectionSingleBase=} [opt_params] - additional parameters
	 * @return {(boolean|!Promise<boolean>)}
	 */

	Collection.prototype.some = function (opt_filter, opt_params) {
	  var p = opt_params || {};

	  if (!isArray(opt_filter) && !isFunction(opt_filter)) {
	    p = opt_filter || p;
	    opt_filter = null;
	  }

	  this._initParams(p, opt_filter);

	  p = any(Object.assign(Object.create(this.p), p, {
	    mult: false,
	    result: false
	  }));
	  var returnVal = any(this.forEach(function () {
	    return p.result = true;
	  }, p));

	  if (returnVal !== this) {
	    return returnVal;
	  }

	  return p.result;
	};

	/**
	 * Searches elements in the collection by the specified condition.
	 * The method returns an array of found indexes/keys or an index/key (if mult = false) or null.
	 * If the data is Map or Set and mult = false, then the method will return an object {value: key} or null
	 *
	 * @see Collection.prototype.forEach
	 * @param {($$CollectionFilter|$$CollectionBase)=} [opt_filter] - function filter or an array of functions
	 * @param {?$$CollectionBase=} [opt_params] - additional parameters
	 * @return {(?|!Array|!Promise<(?|!Array)>)}
	 */

	Collection.prototype.search = function (opt_filter, opt_params) {
	  var _this = this;

	  var p = opt_params || {};

	  if (!isArray(opt_filter) && !isFunction(opt_filter)) {
	    p = opt_filter || p;
	    opt_filter = null;
	  }

	  this._initParams(p, opt_filter);

	  p = any(Object.assign(Object.create(this.p), p));
	  var fn;

	  if (p.mult !== false) {
	    var res = p.result = [];

	    if (isSet(this.data)) {
	      fn = function fn(el) {
	        return res.push(el);
	      };
	    } else {
	      fn = function fn(el, key) {
	        return res.push(key);
	      };
	    }
	  } else {
	    p.result = null;

	    fn = function fn(el, key) {
	      return p.result = isMap(_this.data) ? {
	        value: key
	      } : isSet(_this.data) ? {
	        value: el
	      } : key;
	    };
	  }

	  var returnVal = any(this.forEach(any(fn), p));

	  if (returnVal !== this) {
	    return returnVal;
	  }

	  return p.result;
	};

	/**
	 * Returns true if the specified element contains in the collection
	 *
	 * @see Collection.prototype.forEach
	 * @param {?} searchElement - element for search
	 * @param {($$CollectionFilter|$$CollectionSingleBase)=} [opt_filter] - function filter or an array of functions
	 * @param {?$$CollectionSingleBase=} [opt_params] - additional parameters
	 * @return {(boolean|!Promise<boolean>)}
	 */

	Collection.prototype.includes = function (searchElement, opt_filter, opt_params) {
	  var p = opt_params || {};

	  if (!isArray(opt_filter) && !isFunction(opt_filter)) {
	    p = opt_filter || p;
	    opt_filter = null;
	  }

	  var f = Number.isNaN(searchElement) ? function (el) {
	    return Number.isNaN(el);
	  } : function (el) {
	    return el === searchElement;
	  };

	  this._initParams(p, [].concat(opt_filter || [], f));

	  p = any(Object.assign(Object.create(this.p), p, {
	    mult: false,
	    result: false
	  }));
	  var returnVal = any(this.forEach(function () {
	    return p.result = true;
	  }, p));

	  if (returnVal !== this) {
	    return returnVal;
	  }

	  return p.result;
	};

	/**
	 * Groups elements in the collection by the specified condition and returns a new collection
	 *
	 * @see Collection.prototype.forEach
	 * @param {($$CollectionLink|$$CollectionCb)=} [opt_field] - link for the group field or a function which returns the group field
	 * @param {($$CollectionFilter|$$Collection_group)=} [opt_filter] - function filter or an array of functions
	 * @param {?$$Collection_group=} [opt_params] - additional parameters:
	 *
	 *   * [saveKeys = false] - if true, then will be saved keys, but not values
	 *   * [useMap = false] - if true, then for saving data will be used Map
	 *
	 * @return {(!Object|!Map|!Promise<(!Object|!Map)>)}
	 */

	Collection.prototype.group = function (opt_field, opt_filter, opt_params) {
	  var field = opt_field || function (el) {
	    return el;
	  };

	  var p = opt_params || {};

	  if (!isArray(opt_filter) && !isFunction(opt_filter)) {
	    p = opt_filter || p;
	    opt_filter = null;
	  }

	  this._initParams(p, opt_filter);

	  p = any(Object.assign(Object.create(this.p), p, {
	    mult: true
	  }));
	  var isFunc = isFunction(field),
	      useMap = p.initial && (isMap(p.initial) || isWeakMap(p.initial)) || p.useMap || p.useMap == null && mapSet[p.type],
	      res = p.result = p.initial || (useMap ? new Map() : Object.create(null));
	  var fn;

	  if (useMap) {
	    fn = function fn(el, key) {
	      var param = isFunc ? field.apply(null, arguments) : byLink(el, field),
	          val = p.saveKeys ? key : el; 

	      if (p.async && isPromise(param)) {
	        return param.then(function (param) {
	          if (res.has(param)) {
	            res.get(param).push(val);
	          } else {
	            res.set(param, [val]);
	          }
	        });
	      } 


	      if (res.has(param)) {
	        res.get(param).push(val);
	      } else {
	        res.set(param, [val]);
	      }
	    };
	  } else {
	    fn = function fn(el, key) {
	      var param = isFunc ? field.apply(null, arguments) : byLink(el, field),
	          val = p.saveKeys ? key : el; 

	      if (p.async && isPromise(param)) {
	        return param.then(function (param) {
	          if (res.hasOwnProperty ? res.hasOwnProperty(param) : hasOwnProperty.call(res, param)) {
	            res[param].push(val);
	          } else {
	            res[param] = [val];
	          }
	        });
	      } 


	      if (res.hasOwnProperty ? res.hasOwnProperty(param) : hasOwnProperty.call(res, param)) {
	        res[param].push(val);
	      } else {
	        res[param] = [val];
	      }
	    };
	  }

	  if (isFunc) {
	    fn[FN_LENGTH] = fn.length > field.length ? fn.length : field.length;
	  }

	  var returnVal = any(this.forEach(any(fn), p));

	  if (returnVal !== this) {
	    return returnVal;
	  }

	  return p.result;
	};

	/**
	 * Removes elements from the collection by the specified condition/link
	 *
	 * @see Collection.prototype.forEach
	 * @param {($$CollectionFilter|$$CollectionBase|$$CollectionLink)=} [opt_filter] - link, function filter or an array of functions
	 * @param {?$$CollectionBase=} [opt_params] - additional parameters
	 * @return {($$CollectionReport|!Promise<$$CollectionReport>)}
	 */

	Collection.prototype.remove = function (opt_filter, opt_params) {
	  var p = opt_params || {};

	  if (!isFunction(opt_filter) && (isArray(opt_filter) && !isFunction(opt_filter[1]) || opt_filter != null && _typeof(opt_filter) !== 'object')) {
	    return byLink(this.data, opt_filter, {
	      delete: true
	    });
	  }

	  if (!isArray(opt_filter) && !isFunction(opt_filter)) {
	    p = opt_filter || p;
	    opt_filter = null;
	  }

	  this._initParams(p, opt_filter);

	  p = any(Object.assign(Object.create(this.p), p));
	  var isRealArray = p.type === 'array' && isArray(this.data);

	  if (iterators[p.type]) {
	    throw new TypeError('Incorrect data type');
	  }

	  var mult = p.mult !== false,
	      res = [];

	  if (mult) {
	    p.result = res;
	  } else {
	    p.result = {
	      notFound: true,
	      result: false,
	      key: undefined,
	      value: undefined
	    };
	  }

	  var fn;

	  switch (p.type) {
	    case 'map':
	      fn = function fn(value, key, data) {
	        data.delete(key);
	        var o = {
	          result: !data.has(key),
	          key: key,
	          value: value
	        };

	        if (mult) {
	          res.push(o);
	        } else {
	          p.result = o;
	        }
	      };

	      break;

	    case 'set':
	      fn = function fn(value, key, data) {
	        data.delete(value);
	        var o = {
	          result: !data.has(value),
	          key: null,
	          value: value
	        };

	        if (mult) {
	          res.push(o);
	        } else {
	          p.result = o;
	        }
	      };

	      break;

	    case 'array':
	      if (p.reverse) {
	        fn = function fn(value, key, data) {
	          if (isRealArray) {
	            data.splice(key, 1);
	          } else {
	            splice.call(data, key, 1);
	          }

	          var o = {
	            result: data[key] !== value,
	            key: key,
	            value: value
	          };

	          if (mult) {
	            res.push(o);
	          } else {
	            p.result = o;
	          }
	        };
	      } else {
	        var rm = 0;

	        if (p.live) {
	          fn = function fn(value, key, data, ctx) {
	            if (isRealArray) {
	              data.splice(key, 1);
	            } else {
	              splice.call(data, key, 1);
	            }

	            ctx.i(-1);
	            var o = {
	              result: data[key] !== value,
	              key: key + rm,
	              value: value
	            };

	            if (mult) {
	              res.push(o);
	            } else {
	              p.result = o;
	            }

	            rm++;
	          };
	        } else {
	          fn = function fn(value, key, data, ctx) {
	            var ln = ctx.length();

	            var f = function f(length) {
	              if (isRealArray) {
	                data.splice(key, 1);
	              } else {
	                splice.call(data, key, 1);
	              }

	              ctx.i(-1);
	              var o = {
	                result: data[key] !== value,
	                key: key + rm,
	                value: value
	              };

	              if (mult) {
	                res.push(o);
	              } else {
	                p.result = o;
	              }

	              if (++rm === length) {
	                return ctx.break;
	              }
	            };

	            if (isNumber(ln)) {
	              f(ln);
	            } else {
	              return ctx.wait(ln).then(f);
	            }
	          };
	        }
	      }

	      break;

	    default:
	      fn = function fn(value, key, data) {
	        delete data[key];
	        var o = {
	          result: key in data === false,
	          key: key,
	          value: value
	        };

	        if (mult) {
	          res.push(o);
	        } else {
	          p.result = o;
	        }
	      };

	  }

	  var returnVal = any(this.forEach(any(fn), p));

	  if (returnVal !== this) {
	    return returnVal;
	  }

	  return p.result;
	};

	/**
	 * Sets a new value for collection elements by the specified condition/link
	 *
	 * @see Collection.prototype.forEach
	 * @param {(?|$$CollectionCb)} value - new value (function will execute)
	 * @param {($$CollectionFilter|$$Collection_set|$$CollectionLink)=} filter - link, function filter or an array of functions
	 * @param {?$$Collection_set=} [opt_params] - additional parameters:
	 *
	 *   * [key] - key (null for array.push) of a new element (if search elements nof found)
	 *   * [create = true] - if false, in the absence of the requested property will be thrown an exception, otherwise it will be created
	 *
	 * @return {($$CollectionSetReport|!Promise<$$CollectionSetReport>)}
	 */

	Collection.prototype.set = function (value, filter, opt_params) {
	  var p = opt_params || {};
	  var data = this.data;

	  if (!isFunction(filter) && (isArray(filter) && !isFunction(filter[1]) || filter != null && _typeof(filter) !== 'object')) {
	    return byLink(data, filter, {
	      value: value,
	      create: p.create !== false,
	      error: true
	    });
	  }

	  if (!isArray(filter) && !isFunction(filter)) {
	    p = filter || p;
	    filter = null;
	  }

	  this._initParams(p, filter);

	  p = any(Object.assign(Object.create(this.p), p));
	  var valIsFunc = isFunction(value);

	  if (iterators[p.type]) {
	    throw new TypeError('Incorrect data type');
	  }

	  var mult = p.mult !== false,
	      report = [];

	  if (mult) {
	    p.result = report;
	  } else {
	    p.result = {
	      notFound: true,
	      result: false,
	      key: undefined,
	      value: undefined
	    };
	  }

	  var fn;

	  if (valIsFunc) {
	    switch (p.type) {
	      case 'map':
	        fn = function fn(el, key, data) {
	          var res = value.apply(null, arguments); 

	          if (p.async && isPromise(res)) {
	            return res.then(function (res) {
	              var status = false;

	              if (data.get(key) !== res) {
	                data.set(key, res);
	                status = data.get(key) === res;
	              }

	              var o = {
	                key: key,
	                value: el,
	                newValue: res,
	                result: status
	              };

	              if (mult) {
	                report.push(o);
	              } else {
	                p.result = o;
	              }
	            });
	          } 


	          var status = false;

	          if (data.get(key) !== res) {
	            data.set(key, res);
	            status = data.get(key) === res;
	          }

	          var o = {
	            key: key,
	            value: el,
	            newValue: res,
	            result: status
	          };

	          if (mult) {
	            report.push(o);
	          } else {
	            p.result = o;
	          }
	        };

	        break;

	      case 'set':
	        fn = function fn(el, key, data) {
	          var res = value.apply(null, arguments); 

	          if (p.async && isPromise(res)) {
	            return res.then(function (res) {
	              var status = false;
	              data.delete(el);

	              if (!data.has(res)) {
	                data.add(res);
	                status = data.has(res);
	              }

	              var o = {
	                key: null,
	                value: el,
	                newValue: res,
	                result: status
	              };

	              if (mult) {
	                report.push(o);
	              } else {
	                p.result = o;
	              }
	            });
	          } 


	          var status = false;
	          data.delete(el);

	          if (!data.has(res)) {
	            data.add(res);
	            status = data.has(res);
	          }

	          var o = {
	            key: null,
	            value: el,
	            newValue: res,
	            result: status
	          };

	          if (mult) {
	            report.push(o);
	          } else {
	            p.result = o;
	          }
	        };

	        break;

	      default:
	        fn = function fn(el, key, data) {
	          var res = value.apply(null, arguments); 

	          if (p.async && isPromise(res)) {
	            return res.then(function (res) {
	              var status = false;

	              if (data[key] !== res) {
	                data[key] = res;
	                status = data[key] === res;
	              }

	              var o = {
	                key: key,
	                value: el,
	                newValue: res,
	                result: status
	              };

	              if (mult) {
	                report.push(o);
	              } else {
	                p.result = o;
	              }
	            });
	          } 


	          var status = false;

	          if (data[key] !== res) {
	            data[key] = res;
	            status = data[key] === res;
	          }

	          var o = {
	            key: key,
	            value: el,
	            newValue: res,
	            result: status
	          };

	          if (mult) {
	            report.push(o);
	          } else {
	            p.result = o;
	          }
	        };

	    }

	    fn[FN_LENGTH] = fn.length > value.length ? fn.length : value.length;
	  } else {
	    switch (p.type) {
	      case 'map':
	        fn = function fn(el, key, data) {
	          var result = false;

	          if (data.get(key) !== value) {
	            data.set(key, value);
	            result = data.get(key) === value;
	          }

	          var o = {
	            key: key,
	            value: el,
	            newValue: value,
	            result: result
	          };

	          if (mult) {
	            report.push(o);
	          } else {
	            p.result = o;
	          }
	        };

	        break;

	      case 'set':
	        fn = function fn(el, key, data) {
	          var result = false;
	          data.delete(el);

	          if (!data.has(value)) {
	            data.add(value);
	            result = data.has(value);
	          }

	          var o = {
	            key: null,
	            value: el,
	            newValue: value,
	            result: result
	          };

	          if (mult) {
	            report.push(o);
	          } else {
	            p.result = o;
	          }
	        };

	        break;

	      default:
	        fn = function fn(el, key, data) {
	          var result = false;

	          if (data[key] !== value) {
	            data[key] = value;
	            result = data[key] === value;
	          }

	          var o = {
	            key: key,
	            value: el,
	            newValue: value,
	            result: result
	          };

	          if (mult) {
	            report.push(o);
	          } else {
	            p.result = o;
	          }
	        };

	    }
	  }

	  var _p = p,
	      onIterationEnd = _p.onIterationEnd;

	  p.onIterationEnd = function (ctx) {
	    if ((mult ? !p.result.length : p.result.notFound) && p.create !== false && 'key' in p) {
	      if (isArray(data) && !p.key && p.key !== 0) {
	        p.key = data.length;
	      }

	      var newVal = valIsFunc ? value(undefined, undefined, data, ctx) : value;

	      var create = function create(newVal) {
	        var res = byLink(data, p.key, {
	          value: newVal,
	          create: true
	        });

	        if (mult) {
	          p.result.push(res);
	        } else {
	          p.result = res;
	        }
	      }; 


	      if (valIsFunc && p.async && isPromise(newVal)) {
	        return newVal.then(create);
	      } 


	      create(newVal);
	    }

	    onIterationEnd && onIterationEnd(ctx);
	  };

	  var returnVal = any(this.forEach(any(fn), p));

	  if (returnVal !== this) {
	    return returnVal;
	  }

	  return p.result;
	};

		/**
	 * Returns a random number in the specified diapason
	 *
	 * @param {number} min - minimum
	 * @param {number} max - maximum
	 * @return {number}
	 */

	function getRandomInt(min, max) {
	  return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	var intervals = [[0, 40], [41, 160], [161, 500], [501, 2000]];
	var lastPos = {},
	    execStack = {};

	for (var key in priorities) {
	  if (!priorities.hasOwnProperty(key)) {
	    continue;
	  }

	  lastPos[key] = 0;
	  execStack[key] = [];
	}
	/**
	 * Returns a working plan for the current iteration of the event loop
	 * @return {!Object}
	 */


	function getTasks() {
	  var tasks = {},
	      tmp = {},
	      mods = {},
	      exec = Object.assign({}, execStack);
	  var total = 0,
	      count = 0;
	  $C(exec).forEach(function (el, key) {
	    tmp[key] = $C(el).map(function (el, key) {
	      return key;
	    });
	    mods[key] = 0;
	    count++;
	  }, function (el) {
	    return el.length;
	  });
	  /* eslint-disable no-loop-func */

	  var sort = function sort(a, b) {
	    return b.value - a.value;
	  };

	  var _loop = function _loop() {
	    var rands = [];
	    $C(exec).forEach(function (el, key) {
	      rands.push({
	        key: key,
	        value: priorities[key]
	      });
	    }, function (el) {
	      return el.length;
	    });
	    rands.sort(sort);
	    var pos = rands.length - 1,
	        max = 0;
	    $C(rands).forEach(function (el, i) {
	      var interval = intervals[pos];

	      if (interval[1] > max) {
	        max = interval[1];
	      }

	      rands[i].value = interval;
	      pos--;
	    });
	    var rand = getRandomInt(0, max);
	    $C(rands).forEach(function (_ref) {
	      var key = _ref.key,
	          value = _ref.value;
	      var arr = tmp[key];

	      if (rand >= value[0] && rand <= value[1]) {
	        tasks[key] = tasks[key] || [];
	        var _pos = lastPos[key];

	        if (arr[_pos] == null) {
	          lastPos[key] = _pos = 0;
	          mods[key] = 0;
	        }

	        var point = exec[key][arr[_pos]];

	        if (point && !point.pause) {
	          mods[key]++;
	          tasks[key].push(arr[_pos]);
	          total += priorities[key];
	        }

	        arr.splice(_pos, 1);

	        if (!arr.length) {
	          delete exec[key];
	          count--;
	        }

	        return false;
	      }
	    });

	    if (!count) {
	      return "break";
	    }
	  };

	  while (total <= MAX_PRIORITY) {
	    var _ret = _loop();

	    if (_ret === "break") break;
	  }
	  /* eslint-enable no-loop-func */


	  $C(mods).forEach(function (el, key) {
	    lastPos[key] += el;
	  });
	  return tasks;
	}

	var exec = 0;
	/**
	 * Adds a task to the execution stack
	 *
	 * @private
	 * @param {?} obj - generator object
	 * @param {string} priority - task priority
	 * @param {function(!Error)} onError - callback function for error handling
	 * @param {?function($$CollectionCtx)} [opt_onChunk] - callback function for chunks
	 */

	Collection.prototype._addToStack = function (obj, priority, onError, opt_onChunk) {
	  obj.destroy = function (err) {
	    if (obj.destroyed) {
	      return false;
	    }

	    clearTimeout(obj.sleep);
	    $C(obj.children).forEach(function (child) {
	      return child.destroy();
	    });
	    $C(execStack[obj.priority]).remove(function (el) {
	      return el === obj;
	    }, {
	      mult: false
	    });
	    exec--;
	    obj.destroyed = true;

	    if (err) {
	      if (_typeof(err) !== 'object') {
	        err = new Error(err);
	      }
	    } else {
	      err = new Error('Thread was destroyed');
	      err.type = 'CollectionThreadDestroy';
	    }

	    err.thread = obj;

	    if (obj.stream) {
	      obj.stream.destroy();
	    }

	    try {
	      obj.throw(err);
	    } catch (_unused) {}

	    onError(err);
	    return err;
	  };

	  obj.thread = true;
	  obj.priority = priority;
	  obj.onChunk = opt_onChunk;
	  var next = obj.next; // With strictMode in Chrome (bug?) that method can't define as obj.next =

	  Object.defineProperty(obj, 'next', {
	    value: function value() {
	      obj.pause = false;

	      if (obj.sleep !== null) {
	        obj.sleep.resume();
	      }

	      return next.apply(this, arguments);
	    }
	  });
	  exec++;
	  execStack[priority].push(obj);

	  function loop() {
	    $C(getTasks()).forEach(function (el, key) {
	      var prop = execStack[key];
	      $C(el).forEach(function (el, i, data) {
	        var obj = prop[el];

	        if (!obj) {
	          return;
	        }

	        var res = obj.next();
	        obj.value = res.value;

	        if (res.done) {
	          prop.splice(el, 1);
	          $C(data).forEach(function (el, i) {
	            if (el) {
	              data[i]--;
	            }
	          }, {
	            startIndex: i + 1
	          });
	          exec--;
	        } else if (obj.onChunk) {
	          obj.onChunk(obj.ctx);
	        }
	      });
	    });

	    if (exec) {
	      setTimeout(loop, MAX_PRIORITY);
	    }
	  }

	  if (exec === 1) {
	    if (typeof setImmediate === 'function') {
	      setImmediate(loop);
	    } else {
	      setTimeout(loop, 0);
	    }
	  }
	};
	/**
	 * Destroys the specified Collection worker
	 *
	 * @param {(Promise|?)} obj - Collection worker or any value (returns false)
	 * @return {(!Error|boolean)}
	 */


	$C.destroy = function (obj) {
	  if (!obj || !obj.thread) {
	    return false;
	  }

	  return (obj.priority ? obj : obj.thread).destroy();
	};

	Object.assign($C, {
	  destroy: $C.destroy
	});

	return $C;

}));

