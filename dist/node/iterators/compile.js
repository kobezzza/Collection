'use strict';
/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compileCycle = compileCycle;
exports.returnCache = returnCache;

var _core = _interopRequireDefault(require("../core"));

var _string = require("../helpers/string");

var _types = require("../helpers/types");

var _cache = require("../consts/cache");

var _env = require("../consts/env");

var _symbols = require("../consts/symbols");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let cacheTimer;
const cycles = _core.default.cache.str;
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
const asyncIterators = {
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
  const isMapSet = _types.mapSet[p.type];
  const cantModI = !(p.type === 'array' || p.reverse || p.type === 'object' && p.notOwn && _env.OBJECT_KEYS_NATIVE_SUPPORT);
  const cbArgs = cbArgsList.slice(0, p.length ? p.cbArgs : cbArgsList.length),
        filterArgs = [],
        fLength = p.filter.length;
  const needParallel = p.parallel || p.race,
        parallelFn = p.parallel ? 'wait' : 'race';
  const maxArgsLength = p.length ? Math.max.apply(null, [].concat(p.cbArgs, p.filterArgs)) : cbArgsList.length,
        needCtx = maxArgsLength > 3 || needParallel || p.thread;

  for (let i = 0; i < fLength; i++) {
    filterArgs.push(filterArgsList.slice(0, p.length ? p.filterArgs[i] : filterArgsList.length));
  }

  const resolveFilterVal = 'f = f && f !== FALSE || f === TRUE;',
        resolveFilterValCb = `${p.inverseFilter ? '!' : ''}f && f !== FALSE || f === TRUE`,
        callCycleFilter = `filters[fI](${filterArgsList.slice(0, p.length ? maxArgsLength : filterArgsList.length)})`;
  let iFn = (0, _string.ws)`
		var
			data = o.data,
			cb = o.cb,
			baseCb = cb,
			filters = o.filters;

		var
			count = o.count,
			from = o.from,
			startIndex = o.startIndex || 0,
			endIndex = o.endIndex !== false ? o.endIndex : 0;

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
    if (p.withProto) {
      iFn += (0, _string.ws)`
				var
					_getProto = Object.getPrototypeOf,
					_getDescriptor = Object.getOwnPropertyDescriptor;

				function getDescriptor(obj, key) {
					while (obj) {
						var
							desc = _getDescriptor(obj, key);

						if (desc) {
							return desc;
						}

						obj = _getProto(obj);
					}
				}
			`;
    } else {
      iFn += 'var getDescriptor = Object.getOwnPropertyDescriptor;';
    }
  } //#if iterators/async


  if (p.async) {
    iFn += (0, _string.ws)`
			var
				priorities = o.priorities,
				maxParallel = o.maxParallel,
				maxParallelIsNumber = typeof maxParallel === 'number';

			var
				done,
				timeStart,
				timeEnd,
				time = 0;

			var
				thread = o.self,
				thread = o.self,
				yielder = false,
				yieldVal;

			function isPromise(obj) {
				return obj && typeof obj.then === 'function' && typeof obj.catch === 'function';
			}

			var
				rCbSet = new Set(),
				rElSet = new Set();

			function resolveCb(res) {
				rCbSet.delete(r);
				r = res;
				thread.next();
			}

			function resolveEl(res) {
				rElSet.delete(r);
				el = res;
				thread.next();
			}

			cb = function (${cbArgs}) {
				var
					f = ${fLength ? undefined : true},
					fIsPromise = !done && isPromise(el),
					res;

				if (el === IGNORE || done) {
					f = FALSE;
					return;
				}

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
          iFn += (0, _string.ws)`
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
        iFn += (0, _string.ws)`
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
      fnCountHelper += (0, _string.ws)`
				if (from !== 0) {
					from--;
					return;
				}
			`;
    }

    if (p.count) {
      fnCountHelper += (0, _string.ws)`
				if (j === count) {
					return;
				}

				j++;
			`;
    }

    if (!p.mult) {
      fnCountHelper += 'breaker = true;';
    }

    iFn += (0, _string.ws)`
			if (fIsPromise) {
				f = f.then(function (f) {
					${resolveFilterVal}

					if (${resolveFilterValCb}) {
						${fnCountHelper}
						return baseCb(${cbArgs});
					}
				});

				res = f;

			} else if (${resolveFilterValCb}) {
				${fnCountHelper}
				res = baseCb(${cbArgs});
			}
		`;

    if (needParallel) {
      //#if iterators/async
      iFn += (0, _string.ws)`
				if (maxParallelIsNumber) {
					ctx['${parallelFn}'](maxParallel, null, new Promise(function (r) { r(res); }));

				} else {
					ctx['${parallelFn}'](new Promise((r) => r(res)));
				}
			`; //#endif
    } else {
      iFn += 'return res;';
    }

    iFn += '};';
  } //#endif


  if (needCtx) {
    iFn += (0, _string.ws)`
			var ctx = {
				$: {},
				info: {
					filters: filters.slice(0),
					mult: ${p.mult},
					startIndex: startIndex,
					endIndex: o.endIndex,
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

				cursor: o.cursor,
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
			fCtx.length = o.fLength || o.cbLength;
		`;

    if (p.async) {
      //#if iterators/async
      iFn += (0, _string.ws)`
				ctx.thread = thread;
				thread.ctx = ctx;

				var
					parallelI = {null: {i: 0}},
					raceI = {null: {i: 0}},
					waiting = false;

				var
					waitStore = new Set(),
					raceStore = new Set();

				childResult = [];
				function waitFactory(store, max, label, promise) {
					if (!promise && label) {
						promise = label;
						label = null;
					}

					label = label || null;
					var parallel = parallelI[label] = parallelI[label] || {i: 0};
					parallel.max = max;

					function end(err) {
						parallel.i && parallel.i--;
						var canNext = true;

						for (var key in parallelI) {
							if (!parallelI.hasOwnProperty(key)) {
								break;
							}

							if (parallelI[key].i >= parallelI[key].max) {
								canNext = false;
								break;
							}
						}

						canNext && thread.pause && ctx.next();
					}

					if (promise) {
						parallel.i++;

						if (parallel.i >= parallel.max) {
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

				ctx.race = function (max, label, promise) {
					if (!promise) {
						promise = label || max;
						max = label != null ? max : 1;
						label = null;
					}

					label = label || null;
					var race = raceI[label] = raceI[label] || {i: 0};
					race.max = max;

					waitFactory(raceStore, promise).then(function () {
						if (race.i < race.max) {
							race.i++;

							if (race.i === race.max) {
								race.i = 0;
								raceStore.clear();
								done = true;
							}
						}
					});

					return promise;
				};

				ctx.wait = function (max, label, promise) {
					return waitFactory(waitStore, max, label, promise);
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
			`; //#endif
    } else {
      iFn += (0, _string.ws)`
				ctx.yield = ctx.next = ctx.child = ctx.race = ctx.wait = ctx.sleep = o.notAsync;
			`;
    }
  }

  let threadStart = '',
      threadEnd = ''; //#if iterators/async
  //#if iterators/thread

  if (p.async && p.thread) {
    threadStart = (0, _string.ws)`
			if (timeStart == null) {
				timeStart = new Date().valueOf();
			}
		`;
    threadEnd = (0, _string.ws)`
			timeEnd = new Date().valueOf();
			time += timeEnd - timeStart;
			timeStart = timeEnd;

			if (time > priorities[thread.priority]) {
				yield;
				time = 0;
				timeStart = null;
			}
		`;
  } //#endif
  //#endif


  iFn += 'while (limit !== looper) {';
  let yielder = '',
      asyncWait = ''; //#if iterators/async

  if (p.async) {
    iFn += 'done = false;';
    yielder = (0, _string.ws)`
			if (yielder) {
				yielder = false;
				thread.pause = true;
				yieldVal = yield yieldVal;
			}
		`;

    if (needCtx) {
      asyncWait = (0, _string.ws)`
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
    }
  } //#endif


  let indexLimits = '';

  if (p.startIndex) {
    indexLimits = (0, _string.ws)`
			if (n < startIndex) {
				${threadEnd}
				continue;
			}
		`;
  }

  if (p.endIndex) {
    indexLimits += (0, _string.ws)`
			if (n > endIndex) {
				${threadEnd}
				break;
			};
		`;
  }

  const defArgs = maxArgsLength || p.async;

  switch (p.type) {
    case 'array':
      iFn += (0, _string.ws)`
				var
					clone = data,
					dLength = data.length - 1,
					slice = IGNORE.slice;
			`;

      if (p.reverse) {
        iFn += 'clone = slice.call(clone).reverse();';
      }

      if ((p.reverse || !p.live) && (p.startIndex || p.endIndex)) {
        iFn += (0, _string.ws)`
					clone = slice.call(clone, startIndex, endIndex ? endIndex + 1 : data.length);
				`;
      }

      if (!p.reverse && p.live) {
        iFn += (0, _string.ws)`
					for (n = startIndex - 1; ++n < clone.length;) {
						${threadStart}
						i = n;
						${indexLimits}
				`;
      } else {
        iFn += (0, _string.ws)`
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
      iFn += (0, _string.ws)`
				var
					selfHasOwn = data.hasOwnProperty,
					hasOwnProperty = IGNORE.hasOwnProperty;
			`;

      if (p.reverse || _env.OBJECT_KEYS_NATIVE_SUPPORT && !p.notOwn) {
        iFn += 'var tmpArray;';

        if (!p.notOwn && _env.OBJECT_KEYS_NATIVE_SUPPORT && !p.async) {
          iFn += 'tmpArray = Object.keys(data);';
        } else {
          iFn += 'tmpArray = [];';

          if (p.notOwn) {
            if (p.notOwn === -1) {
              iFn += (0, _string.ws)`
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
              iFn += (0, _string.ws)`
								for (key in data) {
									${threadStart}
									tmpArray.push(key);
									${threadEnd}
								}
							`;
            }
          } else {
            iFn += (0, _string.ws)`
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
          iFn += `tmpArray = tmpArray.slice(startIndex, endIndex ? endIndex + 1 : tmpArray.length);`;
        }

        iFn += (0, _string.ws)`
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
        iFn += (0, _string.ws)`
					for (key in data) {
						${threadStart}
				`;

        if (p.notOwn === false) {
          iFn += (0, _string.ws)`
						if (!(selfHasOwn ? data.hasOwnProperty(key) : hasOwnProperty.call(data, key))) {
							${threadEnd}
							break;
						}`;
        } else if (p.notOwn === -1) {
          iFn += (0, _string.ws)`
						if (selfHasOwn ? data.hasOwnProperty(key) : hasOwnProperty.call(data, key)) {
							${threadEnd}
							continue;
						}`;
        }

        iFn += (0, _string.ws)`
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
        iFn += (0, _string.ws)`
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

      iFn += (0, _string.ws)`
				${p.reverse ? 'var tmpArray = [];' : ''}

				for (
					key = cursor.next(), brkIf = ('done' in key === false);
					'done' in key ? !key.done : key;
					key = cursor.next()
				) {
					${threadStart}
			`;
      let asyncIterator = ''; //#if iterators/async

      if (p.type === 'asyncIterator' || asyncIterators[p.type] && p.async) {
        asyncIterator = (0, _string.ws)`
					while (isPromise(el)) {
						if (!rElSet.has(el)) {
							rElSet.add(el);
							el.then(resolveEl, onError);
						}

						thread.pause = true;
						yield;
					}
				`;
      } //#endif


      if (p.reverse) {
        iFn += `el = 'value' in key ? key.value : key; ${asyncIterator}`; //#if iterators/async

        if (needParallel) {
          iFn += (0, _string.ws)`
						if (maxParallelIsNumber) {
							if (isPromise(el)) {
								ctx['${parallelFn}'](maxParallel, null, el);
							}

							${yielder}
						}
					`;
        } //#endif


        iFn += (0, _string.ws)`
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
          iFn += `tmpArray = tmpArray.slice(startIndex, endIndex ? endIndex + 1 : tmpArray.length);`;
        }

        iFn += (0, _string.ws)`
					length = size;
					for (n = -1; ++n < length;) {
						${threadStart}
						${defArgs ? 'key = tmpArray[n];' : ''}
						i = n + startIndex;
				`;
      } else {
        iFn += (0, _string.ws)`
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
          iFn += `el = key; ${asyncIterator}`;

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
    iFn += (0, _string.ws)`
			if (j === count) {
				${threadEnd}
				break;
			}
		`;
  }

  let tmp = '';

  if (!p.async) {
    if (fLength) {
      if (fLength < 5) {
        for (let i = 0; i < fLength; i++) {
          iFn += (0, _string.ws)`
						if (${i ? 'f' : 'true'}) {
							f = filters[${i}](${filterArgs[i]});
							${resolveFilterVal}
						}
					`;
        }
      } else {
        iFn += (0, _string.ws)`
					for (fI = -1; ++fI < fLength;) {
						f = ${callCycleFilter};
						${resolveFilterVal}

						if (!f) {
							break;
						}
					}
				`;
      }

      iFn += `if (${resolveFilterValCb}) {`;
    }

    if (p.count) {
      tmp += 'j++;';
    }
  }

  tmp += `r = cb(${cbArgs});`;

  if (!p.mult && !p.async) {
    tmp += 'breaker = true;';
  }

  let waitCb = ''; //#if iterators/async

  if (p.async) {
    waitCb = (0, _string.ws)`
			while (isPromise(r)) {
				if (!rCbSet.has(r)) {
					rCbSet.add(r);
					r.then(resolveCb, onError);
				}

				thread.pause = true;
				yield;
			}
		`;
    tmp += waitCb;
  } //#endif


  if (!p.async && p.from) {
    iFn += (0, _string.ws)`
			if (from !== 0) {
				from--;

			} else {
				${tmp}
			}
		`;
  } else {
    iFn += tmp;
  }

  if (!p.async && fLength) {
    iFn += '}';
  }

  iFn += yielder;

  if (!p.live && !p.reverse && isMapSet) {
    iFn += (0, _string.ws)`
			size--;

			if (!size) {
				${threadEnd}
				break;
			}
		`;
  }

  tmp = (0, _string.ws)`
		if (onIterationEnd) {
			onIterationEnd(${needCtx ? 'ctx' : ''});
		}
	`; //#if iterators/async

  if (p.async) {
    tmp = (0, _string.ws)`
			if (onIterationEnd) {
				r = onIterationEnd(${needCtx ? 'ctx' : ''});
				${waitCb}
			}
		`;
  } //#endif


  iFn += (0, _string.ws)`
			${threadEnd}

			if (breaker${p.async ? '|| done' : ''}) {
				break;
			}
		}

		breaker = false;
		looper++;

		${tmp}
	`;
  iFn += (0, _string.ws)`
			${yielder}
		}

		${asyncWait}

		if (onComplete) {
			${p.async ? 'done = true;' : ''}
			onComplete(p.result);
		}

		return p.result;
	`;

  if (p.async) {
    //#if iterators/async
    _cache.compiledCycles[key] = new Function(`return function *(o, p) { ${iFn} };`)(); //#endif
  } else {
    _cache.compiledCycles[key] = new Function('o', 'p', iFn);
  }

  if (_cache.LOCAL_CACHE && _core.default.ready) {
    const delay = 5e3,
          code = `${_symbols.NAMESPACE}.cache.cycle["${key}"] = ${_cache.compiledCycles[key].toString()};`;
    cycles[key] = code;

    if (_env.IS_BROWSER && _env.LOCAL_STORAGE_SUPPORT) {
      clearTimeout(cacheTimer);
      cacheTimer = setTimeout(() => {
        try {
          localStorage.setItem(_symbols.CACHE_KEY, JSON.stringify(cycles));
          localStorage.setItem(_symbols.CACHE_VERSION_KEY, _core.default.CACHE_VERSION);

          if (_env.BLOB_SUPPORT) {
            const script = document.createElement('script');

            for (const key in _cache.localCacheAttrs) {
              if (!_cache.localCacheAttrs.hasOwnProperty(key)) {
                continue;
              }

              const val = _cache.localCacheAttrs[key];
              script.setAttribute(key, val != null ? String(val) : '');
            }

            script.src = URL.createObjectURL(new Blob([code], {
              type: 'application/javascript'
            }));
            document.head.appendChild(script);
          }
        } catch {}
      }, delay);
    } else if (_env.IS_NODE) {
      //#if isNode
      clearTimeout(cacheTimer);
      cacheTimer = setTimeout(() => {
        require('fs').writeFile(require('path').join(__dirname, 'collection.tmp.js'), `
						exports.version = ${_core.default.CACHE_VERSION};
						exports.cache = ${JSON.stringify(cycles)};
						exports.exec = function () { ${returnCache(cycles)} };
					`, () => {});
      }, delay);
      cacheTimer['unref'](); //#endif
    }
  }

  return _cache.compiledCycles[key];
}