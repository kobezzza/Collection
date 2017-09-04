'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import $C from '../core';
import { tmpCycle } from '../consts/cache';
import { ws } from '../helpers/string';
import { OBJECT_KEYS_NATIVE_SUPPORT } from '../consts/hacks';
import { NAMESPACE, CACHE_VERSION, CACHE_KEY, CACHE_VERSION_KEY } from '../consts/base';
import { IS_NODE, IS_BROWSER, BLOB_SUPPORT, LOCAL_STORAGE_SUPPORT } from '../consts/hacks';

let timeout;
const
	cache = $C.cache.str;

/**
 * Returns a cache string by an object
 *
 * @param {?} cache - cache object
 * @return {string}
 */
export function returnCache(cache) {
	let text = '';

	for (const key in cache) {
		if (!cache.hasOwnProperty(key)) {
			continue;
		}

		text += cache[key];
	}

	return text;
}

const cbArgsList = [
	'el',
	'key',
	'data',
	'cbCtx'
];

const filterArgsList = [
	'el',
	'key',
	'data',
	'filterCtx'
];

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
export function compileCycle(key, p) {
	const
		isMapSet = mapSet[p.type],
		isAsync = p.thread || p.async;

	const cantModI = !(
		p.type === 'array' ||
		p.reverse ||
		p.type === 'object' && p.notOwn && OBJECT_KEYS_NATIVE_SUPPORT
	);

	const
		startIndex = p.startIndex || 0,
		endIndex = p.endIndex !== false ? p.endIndex + 1 : 0;

	const
		cbArgs = cbArgsList.slice(0, p.length ? p.cbArgs : cbArgsList.length),
		filterArgs = [];

	for (let i = 0; i < p.filter.length; i++) {
		filterArgs.push(filterArgsList.slice(0, p.length ? p.filterArgs[i] : filterArgsList.length));
	}

	const
		maxArgsLength = p.length ? Math.max.apply(null, [].concat(p.cbArgs, p.filterArgs)) : cbArgsList.length,
		needCtx = maxArgsLength > 3;

	let iFn = ws`
		var 
			data = o.data,
			cb = o.cb,
			filters = o.filters,
			priority = o.priority;

		var
			onIterationEnd = o.onIterationEnd,
			onComplete = o.onComplete,
			onError = o.onError;

		var
			TRUE = [],
			FALSE = [],
			IGNORE = o.IGNORE;

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
			childResult;

		var
			length,
			f,
			r;

		var
			el,
			key;

		var
			slice = TRUE.slice,
			hasOwnProperty = TRUE.hasOwnProperty;
	`;

	if (p.withDescriptor) {
		iFn = 'var getDescriptor = Object.getOwnPropertyDescriptor;';
	}

	if (isAsync) {
		iFn += ws`
			var
				timeStart,
				timeEnd,
				time = 0;

			var
				thread = o.self,
				yielder = false,
				yieldVal;

			function isPromise(obj) {
				return typeof Promise === 'function' && obj instanceof Promise;
			}

			function resolveEl(res) {
				el = res;
				thread.next();
			}

			function resolveCb(res) {
				r = res;
				thread.next();
			}

			function resolveFilter(res) {
				f = res;
				thread.next();
			}
		`;
	}

	if (needCtx) {
		iFn += ws`
			var ctx = {
				$: {},
				info: {
					filters: filters.slice(0),
					mult: ${p.mult},
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
				},

				true: TRUE,
				false: FALSE,

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
		`;

		if (isAsync) {
			iFn += ws`
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

				ctx.yield = function () {
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
			iFn += ws`
				ctx.yield = function () {
					return false;
				};

				ctx.next = function (opt_val) {
					return false;
				};

				ctx.child = function (obj) {
					return false;
				};

				ctx.race = function (max, promise) {
					return false;
				};

				ctx.wait = function (max, promise) {
					return false;
				};

				ctx.sleep = function (time, opt_test, opt_interval) {
					return false;
				};
			`;
		}

		iFn += ws`
			var cbCtx = Object.create(ctx);
			cbCtx.length = o.cbLength;

			var filterCtx = Object.create(ctx);
			filterCtx.length = o.fLength;
		`;
	}

	if (p.from) {
		iFn += `var from = ${p.from};`;
	}

	let
		threadStart = '',
		threadEnd = '',
		getEl = '';

	if (p.thread) {
		threadStart = ws`
			if (timeStart == null) {
				timeStart = new Date().valueOf();
			}
		`;

		threadEnd = ws`
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

	if (isAsync) {
		getEl = ws`
			while (isPromise(el)) {
				el = el.then(resolveEl, onError);
				thread.pause = true;
				yield;
			}

			if (el === IGNORE) {
				continue;
			}

			if (brkIf && el === null) {
				break;
			}
		`;
	}

	iFn += 'while (limit !== looper) {';

	const
		defArgs = maxArgsLength || isAsync;

	switch (p.type) {
		case 'array':
			iFn += ws`
				var
					clone = data,
					dLength = data.length - 1;
			`;

			if (p.reverse) {
				iFn += 'clone = slice.call(clone).reverse();';
			}

			if ((p.reverse || !p.live) && (startIndex || endIndex)) {
				iFn += ws`
					clone = slice.call(clone, ${startIndex}, ${endIndex || 'data.length'});
				`;
			}

			if (!p.reverse && p.live) {
				iFn += ws`
					for (n = ${startIndex - 1}; ++n < clone.length;) {
						i = n;
				`;

				if (startIndex) {
					iFn += ws`
						if (n < ${startIndex}) {
							continue;
						}
					`;
				}

				if (endIndex) {
					iFn += ws`
						if (n > ${endIndex}) {
							break;
						};
					`;
				}

			} else {
				iFn += ws`
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

			if (p.reverse || (OBJECT_KEYS_NATIVE_SUPPORT && !p.notOwn)) {
				iFn += 'var tmpArray;';

				if (!p.notOwn && OBJECT_KEYS_NATIVE_SUPPORT && !isAsync) {
					iFn += 'tmpArray = Object.keys(data);';

				} else {
					iFn += 'tmpArray = [];';

					if (p.notOwn) {
						if (p.notOwn === -1) {
							iFn += ws`
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
							iFn += ws`
								for (var key in data) {
									${threadStart}
									tmpArray.push(key);
									${threadEnd}
								}
							`;
						}

					} else {
						iFn += ws`
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

				iFn += ws`
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
					iFn += ws`
						if (!(selfHasOwn ? data.hasOwnProperty(key) : hasOwnProperty.call(data, key))) {
							break;
						}`
					;

				} else if (p.notOwn === -1) {
					iFn += ws`
						if (selfHasOwn ? data.hasOwnProperty(key) : hasOwnProperty.call(data, key)) {
							continue;
						}`
					;
				}

				iFn += ws`
					n++;
					i = n;
				`;

				if (startIndex) {
					iFn += ws`
						if (n < ${startIndex}) {
							continue;
						}
					`;
				}

				if (endIndex) {
					iFn += ws`
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
					iFn += ws`
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
				iFn += ws`
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

				iFn += ws`
					length = tmpArray.length;
					for (n = -1; ++n < length;) {
						${defArgs ? 'key = tmpArray[n];' : ''}
						i = n + ${startIndex};
				`;

			} else {
				gen();

				iFn += ws`
					for (key = cursor.next(); 'done' in key ? !key.done : key; key = cursor.next()) {
						brkIf = 'done' in key === false;
						${defArgs ? `key = 'value' in key ? key.value : key;` : ''}
						n++;
						i = n;
				`;

				if (startIndex) {
					iFn += ws`
						if (n < ${startIndex}) {
							continue;
						}
					`;
				}

				if (endIndex) {
					iFn += ws`
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
		iFn += ws`
			if (j === ${p.count}) {
				break;
			}
		`;
	}

	iFn += getEl;
	if (p.filter.length) {
		for (let i = 0; i < p.filter.length; i++) {
			iFn += ws`
				if (f === undefined || f === true) {
					f = filters[${i}](${filterArgs[i]});
			`;

			if (isAsync) {
				iFn += ws`
					while (isPromise(f)) {
						f.then(resolveFilter, onError);
						thread.pause = true;
						yield;
					}
				`;
			}

			iFn += ws`
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
		tmp += ws`
			while (isPromise(r)) {
				r.then(resolveCb, onError);
				thread.pause = true;
				yield;
			}
		`;
	}

	if (p.count) {
		tmp += 'j++;';
	}

	if (p.from) {
		iFn += ws`
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

	const yielder = ws`
		if (yielder) {
			yielder = false;
			thread.pause = true;
			yieldVal = yield yieldVal;
		}
	`;

	if (isAsync) {
		iFn += yielder;
	}

	if (!p.live && !p.reverse && isMapSet) {
		iFn += ws`
			size--;

			if (!size) {
				break;
			}
		`;
	}

	if (p.filter.length) {
		iFn += 'f = undefined;';
	}

	iFn += ws`
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
	if (isAsync && needCtx) {
		iFn += ws`
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

	iFn += ws`
		if (onComplete) {
			onComplete(p.result);
		}

		return p.result;
	`;

	if (isAsync) {
		tmpCycle[key] = new Function(`return function *(o, p) { ${iFn} };`)();

	} else {
		tmpCycle[key] = new Function('o', 'p', iFn);
	}

	if ($C.ready) {
		const
			delay = 5e3;

		const text = `${NAMESPACE}.cache.cycle["${key}"] = ${tmpCycle[key].toString()};`;
		cache[key] = text;

		if (IS_BROWSER && LOCAL_STORAGE_SUPPORT) {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				try {
					localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
					localStorage.setItem(CACHE_VERSION_KEY, CACHE_VERSION);

					if (BLOB_SUPPORT) {
						const script = document.createElement('script');
						script.src = URL.createObjectURL(new Blob([text], {type: 'application/javascript'}));
						document.head.appendChild(script);
					}

				} catch (_) {}

			}, delay);

		} else if (IS_NODE) {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				require('fs').writeFile(
					require('path').join(__dirname, 'collection.tmp.js'),

					`
						exports.version = ${CACHE_VERSION};
						exports.cache = ${JSON.stringify(cache)};
						exports.exec = function () { ${returnCache(cache)} };
					`,

					() => {}
				);

			}, delay);
			timeout['unref']();
		}
	}

	return tmpCycle[key];
}
