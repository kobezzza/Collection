/*!
 * Collection v6.6.0 (sync)
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 *
 * Date: 'Sun, 04 Feb 2018 15:58:48 GMT
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('Collection', factory) :
	(global.$C = factory());
}(this, (function () { 'use strict';

/**
 * Gets an object with an undefined type
 * (for the GCC)
 *
 * @param {?} val - source object
 * @return {?}
 */
function any(val) {
  return val;
}

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
	return typeof Promise === 'function' && obj instanceof Promise;
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
	return Boolean(obj) && objectTypes[typeof obj];
}

var isFuncRgxp = /\[object Function]/;
var toString = {}.toString;

/**
 * Returns true if the specified value is an array or like an array
 *
 * @param {?} obj - source value
 * @return {boolean}
 */
function isLikeArray(obj) {
	var res = isArray(obj) || obj &&

	// The hack for PhantomJS,
	// because it has strange bug for HTMLCollection and NodeList:
	// typeof 'function' && instanceof Function = false
	isObjectInstance(obj) && !isFuncRgxp.test(toString.call(obj)) && (
	// If the object is like an array
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
 * @param {?string=} [opt_use] - cycle type for iteration: for, for in, for of, async for of
 * @return {?string}
 */
function getType(obj, opt_use) {
	if (!obj) {
		return null;
	}

	var type = 'object';
	switch (opt_use) {
		case 'for':
			type = 'array';
			break;

		case 'for in':
			type = 'object';
			break;

		case 'for of':
			type = 'iterator';
			break;

		case 'async for of':
			type = 'asyncIterator';
			break;

		default:
			if (isMap(obj)) {
				type = 'map';
			} else if (isWeakMap(obj)) {
				type = 'weakMap';
			} else if (isSet(obj)) {
				type = 'set';
			} else if (isWeakSet(obj)) {
				type = 'weakSet';
			} else if (isGenerator(obj)) {
				type = 'generator';
			} else if (isLikeArray(obj)) {
				type = 'array';
			} else if (isIterator(obj)) {
				type = 'iterator';
			} else if (isIDBRequest(obj)) {
				type = 'idbRequest';
			} else if (isStream(obj)) {
				type = 'stream';
			}
	}

	return type;
}

var isNative = /\[native code]/;

/**
 * Returns a new object with the same type as source
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
 * Returns true if the specified object can be extended
 *
 * @param {?} obj - source object
 * @return {boolean}
 */
function canExtended(obj) {
	if (!obj) {
		return false;
	}

	if (isArray(obj) || isPlainObject(obj)) {
		return true;
	}

	return isFunction(obj.constructor) && !isNative.test(obj.constructor.toString());
}

/**
 * Collection constructor
 *
 * @constructor
 * @implements {$$Collection}
 * @param {$$CollectionType} obj
 */
function Collection(obj) {
	this.data = any(isString(obj) ? obj.split('') : obj || []);
	this._init();
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

Object.assign($C, { config: {} });

/**
 * Library version
 * @const
 */
Collection.prototype.VERSION = [6, 6, 0];

/**
 * Creates an instance of Collection
 * @param {$$CollectionType} obj
 */
function $C(obj) {
	return new Collection(obj);
}

/* eslint-disable prefer-const */

Object.assign($C, {
  ready: false,
  cache: {
    str: {},
    cycle: {}
  }
});

var tmpCycle = $C.cache.cycle;

var wsRgxp = /^\s+|[\r\n]+/mg;

/**
 * String tag (for ES6 string templates) for truncate starting whitespaces and eol-s
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

var IS_NODE = function () {
	try {
		return typeof process === 'object' && {}.toString.call(process) === '[object process]';
	} catch (_) {
		return false;
	}
}();

var IS_BROWSER = !IS_NODE && typeof window === 'object';
var BLOB_SUPPORT = IS_BROWSER && typeof Blob === 'function' && typeof URL === 'function';
var OBJECT_KEYS_NATIVE_SUPPORT = isNative.test(Object.keys && any(Object.keys).toString());
var OBJECT_ASSIGN_NATIVE_SUPPORT = isNative.test(Object.assign && any(Object.assign).toString());
var SYMBOL_NATIVE_SUPPORT = typeof Symbol === 'function' && isNative.test(Symbol.toString());

var LOCAL_STORAGE_SUPPORT = !IS_NODE && function () {
	var mod = Math.random();

	try {
		localStorage.setItem(mod, mod);
		localStorage.removeItem(mod);
		return true;
	} catch (_) {
		return false;
	}
}();

var GLOBAL = new Function('return this')();
var TRUE = [];
var FALSE = [];
var IGNORE = [];

var NAMESPACE = '__COLLECTION_NAMESPACE__https_github_com_kobezzza_Collection';
GLOBAL[NAMESPACE] = $C;

var LENGTH_REQUEST = SYMBOL_NATIVE_SUPPORT ? Symbol('Data length query') : '__COLLECTION_TMP__lengthQuery';
var FN_LENGTH = SYMBOL_NATIVE_SUPPORT ? Symbol('Function length') : '__COLLECTION_TMP__length';
var ON_ERROR = SYMBOL_NATIVE_SUPPORT ? Symbol('Error handler') : '__COLLECTION_TMP__onError';

var CACHE_VERSION = 56;
var CACHE_KEY = '__COLLECTION_CACHE__';
var CACHE_VERSION_KEY = '__COLLECTION_CACHE_VERSION__';

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();







































var taggedTemplateLiteral = function (strings, raw) {
  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
};

var _templateObject = taggedTemplateLiteral(['\nvar\ndata = o.data,\ncb = o.cb,\nbaseCb = cb,\nfilters = o.filters;\nvar\ncount = o.count,\nfrom = o.from,\nstartIndex = o.startIndex || 0,\nendIndex = o.endIndex !== false ? o.endIndex + 1 : 0;\nvar\nonIterationEnd = o.onIterationEnd,\nonComplete = o.onComplete,\nonError = o.onError;\nvar\nTRUE = o.TRUE,\nFALSE = o.FALSE,\nIGNORE = o.IGNORE;\nvar\ni = -1,\nj = 0,\nn = -1,\nid = 0,\nfI = -1;\nvar\nbreaker = false,\nbrkIf = false;\nvar\nlimit = 1,\nlooper = 0,\nchildResult;\nvar\nfLength = filters.length,\nlength,\nr,\nf;\nvar\nel,\nkey;\n'], ['\nvar\ndata = o.data,\ncb = o.cb,\nbaseCb = cb,\nfilters = o.filters;\nvar\ncount = o.count,\nfrom = o.from,\nstartIndex = o.startIndex || 0,\nendIndex = o.endIndex !== false ? o.endIndex + 1 : 0;\nvar\nonIterationEnd = o.onIterationEnd,\nonComplete = o.onComplete,\nonError = o.onError;\nvar\nTRUE = o.TRUE,\nFALSE = o.FALSE,\nIGNORE = o.IGNORE;\nvar\ni = -1,\nj = 0,\nn = -1,\nid = 0,\nfI = -1;\nvar\nbreaker = false,\nbrkIf = false;\nvar\nlimit = 1,\nlooper = 0,\nchildResult;\nvar\nfLength = filters.length,\nlength,\nr,\nf;\nvar\nel,\nkey;\n']);
var _templateObject2 = taggedTemplateLiteral(['\nvar\npriority = o.priority,\nmaxParallel = o.maxParallel,\nmaxParallelIsNumber = typeof maxParallel === \'number\';\nvar\ndone,\ntimeStart,\ntimeEnd,\ntime = 0;\nvar\nthread = o.self,\nthread = o.self,\nyielder = false,\nyieldVal;\nfunction isPromise(obj) {\nreturn typeof Promise === \'function\' && obj instanceof Promise;\n}\nvar\nrCbSet = new Set(),\nrElSet = new Set();\nfunction resolveCb(res) {\nrCbSet.delete(r);\nr = res;\nthread.next();\n}\nfunction resolveEl(res) {\nrElSet.delete(r);\nel = res;\nthread.next();\n}\ncb = function (', ') {\nvar\nf = ', ',\nfIsPromise = !done && isPromise(el),\nres;\nif (el === IGNORE || done) {\nf = FALSE;\nreturn;\n}\nif (fIsPromise) {\nf = el.then(function (val) {\nif (val === IGNORE) {\nreturn FALSE;\n}\nif (brkIf && val === null) {\nbreaker = true;\nreturn FALSE;\n}\nel = val;\nreturn TRUE;\n}, onError);\n}\n'], ['\nvar\npriority = o.priority,\nmaxParallel = o.maxParallel,\nmaxParallelIsNumber = typeof maxParallel === \'number\';\nvar\ndone,\ntimeStart,\ntimeEnd,\ntime = 0;\nvar\nthread = o.self,\nthread = o.self,\nyielder = false,\nyieldVal;\nfunction isPromise(obj) {\nreturn typeof Promise === \'function\' && obj instanceof Promise;\n}\nvar\nrCbSet = new Set(),\nrElSet = new Set();\nfunction resolveCb(res) {\nrCbSet.delete(r);\nr = res;\nthread.next();\n}\nfunction resolveEl(res) {\nrElSet.delete(r);\nel = res;\nthread.next();\n}\ncb = function (', ') {\nvar\nf = ', ',\nfIsPromise = !done && isPromise(el),\nres;\nif (el === IGNORE || done) {\nf = FALSE;\nreturn;\n}\nif (fIsPromise) {\nf = el.then(function (val) {\nif (val === IGNORE) {\nreturn FALSE;\n}\nif (brkIf && val === null) {\nbreaker = true;\nreturn FALSE;\n}\nel = val;\nreturn TRUE;\n}, onError);\n}\n']);
var _templateObject3 = taggedTemplateLiteral(['\nif (', ') {\nif (fIsPromise) {\nf = f.then(function (f) {\n', ';\nif (f) {\nreturn ', ';\n}\nreturn FALSE;\n}, onError);\n} else {\nf = ', ';\nfIsPromise = isPromise(f);\nif (!fIsPromise) {\n', '\n}\n}\n}\n'], ['\nif (', ') {\nif (fIsPromise) {\nf = f.then(function (f) {\n', ';\nif (f) {\nreturn ', ';\n}\nreturn FALSE;\n}, onError);\n} else {\nf = ', ';\nfIsPromise = isPromise(f);\nif (!fIsPromise) {\n', '\n}\n}\n}\n']);
var _templateObject4 = taggedTemplateLiteral(['\nfor (fI = -1; ++fI < fLength;) {\nif (fIsPromise) {\nf = f.then((function (fI) {\nreturn function (f) {\n', '\nif (f) {\nreturn ', ';\n} else {\nreturn FALSE;\n}\n};\n})(fI), onError);\n} else {\nf = ', ';\nfIsPromise = isPromise(f);\nif (!fIsPromise) {\n', '\n}\nif (!f) {\nbreak;\n}\n}\n}\n'], ['\nfor (fI = -1; ++fI < fLength;) {\nif (fIsPromise) {\nf = f.then((function (fI) {\nreturn function (f) {\n', '\nif (f) {\nreturn ', ';\n} else {\nreturn FALSE;\n}\n};\n})(fI), onError);\n} else {\nf = ', ';\nfIsPromise = isPromise(f);\nif (!fIsPromise) {\n', '\n}\nif (!f) {\nbreak;\n}\n}\n}\n']);
var _templateObject5 = taggedTemplateLiteral(['\nif (from === 0) {\nreturn;\n}\nfrom--;\n'], ['\nif (from === 0) {\nreturn;\n}\nfrom--;\n']);
var _templateObject6 = taggedTemplateLiteral(['\nif (j === count) {\nreturn;\n}\nj++;\n'], ['\nif (j === count) {\nreturn;\n}\nj++;\n']);
var _templateObject7 = taggedTemplateLiteral(['\nif (fIsPromise) {\nf = f.then(function (f) {\n', '\nif (f) {\n', '\nreturn baseCb(', ');\n}\n});\nres = f;\n} else if (f) {\n', '\nres = baseCb(', ');\n}\n'], ['\nif (fIsPromise) {\nf = f.then(function (f) {\n', '\nif (f) {\n', '\nreturn baseCb(', ');\n}\n});\nres = f;\n} else if (f) {\n', '\nres = baseCb(', ');\n}\n']);
var _templateObject8 = taggedTemplateLiteral(['\nif (maxParallelIsNumber) {\nctx[\'', '\'](maxParallel, null, new Promise(function (r) { r(res); }));\n} else {\nctx[\'', '\'](new Promise((r) => r(res)));\n}\n'], ['\nif (maxParallelIsNumber) {\nctx[\'', '\'](maxParallel, null, new Promise(function (r) { r(res); }));\n} else {\nctx[\'', '\'](new Promise((r) => r(res)));\n}\n']);
var _templateObject9 = taggedTemplateLiteral(['\nvar ctx = {\n$: {},\ninfo: {\nfilters: filters.slice(0),\nmult: ', ',\nstartIndex: startIndex,\nendIndex: endIndex,\nfrom: from,\ncount: count,\nlive: ', ',\nreverse: ', ',\nwithDescriptor: ', ',\nnotOwn: ', ',\ninverseFilter: ', ',\ntype: \'', '\',\nasync: ', ',\nthread: ', ',\npriority: ', ' && \'', '\',\nlength: ', '\n},\ntrue: TRUE,\nfalse: FALSE,\ncursor: o.cursor,\nlength: o.cbLength,\nchildResult: childResult,\nonError: onError,\nget result() {\nreturn p.result;\n},\nset result(value) {\np.result = value;\n},\nget value() {\nreturn yieldVal;\n},\njump: function (val) {\nif (', ') {\nreturn false;\n}\nvar diff = i - n;\nn = val - 1;\ni = n + diff;\nreturn i;\n},\ni: function (val) {\nif (val === undefined) {\nreturn i;\n}\nif (', ') {\nreturn false;\n}\nn += val;\ni += val;\nreturn i;\n},\nget id() {\nreturn id;\n},\nget reset() {\nbreaker = true;\nlimit++;\nreturn FALSE;\n},\nget break() {\nbreaker = true;\nreturn FALSE;\n}\n};\nvar fCtx = Object.create(ctx);\nfCtx.length = o.fLength;\n'], ['\nvar ctx = {\n$: {},\ninfo: {\nfilters: filters.slice(0),\nmult: ', ',\nstartIndex: startIndex,\nendIndex: endIndex,\nfrom: from,\ncount: count,\nlive: ', ',\nreverse: ', ',\nwithDescriptor: ', ',\nnotOwn: ', ',\ninverseFilter: ', ',\ntype: \'', '\',\nasync: ', ',\nthread: ', ',\npriority: ', ' && \'', '\',\nlength: ', '\n},\ntrue: TRUE,\nfalse: FALSE,\ncursor: o.cursor,\nlength: o.cbLength,\nchildResult: childResult,\nonError: onError,\nget result() {\nreturn p.result;\n},\nset result(value) {\np.result = value;\n},\nget value() {\nreturn yieldVal;\n},\njump: function (val) {\nif (', ') {\nreturn false;\n}\nvar diff = i - n;\nn = val - 1;\ni = n + diff;\nreturn i;\n},\ni: function (val) {\nif (val === undefined) {\nreturn i;\n}\nif (', ') {\nreturn false;\n}\nn += val;\ni += val;\nreturn i;\n},\nget id() {\nreturn id;\n},\nget reset() {\nbreaker = true;\nlimit++;\nreturn FALSE;\n},\nget break() {\nbreaker = true;\nreturn FALSE;\n}\n};\nvar fCtx = Object.create(ctx);\nfCtx.length = o.fLength;\n']);
var _templateObject10 = taggedTemplateLiteral(['\nctx.thread = thread;\nthread.ctx = ctx;\nvar\nparallelI = {null: {i: 0}},\nraceI = {null: {i: 0}},\nwaiting = false;\nvar\nwaitStore = new Set(),\nraceStore = new Set();\nchildResult = [];\nfunction waitFactory(store, max, label, promise) {\nif (!promise && label) {\npromise = label;\nlabel = null;\n}\nlabel = label || null;\nvar parallel = parallelI[label] = parallelI[label] || {i: 0};\nparallel.max = max;\nfunction end(err) {\nparallel.i && parallel.i--;\nvar canNext = true;\nfor (var key in parallelI) {\nif (!parallelI.hasOwnProperty(key)) {\nbreak;\n}\nif (parallelI[key].i >= parallelI[key].max) {\ncanNext = false;\nbreak;\n}\n}\ncanNext && thread.pause && ctx.next();\n}\nif (promise) {\nparallel.i++;\nif (parallel.i >= parallel.max) {\nctx.yield();\n}\nwaitFactory(store, promise).then(end, function (err) {\nif (err && err.type === \'CollectionThreadDestroy\') {\nend();\n}\n});\nreturn promise;\n}\nif (!isPromise(promise = max)) {\npromise = typeof promise.next === \'function\' ? promise.next() : promise();\n}\nctx.child(promise);\nstore.add(promise);\npromise.then(\nfunction (res) {\nif (store.has(promise)) {\nchildResult.push(res);\nstore.delete(promise);\n}\nif (waiting) {\nctx.next();\n}\n},\nfunction (err) {\nif (err && err.type === \'CollectionThreadDestroy\') {\nstore.delete(promise);\nreturn;\n}\nonError(err);\n}\n);\nreturn promise;\n}\nctx.yield = function (opt_val) {\nyielder = true;\nyieldVal = opt_val;\nreturn true;\n};\nctx.next = function (opt_val) {\nthread.next(opt_val);\nreturn true;\n};\nctx.child = function (obj) {\nif (!obj.thread) {\nreturn false;\n}\nthread.children.push(obj.thread);\nreturn true;\n};\nctx.race = function (max, label, promise) {\nif (!promise) {\npromise = label || max;\nmax = label != null ? max : 1;\nlabel = null;\n}\nlabel = label || null;\nvar race = raceI[label] = raceI[label] || {i: 0};\nrace.max = max;\nwaitFactory(raceStore, promise).then(function () {\nif (race.i < race.max) {\nrace.i++;\nif (race.i === race.max) {\nrace.i = 0;\nraceStore.clear();\ndone = true;\n}\n}\n});\nreturn promise;\n};\nctx.wait = function (max, label, promise) {\nreturn waitFactory(waitStore, max, label, promise);\n};\nctx.sleep = function (time, opt_test, opt_interval) {\nctx.yield();\nreturn new Promise(function (resolve, reject) {\nvar\nsleep = thread.sleep;\nif (sleep != null) {\nsleep.resume();\n}\nsleep = thread.sleep = {\nresume: function () {\nclearTimeout(sleep.id);\nthread.sleep = null;\nresolve();\n},\nid: setTimeout(function () {\nif (opt_test) {\ntry {\nthread.sleep = null;\nvar test = opt_test(ctx);\nif (test) {\nresolve();\nctx.next();\n} else if (opt_interval !== false) {\nctx.sleep(time, opt_test, opt_interval).then(resolve, reject);\n}\n} catch (err) {\nreject(err);\nonError(err);\n}\n} else {\nresolve();\nctx.next();\n}\n}, time)\n};\n});\n};\n'], ['\nctx.thread = thread;\nthread.ctx = ctx;\nvar\nparallelI = {null: {i: 0}},\nraceI = {null: {i: 0}},\nwaiting = false;\nvar\nwaitStore = new Set(),\nraceStore = new Set();\nchildResult = [];\nfunction waitFactory(store, max, label, promise) {\nif (!promise && label) {\npromise = label;\nlabel = null;\n}\nlabel = label || null;\nvar parallel = parallelI[label] = parallelI[label] || {i: 0};\nparallel.max = max;\nfunction end(err) {\nparallel.i && parallel.i--;\nvar canNext = true;\nfor (var key in parallelI) {\nif (!parallelI.hasOwnProperty(key)) {\nbreak;\n}\nif (parallelI[key].i >= parallelI[key].max) {\ncanNext = false;\nbreak;\n}\n}\ncanNext && thread.pause && ctx.next();\n}\nif (promise) {\nparallel.i++;\nif (parallel.i >= parallel.max) {\nctx.yield();\n}\nwaitFactory(store, promise).then(end, function (err) {\nif (err && err.type === \'CollectionThreadDestroy\') {\nend();\n}\n});\nreturn promise;\n}\nif (!isPromise(promise = max)) {\npromise = typeof promise.next === \'function\' ? promise.next() : promise();\n}\nctx.child(promise);\nstore.add(promise);\npromise.then(\nfunction (res) {\nif (store.has(promise)) {\nchildResult.push(res);\nstore.delete(promise);\n}\nif (waiting) {\nctx.next();\n}\n},\nfunction (err) {\nif (err && err.type === \'CollectionThreadDestroy\') {\nstore.delete(promise);\nreturn;\n}\nonError(err);\n}\n);\nreturn promise;\n}\nctx.yield = function (opt_val) {\nyielder = true;\nyieldVal = opt_val;\nreturn true;\n};\nctx.next = function (opt_val) {\nthread.next(opt_val);\nreturn true;\n};\nctx.child = function (obj) {\nif (!obj.thread) {\nreturn false;\n}\nthread.children.push(obj.thread);\nreturn true;\n};\nctx.race = function (max, label, promise) {\nif (!promise) {\npromise = label || max;\nmax = label != null ? max : 1;\nlabel = null;\n}\nlabel = label || null;\nvar race = raceI[label] = raceI[label] || {i: 0};\nrace.max = max;\nwaitFactory(raceStore, promise).then(function () {\nif (race.i < race.max) {\nrace.i++;\nif (race.i === race.max) {\nrace.i = 0;\nraceStore.clear();\ndone = true;\n}\n}\n});\nreturn promise;\n};\nctx.wait = function (max, label, promise) {\nreturn waitFactory(waitStore, max, label, promise);\n};\nctx.sleep = function (time, opt_test, opt_interval) {\nctx.yield();\nreturn new Promise(function (resolve, reject) {\nvar\nsleep = thread.sleep;\nif (sleep != null) {\nsleep.resume();\n}\nsleep = thread.sleep = {\nresume: function () {\nclearTimeout(sleep.id);\nthread.sleep = null;\nresolve();\n},\nid: setTimeout(function () {\nif (opt_test) {\ntry {\nthread.sleep = null;\nvar test = opt_test(ctx);\nif (test) {\nresolve();\nctx.next();\n} else if (opt_interval !== false) {\nctx.sleep(time, opt_test, opt_interval).then(resolve, reject);\n}\n} catch (err) {\nreject(err);\nonError(err);\n}\n} else {\nresolve();\nctx.next();\n}\n}, time)\n};\n});\n};\n']);
var _templateObject11 = taggedTemplateLiteral(['\nctx.yield = ctx.next = ctx.child = ctx.race = ctx.wait = ctx.sleep = o.notAsync;\n'], ['\nctx.yield = ctx.next = ctx.child = ctx.race = ctx.wait = ctx.sleep = o.notAsync;\n']);
var _templateObject12 = taggedTemplateLiteral(['\nif (timeStart == null) {\ntimeStart = new Date().valueOf();\n}\n'], ['\nif (timeStart == null) {\ntimeStart = new Date().valueOf();\n}\n']);
var _templateObject13 = taggedTemplateLiteral(['\ntimeEnd = new Date().valueOf();\ntime += timeEnd - timeStart;\ntimeStart = timeEnd;\nif (time > priority[thread.priority]) {\nyield;\ntime = 0;\ntimeStart = null;\n}\n'], ['\ntimeEnd = new Date().valueOf();\ntime += timeEnd - timeStart;\ntimeStart = timeEnd;\nif (time > priority[thread.priority]) {\nyield;\ntime = 0;\ntimeStart = null;\n}\n']);
var _templateObject14 = taggedTemplateLiteral(['\nif (yielder) {\nyielder = false;\nthread.pause = true;\nyieldVal = yield yieldVal;\n}\n'], ['\nif (yielder) {\nyielder = false;\nthread.pause = true;\nyieldVal = yield yieldVal;\n}\n']);
var _templateObject15 = taggedTemplateLiteral(['\nwaiting = true;\nwhile (waitStore.size) {\nthread.pause = true;\nyield;\n}\nwhile (raceStore.size) {\nthread.pause = true;\nyield;\n}\n'], ['\nwaiting = true;\nwhile (waitStore.size) {\nthread.pause = true;\nyield;\n}\nwhile (raceStore.size) {\nthread.pause = true;\nyield;\n}\n']);
var _templateObject16 = taggedTemplateLiteral(['\nif (n < startIndex) {\n', '\ncontinue;\n}\n'], ['\nif (n < startIndex) {\n', '\ncontinue;\n}\n']);
var _templateObject17 = taggedTemplateLiteral(['\nif (n > endIndex) {\n', '\nbreak;\n};\n'], ['\nif (n > endIndex) {\n', '\nbreak;\n};\n']);
var _templateObject18 = taggedTemplateLiteral(['\nvar\nclone = data,\ndLength = data.length - 1,\nslice = IGNORE.slice;\n'], ['\nvar\nclone = data,\ndLength = data.length - 1,\nslice = IGNORE.slice;\n']);
var _templateObject19 = taggedTemplateLiteral(['\nclone = slice.call(clone, startIndex, endIndex || data.length);\n'], ['\nclone = slice.call(clone, startIndex, endIndex || data.length);\n']);
var _templateObject20 = taggedTemplateLiteral(['\nfor (n = startIndex - 1; ++n < clone.length;) {\n', '\ni = n;\n', '\n'], ['\nfor (n = startIndex - 1; ++n < clone.length;) {\n', '\ni = n;\n', '\n']);
var _templateObject21 = taggedTemplateLiteral(['\nlength = clone.length;\nfor (n = -1; ++n < length;) {\n', '\ni = n + startIndex;\n'], ['\nlength = clone.length;\nfor (n = -1; ++n < length;) {\n', '\ni = n + startIndex;\n']);
var _templateObject22 = taggedTemplateLiteral(['\nvar\nselfHasOwn = data.hasOwnProperty,\nhasOwnProperty = IGNORE.hasOwnProperty;\n'], ['\nvar\nselfHasOwn = data.hasOwnProperty,\nhasOwnProperty = IGNORE.hasOwnProperty;\n']);
var _templateObject23 = taggedTemplateLiteral(['\nfor (key in data) {\n', '\nif (selfHasOwn ? data.hasOwnProperty(key) : hasOwnProperty.call(data, key)) {\ncontinue;\n}\ntmpArray.push(key);\n', '\n}\n'], ['\nfor (key in data) {\n', '\nif (selfHasOwn ? data.hasOwnProperty(key) : hasOwnProperty.call(data, key)) {\ncontinue;\n}\ntmpArray.push(key);\n', '\n}\n']);
var _templateObject24 = taggedTemplateLiteral(['\nfor (key in data) {\n', '\ntmpArray.push(key);\n', '\n}\n'], ['\nfor (key in data) {\n', '\ntmpArray.push(key);\n', '\n}\n']);
var _templateObject25 = taggedTemplateLiteral(['\nfor (key in data) {\n', '\nif (!(selfHasOwn ? data.hasOwnProperty(key) : hasOwnProperty.call(data, key))) {\nbreak;\n}\ntmpArray.push(key);\n', '\n}\n'], ['\nfor (key in data) {\n', '\nif (!(selfHasOwn ? data.hasOwnProperty(key) : hasOwnProperty.call(data, key))) {\nbreak;\n}\ntmpArray.push(key);\n', '\n}\n']);
var _templateObject26 = taggedTemplateLiteral(['\nlength = tmpArray.length;\nfor (n = -1; ++n < length;) {\n', '\nkey = tmpArray[n];\nif (key in data === false) {\n', '\ncontinue;\n}\ni = n + startIndex;\n'], ['\nlength = tmpArray.length;\nfor (n = -1; ++n < length;) {\n', '\nkey = tmpArray[n];\nif (key in data === false) {\n', '\ncontinue;\n}\ni = n + startIndex;\n']);
var _templateObject27 = taggedTemplateLiteral(['\nfor (key in data) {\n', '\n'], ['\nfor (key in data) {\n', '\n']);
var _templateObject28 = taggedTemplateLiteral(['\nif (!(selfHasOwn ? data.hasOwnProperty(key) : hasOwnProperty.call(data, key))) {\n', '\nbreak;\n}'], ['\nif (!(selfHasOwn ? data.hasOwnProperty(key) : hasOwnProperty.call(data, key))) {\n', '\nbreak;\n}']);
var _templateObject29 = taggedTemplateLiteral(['\nif (selfHasOwn ? data.hasOwnProperty(key) : hasOwnProperty.call(data, key)) {\n', '\ncontinue;\n}'], ['\nif (selfHasOwn ? data.hasOwnProperty(key) : hasOwnProperty.call(data, key)) {\n', '\ncontinue;\n}']);
var _templateObject30 = taggedTemplateLiteral(['\nn++;\ni = n;\n', '\n'], ['\nn++;\ni = n;\n', '\n']);
var _templateObject31 = taggedTemplateLiteral(['\nvar\niteratorKey = typeof Symbol !== \'undefined\' && Symbol.iterator,\ncursor;\nif (typeof data.next === \'function\') {\ncursor = data;\n} else {\ncursor = (iteratorKey ? data[iteratorKey]() : data[\'@@iterator\'] && data[\'@@iterator\']()) || data;\n}\n'], ['\nvar\niteratorKey = typeof Symbol !== \'undefined\' && Symbol.iterator,\ncursor;\nif (typeof data.next === \'function\') {\ncursor = data;\n} else {\ncursor = (iteratorKey ? data[iteratorKey]() : data[\'@@iterator\'] && data[\'@@iterator\']()) || data;\n}\n']);
var _templateObject32 = taggedTemplateLiteral(['\n', '\nfor (\nkey = cursor.next(), brkIf = (\'done\' in key === false);\n\'done\' in key ? !key.done : key;\nkey = cursor.next()\n) {\n', '\n'], ['\n', '\nfor (\nkey = cursor.next(), brkIf = (\'done\' in key === false);\n\'done\' in key ? !key.done : key;\nkey = cursor.next()\n) {\n', '\n']);
var _templateObject33 = taggedTemplateLiteral(['\nwhile (isPromise(el)) {\nif (!rElSet.has(el)) {\nrElSet.add(el);\nel.then(resolveEl, onError);\n}\nthread.pause = true;\nyield;\n}\n'], ['\nwhile (isPromise(el)) {\nif (!rElSet.has(el)) {\nrElSet.add(el);\nel.then(resolveEl, onError);\n}\nthread.pause = true;\nyield;\n}\n']);
var _templateObject34 = taggedTemplateLiteral(['\nif (maxParallelIsNumber) {\nif (isPromise(el)) {\nctx[\'', '\'](maxParallel, null, el);\n}\n', '\n}\n'], ['\nif (maxParallelIsNumber) {\nif (isPromise(el)) {\nctx[\'', '\'](maxParallel, null, el);\n}\n', '\n}\n']);
var _templateObject35 = taggedTemplateLiteral(['\nif (el !== IGNORE) {\nif (brkIf && el === null) {\n', '\nbreak;\n}\ntmpArray.push(el);\n}\n', '\n}\n', '\ntmpArray.reverse();\nvar size = tmpArray.length;\n'], ['\nif (el !== IGNORE) {\nif (brkIf && el === null) {\n', '\nbreak;\n}\ntmpArray.push(el);\n}\n', '\n}\n', '\ntmpArray.reverse();\nvar size = tmpArray.length;\n']);
var _templateObject36 = taggedTemplateLiteral(['\nlength = size;\nfor (n = -1; ++n < length;) {\n', '\n', '\ni = n + startIndex;\n'], ['\nlength = size;\nfor (n = -1; ++n < length;) {\n', '\n', '\ni = n + startIndex;\n']);
var _templateObject37 = taggedTemplateLiteral(['\n', '\nn++;\ni = n;\n', '\n'], ['\n', '\nn++;\ni = n;\n', '\n']);
var _templateObject38 = taggedTemplateLiteral(['\nif (j === count) {\n', '\nbreak;\n}\n'], ['\nif (j === count) {\n', '\nbreak;\n}\n']);
var _templateObject39 = taggedTemplateLiteral(['\nif (', ') {\nf = filters[', '](', ');\n', '\n}\n'], ['\nif (', ') {\nf = filters[', '](', ');\n', '\n}\n']);
var _templateObject40 = taggedTemplateLiteral(['\nfor (fI = -1; ++fI < fLength;) {\nf = ', ';\n', '\nif (!f) {\nbreak;\n}\n}\n'], ['\nfor (fI = -1; ++fI < fLength;) {\nf = ', ';\n', '\nif (!f) {\nbreak;\n}\n}\n']);
var _templateObject41 = taggedTemplateLiteral(['\nwhile (isPromise(r)) {\nif (!rCbSet.has(r)) {\nrCbSet.add(r);\nr.then(resolveCb, onError);\n}\nthread.pause = true;\nyield;\n}\n'], ['\nwhile (isPromise(r)) {\nif (!rCbSet.has(r)) {\nrCbSet.add(r);\nr.then(resolveCb, onError);\n}\nthread.pause = true;\nyield;\n}\n']);
var _templateObject42 = taggedTemplateLiteral(['\nif (from !== 0) {\nfrom--;\n} else {\n', '\n}\n'], ['\nif (from !== 0) {\nfrom--;\n} else {\n', '\n}\n']);
var _templateObject43 = taggedTemplateLiteral(['\nsize--;\nif (!size) {\n', '\nbreak;\n}\n'], ['\nsize--;\nif (!size) {\n', '\nbreak;\n}\n']);
var _templateObject44 = taggedTemplateLiteral(['\n', '\nif (breaker', ') {\nbreak;\n}\n}\nbreaker = false;\nlooper++;\nif (onIterationEnd) {\nonIterationEnd(', ');\n}\n'], ['\n', '\nif (breaker', ') {\nbreak;\n}\n}\nbreaker = false;\nlooper++;\nif (onIterationEnd) {\nonIterationEnd(', ');\n}\n']);
var _templateObject45 = taggedTemplateLiteral(['\n', '\n}\n', '\nif (onComplete) {\n', '\nonComplete(p.result);\n}\nreturn p.result;\n'], ['\n', '\n}\n', '\nif (onComplete) {\n', '\nonComplete(p.result);\n}\nreturn p.result;\n']);

var timeout = void 0;
var cache$1 = $C.cache.str;

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

var mapSet = {
	'map': true,
	'set': true
};

/**
 * Compiles a loop by the specified parameters
 *
 * @param {string} key - cache key
 * @param {!Object} p - compile parameters
 * @return {!Function}
 */
function compileCycle(key, p) {
	var isMapSet = mapSet[p.type],
	    isAsync = p.thread || p.async;

	var cantModI = !(p.type === 'array' || p.reverse || p.type === 'object' && p.notOwn && OBJECT_KEYS_NATIVE_SUPPORT);

	var cbArgs = cbArgsList.slice(0, p.length ? p.cbArgs : cbArgsList.length),
	    filterArgs = [];

	var maxArgsLength = p.length ? Math.max.apply(null, [].concat(p.cbArgs, p.filterArgs)) : cbArgsList.length,
	    needParallel = p.parallel || p.race,
	    parallelFn = p.parallel ? 'wait' : 'race',
	    needCtx = maxArgsLength > 3 || needParallel,
	    fLength = p.filter.length;

	for (var i = 0; i < fLength; i++) {
		filterArgs.push(filterArgsList.slice(0, p.length ? p.filterArgs[i] : filterArgsList.length));
	}

	var resolveFilterVal = 'f = ' + (p.inverseFilter ? '!' : '') + 'f && f !== FALSE || f === TRUE;',
	    callCycleFilter = 'filters[fI](' + filterArgsList.slice(0, p.length ? maxArgsLength : filterArgsList.length) + ')';

	var iFn = ws(_templateObject);

	if (p.withDescriptor) {
		iFn += 'var getDescriptor = Object.getOwnPropertyDescriptor;';
	}


	if (needCtx) {
		iFn += ws(_templateObject9, p.mult, p.live, p.reverse, p.withDescriptor, p.notOwn, p.inverseFilter, p.type, p.async, p.thread, p.thread, p.priority, p.length, cantModI, cantModI);

		if (isAsync) {
		} else {
			iFn += ws(_templateObject11);
		}
	}

	var threadStart = '',
	    threadEnd = '';


	iFn += 'while (limit !== looper) {';

	var yielder = '',
	    asyncWait = '';


	var indexLimits = '';

	if (p.startIndex) {
		indexLimits = ws(_templateObject16, threadEnd);
	}

	if (p.endIndex) {
		indexLimits += ws(_templateObject17, threadEnd);
	}

	var defArgs = maxArgsLength || isAsync;

	switch (p.type) {
		case 'array':
			iFn += ws(_templateObject18);

			if (p.reverse) {
				iFn += 'clone = slice.call(clone).reverse();';
			}

			if ((p.reverse || !p.live) && (p.startIndex || p.endIndex)) {
				iFn += ws(_templateObject19);
			}

			if (!p.reverse && p.live) {
				iFn += ws(_templateObject20, threadStart, indexLimits);
			} else {
				iFn += ws(_templateObject21, threadStart);
			}

			if (defArgs) {
				if (maxArgsLength > 1) {
					if (p.startIndex) {
						iFn += 'key = ' + (p.reverse ? 'dLength - (' : '') + ' n + startIndex ' + (p.reverse ? ')' : '') + ';';
					} else {
						iFn += 'key = ' + (p.reverse ? 'dLength - ' : '') + ' n;';
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
			iFn += ws(_templateObject22);

			if (p.reverse || OBJECT_KEYS_NATIVE_SUPPORT && !p.notOwn) {
				iFn += 'var tmpArray;';

				if (!p.notOwn && OBJECT_KEYS_NATIVE_SUPPORT && !isAsync) {
					iFn += 'tmpArray = Object.keys(data);';
				} else {
					iFn += 'tmpArray = [];';

					if (p.notOwn) {
						if (p.notOwn === -1) {
							iFn += ws(_templateObject23, threadStart, threadEnd);
						} else {
							iFn += ws(_templateObject24, threadStart, threadEnd);
						}
					} else {
						iFn += ws(_templateObject25, threadStart, threadEnd);
					}
				}

				if (p.reverse) {
					iFn += 'tmpArray.reverse();';
				}

				if (p.startIndex || p.endIndex) {
					iFn += 'tmpArray = tmpArray.slice(startIndex, endIndex || tmpArray.length);';
				}

				iFn += ws(_templateObject26, threadStart, threadEnd);
			} else {
				iFn += ws(_templateObject27, threadStart);

				if (p.notOwn === false) {
					iFn += ws(_templateObject28, threadEnd);
				} else if (p.notOwn === -1) {
					iFn += ws(_templateObject29, threadEnd);
				}

				iFn += ws(_templateObject30, indexLimits);
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
		case 'asyncIterator':
			if (isMapSet) {
				iFn += 'var cursor = data.keys();';

				if (!p.live && !p.reverse) {
					iFn += 'var size = data.size;';
				}
			} else if (p.type === 'generator') {
				iFn += 'var cursor = data();';
			} else {
				iFn += ws(_templateObject31);
			}

			iFn += ws(_templateObject32, p.reverse ? 'var tmpArray = [];' : '', threadStart);

			var asyncIterator$$1 = '';


			if (p.reverse) {
				iFn += 'el = \'value\' in key ? key.value : key; ' + asyncIterator$$1;


				iFn += ws(_templateObject35, threadEnd, threadEnd, asyncWait);

				if (p.startIndex || p.endIndex) {
					iFn += 'tmpArray = tmpArray.slice(startIndex, endIndex || tmpArray.length);';
				}

				iFn += ws(_templateObject36, threadStart, defArgs ? 'key = tmpArray[n];' : '');
			} else {
				iFn += ws(_templateObject37, defArgs ? 'key = \'value\' in key ? key.value : key;' : '', indexLimits);
			}

			if (defArgs) {
				if (p.type === 'map') {
					iFn += 'el = data.get(key);';
				} else {
					iFn += 'el = key; ' + asyncIterator$$1;

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
		iFn += ws(_templateObject38, threadEnd);
	}

	var tmp = '';

	if (!isAsync) {
		if (fLength) {
			if (fLength < 5) {
				for (var _i2 = 0; _i2 < fLength; _i2++) {
					iFn += ws(_templateObject39, _i2 ? 'f' : 'true', _i2, filterArgs[_i2], resolveFilterVal);
				}
			} else {
				iFn += ws(_templateObject40, callCycleFilter, resolveFilterVal);
			}

			iFn += 'if (f) {';
		}

		if (p.count) {
			tmp += 'j++;';
		}
	}

	tmp += 'r = cb(' + cbArgs + ');';

	if (!p.mult) {
		tmp += 'breaker = true;';
	}


	if (!isAsync && p.from) {
		iFn += ws(_templateObject42, tmp);
	} else {
		iFn += tmp;
	}

	if (!isAsync && fLength) {
		iFn += '}';
	}

	iFn += yielder;
	if (!p.live && !p.reverse && isMapSet) {
		iFn += ws(_templateObject43, threadEnd);
	}

	iFn += ws(_templateObject44, threadEnd, isAsync ? '|| done' : '', needCtx ? 'ctx' : '');

	iFn += ws(_templateObject45, yielder, asyncWait, isAsync ? 'done = true;' : '');

	if (isAsync) {
	} else {
		tmpCycle[key] = new Function('o', 'p', iFn);
	}

	if ($C.ready) {
		var delay = 5e3;

		var text = NAMESPACE + '.cache.cycle["' + key + '"] = ' + tmpCycle[key].toString() + ';';
		cache$1[key] = text;

		if (IS_BROWSER && LOCAL_STORAGE_SUPPORT) {
			clearTimeout(timeout);
			timeout = setTimeout(function () {
				try {
					localStorage.setItem(CACHE_KEY, JSON.stringify(cache$1));
					localStorage.setItem(CACHE_VERSION_KEY, CACHE_VERSION);

					if (BLOB_SUPPORT) {
						var script = document.createElement('script');
						script.src = URL.createObjectURL(new Blob([text], { type: 'application/javascript' }));
						document.head.appendChild(script);
					}
				} catch (_) {}
			}, delay);
		} else if (IS_NODE) {
		}
	}

	return tmpCycle[key];
}

/* eslint-disable prefer-template, eqeqeq */

if (GLOBAL['COLLECTION_LOCAL_CACHE'] !== false) {
	if (IS_BROWSER && LOCAL_STORAGE_SUPPORT) {
		try {
			if (document.readyState === 'loading') {
				var version = localStorage.getItem(CACHE_VERSION_KEY),
				    cache = localStorage.getItem(CACHE_KEY);

				if (cache && version == CACHE_VERSION) {
					$C.cache.str = JSON.parse(cache);
					document.write('<script type="text/javascript">' + returnCache($C.cache.str) + (NAMESPACE + '.ready = true;') + '</script>');
				} else {
					localStorage.removeItem(CACHE_KEY);
					localStorage.removeItem(CACHE_VERSION_KEY);
					$C.ready = true;
				}
			}
		} catch (_) {}
	} else if (IS_NODE) {
		try {
		} catch (_) {} finally {
			$C.ready = true;
		}
	}
}

var slice = [].slice;
var splice = [].splice;
var hasOwnProperty = {}.hasOwnProperty;

/**
 * Sets a value to an object property by a link or returns/deletes the property.
 * At changing or deleting the property returns an object:
 *
 *   {
 *     result: boolean,
 *     key,
 *     value
 *   }
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
 *
 * @return {({result: boolean, key, value, notFound: (boolean|undefined)}|?)}
 */
function byLink(obj, link, opt_params) {
	var p = opt_params || {};

	var linkList = isString(link) ? any(link).split('.') : [].concat(link),
	    length = linkList.length,
	    last = length - 1;

	var pre = void 0,
	    preKey = void 0;

	for (var i = -1; ++i < length;) {
		var el = linkList[i];

		if (obj == null) {
			if (p.test) {
				return false;
			}

			if (p.error) {
				throw new ReferenceError(el + ' is not defined!');
			}

			if (p.delete) {
				return {
					notFound: true,
					result: false,
					key: undefined,
					value: undefined
				};
			}

			return undefined;
		}

		var isTest = i === last && p.test;

		if (isTest) {
			pre = obj;
			preKey = el;
		}

		var objIsMap = isMap(obj),
		    objIsSet = isSet(obj);

		var isAMap = objIsMap || isWeakMap(obj),
		    isASet = objIsSet || isWeakSet(obj);

		// Set or delete
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
							if (isArray(obj)) {
								obj.splice(el, 1);
							} else {
								splice.call(obj, el, 1);
							}
						} else {
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
 * Returns true if an object contains a property by a link
 *
 * @see byLink
 * @param {$$CollectionLink} link - source link
 * @param {!Object} obj - source object
 * @return {boolean}
 */
$C.in = function (link, obj) {
	return byLink(obj, link, { test: true });
};

Object.assign($C, { in: $C.in });

/**
 * Returns true if the collection contains a property by a link
 *
 * @see byLink
 * @param {$$CollectionLink} link - source link
 * @return {boolean}
 */
Collection.prototype.in = function (link) {
	return byLink(this.data, link, { test: true });
};

var MAX_PRIORITY = 40;

var PRIORITY = {
  'low': MAX_PRIORITY / 8,
  'normal': MAX_PRIORITY / 4,
  'hight': MAX_PRIORITY / 2,
  'critical': MAX_PRIORITY
};

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

	this._filter(p, opt_filter);
	p = any(Object.assign(Object.create(this.p), p, { result: 0 }));

	var calc = function () {
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

function notAsync() {
	return false;
}

var invalidTypes = {
	'weakMap': true,
	'weakSet': true
};

var mapSet$1 = {
	'map': true,
	'set': true
};

/**
 * Iterates the collection and calls a callback function for each element that matches for the specified condition
 *
 * @param {$$CollectionCb} cb - callback function
 * @param {?$$Collection_forEach=} [opt_params] - additional parameters:
 *
 *   *) [filter] - function filter or an array of functions
 *   *) [mult = true] - if false, then after the first successful iteration the operation will be broken
 *   *) [count] - maximum number of elements in the response (by default all object)
 *   *) [from = 0] - number of skipping successful iterations
 *   *) [startIndex = 0] - number of skipping successful iterations
 *   *) [endIndex] - end iteration position
 *   *) [reverse] - if true, then the iteration will be from the end
 *   *) [inverseFilter = false] - if true, the successful iteration is considered as a negative result of the filter
 *   *) [withDescriptor = false] - if true, then the first element of callback function will be an object of the element descriptor
 *   *) [notOwn = false] - iteration type:
 *
 *     1) if false, then hasOwnProperty test is enabled and all not own properties will be skipped;
 *     2) if true, then hasOwnProperty test is disabled;
 *     3) if -1, then hasOwnProperty test is enabled and all own properties will be skipped.
 *
 *   *) [live = false] - if true, the initial collection length won't be cached (not for all data types),
 *      ie all elements which will be added to the collection during the iteration will be included to the processing
 *
 *   *) [use] - type of the using iterator (for, for of, for in)
 *   *) [length = true] - if false, then function parameters optimization won't be apply
 *   *) [async = false] - if true, then the operation will be executed as async (returns a promise)
 *   *) [thread = false] - if true, then the operation will be executed in a thread (returns a promise)
 *   *) [parallel = false] - if true or number, then the operation will be executed as async and parallel
 *        (number is max parallel operations)
 *
 *   *  [race = false] - if true or number, then the operation will be executed as async and parallel with race
 *        (number is max parallel operations)
 *
 *   *) [priority = 'normal'] - thread priority (low, normal, hight, critical)
 *   *) [onChunk] - callback function for chunks
 *   *) [onIterationEnd] - callback function for the end of iterations
 *   *) [result] - parameter that marked as the operation result
 *
 * @return {(!Collection|!Promise)}
 */
Collection.prototype.forEach = function (cb, opt_params) {
	var _this = this;

	var p = any(Object.create(this._init())),
	    sp = opt_params || p;

	if (isArray(opt_params) || isFunction(opt_params)) {
		p.filter = p.filter.concat(opt_params);
	} else {
		if (opt_params && opt_params.hasOwnProperty('filter')) {
			opt_params.filter = p.filter.concat(opt_params.filter);
		}

		Object.assign(p, opt_params);
	}

	if (!p.use && p.notOwn) {
		p.use = 'for in';
	}

	this._isThread(p);
	if (p.thread && !PRIORITY[p.priority]) {
		p.priority = 'normal';
	}

	var data = this.data,
	    type = p.type = getType(data, p.use);


	if (!isObjectInstance(data) || invalidTypes[type]) {
		throw new TypeError('Incorrect data type');
	}

	var filters = p.filter,
	    fCount = filters.length;

	var isStream$$1 = type === 'stream',
	    isIDBRequest$$1 = type === 'idbRequest';

	var cursor = null;


	// Optimization for the length request
	if (!fCount && cb[LENGTH_REQUEST]) {
		if (type === 'array') {
			cb[LENGTH_REQUEST] = (p.startIndex || p.endIndex !== false ? slice.call(data, p.startIndex || 0, p.endIndex !== false ? p.endIndex + 1 : data.length) : data).length;

			return this;
		} else if (mapSet$1[type] && !p.startIndex && p.endIndex === false) {
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

	var cbLength = void 0;
	if (cbArgs === false || cbArgs > 3) {
		var _p = any(Object.assign({}, opt_params, {
			onChunk: null,
			onIterationEnd: null,
			onComplete: function (val) {
				cbLength.value = val;
			}
		}));

		cbLength = function (opt_reset) {
			if (lengthKey in cbLength === false || opt_reset) {
				return cbLength[lengthKey] = _this.length(filters, _p);
			}

			return cbLength[lengthKey];
		};
	}

	var fLength = void 0;
	if (filterArgs === false || Math.max.apply(null, any(filterArgs)) > 3) {
		var _p2 = any(Object.assign({}, opt_params, {
			onChunk: null,
			onIterationEnd: null,
			onComplete: function (val) {
				fLength.value = val;
			}
		}));

		fLength = function (opt_reset) {
			if (lengthKey in fLength === false || opt_reset) {
				return fLength[lengthKey] = _this.length(null, _p2);
			}

			return fLength[lengthKey];
		};
	}

	var key = [type, cbArgs, fCount < 5 ? fCount : Boolean(fCount), filterArgs, p.length, p.async, p.thread, p.withDescriptor, p.notOwn, p.live, p.inverseFilter, p.reverse, p.mult, Boolean(p.count), Boolean(p.from), Boolean(p.startIndex), p.endIndex !== false, Boolean(p.parallel), Boolean(p.race)].join();

	var fn = any(tmpCycle[key] || compileCycle(key, p));

	var args = {
		TRUE: TRUE,
		FALSE: FALSE,
		IGNORE: IGNORE,
		notAsync: notAsync,
		cursor: cursor,
		data: data,
		cb: cb,
		cbLength: cbLength,
		filters: filters,
		fLength: fLength,
		priority: PRIORITY,
		onComplete: p.onComplete,
		onIterationEnd: p.onIterationEnd,
		count: p.count,
		from: p.from,
		startIndex: p.startIndex,
		endIndex: p.endIndex,
		maxParallel: p.parallel || p.race
	};


	fn(args, sp);
	return this;
};

/**
 * Appends a filter to the operation
 *
 * @param {...($$CollectionFilter|Array<$$CollectionFilter>|undefined)} filter - function filter
 * @return {!Collection}
 */
Collection.prototype.filter = function (filter) {
	var args = [];
	for (var i = 0; i < arguments.length; i++) {
		var el = arguments[i];

		if (el) {
			args = args.concat(el);
		}
	}

	this.p.filter = this.p.filter.concat.apply(this.p.filter, args);
	return this;
};

/**
 * Appends a filter to the operation
 *
 * @private
 * @param {...?} filter - function filter
 * @return {!Collection}
 */
Collection.prototype._filter = function (filter) {
	var args = [];
	for (var i = 0; i < arguments.length; i++) {
		var el = arguments[i];

		if (i === 0) {
			if (!el || !el.filter) {
				continue;
			}

			el = [el.filter, delete el.filter][0];
		}

		if (el) {
			args = args.concat(el);
		}
	}

	this.p.filter = this.p.filter.concat.apply(this.p.filter, args);
	return this;
};

/**
 * @private
 * @param {?} p
 * @return {!Collection}
 */
Collection.prototype._isThread = function (p) {
	if (p.thread == null && (p.priority || p.onChunk)) {
		p.thread = true;
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
	this.p.use = (opt_async ? 'async ' : '') + 'for off';
	return this;
};


Object.defineProperties(Collection.prototype, /** @lends {Collection.prototype} */{

	live: {
		/**
   * Sets .live to true for the operation
   */
		get: function () {
			this.p.live = true;
			return this;
		}
	},

	descriptor: {
		/**
   * Sets .withDescriptor to true for the operation
   */
		get: function () {
			this.p.withDescriptor = true;
			return this;
		}
	},

	array: {
		/**
   * Sets .use to 'for' for the operation
   */
		get: function () {
			this.p.use = 'for';
			return this;
		}
	},

	one: {
		/**
   * Sets .mult to false for the operation
   */
		get: function () {
			this.p.mult = false;
			return this;
		}
	},

	inverse: {
		/**
   * Sets .inverseFilter to true for the operation
   */
		get: function () {
			this.p.inverseFilter = true;
			return this;
		}
	},

	reverse: {
		/**
   * Sets .reverse to true for the operation
   */
		get: function () {
			this.p.reverse = true;
			return this;
		}
	}
});

/* eslint-disable no-loop-func */

var simpleType = {
	'array': true,
	'object': true
};

/**
 * Extends the collection by another objects
 *
 * @param {(boolean|?$$Collection_extend)} deepOrParams - if true, then properties will be copied recursively
 *   OR additional parameters for extending:
 *
 *   *) [withUndef = false] - if true, then the original value can be rewritten to undefined
 *   *) [withDescriptor = false] - if true, then the descriptor of a property will be copied too
 *   *) [withAccessors = false] - if true, then property accessors will be copied too, but not another descriptor properties;
 *   *) [withProto = false] - if true, then properties will be copied with prototypes
 *   *) [concatArray = false] - if true, then array properties will be concatenated (only if extending by an another array)
 *   *) [concatFn = Array.prototype.concat] - function that will be concatenate arrays
 *   *) [traits = false] - if true, then will be copied only new properties, or if -1, only old
 *   *) [deep = false] - if true, then properties will be copied recursively
 *
 * @param {...Object} args - objects for extending
 * @return {(!Object|!Promise)}
 */
Collection.prototype.extend = function (deepOrParams, args) {
	var _arguments = arguments;
	var create = Object.create,
	    defineProperty = Object.defineProperty,
	    getPrototypeOf = Object.getPrototypeOf,
	    assign = Object.assign;


	var p = any(deepOrParams);
	if (p instanceof P === false) {
		if (isBoolean(p)) {
			p = { deep: p };
		} else {
			p = p || {};
		}

		this._filter(p)._isThread(p);
		p = any(assign(Object.create(this.p), p));
	}

	var withDescriptor = p.withDescriptor && !p.withAccessors,
	    isAsync = p.thread || p.async;

	if (p.withAccessors) {
		p.withDescriptor = true;
	}

	if (p.withProto) {
		p.notOwn = true;
	}

	var data = this.data,
	    type = getType(data);


	if (!type) {
		for (var i = 1; i < arguments.length; i++) {
			type = getType(data, p.use);
			if (type) {
				break;
			}
		}

		if (!type) {
			return {};
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

	if (!p.deep && p.withUndef && p.mult && dataIsSimple && OBJECT_ASSIGN_NATIVE_SUPPORT && !p.concatArray && !p.withProto && !p.withDescriptor && !p.withAccessors && !p.traits && !p.filter.length && !p.async && !p.from && !p.count && !p.startIndex && !p.endIndex && !p.notOwn && !p.reverse) {
		var _args = [];

		for (var _i = 1; _i < arguments.length; _i++) {
			_args.push(arguments[_i]);
		}

		return assign.apply(undefined, [data].concat(_args));
	}

	var setVal = void 0;
	switch (type) {
		case 'weakMap':
		case 'map':
			setVal = function (data, key, val) {
				if (p.traits && data.has(key) !== (p.traits === -1)) {
					return;
				}

				data.set(key, val);
			};

			break;

		case 'weakSet':
		case 'set':
			setVal = function (data, key, val) {
				if (p.traits && data.has(val) !== (p.traits === -1)) {
					return;
				}

				data.add(val);
			};

			break;

		default:
			setVal = function (data, key, val) {
				if (p.traits && key in data !== (p.traits === -1)) {
					return;
				}

				if (p.withUndef || val !== undefined) {
					data[key] = val;
				}
			};
	}

	var promise = {
		then: function (cb) {
			cb();
			return this;
		}
	};

	if (isAsync) {
		promise = Promise.resolve();
	}

	if (p.notOwn && !dataIsSimple) {
		p.notOwn = false;
	}

	var _loop = function (_i2) {
		var arg = _arguments[_i2];

		if (!arg) {
			return 'continue';
		}

		var isSimple = simpleType[getType(arg)];

		promise = promise.then(function () {
			return $C(arg).forEach(function (el, key) {
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

				var valIsArray = isArray(val),
				    struct = valIsArray ? [] : getSameAs(val);

				if (p.deep && val && (valIsArray || struct)) {
					var isExt = p.withProto && dataIsSimple && canExtended(src);

					var srcIsArray = isArray(src);

					if (isExt && !(data.hasOwnProperty ? data.hasOwnProperty(key) : hasOwnProperty.call(data, key))) {
						src = srcIsArray ? src.slice() : create(src);
						byLink(data, [key], { value: src });
					}

					var clone = void 0;
					if (valIsArray) {
						var isProto = false,
						    construct = void 0;

						if (!srcIsArray && isExt && p.concatArray) {
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

					if (isAsync) {
						return childExt.then(function (value) {
							return byLink(data, [key], { value: value });
						});
					}

					byLink(data, [key], { value: childExt });
				} else {
					setVal(data, key, val);
				}
			}, p);
		});
	};

	for (var _i2 = 1; _i2 < arguments.length; _i2++) {
		var _ret = _loop(_i2);

		if (_ret === 'continue') continue;
	}

	return isAsync ? promise.then(function () {
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

	var obj = $C(target);
	return obj.extend.apply(obj, args);
};

Object.assign($C, { extend: $C.extend, clone: $C.clone });

/**
 * Creates a new collection based on the current by the specified parameters
 *
 * @see Collection.prototype.forEach
 * @param {($$CollectionCb|$$Collection_map)=} opt_cb - callback function
 * @param {($$Collection_map|$$CollectionFilter)=} [opt_params] - additional parameters:
 *   *) [initial] - initial object for adding elements
 *
 * @return {(!Object|!Promise<!Object>)}
 */
Collection.prototype.map = function (opt_cb, opt_params) {
	var p = opt_params || {};

	if (!isFunction(opt_cb)) {
		p = opt_cb || p;
		opt_cb = function (el) {
			return el;
		};
	}

	if (isArray(p) || isFunction(p)) {
		p = { filter: p };
	}

	this._filter(p)._isThread(p);
	p = any(Object.assign(Object.create(this.p), p));

	var type = p.initial ? getType(p.initial) : getType(this.data, p.use),
	    res = p.initial;

	var source = p.initial || this.data,
	    isAsync = p.thread || p.async;

	if (!res) {
		switch (type) {
			case 'object':
				res = {};
				break;

			case 'array':
				if (isArray(source)) {
					res = [];
				} else {
					res = {};
					type = 'object';
				}

				break;

			case 'generator':
			case 'iterator':
			case 'asyncIterator':
			case 'idbRequest':
			case 'stream':
				res = [];
				type = 'array';
				break;

			default:
				res = new source.constructor();
		}
	}

	var fn = void 0;
	switch (type) {
		case 'array':
			fn = function () {
				var val = opt_cb.apply(null, arguments);


				res.push(val);
			};

			fn[FN_LENGTH] = opt_cb.length;
			break;

		case 'object':
			fn = function (el, key) {
				var val = opt_cb.apply(null, arguments);


				res[key] = val;
			};

			fn[FN_LENGTH] = fn.length > opt_cb.length ? fn.length : opt_cb.length;
			break;

		case 'map':
		case 'weakMap':
			fn = function (el, key) {
				var val = opt_cb.apply(null, arguments);


				res.set(key, val);
			};

			fn[FN_LENGTH] = fn.length > opt_cb.length ? fn.length : opt_cb.length;
			break;

		case 'set':
		case 'weakSet':
			fn = function () {
				var val = opt_cb.apply(null, arguments);


				res.add(val);
			};

			fn[FN_LENGTH] = opt_cb.length;
			break;

		case 'stream':
			fn = function () {
				var _arguments = arguments;

				return new Promise(function (resolve, reject) {
					var val = opt_cb.apply(null, _arguments);

					function end() {
						clear();
						resolve();
					}

					function error(err) {
						clear();
						reject(err);
					}

					function clear() {
						res.removeListener('drain', write);
						res.removeListener('error', error);
						res.removeListener('close', end);
					}

					function write() {
						clear();

						if (res.write(val)) {
							resolve(val);
						} else {
							res.addListener('drain', write);
							res.addListener('error', error);
							res.addListener('close', end);
						}
					}


					return write();
				});
			};

			fn[FN_LENGTH] = opt_cb.length;
			break;
	}

	p.result = res;

	var returnVal = any(this.forEach(any(fn), p));

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

	if (!isFunction(opt_filter) && (isArray(opt_filter) && !isFunction(opt_filter[1]) || opt_filter != null && typeof opt_filter !== 'object')) {
		return byLink(this.data, any(opt_filter));
	}

	if (!isArray(opt_filter) && !isFunction(opt_filter)) {
		p = opt_filter || p;
		opt_filter = null;
	}

	this._filter(p, opt_filter);
	p = any(Object.assign(Object.create(this.p), p));

	var fn = void 0;
	if (p.mult !== false) {
		var res = p.result = [];
		fn = function (el) {
			return res.push(el);
		};
	} else {
		fn = function (el) {
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
 * @param {?=} [opt_initialValue] - initial value
 * @param {($$CollectionFilter|$$CollectionBase)=} [opt_filter] - function filter or an array of functions
 * @param {?$$CollectionBase=} [opt_params] - additional parameters
 * @return {(?|!Promise)}
 */
Collection.prototype.reduce = function (cb, opt_initialValue, opt_filter, opt_params) {
	var p = opt_params || {};

	if (!isArray(opt_filter) && !isFunction(opt_filter)) {
		p = opt_filter || p;
		opt_filter = null;
	}

	this._filter(p, opt_filter)._isThread(p);
	p = any(Object.assign(Object.create(this.p), p, { result: opt_initialValue }));

	var isAsync = p.thread || p.async;

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


			p.result = val;
		}
	}

	var returnVal = any(this.forEach(fn, p));

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

	this._filter(p, opt_filter);
	p = any(Object.assign(Object.create(this.p), p, { result: true, mult: false }));
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

  this._filter(p, opt_filter);
  p = any(Object.assign(Object.create(this.p), p, { mult: true, result: false }));

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

	this._filter(p, opt_filter);
	p = any(Object.assign(Object.create(this.p), p));

	var fn = void 0;
	if (p.mult !== false) {
		var res = p.result = [];

		if (isSet(this.data)) {
			fn = function (el) {
				return res.push(el);
			};
		} else {
			fn = function (el, key) {
				return res.push(key);
			};
		}
	} else {
		p.result = null;
		fn = function (el, key) {
			return p.result = isMap(_this.data) ? { value: key } : isSet(_this.data) ? { value: el } : key;
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

	this._filter(p, opt_filter, f);
	p = any(Object.assign(Object.create(this.p), p, { mult: true, result: false }));

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
 *   *) [saveKeys = false] - if true, then will be saved keys, but not values
 *   *) [useMap = false] - if true, then for saving data will be used Map
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

	this._filter(p, opt_filter);
	p = any(Object.assign(Object.create(this.p), p, { mult: true }));

	var isFunc = isFunction(field),
	    isAsync = p.thread || p.async,
	    res = p.result = p.useMap ? new Map() : Object.create(null);

	var fn = void 0;
	if (p.useMap) {
		fn = function (el, key) {
			var param = isFunc ? field.apply(null, arguments) : byLink(el, field),
			    val = p.saveKeys ? key : el;


			if (res.has(param)) {
				res.get(param).push(val);
			} else {
				res.set(param, [val]);
			}
		};
	} else {
		fn = function (el, key) {
			var param = isFunc ? field.apply(null, arguments) : byLink(el, field),
			    val = p.saveKeys ? key : el;


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

var invalidTypes$1 = {
	'iterator': true,
	'asyncIterator': true,
	'generator': true,
	'stream': true,
	'idbRequest': true
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

	if (!isFunction(opt_filter) && (isArray(opt_filter) && !isFunction(opt_filter[1]) || opt_filter != null && typeof opt_filter !== 'object')) {
		return byLink(this.data, opt_filter, { delete: true });
	}

	if (!isArray(opt_filter) && !isFunction(opt_filter)) {
		p = opt_filter || p;
		opt_filter = null;
	}

	this._filter(p, opt_filter);
	p = any(Object.assign(Object.create(this.p), p));

	var type = getType(this.data, p.use),
	    isRealArray = type === 'array' && isArray(this.data);

	if (invalidTypes$1[type]) {
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

	var fn = void 0;
	switch (type) {
		case 'map':
			fn = function (value, key, data) {
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
			fn = function (value, key, data) {
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
				fn = function (value, key, data) {
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
					fn = function (value, key, data, ctx) {
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
					fn = function (value, key, data, ctx) {
						var ln = ctx.length();
						var f = function (length) {
							if (rm === length) {
								return false;
							}

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

						if (isNumber(ln)) {
							f(ln);
						} else {
							return ctx.wait(ln).then(f, fn[ON_ERROR]);
						}
					};
				}
			}

			break;

		default:
			fn = function (value, key, data) {
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
 *   *) [key] - key (null for array.push) of a new element (if search elements nof found)
 *   *) [create = true] - if false, in the absence of the requested property will be thrown an exception, otherwise it will be created
 *
 * @return {($$CollectionSetReport|!Promise<$$CollectionSetReport>)}
 */
Collection.prototype.set = function (value, filter, opt_params) {
	var p = opt_params || {};

	var data = this.data;


	if (!isFunction(filter) && (isArray(filter) && !isFunction(filter[1]) || filter != null && typeof filter !== 'object')) {
		return byLink(data, filter, { value: value, create: p.create !== false, error: true });
	}

	if (!isArray(filter) && !isFunction(filter)) {
		p = filter || p;
		filter = null;
	}

	this._filter(p, filter)._isThread(p);
	p = any(Object.assign(Object.create(this.p), p));

	var type = getType(data, p.use),
	    isFunc = isFunction(value),
	    isAsync = p.thread || p.async;

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

	var fn = void 0;
	if (isFunc) {
		switch (type) {
			case 'map':
				fn = function (el, key, data) {
					var res = value.apply(null, arguments);


					var status = res === undefined;

					if (res !== undefined && data.get(key) !== res) {
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
				fn = function (el, key, data) {
					var res = value.apply(null, arguments);


					var status = res === undefined;

					if (res !== undefined && !data.has(res)) {
						data.delete(el);
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
				fn = function (el, key, data) {
					var res = value.apply(null, arguments);


					var status = res === undefined;

					if (res !== undefined && data[key] !== res) {
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
		switch (type) {
			case 'map':
				fn = function (el, key, data) {
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
				fn = function (el, key, data) {
					var result = false;
					if (!data.has(value)) {
						data.delete(el);
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
				fn = function (el, key, data) {
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
		if ((mult ? p.result.notFound : !p.result.length) && 'key' in p) {
			if (p.key == null && isArray(data)) {
				p.key = data.length;
			}

			var res = byLink(data, p.key, {
				value: isFunc ? value(undefined, undefined, data, ctx) : value,
				create: p.create !== false
			});

			if (mult) {
				p.result.push(res);
			} else {
				p.result = res;
			}
		}

		onIterationEnd && onIterationEnd(ctx);
	};

	var returnVal = any(this.forEach(any(fn), p));

	if (returnVal !== this) {
		return returnVal;
	}

	return p.result;
};

return $C;

})));

