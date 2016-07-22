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

/**
 * Compiles a loop by the specified parameters
 *
 * @param {string} key - cache key
 * @param {!Object} p - compile parameters
 * @return {!Function}
 */
export function compileCycle(key, p) {
	const isMapSet = {'map': true, 'set': true}[p.type];
	const cantModI = !(
		p.type === 'array' ||
		p.reverse ||
		p.type === 'object' && p.notOwn && OBJECT_KEYS_NATIVE_SUPPORT
	);

	let iFn = ws`
		var 
			data = o.data,
			cb = o.cb,
			filters = o.filters,
			link = o.link,
			priority = o.priority;

		var
			onIterationEnd = o.onIterationEnd,
			onComplete = o.onComplete,
			onError = o.onError,
			getDescriptor = Object.getOwnPropertyDescriptor;

		var
			TRUE = {},
			FALSE = {};

		var
			i = -1,
			j = 0,
			n = -1;

		var
			breaker = false,
			yielder = false,
			yieldVal;

		var
			timeStart,
			timeEnd,
			time = 0;

		var
			limit = 1,
			looper = 0;

		var
			waitResult = [],
			wait = 0;

		var
			length,
			f,
			r;

		var
			el,
			key;

		var
			arr = [],
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
			thread: ${p.thread},
			priority: ${p.thread} && '${p.priority}',
			length: ${p.length}
		};

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
				if (${!p.thread}) {
					return false;
				}

				yielder = true;
				yieldVal = opt_val;

				return true;
			},

			next: function (opt_val) {
				if (${!p.thread}) {
					return false;
				}

				link.self.next(opt_val);
				return true;
			},

			child: function (thread) {
				if (${!p.thread} || !thread.thread) {
					return false;
				}

				link.self.children.push(thread.thread);
				return true;
			},

			wait: function (promise) {
				if (${!p.thread}) {
					return false;
				}

				if (promise.thread) {
					ctx.child(promise);
				}

				wait++;
				return promise.then(function (res) {
					waitResult.push(res);
					wait--;
					ctx.next();
				}, onError);
			},

			sleep: function (time, opt_test, opt_interval) {
				if (${!p.thread}) {
					return false;
				}

				ctx.yield();
				return new Promise(function (resolve, reject) {
					link.self.sleep = setTimeout(function () {
						if (opt_test) {
							try {
								var test = opt_test(ctx);

								if (test) {
									resolve();
									ctx.next();

								} else if (opt_interval !== false) {
									ctx.sleep(time, opt_test, opt_interval).then(resolve, reject);
								}

							} catch (err) {
								reject(err);
								throw err;
							}

						} else {
							resolve();
							ctx.next();
						}
					}, time);
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

	if (p.thread) {
		iFn += ws`
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

			ctx.thread = link.self;
			link.self.ctx = ctx;
		`;
	}

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
		maxArgsLength = p.length ? Math.max.apply(null, [].concat(p.cbArgs, p.filterArgs)) : cbArgsList.length;

	if (p.from) {
		iFn += `var from = ${p.from};`;
	}

	let
		threadStart = '',
		threadEnd = '';

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

			if (time > priority[link.self.priority]) {
				yield;
				time = 0;
				timeStart = null;
			}
		`;
	}

	iFn += 'while (limit !== looper) {';

	switch (p.type) {
		case 'array':
			iFn += ws`
				var
					clone = data,
					dLength = data.length - 1;
			`;

			if (p.reverse) {
				iFn += 'clone = arr.slice.call(clone).reverse();';
			}

			if ((p.reverse || !p.live) && (startIndex || endIndex)) {
				iFn += ws`
					clone = arr.slice.call(clone, ${startIndex}, ${endIndex || 'data.length'});
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

			if (maxArgsLength || p.thread) {
				if (maxArgsLength > 1) {
					if (startIndex) {
						iFn += `key = ${p.reverse ? 'dLength - (' : ''} n + ${startIndex + (p.reverse ? ')' : '')};`;

					} else {
						iFn += `key = ${p.reverse ? 'dLength - ' : ''} n;`;
					}
				}

				iFn += 'el = clone[n];';
			}

			break;

		case 'object':
			if (p.reverse || (OBJECT_KEYS_NATIVE_SUPPORT && !p.notOwn)) {
				iFn += 'var tmpArray;';

				if (!p.notOwn && OBJECT_KEYS_NATIVE_SUPPORT && !p.thread) {
					iFn += 'tmpArray = Object.keys(data);';

				} else {
					iFn += 'tmpArray = [];';

					if (p.notOwn) {
						if (p.notOwn === -1) {
							iFn += ws`
								for (var key in data) {
									${threadStart}
									if (data.hasOwnProperty(key)) {
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
								if (!data.hasOwnProperty(key)) {
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
						if (!data.hasOwnProperty(key)) {
							break;
						}`
					;

				} else if (p.notOwn === -1) {
					iFn += ws`
						if (!data.hasOwnProperty(key)) {
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

						if ('next' in data) {
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

					for (var step = cursor.next(); !step.done; step = cursor.next()) {
						${threadStart}
						tmpArray.push(step.value);
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
						${maxArgsLength ? 'key = tmpArray[n];' : ''}
						i = n + ${startIndex};
				`;

			} else {
				gen();

				iFn += ws`
					for (key = cursor.next(); !key.done; key = cursor.next()) {
						${maxArgsLength ? 'key = key.value;' : ''}
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
		iFn += ws`
			if (j === ${p.count}) {
				break;
			}
		`;
	}

	if (p.thread) {
		iFn += ws`
			while (isPromise(el)) {
				el = el.then(resolveEl, onError);
				link.self.pause = true;
				yield;
			}
		`;
	}

	if (p.filter.length) {
		for (let i = 0; i < p.filter.length; i++) {
			iFn += ws`
				if (f === undefined || f === true) {
					f = filters[${i}](${filterArgs[i]});
			`;

			if (p.thread) {
				iFn += ws`
					while (isPromise(f)) {
						f.then(resolveFilter, onError);
						link.self.pause = true;
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

	if (p.thread) {
		tmp += ws`
			while (isPromise(r)) {
				r.then(resolveCb, onError);
				link.self.pause = true;
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
			link.self.pause = true;
			yield yieldVal;
			yieldVal = undefined;
		}
	`;

	if (p.thread) {
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

	if (p.thread) {
		iFn += yielder;
	}

	iFn += ws`
		}

		while (wait) {
			link.self.pause = true;
			yield;
		}

		if (onComplete) {
			onComplete(p.result);
		}

		return p.result;
	`;

	if (p.thread) {
		tmpCycle[key] = eval(`(function *(o, p) { ${iFn} })`);

	} else {
		tmpCycle[key] = Function('o', 'p', iFn);
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

				} catch (ignore) {}

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
