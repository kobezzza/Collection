/*!
 * Collection v6.0.0-beta.11
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 *
 * Date: 'Mon, 25 Jul 2016 08:01:09 GMT
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('Collection', factory) :
    (global.$C = factory());
}(this, function () { 'use strict';

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
      isObjectInstance(obj) && !isFuncRgxp.test({}.toString.call(obj)) && (
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
      return Boolean(obj && (typeof Symbol === 'function' ? obj[Symbol.iterator] : typeof obj['@@iterator'] === 'function'));
    }

    /**
     * Returns the current type of an object
     *
     * @param {Object} obj - source object
     * @param {?string=} [opt_use] - cycle type for iteration: for, for of, for in
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

        case 'for of':
          type = 'iterator';
          break;

        case 'for in':
          type = 'object';
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
          }
      }

      return type;
    }

    var isNative = /\[native code]/;

    /**
     * Returns true if the specified object is one of JS data structures
     *
     * @param {?} obj - source object
     * @return {?}
     */
    function getStructure(obj) {
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
        thread: false,
        length: true,
        filter: []
      }, $C.config);
    }

    Object.assign($C, { config: {} });

    /**
     * Library version
     * @const
     */
    Collection.prototype.VERSION = [6, 0, 0, 'beta.11'];

    /**
     * Creates an instance of Collection
     * @param {$$CollectionType} obj
     */
    function $C(obj) {
      return new Collection(obj);
    }

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
      expr = Array.from(arguments).slice(1);

      var res = '';

      for (var i = 0; i < strings.length; i++) {
        res += strings[i].replace(wsRgxp, ' ') + (i in expr ? expr[i] : '');
      }

      return res;
    }

    var IS_NODE = function () {
    	try {
    		return typeof process === 'object' && {}.toString.call(process) === '[object process]';
    	} catch (ignore) {
    		return false;
    	}
    }();

    var IS_BROWSER = !IS_NODE && typeof window === 'object';
    var BLOB_SUPPORT = IS_BROWSER && typeof Blob === 'function' && typeof URL === 'function';
    var LOCAL_STORAGE_SUPPORT = !IS_NODE && typeof localStorage === 'object';
    var OBJECT_KEYS_NATIVE_SUPPORT = isNative.test(Object.keys && any(Object.keys).toString());

        var GLOBAL = Function('return this')();

    var NAMESPACE = '__COLLECTION_NAMESPACE__https_github_com_kobezzza_Collection';
    GLOBAL[NAMESPACE] = $C;

    var LENGTH_REQUEST = '__COLLECTION_TMP__lengthQuery';
    var FN_LENGTH = '__COLLECTION_TMP__length';
    var ON_ERROR = '__COLLECTION_TMP__onError';
    var CACHE_VERSION = 20;
    var CACHE_KEY = '__COLLECTION_CACHE_VERSION__';
    var CACHE_VERSION_KEY = '__COLLECTION_CACHE__';

    var taggedTemplateLiteral = function (strings, raw) {
      return Object.freeze(Object.defineProperties(strings, {
        raw: {
          value: Object.freeze(raw)
        }
      }));
    };

    var toConsumableArray = function (arr) {
      if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

        return arr2;
      } else {
        return Array.from(arr);
      }
    };

    var _templateObject = taggedTemplateLiteral(['\nvar \ndata = o.data,\ncb = o.cb,\nfilters = o.filters,\npriority = o.priority;\nvar\nonIterationEnd = o.onIterationEnd,\nonComplete = o.onComplete,\ngetDescriptor = Object.getOwnPropertyDescriptor,\nonError;\nvar\nTRUE = {},\nFALSE = {},\nBREAK = {};\nvar\ni = -1,\nj = 0,\nn = -1;\nvar\nbreaker = false,\nyielder = false,\nyieldVal;\nvar\ntimeStart,\ntimeEnd,\ntime = 0;\nvar\nlimit = 1,\nlooper = 0;\nvar\nwaitResult = [],\nwait = 0;\nvar\nlength,\nf,\nr;\nvar\nel,\nkey;\nvar\narr = [],\n$ = {};\nvar info = {\nstartIndex: ', ',\nendIndex: ', ',\nfrom: ', ',\ncount: ', ',\nlive: ', ',\nreverse: ', ',\nwithDescriptor: ', ',\nnotOwn: ', ',\ninverseFilter: ', ',\ntype: \'', '\',\nthread: ', ',\npriority: ', ' && \'', '\',\nlength: ', '\n};\n'], ['\nvar \ndata = o.data,\ncb = o.cb,\nfilters = o.filters,\npriority = o.priority;\nvar\nonIterationEnd = o.onIterationEnd,\nonComplete = o.onComplete,\ngetDescriptor = Object.getOwnPropertyDescriptor,\nonError;\nvar\nTRUE = {},\nFALSE = {},\nBREAK = {};\nvar\ni = -1,\nj = 0,\nn = -1;\nvar\nbreaker = false,\nyielder = false,\nyieldVal;\nvar\ntimeStart,\ntimeEnd,\ntime = 0;\nvar\nlimit = 1,\nlooper = 0;\nvar\nwaitResult = [],\nwait = 0;\nvar\nlength,\nf,\nr;\nvar\nel,\nkey;\nvar\narr = [],\n$ = {};\nvar info = {\nstartIndex: ', ',\nendIndex: ', ',\nfrom: ', ',\ncount: ', ',\nlive: ', ',\nreverse: ', ',\nwithDescriptor: ', ',\nnotOwn: ', ',\ninverseFilter: ', ',\ntype: \'', '\',\nthread: ', ',\npriority: ', ' && \'', '\',\nlength: ', '\n};\n']);
    var _templateObject2 = taggedTemplateLiteral(['\nif (o.onError) {\nonError = function (err) {\no.onError(err);\nr = f = el = BREAK;\nwait = 0;\n};\nvar onChildError = function (err) {\nif (err && err.type === \'CollectionThreadDestroy\') {\nwait--;\nreturn;\n}\nonError(err);\n};\n}\n'], ['\nif (o.onError) {\nonError = function (err) {\no.onError(err);\nr = f = el = BREAK;\nwait = 0;\n};\nvar onChildError = function (err) {\nif (err && err.type === \'CollectionThreadDestroy\') {\nwait--;\nreturn;\n}\nonError(err);\n};\n}\n']);
    var _templateObject3 = taggedTemplateLiteral(['\nvar ctx = {\n$: $,\ninfo: info,\nwaitResult: waitResult,\nonError: onError,\nTRUE: TRUE,\nFALSE: FALSE,\nget result() {\nreturn p.result;\n},\nset result(value) {\np.result = value;\n},\nyield: function (opt_val) {\nif (', ') {\nreturn false;\n}\nyielder = true;\nyieldVal = opt_val;\nreturn true;\n},\nnext: function (opt_val) {\nif (', ') {\nreturn false;\n}\nctx.thread.next(opt_val);\nreturn true;\n},\nchild: function (thread) {\nif (', ' || !thread.thread) {\nreturn false;\n}\nctx.thread.children.push(thread.thread);\nreturn true;\n},\nwait: function (promise) {\nif (', ') {\nreturn false;\n}\nif (promise.thread) {\nctx.child(promise);\n}\nwait++;\nreturn promise.then(function (res) {\nwaitResult.push(res);\nwait--;\nctx.next();\n}, onChildError);\n},\nsleep: function (time, opt_test, opt_interval) {\nif (', ') {\nreturn false;\n}\nctx.yield();\nreturn new Promise(function (resolve, reject) {\nctx.thread.sleep = setTimeout(function () {\nif (opt_test) {\ntry {\nvar test = opt_test(ctx);\nif (test) {\nresolve();\nctx.next();\n} else if (opt_interval !== false) {\nctx.sleep(time, opt_test, opt_interval).then(resolve, reject);\n}\n} catch (err) {\nreject(err);\nonError(err);\n}\n} else {\nresolve();\nctx.next();\n}\n}, time);\n});\n},\njump: function (val) {\nif (', ') {\nreturn false;\n}\nvar diff = i - n;\nn = val - 1;\ni = n + diff;\nreturn i;\n},\ni: function (val) {\nif (val === undefined) {\nreturn i;\n}\nif (', ') {\nreturn false;\n}\nn += val;\ni += val;\nreturn i;\n},\nget reset() {\nbreaker = true;\nlimit++;\nreturn FALSE;\n},\nget break() {\nbreaker = true;\nreturn FALSE;\n}\n};\nvar cbCtx = Object.create(ctx);\ncbCtx.length = o.cbLength;\nvar filterCtx = Object.create(ctx);\nfilterCtx.length = o.fLength;\n'], ['\nvar ctx = {\n$: $,\ninfo: info,\nwaitResult: waitResult,\nonError: onError,\nTRUE: TRUE,\nFALSE: FALSE,\nget result() {\nreturn p.result;\n},\nset result(value) {\np.result = value;\n},\nyield: function (opt_val) {\nif (', ') {\nreturn false;\n}\nyielder = true;\nyieldVal = opt_val;\nreturn true;\n},\nnext: function (opt_val) {\nif (', ') {\nreturn false;\n}\nctx.thread.next(opt_val);\nreturn true;\n},\nchild: function (thread) {\nif (', ' || !thread.thread) {\nreturn false;\n}\nctx.thread.children.push(thread.thread);\nreturn true;\n},\nwait: function (promise) {\nif (', ') {\nreturn false;\n}\nif (promise.thread) {\nctx.child(promise);\n}\nwait++;\nreturn promise.then(function (res) {\nwaitResult.push(res);\nwait--;\nctx.next();\n}, onChildError);\n},\nsleep: function (time, opt_test, opt_interval) {\nif (', ') {\nreturn false;\n}\nctx.yield();\nreturn new Promise(function (resolve, reject) {\nctx.thread.sleep = setTimeout(function () {\nif (opt_test) {\ntry {\nvar test = opt_test(ctx);\nif (test) {\nresolve();\nctx.next();\n} else if (opt_interval !== false) {\nctx.sleep(time, opt_test, opt_interval).then(resolve, reject);\n}\n} catch (err) {\nreject(err);\nonError(err);\n}\n} else {\nresolve();\nctx.next();\n}\n}, time);\n});\n},\njump: function (val) {\nif (', ') {\nreturn false;\n}\nvar diff = i - n;\nn = val - 1;\ni = n + diff;\nreturn i;\n},\ni: function (val) {\nif (val === undefined) {\nreturn i;\n}\nif (', ') {\nreturn false;\n}\nn += val;\ni += val;\nreturn i;\n},\nget reset() {\nbreaker = true;\nlimit++;\nreturn FALSE;\n},\nget break() {\nbreaker = true;\nreturn FALSE;\n}\n};\nvar cbCtx = Object.create(ctx);\ncbCtx.length = o.cbLength;\nvar filterCtx = Object.create(ctx);\nfilterCtx.length = o.fLength;\n']);
    var _templateObject4 = taggedTemplateLiteral(['\nfunction isPromise(obj) {\nreturn typeof Promise === \'function\' && obj instanceof Promise;\n}\nfunction resolveEl(res) {\nel = res;\nctx.next();\n}\nfunction resolveCb(res) {\nr = res;\nctx.next();\n}\nfunction resolveFilter(res) {\nf = res;\nctx.next();\n}\nctx.thread = o.self;\nctx.thread.ctx = ctx;\n'], ['\nfunction isPromise(obj) {\nreturn typeof Promise === \'function\' && obj instanceof Promise;\n}\nfunction resolveEl(res) {\nel = res;\nctx.next();\n}\nfunction resolveCb(res) {\nr = res;\nctx.next();\n}\nfunction resolveFilter(res) {\nf = res;\nctx.next();\n}\nctx.thread = o.self;\nctx.thread.ctx = ctx;\n']);
    var _templateObject5 = taggedTemplateLiteral(['\nif (timeStart == null) {\ntimeStart = new Date().valueOf();\n}\n'], ['\nif (timeStart == null) {\ntimeStart = new Date().valueOf();\n}\n']);
    var _templateObject6 = taggedTemplateLiteral(['\ntimeEnd = new Date().valueOf();\ntime += timeEnd - timeStart;\ntimeStart = timeEnd;\nif (time > priority[ctx.thread.priority]) {\nyield;\ntime = 0;\ntimeStart = null;\n}\n'], ['\ntimeEnd = new Date().valueOf();\ntime += timeEnd - timeStart;\ntimeStart = timeEnd;\nif (time > priority[ctx.thread.priority]) {\nyield;\ntime = 0;\ntimeStart = null;\n}\n']);
    var _templateObject7 = taggedTemplateLiteral(['\nvar\nclone = data,\ndLength = data.length - 1;\n'], ['\nvar\nclone = data,\ndLength = data.length - 1;\n']);
    var _templateObject8 = taggedTemplateLiteral(['\nclone = arr.slice.call(clone, ', ', ', ');\n'], ['\nclone = arr.slice.call(clone, ', ', ', ');\n']);
    var _templateObject9 = taggedTemplateLiteral(['\nfor (n = ', '; ++n < clone.length;) {\ni = n;\n'], ['\nfor (n = ', '; ++n < clone.length;) {\ni = n;\n']);
    var _templateObject10 = taggedTemplateLiteral(['\nif (n < ', ') {\ncontinue;\n}\n'], ['\nif (n < ', ') {\ncontinue;\n}\n']);
    var _templateObject11 = taggedTemplateLiteral(['\nif (n > ', ') {\nbreak;\n};\n'], ['\nif (n > ', ') {\nbreak;\n};\n']);
    var _templateObject12 = taggedTemplateLiteral(['\nlength = clone.length;\nfor (n = -1; ++n < length;) {\ni = n + ', ';\n'], ['\nlength = clone.length;\nfor (n = -1; ++n < length;) {\ni = n + ', ';\n']);
    var _templateObject13 = taggedTemplateLiteral(['\nfor (var key in data) {\n', '\nif (data.hasOwnProperty(key)) {\ncontinue;\n}\ntmpArray.push(key);\n', '\n}\n'], ['\nfor (var key in data) {\n', '\nif (data.hasOwnProperty(key)) {\ncontinue;\n}\ntmpArray.push(key);\n', '\n}\n']);
    var _templateObject14 = taggedTemplateLiteral(['\nfor (var key in data) {\n', '\ntmpArray.push(key);\n', '\n}\n'], ['\nfor (var key in data) {\n', '\ntmpArray.push(key);\n', '\n}\n']);
    var _templateObject15 = taggedTemplateLiteral(['\nfor (var key in data) {\n', '\nif (!data.hasOwnProperty(key)) {\nbreak;\n}\ntmpArray.push(key);\n', '\n}\n'], ['\nfor (var key in data) {\n', '\nif (!data.hasOwnProperty(key)) {\nbreak;\n}\ntmpArray.push(key);\n', '\n}\n']);
    var _templateObject16 = taggedTemplateLiteral(['\nlength = tmpArray.length;\nfor (n = -1; ++n < length;) {\nkey = tmpArray[n];\nif (key in data === false) {\ncontinue;\n}\ni = n + ', ';\n'], ['\nlength = tmpArray.length;\nfor (n = -1; ++n < length;) {\nkey = tmpArray[n];\nif (key in data === false) {\ncontinue;\n}\ni = n + ', ';\n']);
    var _templateObject17 = taggedTemplateLiteral(['\nif (!data.hasOwnProperty(key)) {\nbreak;\n}'], ['\nif (!data.hasOwnProperty(key)) {\nbreak;\n}']);
    var _templateObject18 = taggedTemplateLiteral(['\nif (!data.hasOwnProperty(key)) {\ncontinue;\n}'], ['\nif (!data.hasOwnProperty(key)) {\ncontinue;\n}']);
    var _templateObject19 = taggedTemplateLiteral(['\nn++;\ni = n;\n'], ['\nn++;\ni = n;\n']);
    var _templateObject20 = taggedTemplateLiteral(['\nvar\niteratorKey = typeof Symbol !== \'undefined\' && Symbol.iterator,\ncursor;\nif (\'next\' in data) {\ncursor = data;\n} else {\ncursor = (iteratorKey ? data[iteratorKey]() : data[\'@@iterator\'] && data[\'@@iterator\']()) || data;\n}\n'], ['\nvar\niteratorKey = typeof Symbol !== \'undefined\' && Symbol.iterator,\ncursor;\nif (\'next\' in data) {\ncursor = data;\n} else {\ncursor = (iteratorKey ? data[iteratorKey]() : data[\'@@iterator\'] && data[\'@@iterator\']()) || data;\n}\n']);
    var _templateObject21 = taggedTemplateLiteral(['\nvar tmpArray = [];\nfor (var step = cursor.next(); !step.done; step = cursor.next()) {\n', '\ntmpArray.push(step.value);\n', '\n}\ntmpArray.reverse();\nvar size = tmpArray.length;\n'], ['\nvar tmpArray = [];\nfor (var step = cursor.next(); !step.done; step = cursor.next()) {\n', '\ntmpArray.push(step.value);\n', '\n}\ntmpArray.reverse();\nvar size = tmpArray.length;\n']);
    var _templateObject22 = taggedTemplateLiteral(['\nlength = tmpArray.length;\nfor (n = -1; ++n < length;) {\n', '\ni = n + ', ';\n'], ['\nlength = tmpArray.length;\nfor (n = -1; ++n < length;) {\n', '\ni = n + ', ';\n']);
    var _templateObject23 = taggedTemplateLiteral(['\nfor (key = cursor.next(); !key.done; key = cursor.next()) {\n', '\nn++;\ni = n;\n'], ['\nfor (key = cursor.next(); !key.done; key = cursor.next()) {\n', '\nn++;\ni = n;\n']);
    var _templateObject24 = taggedTemplateLiteral(['\nif (j === ', ') {\nbreak;\n}\n'], ['\nif (j === ', ') {\nbreak;\n}\n']);
    var _templateObject25 = taggedTemplateLiteral(['\nwhile (isPromise(el)) {\nel = el.then(resolveEl, onError);\nctx.thread.pause = true;\nyield;\n}\nif (el === BREAK) { \nreturn; \n}\n'], ['\nwhile (isPromise(el)) {\nel = el.then(resolveEl, onError);\nctx.thread.pause = true;\nyield;\n}\nif (el === BREAK) { \nreturn; \n}\n']);
    var _templateObject26 = taggedTemplateLiteral(['\nif (f === undefined || f === true) {\nf = filters[', '](', ');\n'], ['\nif (f === undefined || f === true) {\nf = filters[', '](', ');\n']);
    var _templateObject27 = taggedTemplateLiteral(['\nwhile (isPromise(f)) {\nf.then(resolveFilter, onError);\nctx.thread.pause = true;\nyield;\n}\nif (f === BREAK) {\nreturn; \n}\n'], ['\nwhile (isPromise(f)) {\nf.then(resolveFilter, onError);\nctx.thread.pause = true;\nyield;\n}\nif (f === BREAK) {\nreturn; \n}\n']);
    var _templateObject28 = taggedTemplateLiteral(['\nf = ', 'f && f !== FALSE || f === TRUE;\n}\n'], ['\nf = ', 'f && f !== FALSE || f === TRUE;\n}\n']);
    var _templateObject29 = taggedTemplateLiteral(['\nwhile (isPromise(r)) {\nr.then(resolveCb, onError);\nctx.thread.pause = true;\nyield;\n}\nif (r === BREAK) {\nreturn; \n}\n'], ['\nwhile (isPromise(r)) {\nr.then(resolveCb, onError);\nctx.thread.pause = true;\nyield;\n}\nif (r === BREAK) {\nreturn; \n}\n']);
    var _templateObject30 = taggedTemplateLiteral(['\nif (from !== 0) {\nfrom--;\n} else {\n', '\n}\n'], ['\nif (from !== 0) {\nfrom--;\n} else {\n', '\n}\n']);
    var _templateObject31 = taggedTemplateLiteral(['\nif (yielder) {\nyielder = false;\nctx.thread.pause = true;\nyield yieldVal;\nyieldVal = undefined;\n}\n'], ['\nif (yielder) {\nyielder = false;\nctx.thread.pause = true;\nyield yieldVal;\nyieldVal = undefined;\n}\n']);
    var _templateObject32 = taggedTemplateLiteral(['\nsize--;\nif (!size) {\nbreak;\n}\n'], ['\nsize--;\nif (!size) {\nbreak;\n}\n']);
    var _templateObject33 = taggedTemplateLiteral(['\nif (breaker) {\nbreak;\n}\n', '\n}\nbreaker = false;\nlooper++;\nif (onIterationEnd) {\nonIterationEnd(ctx);\n}\n'], ['\nif (breaker) {\nbreak;\n}\n', '\n}\nbreaker = false;\nlooper++;\nif (onIterationEnd) {\nonIterationEnd(ctx);\n}\n']);
    var _templateObject34 = taggedTemplateLiteral(['\n}\nwhile (wait) {\nctx.thread.pause = true;\nyield;\n}\nif (r === BREAK) {\nreturn;\n}\nif (onComplete) {\nonComplete(p.result);\n}\nreturn p.result;\n'], ['\n}\nwhile (wait) {\nctx.thread.pause = true;\nyield;\n}\nif (r === BREAK) {\nreturn;\n}\nif (onComplete) {\nonComplete(p.result);\n}\nreturn p.result;\n']);
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

    var cbArgsList = ['el', 'key', 'data', 'cbCtx'];

    var filterArgsList = ['el', 'key', 'data', 'filterCtx'];

    /**
     * Compiles a loop by the specified parameters
     *
     * @param {string} key - cache key
     * @param {!Object} p - compile parameters
     * @return {!Function}
     */
    function compileCycle(key, p) {
    	var isMapSet = { 'map': true, 'set': true }[p.type];
    	var cantModI = !(p.type === 'array' || p.reverse || p.type === 'object' && p.notOwn && OBJECT_KEYS_NATIVE_SUPPORT);

    	var iFn = ws(_templateObject, p.startIndex, p.endIndex, p.from, p.count, p.live, p.reverse, p.withDescriptor, p.notOwn, p.inverseFilter, p.type, p.thread, p.thread, p.priority, p.length);

    	if (p.thread) {
    		iFn += ws(_templateObject2);
    	}

    	iFn += ws(_templateObject3, !p.thread, !p.thread, !p.thread, !p.thread, !p.thread, cantModI, cantModI);

    	if (p.thread) {
    		iFn += ws(_templateObject4);
    	}

    	var startIndex = p.startIndex || 0,
    	    endIndex = p.endIndex !== false ? p.endIndex + 1 : 0;

    	var cbArgs = cbArgsList.slice(0, p.length ? p.cbArgs : cbArgsList.length),
    	    filterArgs = [];

    	for (var i = 0; i < p.filter.length; i++) {
    		filterArgs.push(filterArgsList.slice(0, p.length ? p.filterArgs[i] : filterArgsList.length));
    	}

    	var maxArgsLength = p.length ? Math.max.apply(null, [].concat(p.cbArgs, p.filterArgs)) : cbArgsList.length;

    	if (p.from) {
    		iFn += 'var from = ' + p.from + ';';
    	}

    	var threadStart = '',
    	    threadEnd = '';

    	if (p.thread) {
    		threadStart = ws(_templateObject5);

    		threadEnd = ws(_templateObject6);
    	}

    	iFn += 'while (limit !== looper) {';

    	switch (p.type) {
    		case 'array':
    			iFn += ws(_templateObject7);

    			if (p.reverse) {
    				iFn += 'clone = arr.slice.call(clone).reverse();';
    			}

    			if ((p.reverse || !p.live) && (startIndex || endIndex)) {
    				iFn += ws(_templateObject8, startIndex, endIndex || 'data.length');
    			}

    			if (!p.reverse && p.live) {
    				iFn += ws(_templateObject9, startIndex - 1);

    				if (startIndex) {
    					iFn += ws(_templateObject10, startIndex);
    				}

    				if (endIndex) {
    					iFn += ws(_templateObject11, endIndex);
    				}
    			} else {
    				iFn += ws(_templateObject12, startIndex);
    			}

    			if (maxArgsLength || p.thread) {
    				if (maxArgsLength > 1) {
    					if (startIndex) {
    						iFn += 'key = ' + (p.reverse ? 'dLength - (' : '') + ' n + ' + (startIndex + (p.reverse ? ')' : '')) + ';';
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
    			if (p.reverse || OBJECT_KEYS_NATIVE_SUPPORT && !p.notOwn) {
    				iFn += 'var tmpArray;';

    				if (!p.notOwn && OBJECT_KEYS_NATIVE_SUPPORT && !p.thread) {
    					iFn += 'tmpArray = Object.keys(data);';
    				} else {
    					iFn += 'tmpArray = [];';

    					if (p.notOwn) {
    						if (p.notOwn === -1) {
    							iFn += ws(_templateObject13, threadStart, threadEnd);
    						} else {
    							iFn += ws(_templateObject14, threadStart, threadEnd);
    						}
    					} else {
    						iFn += ws(_templateObject15, threadStart, threadEnd);
    					}
    				}

    				if (p.reverse) {
    					iFn += 'tmpArray.reverse();';
    				}

    				if (startIndex || endIndex) {
    					iFn += 'tmpArray = tmpArray.slice(' + startIndex + ', ' + (endIndex || 'tmpArray.length') + ');';
    				}

    				iFn += ws(_templateObject16, startIndex);
    			} else {
    				iFn += 'for (key in data) {';

    				if (p.notOwn === false) {
    					iFn += ws(_templateObject17);
    				} else if (p.notOwn === -1) {
    					iFn += ws(_templateObject18);
    				}

    				iFn += ws(_templateObject19);

    				if (startIndex) {
    					iFn += ws(_templateObject10, startIndex);
    				}

    				if (endIndex) {
    					iFn += ws(_templateObject11, endIndex);
    				}
    			}

    			if (maxArgsLength || p.thread) {
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
    			var gen = function () {
    				if (isMapSet) {
    					iFn += 'var cursor = data.keys();';

    					if (!p.live && !p.reverse) {
    						iFn += 'var size = data.size;';
    					}
    				} else if (p.type === 'generator') {
    					iFn += 'var cursor = data();';
    				} else {
    					iFn += ws(_templateObject20);
    				}
    			};

    			if (p.reverse) {
    				gen();
    				iFn += ws(_templateObject21, threadStart, threadEnd);

    				if (startIndex || endIndex) {
    					iFn += 'tmpArray = tmpArray.slice(' + startIndex + ', ' + (endIndex || 'tmpArray.length') + ');';
    				}

    				iFn += ws(_templateObject22, maxArgsLength ? 'key = tmpArray[n];' : '', startIndex);
    			} else {
    				gen();

    				iFn += ws(_templateObject23, maxArgsLength ? 'key = key.value;' : '');

    				if (startIndex) {
    					iFn += ws(_templateObject10, startIndex);
    				}

    				if (endIndex) {
    					iFn += ws(_templateObject11, endIndex);
    				}
    			}

    			if (maxArgsLength || p.thread) {
    				if (p.type === 'map') {
    					iFn += 'el = data.get(key);';
    				} else {
    					iFn += 'el = key;';

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

    	iFn += threadStart;

    	if (p.count) {
    		iFn += ws(_templateObject24, p.count);
    	}

    	if (p.thread) {
    		iFn += ws(_templateObject25);
    	}

    	if (p.filter.length) {
    		for (var _i = 0; _i < p.filter.length; _i++) {
    			iFn += ws(_templateObject26, _i, filterArgs[_i]);

    			if (p.thread) {
    				iFn += ws(_templateObject27);
    			}

    			iFn += ws(_templateObject28, p.inverseFilter ? '!' : '');
    		}

    		iFn += 'if (f) {';
    	}

    	var tmp = 'r = ';
    	if (p.mult) {
    		tmp += 'cb(' + cbArgs + ');';
    	} else {
    		tmp += 'cb(' + cbArgs + '); breaker = true;';
    	}

    	if (p.thread) {
    		tmp += ws(_templateObject29);
    	}

    	if (p.count) {
    		tmp += 'j++;';
    	}

    	if (p.from) {
    		iFn += ws(_templateObject30, tmp);
    	} else {
    		iFn += tmp;
    	}

    	if (p.filter.length) {
    		iFn += '}';
    	}

    	var yielder = ws(_templateObject31);

    	if (p.thread) {
    		iFn += yielder;
    	}

    	if (!p.live && !p.reverse && isMapSet) {
    		iFn += ws(_templateObject32);
    	}

    	if (p.filter.length) {
    		iFn += 'f = undefined;';
    	}

    	iFn += ws(_templateObject33, threadEnd);

    	if (p.thread) {
    		iFn += yielder;
    	}

    	iFn += ws(_templateObject34);

    	if (p.thread) {
    		tmpCycle[key] = eval('(function *(o, p) { ' + iFn + ' })');
    	} else {
    		tmpCycle[key] = Function('o', 'p', iFn);
    	}

    	if ($C.ready) {
    		(function () {
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
    					} catch (ignore) {}
    				}, delay);
    			} else if (IS_NODE) {
    				clearTimeout(timeout);
    				timeout = setTimeout(function () {
    					require('fs').writeFile(require('path').join(__dirname, 'collection.tmp.js'), '\nexports.version = ' + CACHE_VERSION + ';\nexports.cache = ' + JSON.stringify(cache$1) + ';\nexports.exec = function () { ' + returnCache(cache$1) + ' };\n', function () {});
    				}, delay);
    				timeout['unref']();
    			}
    		})();
    	}

    	return tmpCycle[key];
    }

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
    		} catch (ignore) {}
    	} else if (IS_NODE) {
    		try {
    			var _cache = require(require('path').join(__dirname, 'collection.tmp.js'));

    			if (_cache['version'] === CACHE_VERSION) {
    				_cache['exec']();
    				$C.cache.str = _cache['cache'];
    			}
    		} catch (ignore) {} finally {
    			$C.ready = true;
    		}
    	}
    }

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
     * @param {($$CollectionFilter|$$CollectionBase)=} [opt_filter] - function filter or an array of functions
     * @param {?$$CollectionBase=} [opt_params] - additional parameters
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
     *   *) [thread = false] - if true, then operation will be executed in a thread (returns a promise)
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

    	var data = this.data;


    	var type = p.type = getType(data, p.use),
    	    filters = p.filter;

    	if (!isObjectInstance(data) || { 'weakMap': true, 'weakSet': true }[type]) {
    		throw new TypeError('Incorrect data type');
    	}

    	// Optimization for the length request
    	if (!filters.length && cb[LENGTH_REQUEST]) {
    		if (type === 'array') {
    			cb[LENGTH_REQUEST] = (p.startIndex || p.endIndex !== false ? [].slice.call(data, p.startIndex || 0, p.endIndex !== false ? p.endIndex + 1 : data.length) : data).length;

    			return this;
    		} else if ({ 'map': true, 'set': true }[type] && !p.startIndex && p.endIndex === false) {
    			cb[LENGTH_REQUEST] = data.size;
    			return this;
    		}
    	}

    	var cbArgs = false,
    	    filterArgs = false;

    	if (p.length) {
    		cbArgs = p.cbArgs = cb[FN_LENGTH] || cb.length;
    		p.filterArgs = [];

    		for (var i = 0; i < filters.length; i++) {
    			p.filterArgs.push(filters[i][FN_LENGTH] || filters[i].length);
    		}

    		filterArgs = p.filterArgs.length ? p.filterArgs : false;
    	}

    	var cbLength = void 0;
    	if (cbArgs && cbArgs > 3) {
    		(function () {
    			var p = any(Object.assign({}, opt_params, {
    				onChunk: null,
    				onIterationEnd: null,
    				onComplete: function (val) {
    					cbLength.value = val;
    				}
    			}));

    			cbLength = function (opt_reset) {
    				if (!cbLength.value || opt_reset) {
    					cbLength.value = _this.length(filters, p);
    				}

    				return cbLength.value;
    			};
    		})();
    	}

    	var fLength = void 0;
    	if (filterArgs && Math.max.apply(null, any(filterArgs)) > 3) {
    		(function () {
    			var p = any(Object.assign({}, opt_params, {
    				onChunk: null,
    				onIterationEnd: null,
    				onComplete: function (val) {
    					fLength.value = val;
    				}
    			}));

    			fLength = function (opt_reset) {
    				if (!fLength.value || opt_reset) {
    					fLength.value = _this.length(null, p);
    				}

    				return fLength.value;
    			};
    		})();
    	}

    	var key = [type, cbArgs, filters.length, filterArgs, p.length, p.thread, p.withDescriptor, p.notOwn, p.live, p.inverseFilter, p.reverse, p.mult, p.count, p.from, p.startIndex, p.endIndex].join();

    	var fn = any(tmpCycle[key] || compileCycle(key, p));

    	var args = {
    		data: data,
    		cb: cb,
    		cbLength: cbLength,
    		filters: filters,
    		fLength: fLength,
    		priority: PRIORITY,
    		onComplete: p.onComplete,
    		onIterationEnd: p.onIterationEnd
    	};

    	//#if iterators.thread

    	if (p.thread) {
    		var _ret3 = function () {
    			var thread = void 0;
    			var promise = new Promise(function (resolve, reject) {
    				var error = false;
    				function onError(err) {
    					if (error) {
    						return;
    					}

    					if (thread) {
    						thread.destroy(err);
    					} else {
    						reject(err);
    					}

    					error = true;
    				}

    				function wrap(fn) {
    					if (!fn) {
    						return undefined;
    					}

    					return function (el, key, data, o) {
    						try {
    							fn[ON_ERROR] = onError;
    							return fn(el, key, data, o);
    						} catch (err) {
    							onError(err);
    						}
    					};
    				}

    				for (var _i = 0; _i < filters.length; _i++) {
    					filters[_i] = wrap(filters[_i]);
    				}

    				args.cb = wrap(cb);
    				args.onComplete = resolve;
    				args.onIterationEnd = wrap(p.onIterationEnd);
    				args.onError = onError;

    				thread = args.self = fn(args, sp);
    				_this._addToStack(thread, p.priority, reject, wrap(p.onChunk));
    			});

    			promise.thread = thread;
    			return {
    				v: promise
    			};
    		}();

    		if (typeof _ret3 === "object") return _ret3.v;
    	}

    	//#endif

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

    	this.p.thread = true;

    	if (opt_priority) {
    		this.p.priority = opt_priority;
    	}

    	if (opt_onChunk) {
    		this.p.onChunk = opt_onChunk;
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

    Object.defineProperties(Collection.prototype, /** @lends {Collection.prototype} */{
    	one: {
    		/**
       * Sets .mult to false for the operation
       * @return {!Collection}
       */
    		get: function () {
    			this.p.mult = false;
    			return this;
    		}
    	},

    	inverse: {
    		/**
       * Sets .inverseFilter to true for the operation
       * @return {!Collection}
       */
    		get: function () {
    			this.p.inverseFilter = true;
    			return this;
    		}
    	},

    	reverse: {
    		/**
       * Sets .reverse to true for the operation
       * @return {!Collection}
       */
    		get: function () {
    			this.p.reverse = true;
    			return this;
    		}
    	}
    });

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
    							[].splice.call(obj, el, 1);
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

    /**
     * Extends the collection by another objects
     *
     * @param {(boolean|?$$Collection_extend)} deepOrParams - if true, then properties will be copied recursively
     *   OR additional parameters for extending:
     *
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
    	var create = Object.create;
    	var defineProperty = Object.defineProperty;
    	var getPrototypeOf = Object.getPrototypeOf;


    	var p = any(deepOrParams);
    	if (p instanceof P === false) {
    		if (isBoolean(p)) {
    			p = { deep: p };
    		} else {
    			p = p || {};
    		}

    		this._filter(p)._isThread(p);
    		p = any(Object.assign(Object.create(this.p), p));
    	}

    	var withDescriptor = p.withDescriptor && !p.withAccessors;

    	if (p.withAccessors) {
    		p.withDescriptor = true;
    	}

    	if (p.withProto) {
    		p.notOwn = true;
    	}

    	var data = this.data;
    	var type = getType(data);

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

    	var setVal = void 0;
    	p.result = data;

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
    				if (val === undefined || p.traits && key in data !== (p.traits === -1)) {
    					return;
    				}

    				data[key] = val;
    			};
    	}

    	var promise = {
    		then: function (cb) {
    			cb();
    			return this;
    		}
    	};

    	if (p.thread) {
    		promise = Promise.resolve();
    	}

    	var simpleType = {
    		'array': true,
    		'object': true
    	};

    	if (p.notOwn && !simpleType[type]) {
    		p.notOwn = false;
    	}

    	var dataIsSimple = simpleType[type];

    	var _loop = function (_i) {
    		var arg = _arguments[_i];

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
    					} else if ('value' in el === false || el.value !== undefined) {
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
    				    struct = valIsArray ? [] : getStructure(val);

    				if (p.deep && val && (valIsArray || struct)) {
    					var isExt = p.withProto && dataIsSimple && canExtended(src);

    					var srcIsArray = isArray(src);

    					if (isExt && !data.hasOwnProperty(key)) {
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
    								data[key] = p.concatFn ? p.concatFn(o, val) : o.concat(val);
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

    					if (p.thread) {
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

    	for (var _i = 1; _i < arguments.length; _i++) {
    		var _ret = _loop(_i);

    		if (_ret === 'continue') continue;
    	}

    	return p.thread ? promise.then(function () {
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
    	var _$C;

    	return (_$C = $C(target)).extend.apply(_$C, [deepOrParams].concat(toConsumableArray([].slice.call(arguments, 2))));
    };

    Object.assign($C, { extend: $C.extend, clone: $C.clone });

    /**
     * Creates a new collection based on the current by the specified parameters
     *
     * @see Collection.prototype.forEach
     * @param {($$CollectionCb|$$Collection_map)} cb - callback function
     * @param {($$Collection_map|$$CollectionFilter)=} [opt_params] - additional parameters:
     *   *) [initial] - initial object for adding elements
     *
     * @return {(!Object|!Promise<!Object>)}
     */
    Collection.prototype.map = function (cb, opt_params) {
    	var p = opt_params || {};

    	if (!isFunction(cb)) {
    		p = cb || p;
    		cb = function (el) {
    			return el;
    		};
    	}

    	if (isArray(p) || isFunction(p)) {
    		p = { filter: p };
    	}

    	this._filter(p)._isThread(p);
    	p = any(Object.assign(Object.create(this.p), p));

    	var type = 'object';
    	if ((p.use || p.notOwn) && !p.initial) {
    		p.initial = {};
    	} else if (p.initial) {
    		type = getType(p.initial);
    	} else {
    		type = getType(this.data, p.use);
    	}

    	var source = p.initial || this.data;

    	var res = void 0;
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
    			res = [];
    			type = 'array';
    			break;

    		default:
    			res = new source.constructor();
    	}

    	var fn = void 0;
    	switch (type) {
    		case 'array':
    			fn = function () {
    				var val = cb.apply(null, arguments);

    				if (p.thread && isPromise(val)) {
    					return val.then(function (val) {
    						return res.push(val);
    					}, fn[ON_ERROR]);
    				}

    				res.push(val);
    			};

    			fn[FN_LENGTH] = cb.length;
    			break;

    		case 'object':
    			fn = function (el, key) {
    				var val = cb.apply(null, arguments);

    				if (p.thread && isPromise(val)) {
    					return val.then(function (val) {
    						return res[key] = val;
    					}, fn[ON_ERROR]);
    				}

    				res[key] = val;
    			};

    			fn[FN_LENGTH] = fn.length > cb.length ? fn.length : cb.length;
    			break;

    		case 'map':
    		case 'weakMap':
    			fn = function (el, key) {
    				var val = cb.apply(null, arguments);

    				if (p.thread && isPromise(val)) {
    					return val.then(function (val) {
    						return res.set(key, val);
    					}, fn[ON_ERROR]);
    				}

    				res.set(key, val);
    			};

    			fn[FN_LENGTH] = fn.length > cb.length ? fn.length : cb.length;
    			break;

    		case 'set':
    		case 'weakSep':
    			fn = function () {
    				var val = cb.apply(null, arguments);

    				if (p.thread && isPromise(val)) {
    					return val.then(function (val) {
    						return res.add(val);
    					}, fn[ON_ERROR]);
    				}

    				res.add(val);
    			};

    			fn[FN_LENGTH] = cb.length;
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
    		(function () {
    			var res = p.result = [];
    			fn = function (el) {
    				return res.push(el);
    			};
    		})();
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

    	fn[FN_LENGTH] = cb.length - 1;
    	function fn(el) {
    		if (opt_initialValue == null) {
    			p.result = el;
    			opt_initialValue = true;
    		} else {
    			var val = cb.apply(null, [p.result].concat([].slice.call(arguments)));

    			if (p.thread && isPromise(val)) {
    				return val.then(function (val) {
    					return p.result = val;
    				}, fn[ON_ERROR]);
    			}

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
    		(function () {
    			var res = p.result = [];

    			if (isSet(_this.data)) {
    				fn = function (el) {
    					return res.push(el);
    				};
    			} else {
    				fn = function (el, key) {
    					return res.push(key);
    				};
    			}
    		})();
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
    	    res = p.result = p.useMap ? new Map() : {};

    	var fn = void 0;
    	if (p.useMap) {
    		fn = function (el, key) {
    			var param = isFunc ? field.apply(null, arguments) : byLink(el, field),
    			    val = p.saveKeys ? key : el;

    			if (isPromise(param)) {
    				return param.then(function (param) {
    					if (res.has(param)) {
    						res.get(param).push(val);
    					} else {
    						res.set(param, [val]);
    					}
    				}, fn[ON_ERROR]);
    			}

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

    			if (isPromise(param)) {
    				return param.then(function (param) {
    					if (res.hasOwnProperty(param)) {
    						res[param].push(val);
    					} else {
    						res[param] = [val];
    					}
    				}, fn[ON_ERROR]);
    			}

    			if (res.hasOwnProperty(param)) {
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

    	if (!isFunction(opt_filter) && (isArray(opt_filter) && !isFunction(opt_filter[1]) || opt_filter != null && typeof opt_filter !== 'object')) {
    		return byLink(this.data, opt_filter, { delete: true });
    	}

    	if (!isArray(opt_filter) && !isFunction(opt_filter)) {
    		p = opt_filter || p;
    		opt_filter = null;
    	}

    	this._filter(p, opt_filter);
    	p = any(Object.assign(Object.create(this.p), p));

    	var type = getType(this.data, p.use);

    	if ({ 'iterator': true, 'generator': true }[type]) {
    		throw new TypeError('Incorrect data type');
    	}

    	var mult = p.mult !== false,
    	    res = [],
    	    splice = [].splice;

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
    					splice.call(data, key, 1);
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
    				(function () {
    					var rm = 0;
    					if (p.live) {
    						fn = function (value, key, data, ctx) {
    							splice.call(data, key, 1);
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

    								splice.call(data, key, 1);
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
    				})();
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
    	    isFunc = isFunction(value);

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

    					if (p.thread && isPromise(res)) {
    						return res.then(function (res) {
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
    						}, fn[ON_ERROR]);
    					}

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

    					if (p.thread && isPromise(res)) {
    						return res.then(function (res) {
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
    						}, fn[ON_ERROR]);
    					}

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

    					if (p.thread && isPromise(res)) {
    						return res.then(function (res) {
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
    						}, fn[ON_ERROR]);
    					}

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

    	var _p = p;
    	var onIterationEnd = _p.onIterationEnd;

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

    var lastPos = {};
    var execStack = {};
    for (var key in PRIORITY) {
    	if (!PRIORITY.hasOwnProperty(key)) {
    		break;
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

    	var sort = function (a, b) {
    		return b.value - a.value;
    	};

    	var _loop = function () {
    		var rands = [];

    		$C(exec).forEach(function (el, key) {
    			rands.push({
    				key: key,
    				value: PRIORITY[key]
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
    			var key = _ref.key;
    			var value = _ref.value;

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
    					total += PRIORITY[key];
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
    			return 'break';
    		}
    	};

    	while (total <= MAX_PRIORITY) {
    		var _ret = _loop();

    		if (_ret === 'break') break;
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
    	obj.destroyed = false;
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
    		}, { mult: false });

    		exec--;
    		obj.destroyed = true;

    		if (!err) {
    			err = new Error('Thread was destroyed');
    			err.type = 'CollectionThreadDestroy';
    			err.thread = obj;
    		}

    		onError(err);
    		return err;
    	};

    	obj.value = undefined;
    	obj.thread = true;
    	obj.priority = priority;
    	obj.onChunk = opt_onChunk;
    	obj.pause = false;
    	obj.sleep = null;
    	obj.children = [];

    	var next = obj.next;

    	// With strictMode in Chrome (bug?) that method can't define as obj.next =
    	Object.defineProperty(obj, 'next', {
    		value: function () {
    			obj.pause = false;
    			if (obj.sleep !== null) {
    				clearTimeout(obj.sleep);
    				obj.sleep = null;
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
    					}, { startIndex: i + 1 });

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

    Object.assign($C, { destroy: $C.destroy });

    return $C;

}));
