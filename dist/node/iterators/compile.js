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

const cbArgsList = ['el', 'key', 'data', 'ctx'];

const filterArgsList = ['el', 'key', 'data', 'fCtx'];

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

	const cbArgs = cbArgsList.slice(0, p.length ? p.cbArgs : cbArgsList.length),
	      filterArgs = [];

	const maxArgsLength = p.length ? Math.max.apply(null, [].concat(p.cbArgs, p.filterArgs)) : cbArgsList.length,
	      needParallel = p.parallel || p.race,
	      parallelFn = p.parallel ? 'wait' : 'race',
	      needCtx = maxArgsLength > 3 || needParallel,
	      fLength = p.filter.length;

	for (let i = 0; i < fLength; i++) {
		filterArgs.push(filterArgsList.slice(0, p.length ? p.filterArgs[i] : filterArgsList.length));
	}

	const resolveFilterVal = `f = ${p.inverseFilter ? '!' : ''}f && f !== FALSE || f === TRUE;`,
	      callCycleFilter = `filters[fI](${filterArgsList.slice(0, p.length ? maxArgsLength : filterArgsList.length)})`;

	let iFn = _string.ws`
		var
			data = o.data,
			cb = o.cb,
			baseCb = cb,
			filters = o.filters;

		var
			count = o.count,
			from = o.from,
			startIndex = o.startIndex || 0,
			endIndex = o.endIndex !== false ? o.endIndex + 1 : 0;

		var
			onIterationEnd = o.onIterationEnd,
			onComplete = o.onComplete,
			onError = o.onError;

		var
			TRUE = o.TRUE,
			FALSE = o.FALSE,
			IGNORE = o.IGNORE;

		var
			i = -1,
			j = 0,
			n = -1,
			id = 0,
			fI = -1;

		var
			breaker = false,
			brkIf = false;

		var
			limit = 1,
			looper = 0,
			childResult;

		var
			fLength = filters.length,
			length,
			r,
			f;

		var
			el,
			key;
	`;

	if (p.withDescriptor) {
		iFn += 'var getDescriptor = Object.getOwnPropertyDescriptor;';
	}

	if (isAsync) {
		iFn += _string.ws`
			var
				priority = o.priority,
				maxParallel = o.maxParallel,
				maxParallelIsNumber = typeof maxParallel === 'number';

			var
				timeStart,
				timeEnd,
				time = 0;

			var
				thread = o.self,
				thread = o.self,
				yielder = false,
				yieldVal;

			function isPromise(obj) {
				return typeof Promise === 'function' && obj instanceof Promise;
			}

			var
				rCbSet = new Set();

			function resolveCb(res) {
				rCbSet.delete(r);
				r = res;
				thread.next();
			}

			cb = function (${cbArgs}) {
				var
					f = ${fLength ? undefined : true},
					fIsPromise = isPromise(el),
					res;

				if (fIsPromise) {
					f = el.then(function (val) {
						if (val === IGNORE) {
							return FALSE;
						}

						if (brkIf && val === null) {
							breaker = true;
							return FALSE;
						}

						el = val;
						return TRUE;
					}, onError);
				}
		`;

		if (fLength) {
			if (fLength < 5) {
				for (let i = 0; i < fLength; i++) {
					const callFilter = `filters[${i}](${filterArgs[i]})`;

					iFn += _string.ws`
						if (${i ? 'f' : 'f === undefined || f'}) {
							if (fIsPromise) {
								f = f.then(function (f) {
									${resolveFilterVal};

									if (f) {
										return ${callFilter};
									}

									return FALSE;
								}, onError);

							} else {
								f = ${callFilter};
								fIsPromise = isPromise(f);

								if (!fIsPromise) {
									${resolveFilterVal}
								}
							}
						}
					`;
				}
			} else {
				iFn += _string.ws`
					for (fI = -1; ++fI < fLength;) {
						if (fIsPromise) {
							f = f.then((function (fI) {
								return function (f) {
									${resolveFilterVal}

									if (f) {
										return ${callCycleFilter};

									} else {
										return FALSE;
									}
								};
							})(fI), onError);

						} else {
							f = ${callCycleFilter};
							fIsPromise = isPromise(f);

							if (!fIsPromise) {
								${resolveFilterVal}
							}

							if (!f) {
								break;
							}
						}
					}
				`;
			}
		}

		let fnCountHelper = '';

		if (p.from) {
			fnCountHelper += _string.ws`
				if (from === 0) {
					return;
				}

				from--;
			`;
		}

		if (p.count) {
			fnCountHelper += _string.ws`
				if (j === count) {
					return;
				}

				j++;
			`;
		}

		iFn += _string.ws`
			if (fIsPromise) {
				f = f.then(function (f) {
					${resolveFilterVal}

					if (f) {
						${fnCountHelper}
						return baseCb(${cbArgs});
					}
				});

				res = f;

			} else if (f) {
				${fnCountHelper}
				res = baseCb(${cbArgs});
			}
		`;

		if (needParallel) {
			iFn += _string.ws`
				if (maxParallelIsNumber) {
					ctx['${parallelFn}'](maxParallel, new Promise((r) => r(res)));

				} else {
					ctx['${parallelFn}'](new Promise((r) => r(res)));
				}
			`;
		} else {
			iFn += 'return res;';
		}

		iFn += '};';
	}

	if (needCtx) {
		iFn += _string.ws`
			var ctx = {
				$: {},
				info: {
					filters: filters.slice(0),
					mult: ${p.mult},
					startIndex: startIndex,
					endIndex: endIndex,
					from: from,
					count: count,
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
				},

				true: TRUE,
				false: FALSE,

				length: o.cbLength,
				childResult: childResult,
				onError: onError,

				get result() {
					return p.result;
				},

				set result(value) {
					p.result = value;
				},

				get value() {
					return yieldVal;
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

				get id() {
					return id;
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

			var fCtx = Object.create(ctx);
			fCtx.length = o.fLength;
		`;

		if (isAsync) {
			iFn += _string.ws`
				ctx.thread = thread;
				thread.ctx = ctx;

				var
					parallelI = 0,
					raceI = 0,
					waiting = false;

				var
					waitStore = new Set(),
					raceStore = new Set();

				childResult = [];
				function waitFactory(store, max, promise) {
					function end(err) {
						parallelI && parallelI--;
						thread.pause && ctx.next();
					}

					if (promise) {
						parallelI++;

						if (parallelI >= max) {
							ctx.yield();
						}

						waitFactory(store, promise).then(end, function (err) {
							if (err && err.type === 'CollectionThreadDestroy') {
								end();
							}
						});

						return promise;
					}

					if (!isPromise(promise = max)) {
						promise = typeof promise.next === 'function' ? promise.next() : promise();
					}

					ctx.child(promise);
					store.add(promise);

					promise.then(
						function (res) {
							if (store.has(promise)) {
								childResult.push(res);
								store.delete(promise);
							}

							if (waiting) {
								ctx.next();
							}
						},

						function (err) {
							if (err && err.type === 'CollectionThreadDestroy') {
								store.delete(promise);
								return;
							}

							onError(err);
						}
					);

					return promise;
				}

				ctx.yield = function (opt_val) {
					yielder = true;
					yieldVal = opt_val;
					return true;
				};

				ctx.next = function (opt_val) {
					thread.next(opt_val);
					return true;
				};

				ctx.child = function (obj) {
					if (!obj.thread) {
						return false;
					}

					thread.children.push(obj.thread);
					return true;
				};

				ctx.race = function (max, promise) {
					if (!promise) {
						promise = max;
						max = 1;
					}

					waitFactory(raceStore, promise).then(function () {
						if (raceI < max) {
							raceI++;

							if (raceI === max) {
								raceI = 0;
								raceStore.clear();
							}
						}
					});

					return promise;
				};

				ctx.wait = function (max, promise) {
					return waitFactory(waitStore, max, promise);
				};

				ctx.sleep = function (time, opt_test, opt_interval) {
					ctx.yield();
					return new Promise(function (resolve, reject) {
						var
							sleep = thread.sleep;

						if (sleep != null) {
							sleep.resume();
						}

						sleep = thread.sleep = {
							resume: function () {
								clearTimeout(sleep.id);
								thread.sleep = null;
								resolve();
							},

							id: setTimeout(function () {
								if (opt_test) {
									try {
										thread.sleep = null;
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
				};
			`;
		} else {
			iFn += _string.ws`
				ctx.yield = ctx.next = ctx.child = ctx.race = ctx.wait = ctx.sleep = o.notAsync;
			`;
		}
	}

	let threadStart = '',
	    threadEnd = '';

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

			if (time > priority[thread.priority]) {
				yield;
				time = 0;
				timeStart = null;
			}
		`;
	}

	iFn += 'while (limit !== looper) {';

	const yielder = _string.ws`
		if (yielder) {
			yielder = false;
			thread.pause = true;
			yieldVal = yield yieldVal;
		}
	`;

	const asyncWait = _string.ws`
		waiting = true;

		while (waitStore.size) {
			thread.pause = true;
			yield;
		}

		while (raceStore.size) {
			thread.pause = true;
			yield;
		}
	`;

	let indexLimits = '';

	if (p.startIndex) {
		indexLimits = _string.ws`
			if (n < startIndex) {
				${threadEnd}
				continue;
			}
		`;
	}

	if (p.endIndex) {
		indexLimits += _string.ws`
			if (n > endIndex) {
				${threadEnd}
				break;
			};
		`;
	}

	const defArgs = maxArgsLength || isAsync;

	switch (p.type) {
		case 'array':
			iFn += _string.ws`
				var
					clone = data,
					dLength = data.length - 1,
					slice = IGNORE.slice;
			`;

			if (p.reverse) {
				iFn += 'clone = slice.call(clone).reverse();';
			}

			if ((p.reverse || !p.live) && (p.startIndex || p.endIndex)) {
				iFn += _string.ws`
					clone = slice.call(clone, startIndex, endIndex || data.length);
				`;
			}

			if (!p.reverse && p.live) {
				iFn += _string.ws`
					for (n = startIndex - 1; ++n < clone.length;) {
						${threadStart}
						i = n;
						${indexLimits}
				`;
			} else {
				iFn += _string.ws`
					length = clone.length;
					for (n = -1; ++n < length;) {
						${threadStart}
						i = n + startIndex;
				`;
			}

			if (defArgs) {
				if (maxArgsLength > 1) {
					if (p.startIndex) {
						iFn += `key = ${p.reverse ? 'dLength - (' : ''} n + startIndex ${p.reverse ? ')' : ''};`;
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
			iFn += _string.ws`
				var
					selfHasOwn = data.hasOwnProperty,
					hasOwnProperty = IGNORE.hasOwnProperty;
			`;

			if (p.reverse || _hacks.OBJECT_KEYS_NATIVE_SUPPORT && !p.notOwn) {
				iFn += 'var tmpArray;';

				if (!p.notOwn && _hacks.OBJECT_KEYS_NATIVE_SUPPORT && !isAsync) {
					iFn += 'tmpArray = Object.keys(data);';
				} else {
					iFn += 'tmpArray = [];';

					if (p.notOwn) {
						if (p.notOwn === -1) {
							iFn += _string.ws`
								for (key in data) {
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
								for (key in data) {
									${threadStart}
									tmpArray.push(key);
									${threadEnd}
								}
							`;
						}
					} else {
						iFn += _string.ws`
							for (key in data) {
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

				if (p.startIndex || p.endIndex) {
					iFn += `tmpArray = tmpArray.slice(startIndex, endIndex || tmpArray.length);`;
				}

				iFn += _string.ws`
					length = tmpArray.length;
					for (n = -1; ++n < length;) {
						${threadStart}
						key = tmpArray[n];

						if (key in data === false) {
							${threadEnd}
							continue;
						}

						i = n + startIndex;
				`;
			} else {
				iFn += _string.ws`
					for (key in data) {
						${threadStart}
				`;

				if (p.notOwn === false) {
					iFn += _string.ws`
						if (!(selfHasOwn ? data.hasOwnProperty(key) : hasOwnProperty.call(data, key))) {
							${threadEnd}
							break;
						}`;
				} else if (p.notOwn === -1) {
					iFn += _string.ws`
						if (selfHasOwn ? data.hasOwnProperty(key) : hasOwnProperty.call(data, key)) {
							${threadEnd}
							continue;
						}`;
				}

				iFn += _string.ws`
					n++;
					i = n;
					${indexLimits}
				`;
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

			iFn += _string.ws`
				${p.reverse ? 'var tmpArray = [];' : ''}

				for (
					key = cursor.next(), brkIf = ('done' in key === false);
					'done' in key ? !key.done : key;
					key = cursor.next()
				) {
					${threadStart}
			`;

			if (p.reverse) {
				iFn += "el = 'value' in key ? key.value : key;";

				if (needParallel) {
					iFn += _string.ws`
						if (maxParallelIsNumber) {
							if (isPromise(el)) {
								ctx['${parallelFn}'](maxParallel, el);
							}

							${yielder}
						}
					`;
				}

				iFn += _string.ws`
						if (el !== IGNORE) {
							if (brkIf && el === null) {
								${threadEnd}
								break;
							}

							tmpArray.push(el);
						}

						${threadEnd}
					}

					${asyncWait}
					tmpArray.reverse();
					var size = tmpArray.length;
				`;

				if (p.startIndex || p.endIndex) {
					iFn += `tmpArray = tmpArray.slice(startIndex, endIndex || tmpArray.length);`;
				}

				iFn += _string.ws`
					length = size;
					for (n = -1; ++n < length;) {
						${threadStart}
						${defArgs ? 'key = tmpArray[n];' : ''}
						i = n + startIndex;
				`;
			} else {
				iFn += _string.ws`
					${defArgs ? `key = 'value' in key ? key.value : key;` : ''}
					n++;
					i = n;
					${indexLimits}
				`;
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

	if (needCtx) {
		iFn += 'id++;';
	}

	if (p.count) {
		iFn += _string.ws`
			if (j === count) {
				${threadEnd}
				break;
			}
		`;
	}

	let tmp = '';

	if (!isAsync) {
		if (fLength) {
			if (fLength < 5) {
				for (let i = 0; i < fLength; i++) {
					iFn += _string.ws`
						if (${i ? 'f' : 'true'}) {
							f = filters[${i}](${filterArgs[i]});
							${resolveFilterVal}
						}
					`;
				}
			} else {
				iFn += _string.ws`
					for (fI = -1; ++fI < fLength;) {
						f = ${callCycleFilter};
						${resolveFilterVal}

						if (!f) {
							break;
						}
					}
				`;
			}

			iFn += 'if (f) {';
		}

		if (p.count) {
			tmp += 'j++;';
		}
	}

	tmp += `r = cb(${cbArgs});`;

	if (!p.mult) {
		tmp += 'breaker = true;';
	}

	if (isAsync) {
		tmp += _string.ws`
			while (isPromise(r)) {
				if (!rCbSet.has(r)) {
					rCbSet.add(r);
					r.then(resolveCb, onError);
				}

				thread.pause = true;
				yield;
			}
		`;
	}

	if (!isAsync && p.from) {
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

	if (!isAsync && fLength) {
		iFn += '}';
	}

	if (isAsync) {
		iFn += yielder;
	}

	if (!p.live && !p.reverse && isMapSet) {
		iFn += _string.ws`
			size--;

			if (!size) {
				${threadEnd}
				break;
			}
		`;
	}

	iFn += _string.ws`
			${threadEnd}

			if (breaker) {
				break;
			}
		}

		breaker = false;
		looper++;

		if (onIterationEnd) {
			onIterationEnd(${needCtx ? 'ctx' : ''});
		}
	`;

	if (isAsync) {
		iFn += yielder;
	}

	iFn += '}';
	if (isAsync && needCtx) {
		iFn += asyncWait;
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
				} catch (_) {}
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