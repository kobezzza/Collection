'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

exports.__esModule = true;
exports.returnCache = returnCache;
exports.compileCycle = compileCycle;

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

var _cache = require('../consts/cache');

var _string = require('../helpers/string');

var _hacks = require('../consts/hacks');

var _base = require('../consts/base');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let timeout;
const cache = _core2.default.cache.str;

/**
 * Returns a cache string by an object
 *
 * @param {?} cache - cache object
 * @return {string}
 */
function returnCache(cache) {
	let text = '';

	for (const key in cache) {
		if (!cache.hasOwnProperty(key)) {
			continue;
		}

		text += cache[key];
	}

	return text;
}

const cbArgsList = ['el', 'key', 'data', 'cbCtx'];

const filterArgsList = ['el', 'key', 'data', 'filterCtx'];

const mapSet = {
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
	const isMapSet = mapSet[p.type],
	      isAsync = p.thread || p.async;

	const cantModI = !(p.type === 'array' || p.reverse || p.type === 'object' && p.notOwn && _hacks.OBJECT_KEYS_NATIVE_SUPPORT);

	let iFn = _string.ws`
		var 
			data = o.data,
			cb = o.cb,
			filters = o.filters,
			priority = o.priority;

		var
			onIterationEnd = o.onIterationEnd,
			onComplete = o.onComplete,
			getDescriptor = Object.getOwnPropertyDescriptor,
			onError = o.onError;

		var
			TRUE = {},
			FALSE = {};

		var
			i = -1,
			j = 0,
			n = -1;

		var
			breaker = false,
			brkIf = false;

		var
			limit = 1,
			looper = 0,
			waitResult;

		var
			length,
			f,
			r;

		var
			el,
			key;

		var
			slice = [].slice,
			hasOwnProperty = {}.hasOwnProperty,
			$ = {};

		var info = {
			startIndex: ${p.startIndex},
			endIndex: ${p.endIndex},
			from: ${p.from},
			count: ${p.count},
			live: ${p.live},
			reverse: ${p.reverse},
			withDescriptor: ${p.withDescriptor},
			notOwn: ${p.notOwn},
			inverseFilter: ${p.inverseFilter},
			type: '${p.type}',
			async: ${p.async},
			thread: ${p.thread},
			priority: ${p.thread} && '${p.priority}',
			length: ${p.length}
		};
	`;

	if (isAsync) {
		iFn += _string.ws`
			var
				timeStart,
				timeEnd,
				time = 0;

			var
				yielder = false,
				yieldVal;

			var
				parallel = 0,
				race = 0;

			var
				wait = new Set(),
				waiting = false;

			waitResult = [];
		`;
	}

	iFn += _string.ws`
		var ctx = {
			$: $,
			info: info,
			waitResult: waitResult,
			onError: onError,

			TRUE: TRUE,
			FALSE: FALSE,

			get result() {
				return p.result;
			},

			set result(value) {
				p.result = value;
			},

			yield: function (opt_val) {
				if (${!isAsync}) {
					return false;
				}

				yielder = true;
				yieldVal = opt_val;

				return true;
			},

			next: function (opt_val) {
				if (${!isAsync}) {
					return false;
				}

				ctx.thread.next(opt_val);
				return true;
			},

			child: function (thread) {
				if (${!isAsync} || !thread.thread) {
					return false;
				}

				ctx.thread.children.push(thread.thread);
				return true;
			},

			race: function (max, promise) {
				if (${!isAsync}) {
					return false;
				}

				if (arguments.length === 1) {
					promise = max;
					max = 1;
				}

				ctx.wait(promise).then(function () {
					if (race < max) {
						race++;
						if (race === max) {
							wait.clear();
						}
					}
				});

				return promise;
			},

			wait: function (max, promise) {
				if (${!isAsync}) {
					return false;
				}

				function end(err) {
					parallel && parallel--;
					ctx.thread.pause && ctx.next();
				}

				if (arguments.length > 1) {
					parallel++;

					if (parallel >= max) {
						ctx.yield();
					}

					ctx.wait(promise).then(end, function (err) {
						if (err && err.type === 'CollectionThreadDestroy') {
							end();
							return;
						}
					});

					return promise;

				} else {
					promise = max;
				}

				if (!isPromise(promise)) {
					promise = typeof promise.next === 'function' ? promise.next() : promise();
				}

				ctx.child(promise);
				wait.add(promise);

				promise.then(
					function (res) {
						if (wait.has(promise)) {
							waitResult.push(res);
							wait.delete(promise);
						}

						if (waiting) {
							ctx.next();
						}
					}, 

					function (err) {
						if (err && err.type === 'CollectionThreadDestroy') {
							wait.delete(promise);
							return;
						}

						onError(err);
					}
				);

				return promise;
			},

			sleep: function (time, opt_test, opt_interval) {
				if (${!isAsync}) {
					return false;
				}

				ctx.yield();
				return new Promise(function (resolve, reject) {
					var
						sleep = ctx.thread.sleep;

					if (sleep != null) {
						sleep.resume();
					}

					sleep = ctx.thread.sleep = {
						resume: function () {
							clearTimeout(sleep.id);
							ctx.thread.sleep = null;
							resolve();
						},

						id: setTimeout(function () {
							if (opt_test) {
								try {
									ctx.thread.sleep = null;
									var test = opt_test(ctx);

									if (test) {
										resolve();
										ctx.next();

									} else if (opt_interval !== false) {
										ctx.sleep(time, opt_test, opt_interval).then(resolve, reject);
									}

								} catch (err) {
									reject(err);
									onError(err);
								}

							} else {
								resolve();
								ctx.next();
							}
						}, time)
					};
				});
			},

			jump: function (val) {
				if (${cantModI}) {
					return false;
				}

				var diff = i - n;
				n = val - 1;
				i = n + diff;

				return i;
			},

			i: function (val) {
				if (val === undefined) {
					return i;
				}

				if (${cantModI}) {
					return false;
				}

				n += val;
				i += val;

				return i;
			},

			get reset() {
				breaker = true;
				limit++;
				return FALSE;
			},

			get break() {
				breaker = true;
				return FALSE;
			}
		};

		var cbCtx = Object.create(ctx);
		cbCtx.length = o.cbLength;

		var filterCtx = Object.create(ctx);
		filterCtx.length = o.fLength;
	`;

	if (isAsync) {
		iFn += _string.ws`
			function isPromise(obj) {
				return typeof Promise === 'function' && obj instanceof Promise;
			}

			function resolveEl(res) {
				el = res;
				ctx.next();
			}

			function resolveCb(res) {
				r = res;
				ctx.next();
			}

			function resolveFilter(res) {
				f = res;
				ctx.next();
			}

			ctx.thread = o.self;
			ctx.thread.ctx = ctx;
		`;
	}

	const startIndex = p.startIndex || 0,
	      endIndex = p.endIndex !== false ? p.endIndex + 1 : 0;

	const cbArgs = cbArgsList.slice(0, p.length ? p.cbArgs : cbArgsList.length),
	      filterArgs = [];

	for (let i = 0; i < p.filter.length; i++) {
		filterArgs.push(filterArgsList.slice(0, p.length ? p.filterArgs[i] : filterArgsList.length));
	}

	const maxArgsLength = p.length ? Math.max.apply(null, [].concat(p.cbArgs, p.filterArgs)) : cbArgsList.length;

	if (p.from) {
		iFn += `var from = ${p.from};`;
	}

	let threadStart = '',
	    threadEnd = '',
	    getEl = '';

	if (p.thread) {
		threadStart = _string.ws`
			if (timeStart == null) {
				timeStart = new Date().valueOf();
			}
		`;

		threadEnd = _string.ws`
			timeEnd = new Date().valueOf();
			time += timeEnd - timeStart;
			timeStart = timeEnd;

			if (time > priority[ctx.thread.priority]) {
				yield;
				time = 0;
				timeStart = null;
			}
		`;
	}

	if (isAsync) {
		getEl = _string.ws`
			while (isPromise(el)) {
				el = el.then(resolveEl, onError);
				ctx.thread.pause = true;
				yield;
			}

			if (el === o.IGNORE) {
				continue;
			}

			if (brkIf && el === null) {
				break;
			}
		`;
	}

	iFn += 'while (limit !== looper) {';

	const defArgs = maxArgsLength || isAsync;

	switch (p.type) {
		case 'array':
			iFn += _string.ws`
				var
					clone = data,
					dLength = data.length - 1;
			`;

			if (p.reverse) {
				iFn += 'clone = slice.call(clone).reverse();';
			}

			if ((p.reverse || !p.live) && (startIndex || endIndex)) {
				iFn += _string.ws`
					clone = slice.call(clone, ${startIndex}, ${endIndex || 'data.length'});
				`;
			}

			if (!p.reverse && p.live) {
				iFn += _string.ws`
					for (n = ${startIndex - 1}; ++n < clone.length;) {
						i = n;
				`;

				if (startIndex) {
					iFn += _string.ws`
						if (n < ${startIndex}) {
							continue;
						}
					`;
				}

				if (endIndex) {
					iFn += _string.ws`
						if (n > ${endIndex}) {
							break;
						};
					`;
				}
			} else {
				iFn += _string.ws`
					length = clone.length;
					for (n = -1; ++n < length;) {
						i = n + ${startIndex};
				`;
			}

			if (defArgs) {
				if (maxArgsLength > 1) {
					if (startIndex) {
						iFn += `key = ${p.reverse ? 'dLength - (' : ''} n + ${startIndex + (p.reverse ? ')' : '')};`;
					} else {
						iFn += `key = ${p.reverse ? 'dLength - ' : ''} n;`;
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
			iFn += 'var selfHasOwn = data.hasOwnProperty;';

			if (p.reverse || _hacks.OBJECT_KEYS_NATIVE_SUPPORT && !p.notOwn) {
				iFn += 'var tmpArray;';

				if (!p.notOwn && _hacks.OBJECT_KEYS_NATIVE_SUPPORT && !isAsync) {
					iFn += 'tmpArray = Object.keys(data);';
				} else {
					iFn += 'tmpArray = [];';

					if (p.notOwn) {
						if (p.notOwn === -1) {
							iFn += _string.ws`
								for (var key in data) {
									${threadStart}
									if (selfHasOwn ? data.hasOwnProperty(key) : hasOwnProperty.call(data, key)) {
										continue;
									}

									tmpArray.push(key);
									${threadEnd}
								}
							`;
						} else {
							iFn += _string.ws`
								for (var key in data) {
									${threadStart}
									tmpArray.push(key);
									${threadEnd}
								}
							`;
						}
					} else {
						iFn += _string.ws`
							for (var key in data) {
								${threadStart}
								if (!(selfHasOwn ? data.hasOwnProperty(key) : hasOwnProperty.call(data, key))) {
									break;
								}

								tmpArray.push(key);
								${threadEnd}
							}
						`;
					}
				}

				if (p.reverse) {
					iFn += 'tmpArray.reverse();';
				}

				if (startIndex || endIndex) {
					iFn += `tmpArray = tmpArray.slice(${startIndex}, ${endIndex || 'tmpArray.length'});`;
				}

				iFn += _string.ws`
					length = tmpArray.length;
					for (n = -1; ++n < length;) {
						key = tmpArray[n];

						if (key in data === false) {
							continue;
						}

						i = n + ${startIndex};
				`;
			} else {
				iFn += 'for (key in data) {';

				if (p.notOwn === false) {
					iFn += _string.ws`
						if (!(selfHasOwn ? data.hasOwnProperty(key) : hasOwnProperty.call(data, key))) {
							break;
						}`;
				} else if (p.notOwn === -1) {
					iFn += _string.ws`
						if (selfHasOwn ? data.hasOwnProperty(key) : hasOwnProperty.call(data, key)) {
							continue;
						}`;
				}

				iFn += _string.ws`
					n++;
					i = n;
				`;

				if (startIndex) {
					iFn += _string.ws`
						if (n < ${startIndex}) {
							continue;
						}
					`;
				}

				if (endIndex) {
					iFn += _string.ws`
						if (n > ${endIndex}) {
							break;
						};
					`;
				}
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
			const gen = () => {
				if (isMapSet) {
					iFn += 'var cursor = data.keys();';

					if (!p.live && !p.reverse) {
						iFn += 'var size = data.size;';
					}
				} else if (p.type === 'generator') {
					iFn += 'var cursor = data();';
				} else {
					iFn += _string.ws`
						var
							iteratorKey = typeof Symbol !== 'undefined' && Symbol.iterator,
							cursor;

						if (typeof data.next === 'function') {
							cursor = data;

						} else {
							cursor = (iteratorKey ? data[iteratorKey]() : data['@@iterator'] && data['@@iterator']()) || data;
						}
					`;
				}
			};

			if (p.reverse) {
				gen();
				iFn += _string.ws`
					var tmpArray = [];
					for (var step = cursor.next(); 'done' in step ? !step.done : step; step = cursor.next()) {
						${threadStart}
						brkIf = 'done' in step === false;
						el = 'value' in step ? step.value : step;
						${getEl}
						tmpArray.push(el);
						${threadEnd}
					}

					tmpArray.reverse();
					var size = tmpArray.length;
				`;

				if (startIndex || endIndex) {
					iFn += `tmpArray = tmpArray.slice(${startIndex}, ${endIndex || 'tmpArray.length'});`;
				}

				iFn += _string.ws`
					length = tmpArray.length;
					for (n = -1; ++n < length;) {
						${defArgs ? 'key = tmpArray[n];' : ''}
						i = n + ${startIndex};
				`;
			} else {
				gen();

				iFn += _string.ws`
					for (key = cursor.next(); 'done' in key ? !key.done : key; key = cursor.next()) {
						brkIf = 'done' in key === false;
						${defArgs ? `key = 'value' in key ? key.value : key;` : ''}
						n++;
						i = n;
				`;

				if (startIndex) {
					iFn += _string.ws`
						if (n < ${startIndex}) {
							continue;
						}
					`;
				}

				if (endIndex) {
					iFn += _string.ws`
						if (n > ${endIndex}) {
							break;
						};
					`;
				}
			}

			if (defArgs) {
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
		iFn += _string.ws`
			if (j === ${p.count}) {
				break;
			}
		`;
	}

	iFn += getEl;
	if (p.filter.length) {
		for (let i = 0; i < p.filter.length; i++) {
			iFn += _string.ws`
				if (f === undefined || f === true) {
					f = filters[${i}](${filterArgs[i]});
			`;

			if (isAsync) {
				iFn += _string.ws`
					while (isPromise(f)) {
						f.then(resolveFilter, onError);
						ctx.thread.pause = true;
						yield;
					}
				`;
			}

			iFn += _string.ws`
					f = ${p.inverseFilter ? '!' : ''}f && f !== FALSE || f === TRUE;
				}
			`;
		}

		iFn += 'if (f) {';
	}

	let tmp = 'r = ';
	if (p.mult) {
		tmp += `cb(${cbArgs});`;
	} else {
		tmp += `cb(${cbArgs}); breaker = true;`;
	}

	if (isAsync) {
		tmp += _string.ws`
			while (isPromise(r)) {
				r.then(resolveCb, onError);
				ctx.thread.pause = true;
				yield;
			}
		`;
	}

	if (p.count) {
		tmp += 'j++;';
	}

	if (p.from) {
		iFn += _string.ws`
			if (from !== 0) {
				from--;

			} else {
				${tmp}
			}
		`;
	} else {
		iFn += tmp;
	}

	if (p.filter.length) {
		iFn += '}';
	}

	const yielder = _string.ws`
		if (yielder) {
			yielder = false;
			ctx.thread.pause = true;
			yield yieldVal;
			yieldVal = undefined;
		}
	`;

	if (isAsync) {
		iFn += yielder;
	}

	if (!p.live && !p.reverse && isMapSet) {
		iFn += _string.ws`
			size--;

			if (!size) {
				break;
			}
		`;
	}

	if (p.filter.length) {
		iFn += 'f = undefined;';
	}

	iFn += _string.ws`
			if (breaker) {
				break;
			}

			${threadEnd}
		}

		breaker = false;
		looper++;

		if (onIterationEnd) {
			onIterationEnd(ctx);
		}
	`;

	if (isAsync) {
		iFn += yielder;
	}

	iFn += '}';
	if (isAsync) {
		iFn += _string.ws`
			waiting = true;
			while (wait.size) {
				ctx.thread.pause = true;
				yield;
			}
		`;
	}

	iFn += _string.ws`
		if (onComplete) {
			onComplete(p.result);
		}

		return p.result;
	`;

	if (isAsync) {
		_cache.tmpCycle[key] = new Function(`return function *(o, p) { ${iFn} };`)();
	} else {
		_cache.tmpCycle[key] = new Function('o', 'p', iFn);
	}

	if (_core2.default.ready) {
		const delay = 5e3;

		const text = `${_base.NAMESPACE}.cache.cycle["${key}"] = ${_cache.tmpCycle[key].toString()};`;
		cache[key] = text;

		if (_hacks.IS_BROWSER && _hacks.LOCAL_STORAGE_SUPPORT) {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				try {
					localStorage.setItem(_base.CACHE_KEY, JSON.stringify(cache));
					localStorage.setItem(_base.CACHE_VERSION_KEY, _base.CACHE_VERSION);

					if (_hacks.BLOB_SUPPORT) {
						const script = document.createElement('script');
						script.src = URL.createObjectURL(new Blob([text], { type: 'application/javascript' }));
						document.head.appendChild(script);
					}
				} catch (ignore) {}
			}, delay);
		} else if (_hacks.IS_NODE) {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				require('fs').writeFile(require('path').join(__dirname, 'collection.tmp.js'), `
						exports.version = ${_base.CACHE_VERSION};
						exports.cache = ${JSON.stringify(cache)};
						exports.exec = function () { ${returnCache(cache)} };
					`, () => {});
			}, delay);
			timeout['unref']();
		}
	}

	return _cache.tmpCycle[key];
}