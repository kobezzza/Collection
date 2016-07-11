/*!
 * Collection v6.0.0-beta.5
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 *
 * Date: 'Mon, 11 Jul 2016 19:55:29 GMT
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

        var wsRgxp = /^\s+|[\r\n]+/mg;

    /**
     * String tag (for ES6 string templates) for truncate starting whitespaces and eol-s
     *
     * @param {!Array<string>} strings
     * @param {...?} expr
     * @return {string}
     */
    function ws(strings, expr) {
      expr = [].slice.call(arguments, 1);

      var res = '';

      for (var i = 0; i < strings.length; i++) {
        res += strings[i].replace(wsRgxp, ' ') + (i in expr ? expr[i] : '');
      }

      return res;
    }

    var taggedTemplateLiteral = function (strings, raw) {
      return Object.freeze(Object.defineProperties(strings, {
        raw: {
          value: Object.freeze(raw)
        }
      }));
    };

    var _templateObject = taggedTemplateLiteral(['\n(function () {\n\'use strict\';\nvar res = true;\ntry {\narguments.callee;\n} catch (ignore) {\nres = false;\n}\nreturn res;\n})();\n'], ['\n(function () {\n\'use strict\';\nvar res = true;\ntry {\narguments.callee;\n} catch (ignore) {\nres = false;\n}\nreturn res;\n})();\n']);

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
    var OBJECT_KEYS_NATIVE_SUPPORT = (Object.keys && any(Object.keys).toString()) === '[native code]';
    var MAP_SUPPORT = function () {
    	try {
    		var tmp = new Map(),
    		    key = {};

    		tmp.set(key, true);
    		return tmp.get(key);
    	} catch (ignore) {
    		return false;
    	}
    }();

    var SET_SUPPORT = function () {
    	try {
    		var tmp = new Set(),
    		    key = {};

    		tmp.add(key);
    		return tmp.has(key);
    	} catch (ignore) {
    		return false;
    	}
    }();

    var DESCRIPTORS_SUPPORT = function () {
    	try {
    		return Object.getOwnPropertyDescriptor(Object.create(null, { foo: { enumerable: false } }), 'foo').enumerable === false;
    	} catch (ignore) {
    		return false;
    	}
    }();

    var JSON_SUPPORT = function () {
    	try {
    		return JSON.parse(JSON.stringify({ foo: 'bar' })).foo === 'bar';
    	} catch (ignore) {
    		return false;
    	}
    }();

    var CALLEE_SUPPORT = Boolean(eval(ws(_templateObject)));

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
    	return Array.isArray(obj);
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
     * Returns true if the specified value is a plain object
     *
     * @param {?} obj - source value
     * @return {boolean}
     */
    function isPlainObject(obj) {
    	return Boolean(obj) && (obj.constructor === Object || obj.constructor.name === 'Object');
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
     * @param {!Object} obj - source object
     * @param {?string=} [opt_use] - cycle type for iteration: for, for of, for in
     * @return {string}
     */
    function getType(obj, opt_use) {
    	var type = 'object';

    	if (!obj) {
    		return type;
    	}

    	if (CALLEE_SUPPORT && 'callee' in obj && 'length' in obj) {
    		return 'array';
    	}

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

    var nativeNames = {
    	'Crypto': true,
    	'Number': true,
    	'String': true,
    	'Boolean': true,
    	'Symbol': true,
    	'Function': true,
    	'Date': true,
    	'RegExp': true,
    	'Blob': true,
    	'Array': true,
    	'ArrayBuffer': true,
    	'Uint8ClampedArray': true,
    	'Uint8Array': true,
    	'Uint16Array': true,
    	'Uint32Array': true,
    	'Int8Array': true,
    	'Int16Array': true,
    	'Int32Array': true,
    	'Map': true,
    	'WeakMap': true,
    	'Set': true,
    	'WeakSet': true,
    	'Error': true,
    	'EvalError': true,
    	'TypeError': true,
    	'SyntaxError': true,
    	'URIError': true,
    	'RangeError': true,
    	'ReferenceError': true
    };

    /**
     * Returns true if the specified object can be extended
     *
     * @param {?} obj - source object
     * @return {boolean}
     */
    function isExtensible(obj) {
    	if (!obj) {
    		return false;
    	}

    	if (isArray(obj)) {
    		return true;
    	}

    	var constr = obj.constructor;

    	if (!isFunction(constr)) {
    		return false;
    	}

    	if (isPlainObject(obj)) {
    		return true;
    	}

    	if (nativeNames[constr.name]) {
    		return false;
    	}

    	return constr.toString() === '[native code]';
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
      this.p = this._init();
    }

    /**
     * @private
     * @return {!Object}
     */
    Collection.prototype._init = function () {
      return Object.assign({
        mult: true,
        count: false,
        from: false,
        startIndex: false,
        endIndex: false,
        reverse: false,
        inverseFilter: false,
        notOwn: false,
        live: false,
        thread: false,
        priority: 'normal',
        length: true,
        filter: []
      }, $C.config);
    };

    Object.assign($C, { config: {} });

    /**
     * Library version
     * @const
     */
    Collection.prototype.VERSION = [6, 0, 0, 'beta.5'];

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

    var GLOBAL = Function('return this')();

    var TRUE = Collection.prototype.TRUE = {};
    var FALSE = Collection.prototype.FALSE = {};
    var NULL = Collection.prototype.NULL = {};

    var NAMESPACE = '__COLLECTION_NAMESPACE__https_github_com_kobezzza_Collection';
    GLOBAL[NAMESPACE] = $C;

    var LENGTH_REQUEST = '__COLLECTION_TMP__lengthQuery';
    var FN_LENGTH = '__COLLECTION_TMP__length';
    var CACHE_VERSION = 16;
    var CACHE_KEY = '__COLLECTION_CACHE_VERSION__';
    var CACHE_VERSION_KEY = '__COLLECTION_CACHE__';

var     _templateObject$1 = taggedTemplateLiteral(['\nvar \nthat = this,\ndata = o.data,\ncb = o.cb,\nfilters = o.filters,\nlink = o.link,\nonIterationEnd = o.onIterationEnd,\nonComplete = o.onComplete;\nvar\nwait = 0,\nonGlobalComplete,\nonGlobalError;\nvar\ni = -1,\nj = 0,\nn = -1;\nvar\nresults = [],\nbreaker = false,\nyielder = false,\nyieldVal;\nvar\ntimeStart,\ntimeEnd,\ntime = 0;\nvar\nlimit = 1,\nlooper = 0;\nvar\nlength,\nf;\nvar\nTRUE = this.TRUE,\nFALSE = this.FALSE,\nNULL = this.NULL;\nvar\nel,\nkey;\nvar\narr = [],\n$ = {};\nvar info = {\nstartIndex: ', ',\nendIndex: ', ',\nfrom: ', ',\ncount: ', ',\nlive: ', ',\nreverse: ', ',\nnotOwn: ', ',\ninverseFilter: ', ',\ntype: \'', '\',\nthread: ', '\n};\nvar ctx = {\n$: $,\ninfo: info,\nget result() {\nreturn p.result;\n},\nyield: function (opt_val) {\nif (', ') {\nreturn false;\n}\nyielder = true;\nyieldVal = opt_val;\nreturn true;\n},\nget next() {\nif (', ') {\nreturn false;\n}\nlink.self.next();\nreturn true;\n},\nsleep: function (time, opt_test, opt_interval) {\nif (', ') {\nreturn false;\n}\nctx.yield();\nreturn new Promise(function (resolve, reject) {\nlink.self.sleep = setTimeout(function () {\nif (opt_test) {\ntry {\nvar test = opt_test(ctx);\nif (test) {\nresolve();\nlink.self.next();\n} else if (opt_interval !== false) {\nctx.sleep(time, opt_test, opt_interval).then(resolve, reject);\n}\n} catch (err) {\nreject(err);\nthrow err;\n}\n} else {\nresolve();\nlink.self.next();\n}\n}, time);\n});\n},\nwait: function (promise) {\nvar thread = promise.thread;\nif (!thread || !thread.thread) {\nresults.push(thread);\nif (!wait) {\nif (onGlobalComplete) {\nonGlobalComplete(results);\nonGlobalComplete = null;\n}\nresults = [];\n}\nreturn false;\n}\nctx.yield();\nwait++;\nvar onComplete = thread.onComplete;\nthread.onComplete = function (res) {\nif (wait) {\nwait--;\n}\nresults.push(res);\nthat._stack.push(ctx);\nif (onComplete) {\nonComplete(res);\n}\nif (!wait) {\nyielder = false;\nif (onGlobalComplete) {\nonGlobalComplete(results);\nonGlobalComplete = null;\n}\nresults = [];\nthat._stack.pop();\nif (!yielder) {\nctx.next;\n}\n} else {\nthat._stack.pop();\n}\n};\nreturn promise.catch(function (err) {\nif (onGlobalError) {\nonGlobalError(err);\nonGlobalError = null;\n}\n});\n},\nget complete() {\nreturn new Promise(function (resolve, reject) {\nif (!wait) {\nresolve(that, results);\nresults = [];\nreturn false;\n}\nonGlobalComplete = resolve;\nonGlobalError = reject;\n});\n},\njump: function (val) {\nif (', ') {\nreturn false;\n}\nvar diff = i - n;\nn = val - 1;\ni = n + diff;\nreturn i;\n},\ni: function (val) {\nif (val === undefined) {\nreturn i;\n}\nif (', ') {\nreturn false;\n}\nn += val;\ni += val;\nreturn i;\n},\nget reset() {\nbreaker = true;\nlimit++;\nreturn true;\n},\nget break() {\nbreaker = true;\nreturn true;\n}\n};\nvar cbCtx = Object.create(ctx);\ncbCtx.length = o.cbLength;\nvar filterCtx = Object.create(ctx);\nfilterCtx.length = o.fLength;\n'], ['\nvar \nthat = this,\ndata = o.data,\ncb = o.cb,\nfilters = o.filters,\nlink = o.link,\nonIterationEnd = o.onIterationEnd,\nonComplete = o.onComplete;\nvar\nwait = 0,\nonGlobalComplete,\nonGlobalError;\nvar\ni = -1,\nj = 0,\nn = -1;\nvar\nresults = [],\nbreaker = false,\nyielder = false,\nyieldVal;\nvar\ntimeStart,\ntimeEnd,\ntime = 0;\nvar\nlimit = 1,\nlooper = 0;\nvar\nlength,\nf;\nvar\nTRUE = this.TRUE,\nFALSE = this.FALSE,\nNULL = this.NULL;\nvar\nel,\nkey;\nvar\narr = [],\n$ = {};\nvar info = {\nstartIndex: ', ',\nendIndex: ', ',\nfrom: ', ',\ncount: ', ',\nlive: ', ',\nreverse: ', ',\nnotOwn: ', ',\ninverseFilter: ', ',\ntype: \'', '\',\nthread: ', '\n};\nvar ctx = {\n$: $,\ninfo: info,\nget result() {\nreturn p.result;\n},\nyield: function (opt_val) {\nif (', ') {\nreturn false;\n}\nyielder = true;\nyieldVal = opt_val;\nreturn true;\n},\nget next() {\nif (', ') {\nreturn false;\n}\nlink.self.next();\nreturn true;\n},\nsleep: function (time, opt_test, opt_interval) {\nif (', ') {\nreturn false;\n}\nctx.yield();\nreturn new Promise(function (resolve, reject) {\nlink.self.sleep = setTimeout(function () {\nif (opt_test) {\ntry {\nvar test = opt_test(ctx);\nif (test) {\nresolve();\nlink.self.next();\n} else if (opt_interval !== false) {\nctx.sleep(time, opt_test, opt_interval).then(resolve, reject);\n}\n} catch (err) {\nreject(err);\nthrow err;\n}\n} else {\nresolve();\nlink.self.next();\n}\n}, time);\n});\n},\nwait: function (promise) {\nvar thread = promise.thread;\nif (!thread || !thread.thread) {\nresults.push(thread);\nif (!wait) {\nif (onGlobalComplete) {\nonGlobalComplete(results);\nonGlobalComplete = null;\n}\nresults = [];\n}\nreturn false;\n}\nctx.yield();\nwait++;\nvar onComplete = thread.onComplete;\nthread.onComplete = function (res) {\nif (wait) {\nwait--;\n}\nresults.push(res);\nthat._stack.push(ctx);\nif (onComplete) {\nonComplete(res);\n}\nif (!wait) {\nyielder = false;\nif (onGlobalComplete) {\nonGlobalComplete(results);\nonGlobalComplete = null;\n}\nresults = [];\nthat._stack.pop();\nif (!yielder) {\nctx.next;\n}\n} else {\nthat._stack.pop();\n}\n};\nreturn promise.catch(function (err) {\nif (onGlobalError) {\nonGlobalError(err);\nonGlobalError = null;\n}\n});\n},\nget complete() {\nreturn new Promise(function (resolve, reject) {\nif (!wait) {\nresolve(that, results);\nresults = [];\nreturn false;\n}\nonGlobalComplete = resolve;\nonGlobalError = reject;\n});\n},\njump: function (val) {\nif (', ') {\nreturn false;\n}\nvar diff = i - n;\nn = val - 1;\ni = n + diff;\nreturn i;\n},\ni: function (val) {\nif (val === undefined) {\nreturn i;\n}\nif (', ') {\nreturn false;\n}\nn += val;\ni += val;\nreturn i;\n},\nget reset() {\nbreaker = true;\nlimit++;\nreturn true;\n},\nget break() {\nbreaker = true;\nreturn true;\n}\n};\nvar cbCtx = Object.create(ctx);\ncbCtx.length = o.cbLength;\nvar filterCtx = Object.create(ctx);\nfilterCtx.length = o.fLength;\n']);
    var _templateObject2 = taggedTemplateLiteral(['\nctx.thread = link.self;\nlink.self.ctx = ctx;\n'], ['\nctx.thread = link.self;\nlink.self.ctx = ctx;\n']);
    var _templateObject3 = taggedTemplateLiteral(['\nif (timeStart == null) {\nthat._stack.push(ctx);\ntimeStart = new Date().valueOf();\n}\n'], ['\nif (timeStart == null) {\nthat._stack.push(ctx);\ntimeStart = new Date().valueOf();\n}\n']);
    var _templateObject4 = taggedTemplateLiteral(['\ntimeEnd = new Date().valueOf();\ntime += timeEnd - timeStart;\ntimeStart = timeEnd;\nif (time > this._priority[link.self.priority]) {\nthat._stack.pop();\nyield n;\ntime = 0;\ntimeStart = null;\n}\n'], ['\ntimeEnd = new Date().valueOf();\ntime += timeEnd - timeStart;\ntimeStart = timeEnd;\nif (time > this._priority[link.self.priority]) {\nthat._stack.pop();\nyield n;\ntime = 0;\ntimeStart = null;\n}\n']);
    var _templateObject5 = taggedTemplateLiteral(['\nvar\nclone = data,\ndLength = data.length - 1;\n'], ['\nvar\nclone = data,\ndLength = data.length - 1;\n']);
    var _templateObject6 = taggedTemplateLiteral(['\nclone = arr.slice.call(clone, ', ', ', ');\n'], ['\nclone = arr.slice.call(clone, ', ', ', ');\n']);
    var _templateObject7 = taggedTemplateLiteral(['\nfor (n = ', '; ++n < clone.length;) {\ni = n;\n'], ['\nfor (n = ', '; ++n < clone.length;) {\ni = n;\n']);
    var _templateObject8 = taggedTemplateLiteral(['\nif (n < ', ') {\ncontinue;\n}\n'], ['\nif (n < ', ') {\ncontinue;\n}\n']);
    var _templateObject9 = taggedTemplateLiteral(['\nif (n > ', ') {\nbreak;\n};\n'], ['\nif (n > ', ') {\nbreak;\n};\n']);
    var _templateObject10 = taggedTemplateLiteral(['\nlength = clone.length;\nfor (n = -1; ++n < length;) {\ni = n + ', ';\n'], ['\nlength = clone.length;\nfor (n = -1; ++n < length;) {\ni = n + ', ';\n']);
    var _templateObject11 = taggedTemplateLiteral(['\nfor (var key in data) {\n', '\nif (data.hasOwnProperty(key)) {\ncontinue;\n}\ntmpArray.push(key);\n', '\n}\n'], ['\nfor (var key in data) {\n', '\nif (data.hasOwnProperty(key)) {\ncontinue;\n}\ntmpArray.push(key);\n', '\n}\n']);
    var _templateObject12 = taggedTemplateLiteral(['\nfor (var key in data) {\n', '\ntmpArray.push(key);\n', '\n}\n'], ['\nfor (var key in data) {\n', '\ntmpArray.push(key);\n', '\n}\n']);
    var _templateObject13 = taggedTemplateLiteral(['\nfor (var key in data) {\n', '\nif (!data.hasOwnProperty(key)) {\nbreak;\n}\ntmpArray.push(key);\n', '\n}\n'], ['\nfor (var key in data) {\n', '\nif (!data.hasOwnProperty(key)) {\nbreak;\n}\ntmpArray.push(key);\n', '\n}\n']);
    var _templateObject14 = taggedTemplateLiteral(['\nlength = tmpArray.length;\nfor (n = -1; ++n < length;) {\nkey = tmpArray[n];\nif (key in data === false) {\ncontinue;\n}\ni = n + ', ';\n'], ['\nlength = tmpArray.length;\nfor (n = -1; ++n < length;) {\nkey = tmpArray[n];\nif (key in data === false) {\ncontinue;\n}\ni = n + ', ';\n']);
    var _templateObject15 = taggedTemplateLiteral(['\nif (!data.hasOwnProperty(key)) {\nbreak;\n}'], ['\nif (!data.hasOwnProperty(key)) {\nbreak;\n}']);
    var _templateObject16 = taggedTemplateLiteral(['\nif (!data.hasOwnProperty(key)) {\ncontinue;\n}'], ['\nif (!data.hasOwnProperty(key)) {\ncontinue;\n}']);
    var _templateObject17 = taggedTemplateLiteral(['\nn++;\ni = n;\n'], ['\nn++;\ni = n;\n']);
    var _templateObject18 = taggedTemplateLiteral(['\nvar\niteratorKey = typeof Symbol !== \'undefined\' && Symbol.iterator,\ncursor;\nif (\'next\' in data) {\ncursor = data;\n} else {\ncursor = (iteratorKey ? data[iteratorKey]() : data[\'@@iterator\'] && data[\'@@iterator\']()) || data;\n}\n'], ['\nvar\niteratorKey = typeof Symbol !== \'undefined\' && Symbol.iterator,\ncursor;\nif (\'next\' in data) {\ncursor = data;\n} else {\ncursor = (iteratorKey ? data[iteratorKey]() : data[\'@@iterator\'] && data[\'@@iterator\']()) || data;\n}\n']);
    var _templateObject19 = taggedTemplateLiteral(['\nvar tmpArray = [];\nfor (var step = cursor.next(); !step.done; step = cursor.next()) {\n', '\ntmpArray.push(step.value);\n', '\n}\ntmpArray.reverse();\nvar size = tmpArray.length;\n'], ['\nvar tmpArray = [];\nfor (var step = cursor.next(); !step.done; step = cursor.next()) {\n', '\ntmpArray.push(step.value);\n', '\n}\ntmpArray.reverse();\nvar size = tmpArray.length;\n']);
    var _templateObject20 = taggedTemplateLiteral(['\nlength = tmpArray.length;\nfor (n = -1; ++n < length;) {\n', '\ni = n + ', ';\n'], ['\nlength = tmpArray.length;\nfor (n = -1; ++n < length;) {\n', '\ni = n + ', ';\n']);
    var _templateObject21 = taggedTemplateLiteral(['\nfor (key = cursor.next(); !key.done; key = cursor.next()) {\n', '\nn++;\ni = n;\n'], ['\nfor (key = cursor.next(); !key.done; key = cursor.next()) {\n', '\nn++;\ni = n;\n']);
    var _templateObject22 = taggedTemplateLiteral(['\nif (j === ', ') {\nbreak;\n}\n'], ['\nif (j === ', ') {\nbreak;\n}\n']);
    var _templateObject23 = taggedTemplateLiteral(['\nif (from !== 0) {\nfrom--;\n} else {\n', '\n}\n'], ['\nif (from !== 0) {\nfrom--;\n} else {\n', '\n}\n']);
    var _templateObject24 = taggedTemplateLiteral(['\nif (yielder) {\nthat._stack.pop();\nyielder = false;\nif (link.self) {\nlink.self.pause = true;\n} else {\nlink.pause = true;\n}\nyield yieldVal;\nlink.self.pause = false;\ndelete link.pause;\nyieldVal = void 0;\nthat._stack.push(ctx);\n}\n'], ['\nif (yielder) {\nthat._stack.pop();\nyielder = false;\nif (link.self) {\nlink.self.pause = true;\n} else {\nlink.pause = true;\n}\nyield yieldVal;\nlink.self.pause = false;\ndelete link.pause;\nyieldVal = void 0;\nthat._stack.push(ctx);\n}\n']);
    var _templateObject25 = taggedTemplateLiteral(['\nsize--;\nif (!size) {\nbreak;\n}\n'], ['\nsize--;\nif (!size) {\nbreak;\n}\n']);
    var _templateObject26 = taggedTemplateLiteral(['\nif (breaker) {\nbreak;\n}\n', '\n}\nbreaker = false;\nlooper++;\nif (onIterationEnd) {\nonIterationEnd(ctx);\n}\n'], ['\nif (breaker) {\nbreak;\n}\n', '\n}\nbreaker = false;\nlooper++;\nif (onIterationEnd) {\nonIterationEnd(ctx);\n}\n']);
    var _templateObject27 = taggedTemplateLiteral(['\n}\nthat._stack.pop();\nif (onComplete) {\nonComplete(p.result);\n}\nreturn p.result;\n'], ['\n}\nthat._stack.pop();\nif (onComplete) {\nonComplete(p.result);\n}\nreturn p.result;\n']);
    var _templateObject28 = taggedTemplateLiteral(['(function *(o, p) { ', ' })'], ['(function *(o, p) { ', ' })']);
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

    	var iFn = ws(_templateObject$1, p.startIndex, p.endIndex, p.from, p.count, p.live, p.reverse, p.notOwn, p.inverseFilter, p.type, p.thread, !p.thread, !p.thread, !p.thread, cantModI, cantModI);

    	if (p.thread) {
    		iFn += ws(_templateObject2);
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
    		threadStart = ws(_templateObject3);

    		threadEnd = ws(_templateObject4);
    	} else {
    		iFn += 'that._stack.push(ctx);';
    	}

    	iFn += 'while (limit !== looper) {';

    	switch (p.type) {
    		case 'array':
    			iFn += ws(_templateObject5);

    			if (p.reverse) {
    				iFn += 'clone = arr.slice.call(clone).reverse();';
    			}

    			if ((p.reverse || !p.live) && (startIndex || endIndex)) {
    				iFn += ws(_templateObject6, startIndex, endIndex || 'data.length');
    			}

    			if (!p.reverse && p.live) {
    				iFn += ws(_templateObject7, startIndex - 1);

    				if (startIndex) {
    					iFn += ws(_templateObject8, startIndex);
    				}

    				if (endIndex) {
    					iFn += ws(_templateObject9, endIndex);
    				}
    			} else {
    				iFn += ws(_templateObject10, startIndex);
    			}

    			if (maxArgsLength) {
    				if (maxArgsLength > 1) {
    					if (startIndex) {
    						iFn += 'key = ' + (p.reverse ? 'dLength - (' : '') + ' n + ' + (startIndex + (p.reverse ? ')' : '')) + ';';
    					} else {
    						iFn += 'key = ' + (p.reverse ? 'dLength - ' : '') + ' n;';
    					}
    				}

    				iFn += 'el = clone[n];';
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
    							iFn += ws(_templateObject11, threadStart, threadEnd);
    						} else {
    							iFn += ws(_templateObject12, threadStart, threadEnd);
    						}
    					} else {
    						iFn += ws(_templateObject13, threadStart, threadEnd);
    					}
    				}

    				if (p.reverse) {
    					iFn += 'tmpArray.reverse();';
    				}

    				if (startIndex || endIndex) {
    					iFn += 'tmpArray = tmpArray.slice(' + startIndex + ', ' + (endIndex || 'tmpArray.length') + ');';
    				}

    				iFn += ws(_templateObject14, startIndex);
    			} else {
    				iFn += 'for (key in data) {';

    				if (p.notOwn === false) {
    					iFn += ws(_templateObject15);
    				} else if (p.notOwn === -1) {
    					iFn += ws(_templateObject16);
    				}

    				iFn += ws(_templateObject17);

    				if (startIndex) {
    					iFn += ws(_templateObject8, startIndex);
    				}

    				if (endIndex) {
    					iFn += ws(_templateObject9, endIndex);
    				}
    			}

    			if (maxArgsLength) {
    				iFn += 'el = data[key];';
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
    					iFn += ws(_templateObject18);
    				}
    			};

    			if (p.reverse) {
    				gen();
    				iFn += ws(_templateObject19, threadStart, threadEnd);

    				if (startIndex || endIndex) {
    					iFn += 'tmpArray = tmpArray.slice(' + startIndex + ', ' + (endIndex || 'tmpArray.length') + ');';
    				}

    				iFn += ws(_templateObject20, maxArgsLength ? 'key = tmpArray[n];' : '', startIndex);
    			} else {
    				gen();

    				iFn += ws(_templateObject21, maxArgsLength ? 'key = key.value;' : '');

    				if (startIndex) {
    					iFn += ws(_templateObject8, startIndex);
    				}

    				if (endIndex) {
    					iFn += ws(_templateObject9, endIndex);
    				}
    			}

    			if (maxArgsLength) {
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
    		iFn += ws(_templateObject22, p.count);
    	}

    	if (p.filter.length) {
    		iFn += 'if (';

    		for (var _i = 0; _i < p.filter.length; _i++) {
    			iFn += '(' + (p.inverseFilter ? '!' : '') + '(f = filters[' + _i + '](' + filterArgs[_i] + ')) || f === ' + (p.inverseFilter ? 'FALSE' : 'TRUE') + ')';
    			if (_i !== p.filter.length - 1) {
    				iFn += '&&';
    			}
    		}

    		iFn += ') {';
    	}

    	var tmp = void 0;
    	if (p.mult) {
    		tmp = 'cb(' + cbArgs + ');';
    	} else {
    		tmp = 'cb(' + cbArgs + '); breaker = true;';
    	}

    	if (p.count) {
    		tmp += 'j++;';
    	}

    	if (p.from) {
    		iFn += ws(_templateObject23, tmp);
    	} else {
    		iFn += tmp;
    	}

    	if (p.filter.length) {
    		iFn += '}';
    	}

    	var yielder = ws(_templateObject24);

    	if (p.thread) {
    		iFn += yielder;
    	}

    	if (!p.live && !p.reverse && isMapSet) {
    		iFn += ws(_templateObject25);
    	}

    	iFn += ws(_templateObject26, threadEnd);

    	if (p.thread) {
    		iFn += yielder;
    	}

    	iFn += ws(_templateObject27);

    	if (p.thread) {
    		tmpCycle[key] = eval(ws(_templateObject28, iFn));
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
    	if (IS_BROWSER && JSON_SUPPORT && LOCAL_STORAGE_SUPPORT) {
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

        var maxPriority = 40;
    var priority = {
      'low': maxPriority / 8,
      'normal': maxPriority / 4,
      'hight': maxPriority / 2,
      'critical': maxPriority
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
    	var p = any(opt_params || {});

    	if (!isArray(opt_filter) && !isFunction(opt_filter)) {
    		p = opt_filter || p;
    		opt_filter = null;
    	}

    	p.result = 0;
    	p.filter = [].concat(p.filter || [], opt_filter || []);

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

    var stack = Collection.prototype['_stack'] = [];

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
     *   *) [onComplete] - callback function for the operation end
     *   *) [result] - parameter that marked as the operation result
     *
     * @return {(!Collection|!Promise)}
     */
    Collection.prototype.forEach = function (cb, opt_params) {
    	var _this = this;

    	var p = any(Object.create(this.p));

    	this.p = this._init();
    	if (isArray(opt_params) || isFunction(opt_params)) {
    		p.filter = opt_params;
    	} else {
    		Object.assign(p, opt_params);
    	}

    	if (p.notOwn) {
    		p.use = 'for in';
    	}

    	if (p.hasOwnProperty('priority') || p.onChunk) {
    		p.thread = true;
    	}

    	if (!priority[p.priority]) {
    		priority[p.priority] = 'normal';
    	}

    	var data = this.data;
    	var type = p.type = getType(data, p.use);

    	if (!isObjectInstance(data) || { 'weakMap': true, 'weakSet': true }[type]) {
    		throw new TypeError('Incorrect data type');
    	}

    	var filters = p.filter = [].concat(p.filter || []);

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

    	var key = [type, cbArgs, filters.length, filterArgs, p.length, p.thread, p.notOwn, p.live, p.inverseFilter, p.reverse, p.mult, p.count, p.from, p.startIndex, p.endIndex].join();

    	var link = {},
    	    fn = any(tmpCycle[key] || compileCycle(key, p));

    	var args = {
    		data: data,
    		cb: cb,
    		cbLength: cbLength,
    		filters: filters,
    		fLength: fLength,
    		link: link,
    		onComplete: p.onComplete,
    		onIterationEnd: p.onIterationEnd
    	};

    	//#if iterators.thread

    	if (p.thread) {
    		var _ret3 = function () {
    			var thread = void 0;
    			var promise = new Promise(function (resolve, reject) {
    				function wrap(fn) {
    					if (!fn) {
    						return undefined;
    					}

    					return function (el, key, data, o) {
    						try {
    							return fn(el, key, data, o);
    						} catch (err) {
    							reject(err);
    							throw err;
    						}
    					};
    				}

    				for (var _i = 0; _i < filters.length; _i++) {
    					filters[_i] = wrap(filters[_i]);
    				}

    				var onComplete = p.onComplete;

    				args.onComplete = p.onComplete = wrap(function (res) {
    					onComplete && onComplete(res);
    					resolve(res);
    				});

    				args.cb = wrap(cb);
    				args.onIterationEnd = wrap(p.onIterationEnd);
    				thread = link.self = fn.call(_this, args, opt_params || p);

    				if (link.pause) {
    					link.self.pause = true;
    				}

    				var l = stack.length;

    				var cursor = void 0,
    				    pos = 1;

    				while (cursor = stack[l - pos]) {
    					if (cursor.thread) {
    						cursor.thread.children.push(thread);
    						break;
    					}

    					pos++;
    				}

    				_this._addToStack(thread, p.priority, p.onComplete, wrap(p.onChunk));
    			});

    			promise.thread = thread;
    			return {
    				v: promise
    			};
    		}();

    		if (typeof _ret3 === "object") return _ret3.v;
    	}

    	//#endif

    	link.self = fn.call(this, args, opt_params || p);

    	if (link.pause) {
    		link.self.pause = true;
    	}

    	return this;
    };

    /**
     * Appends a filter to the operation
     *
     * @param {...$$CollectionFilter} filter - function filter
     * @return {!Collection}
     */
    Collection.prototype.filter = function (filter) {
    	this.p.filter = this.p.filter.concat([].slice.call(arguments));
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
     * @param {(boolean|?$$Collection_extend)} deepOrParams - if true, then properties will be copied recursively
     *   OR additional parameters for extending:
     *
     *   *) [withAccessors = false] - if true, then accessors will be copied too;
     *   *) [withProto = false] - if true, then properties will be copied with prototypes;
     *   *) [deepOrParams.concatArray = false] - if true, then array properties will be concatenated
     *        (only if extending by an another array);
     *
     *   *) [deepOrParams.traits = false] - if true, then will be copied only new properties, or if -1, only old;
     *   *) [deepOrParams.deep = false] - if true, then properties will be copied recursively.
     *
     * @param {Object} target - source object
     * @param {...Object} args - objects for extending
     * @return {!Object}
     */
    $C.extend = function (deepOrParams, target, args) {
    	var params = any(deepOrParams);

    	var concatArray = false,
    	    withAccessors = false,
    	    withProto = false,
    	    traits = false,
    	    deep = void 0;

    	if (deepOrParams && !isBoolean(deepOrParams)) {
    		var p = deepOrParams;
    		withProto = p.withProto;
    		withAccessors = p.withAccessors && DESCRIPTORS_SUPPORT;
    		concatArray = Boolean(p.concatArray);
    		traits = p.traits || false;
    		deep = Boolean(p.deep);
    	} else {
    		deep = deepOrParams || false;
    	}

    	var current = any(isObjectInstance(target) ? target : isArray(arguments[2]) ? [] : {}),
    	    length = arguments.length;

    	var i = 1;
    	while (++i < length) {
    		var arg = arguments[i];

    		if (arg) {
    			for (var key in arg) {
    				if (withAccessors) {
    					var descriptor = Object.getOwnPropertyDescriptor(arg, key);
    					if (descriptor && (descriptor.set || descriptor.get)) {
    						Object.defineProperty(current, key, {
    							get: descriptor.get,
    							set: descriptor.set
    						});

    						continue;
    					}
    				}

    				var src = current[key];

    				var copy = arg[key];

    				if (current === copy || copy === arg) {
    					continue;
    				}

    				var copyIsArray = void 0;
    				if (deep && copy && typeof copy === 'object' && ((copyIsArray = isArray(copy)) || isExtensible(copy))) {
    					var isObj = src && typeof src === 'object',
    					    isPlainObj = isObj && isExtensible(src);

    					if (withProto && isPlainObj && !current.hasOwnProperty(key)) {
    						if (isArray(current[key])) {
    							current[key] = src = current[key].slice();
    						} else {
    							current[key] = src = Object.create(current[key]);
    						}
    					}

    					var clone = void 0;
    					if (copyIsArray) {
    						var srcIsArray = isArray(src),
    						    isProto = false,
    						    construct = void 0;

    						if (!srcIsArray && withProto && concatArray) {
    							construct = isObj && Object.getPrototypeOf(src);
    							srcIsArray = construct && isArray(construct) && (isProto = true);
    						}

    						if (srcIsArray) {
    							if (concatArray) {
    								current[key] = (isProto ? construct : src).concat(copy);
    								continue;
    							} else {
    								clone = src;
    							}
    						} else {
    							clone = [];
    						}
    					} else {
    						if (src && isPlainObj && !isArray(src)) {
    							clone = src;
    						} else {
    							clone = {};
    						}
    					}

    					current[key] = $C.extend(params, clone, copy);
    				} else if (copy !== undefined) {
    					if (traits) {
    						if (key in current === (traits === -1)) {
    							current[key] = copy;
    						}
    					} else {
    						current[key] = copy;
    					}
    				}
    			}
    		}
    	}

    	return current;
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
    	var p = any(opt_params || {});

    	if (!isFunction(cb)) {
    		p = cb || p;
    		cb = function (el) {
    			return el;
    		};
    	}

    	if (isArray(p) || isFunction(p)) {
    		p = { filter: p };
    	}

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

    	var action = void 0;
    	switch (type) {
    		case 'array':
    			action = function () {
    				res.push(cb.apply(null, arguments));
    			};

    			action[FN_LENGTH] = cb.length;
    			break;

    		case 'object':
    			action = function (el, key) {
    				res[key] = cb.apply(null, arguments);
    			};

    			action[FN_LENGTH] = action.length > cb.length ? action.length : cb.length;
    			break;

    		case 'map':
    		case 'weakMap':
    			action = function (el, key) {
    				res.set(key, cb.apply(null, arguments));
    			};

    			action[FN_LENGTH] = action.length > cb.length ? action.length : cb.length;
    			break;

    		case 'set':
    		case 'weakSep':
    			action = function () {
    				res.add(cb.apply(null, arguments));
    			};

    			action[FN_LENGTH] = cb.length;
    			break;
    	}

    	p.result = res;

    	var returnVal = any(this.forEach(any(action), p));

    	if (returnVal !== this) {
    		return returnVal;
    	}

    	return p.result;
    };

    /**
     * Collection context link
     *
     * @constructor
     * @param {$$CollectionLink} link - source link
     */
    function Link(link) {
      this.link = isArray(link) ? [link] : link;
    }

    /**
     * Returns a context link value
     * @return {?}
     */
    Link.prototype.valueOf = function () {
      return this.link;
    };

    /**
     * Returns true if the specified object is a Link instance
     *
     * @param {?} obj - source object
     * @return {boolean}
     */
    function isLink(obj) {
      return obj instanceof Link;
    }

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
     * @return {({key, result: boolean, value}|?)}
     */
    function byLink(obj, link, opt_params) {
    	var p = opt_params || {};

    	if (isLink(link)) {
    		link = link.valueOf();
    	}

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
    		if (!isTest && i === last && (p.delete || p.value !== undefined)) {
    			var cache = {
    				key: isASet ? null : el,
    				result: isAMap || isASet ? obj.has(el) : el in obj,
    				value: isAMap ? obj.get(el) : isASet ? el : obj[el]
    			};

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

    //#endif

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
    	var p = any(opt_params || {});

    	//#if link

    	if (isLink(opt_filter) || !isFunction(opt_filter) && (isArray(opt_filter) && !isFunction(opt_filter[1]) || opt_filter != null && typeof opt_filter !== 'object')) {
    		var tmp = byLink(this.data, opt_filter);
    		p.onComplete && p.onComplete(tmp);
    		return tmp;
    	}

    	//#endif

    	if (!isArray(opt_filter) && !isFunction(opt_filter)) {
    		p = opt_filter || p;
    		opt_filter = null;
    	}

    	var action = void 0;
    	if (p.mult !== false && this.p.mult !== false) {
    		(function () {
    			var res = p.result = [];
    			action = function (el) {
    				return res.push(el);
    			};
    		})();
    	} else {
    		action = function (el) {
    			return p.result = el;
    		};
    	}

    	p.filter = [].concat(p.filter || [], opt_filter || []);

    	var returnVal = any(this.forEach(any(action), p));

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
    	var p = any(opt_params || {});

    	if (!isArray(opt_filter) && !isFunction(opt_filter)) {
    		p = opt_filter || p;
    		opt_filter = null;
    	}

    	p.result = opt_initialValue;
    	p.filter = [].concat(p.filter || [], opt_filter || []);

    	fn[FN_LENGTH] = cb.length - 1;
    	function fn(el) {
    		if (opt_initialValue == null) {
    			p.result = el;
    			opt_initialValue = true;
    		} else {
    			p.result = cb.apply(null, [p.result].concat([].slice.call(arguments)));
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
    	var p = any(opt_params || {});

    	if (!isArray(opt_filter) && !isFunction(opt_filter)) {
    		p = opt_filter || p;
    		opt_filter = null;
    	}

    	p.result = true;
    	p.filter = [].concat(p.filter || [], opt_filter || []);
    	p.inverseFilter = !p.inverseFilter;
    	p.mult = false;

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
    	var p = any(opt_params || {});

    	if (!isArray(opt_filter) && !isFunction(opt_filter)) {
    		p = opt_filter || p;
    		opt_filter = null;
    	}

    	p.result = false;
    	p.filter = [].concat(p.filter || [], opt_filter || []);
    	p.mult = false;

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

    	var p = any(opt_params || {});

    	if (!isArray(opt_filter) && !isFunction(opt_filter)) {
    		p = opt_filter || p;
    		opt_filter = null;
    	}

    	var action = void 0;
    	if (p.mult !== false && this.p.mult !== false) {
    		(function () {
    			var res = p.result = [];

    			if (isSet(_this.data)) {
    				action = function (el) {
    					return res.push(el);
    				};
    			} else {
    				action = function (el, key) {
    					return res.push(key);
    				};
    			}
    		})();
    	} else {
    		p.result = null;
    		action = function (el, key) {
    			return p.result = isMap(_this.data) ? { value: key } : isSet(_this.data) ? { value: el } : key;
    		};
    	}

    	p.filter = [].concat(p.filter || [], opt_filter || []);

    	var returnVal = any(this.forEach(any(action), p));

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
    	var p = any(opt_params || {});

    	if (!isArray(opt_filter) && !isFunction(opt_filter)) {
    		p = opt_filter || p;
    		opt_filter = null;
    	}

    	p.filter = [Number.isNaN(searchElement) ? function (el) {
    		return Number.isNaN(el);
    	} : function (el) {
    		return el === searchElement;
    	}].concat(opt_filter || []);

    	p.mult = false;
    	p.result = false;

    	var returnVal = any(this.forEach(function () {
    		return p.result = true;
    	}, p));

    	if (returnVal !== this) {
    		return returnVal;
    	}

    	return p.result;
    };

    //#endif

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

    	var p = any(opt_params || {});

    	if (!isArray(opt_filter) && !isFunction(opt_filter)) {
    		p = opt_filter || p;
    		opt_filter = null;
    	}

    	var isFunc = isFunction(field),
    	    res = p.result = p.useMap ? new GLOBAL['Map']() : {};

    	var action = void 0;
    	if (p.useMap) {
    		action = function (el, key) {
    			var param = isFunc ? field.apply(null, arguments) : byLink(el, field),
    			    val = p.saveKeys ? key : el;

    			if (res.has(param)) {
    				res.get(param).push(val);
    			} else {
    				res.set(param, [val]);
    			}
    		};
    	} else {
    		action = function (el, key) {
    			var param = isFunc ? field.apply(null, arguments) : byLink(el, field),
    			    val = p.saveKeys ? key : el;

    			if (res[param]) {
    				res[param].push(val);
    			} else {
    				res[param] = [val];
    			}
    		};
    	}

    	if (isFunc) {
    		action[FN_LENGTH] = action.length > field.length ? action.length : field.length;
    	}

    	p.filter = [].concat(p.filter || [], opt_filter || []);
    	p.mult = true;

    	var returnVal = any(this.forEach(any(action), p));

    	if (returnVal !== this) {
    		return returnVal;
    	}

    	return p.result;
    };

    //#endif

    /**
     * Removes elements from the collection by the specified condition/link
     *
     * @see Collection.prototype.forEach
     * @param {($$CollectionFilter|$$CollectionBase|$$CollectionLink)=} [opt_filter] - link, function filter or an array of functions
     * @param {?$$CollectionBase=} [opt_params] - additional parameters
     * @return {($$CollectionReport|!Promise<$$CollectionReport>)}
     */
    Collection.prototype.remove = function (opt_filter, opt_params) {
    	var p = any(opt_params || {});

    	//#if link

    	if (isLink(opt_filter) || !isFunction(opt_filter) && (isArray(opt_filter) && !isFunction(opt_filter[1]) || opt_filter != null && typeof opt_filter !== 'object')) {
    		var tmp = byLink(this.data, opt_filter, { delete: true });
    		p.onComplete && p.onComplete(tmp);
    		return tmp;
    	}

    	//#endif

    	if (!isArray(opt_filter) && !isFunction(opt_filter)) {
    		p = opt_filter || p;
    		opt_filter = null;
    	}

    	var type = getType(this.data, p.use);

    	if ({ 'iterator': true, 'generator': true }[type]) {
    		throw new TypeError('Incorrect data type');
    	}

    	var mult = p.mult !== false && this.p.mult !== false,
    	    res = [],
    	    splice = [].splice;

    	if (mult) {
    		p.result = res;
    	}

    	var action = void 0;
    	switch (type) {
    		case 'map':
    			action = function (value, key, data) {
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
    			action = function (value, key, data) {
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
    				action = function (value, key, data) {
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
    						action = function (value, key, data, ctx) {
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
    						action = function (value, key, data, ctx) {
    							var ln = ctx.length();
    							var fn = function (length) {
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
    								fn(ln);
    							} else {
    								ctx.wait(ln).then(fn);
    							}
    						};
    					}
    				})();
    			}

    			break;

    		default:
    			action = function (value, key, data) {
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

    	p.filter = [].concat(p.filter || [], opt_filter || []);

    	var returnVal = any(this.forEach(any(action), p));

    	if (returnVal !== this) {
    		return returnVal;
    	}

    	return p.result;
    };

    //#endif

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
     * @return {($$CollectionReport|!Promise<$$CollectionReport>)}
     */
    Collection.prototype.set = function (value, filter, opt_params) {
    	var p = any(opt_params || {});

    	var data = this.data;

    	//#if link

    	if (isLink(filter) || !isFunction(filter) && (isArray(filter) && !isFunction(filter[1]) || filter != null && typeof filter !== 'object')) {
    		var tmp = byLink(data, filter, { value: value, create: p.create !== false, error: true });
    		p.onComplete && p.onComplete(tmp);
    		return tmp;
    	}

    	//#endif

    	if (!isArray(filter) && !isFunction(filter)) {
    		p = filter || p;
    		filter = null;
    	}

    	var type = getType(data, p.use),
    	    isFunc = isFunction(value);

    	var mult = p.mult !== false && this.p.mult !== false,
    	    report = [];

    	if (mult) {
    		p.result = report;
    	}

    	var action = void 0;
    	if (isFunc) {
    		switch (type) {
    			case 'map':
    				action = function (el, key, data) {
    					var res = value.apply(null, arguments);

    					var status = res === undefined;

    					if (res !== undefined && data.get(key) !== res) {
    						data.set(key, res);
    						status = data.get(key) === res;
    					}

    					var o = {
    						key: key,
    						value: el,
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
    				action = function (el, key, data) {
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
    				action = function (el, key, data) {
    					var res = value.apply(null, arguments);

    					var status = res === undefined;

    					if (res !== undefined && data[key] !== res) {
    						data[key] = res;
    						status = data[key] === res;
    					}

    					var o = {
    						key: key,
    						value: el,
    						result: status
    					};

    					if (mult) {
    						report.push(o);
    					} else {
    						p.result = o;
    					}
    				};
    		}

    		action[FN_LENGTH] = action.length > value.length ? action.length : value.length;
    	} else {
    		switch (type) {
    			case 'map':
    				action = function (el, key, data) {
    					var result = false;
    					if (data.get(key) !== value) {
    						data.set(key, value);
    						result = data.get(key) === value;
    					}

    					var o = {
    						key: key,
    						value: el,
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
    				action = function (el, key, data) {
    					var result = false;
    					if (!data.has(value)) {
    						data.delete(el);
    						data.add(value);
    						result = data.has(value);
    					}

    					var o = {
    						key: null,
    						value: el,
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
    				action = function (el, key, data) {
    					var result = false;
    					if (data[key] !== value) {
    						data[key] = value;
    						result = data[key] === value;
    					}

    					var o = {
    						key: key,
    						value: el,
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


    	p.filter = [].concat(p.filter || [], filter || []);
    	p.onIterationEnd = function (ctx) {
    		if ((!p.result || !p.result.length) && 'key' in p) {
    			if (p.key == null && isArray(data)) {
    				p.key = data.length;
    			}

    			byLink(data, p.key, {
    				value: isFunc ? value(undefined, undefined, data, ctx) : value,
    				create: p.create !== false
    			});
    		}

    		onIterationEnd && onIterationEnd(ctx);
    	};

    	var returnVal = any(this.forEach(any(action), p));

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

    /** @private */
    Collection.prototype['_priority'] = priority;

    var lastPos = {};
    var execStack = {};
    for (var key in priority) {
    	if (!priority.hasOwnProperty(key)) {
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
    				value: priority[key]
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
    					total += priority[key];
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

    	while (total <= maxPriority) {
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
     * @param {?function(?)} onComplete - callback function for complete
     * @param {?function($$CollectionCtx)} [opt_onChunk] - callback function for chunks
     */
    Collection.prototype._addToStack = function (obj, priority, onComplete, opt_onChunk) {
    	obj.thread = true;
    	obj.priority = priority;
    	obj.destroy = function () {
    		return $C.destroy(obj);
    	};
    	obj.onComplete = onComplete;
    	obj.onChunk = opt_onChunk;
    	obj.pause = false;
    	obj.sleep = null;
    	obj.children = [];

    	var next = obj.next;

    	// With strictMode in Chrome (bug?) that method can't define as obj.next =
    	Object.defineProperty(obj, 'next', {
    		value: function () {
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
    				var obj = prop[el],
    				    res = obj.next();

    				if (res.done) {
    					prop.splice(el, 1);

    					$C(data).forEach(function (el, i) {
    						if (el) {
    							data[i]--;
    						}
    					}, { startIndex: i + 1 });

    					exec--;
    					if (obj.onComplete && obj.onComplete !== onComplete) {
    						obj.onComplete(obj.ctx.result);
    					}
    				} else if (obj.onChunk) {
    					obj.onChunk(obj.ctx);
    				}
    			});
    		});

    		if (exec) {
    			setTimeout(loop, maxPriority);
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
     * @return {boolean}
     */
    $C.destroy = function (obj) {
    	if (!obj || !obj.thread) {
    		return false;
    	}

    	var thread = obj.thread;

    	clearTimeout(thread.sleep);
    	$C(thread.children).forEach(function (child) {
    		return $C.destroy(child);
    	});
    	$C(execStack[thread.priority]).remove(function (el) {
    		return el === thread;
    	}, { mult: false });

    	return true;
    };

    Object.assign($C, { destroy: $C.destroy });

    return $C;

}));
