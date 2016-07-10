'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

import { tmpCycle } from '../consts/cache';
import { ws } from '../helpers/string';
import { STRUCT_OPT } from '../helpers/structs';
import { OBJECT_KEYS_NATIVE_SUPPORT } from '../consts/hacks';

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
 * Compiles a cycle by the specified parameters
 *
 * @param {string} key - cache key
 * @param {!Object} p - compile parameters
 * @return {!Function}
 */
export function compileCycle(key, p) {
	const isMapSet = {'map': true, 'set': true}[p.type];
	const cantModI = (isMapSet && STRUCT_OPT) || (
		p.type !== 'array' && (
			(p.type === 'object' && (p.notOwn || !OBJECT_KEYS_NATIVE_SUPPORT)) ||
			(!p.reverse && (p.type !== 'object' || !OBJECT_KEYS_NATIVE_SUPPORT || p.notOwn))
		)
	);

	let iFn = ws`
		var 
			that = this,
			data = o.data,
			cb = o.cb,
			filters = o.filters,
			link = o.link,
			onIterationEnd = o.onIterationEnd,
			onComplete = o.onComplete;
	`;

	const pop = ws`
		if (${p.thread}) {
			link.self.result = o.inject;
		}

		that._stack.pop();
	`;

	const push = ws`
		that._stack.push(ctx);
	`;

	iFn += ws`
		var
			wait = 0,
			onGlobalComplete,
			onGlobalError;

		var
			i = -1,
			j = 0;

		var
			n = null,
			breaker = false;

		var
			results = [],
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
			length,
			f;

		var
			TRUE = this.TRUE,
			FALSE = this.FALSE,
			NULL = this.NULL;

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
			notOwn: ${p.notOwn},
			inverseFilter: ${p.inverseFilter},
			type: '${p.type}',
			thread: ${p.thread}
		};

		var ctx = {
			$: $,
			info: info,
			inject: o.inject,

			yield: function (opt_val) {
				if (${!p.thread}) {
					return false;
				}

				yielder = true;
				yieldVal = opt_val;

				return true;
			},

			get next() {
				if (${!p.thread}) {
					return false;
				}

				link.self.next();
				return true;
			},

			sleep: function (time, opt_test, opt_interval) {
				if (${!p.thread}) {
					return false;
				}

				ctx.yield();
				link.self.sleep = setTimeout(function () {
					if (opt_test) {
						${push}
						var test = opt_test.call(that);
						${pop}

						if (test) {
							link.self.next();

						} else if (opt_interval) {
							ctx.sleep(time, opt_test, opt_interval);
						}

					} else {
						link.self.next();
					}
				}, time);

				return link.self.sleep;
			},

			wait: function (promise) {
				var thread = promise.thread;

				if (!thread || !thread.thread) {
					results.push(thread);

					if (!wait) {
						if (onGlobalComplete) {
							onGlobalComplete.call(that, results);
							onGlobalComplete = null;
						}

						results = [];
					}

					return false;
				}

				ctx.yield();
				wait++;

				var onComplete = thread.onComplete;
				thread.onComplete = function (res) {
					if (wait) {
						wait--;
					}

					results.push(res);
					${push}

					if (onComplete) {
						onComplete.call(that, res);
					}

					if (!wait) {
						yielder = false;
						if (onGlobalComplete) {
							onGlobalComplete.call(that, results);
							onGlobalComplete = null;
						}

						results = [];
						${pop}

						if (!yielder) {
							ctx.next;
						}

					} else {
						${pop}
					}
				};

				return promise.catch(function (err) {
					if (onGlobalError) {
						onGlobalError.call(that, err);
						onGlobalError = null;
					}
				});
			},

			get complete() {
				return new Promise(function (resolve, reject) {
					if (!wait) {
						resolve(that, results);
						results = [];
						return false;
					}

					onGlobalComplete = resolve;
					onGlobalError = reject;
				});
			},

			jump: function (val) {
				if (${cantModI}) {
					return false;
				}

				n = val - 1;
				return n;
			},

			i: function (val) {
				if (${cantModI}) {
					return false;
				}

				n += val;
				return n;
			},

			get reset() {
				breaker = true;
				limit++;
				return true;
			},

			get break() {
				breaker = true;
				return true;
			}
		};

		var cbCtx = {
			$: $,
			info: info,
			inject: o.inject,
			ctx: ctx,
			length: o.cbLength,
			TRUE: TRUE,
			FALSE: FALSE
		};

		var filterCtx = {
			$: $,
			info: info,
			inject: o.inject,
			ctx: ctx,
			length: o.fLength,
			TRUE: TRUE,
			FALSE: FALSE
		};
	`;

	if (p.thread) {
		iFn += 'ctx.thread = link.self;';
	}

	p.startIndex = p.startIndex || 0;

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
				${push}
				timeStart = new Date().valueOf();
			}
		`;

		threadEnd = ws`
			timeEnd = new Date().valueOf();
			time += timeEnd - timeStart;
			timeStart = timeEnd;

			if (time > this._priority[link.self.priority]) {
				${pop}
				yield n;
				time = 0;
				timeStart = null;
			}
		`;

	} else {
		iFn += push;
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

			if ((p.reverse || !p.live) && (p.startIndex || p.endIndex !== false)) {
				iFn += ws`
					clone = arr.slice.call(clone, ${p.startIndex}, ${p.endIndex !== false ? p.endIndex + 1 : 'data.length'});
				`;
			}

			if (!p.reverse && p.live) {
				iFn += `for (n = ${p.startIndex - 1}; ++n < clone.length;) {`;

				if (p.startIndex) {
					iFn += ws`
						if (n < ${p.startIndex}) {
							continue;
						}
					`;
				}

				if (p.endIndex !== false) {
					iFn += ws`
						if (n > ${p.endIndex}) {
							break;
						};
					`;
				}

			} else {
				iFn += ws`
					length = clone.length;
					for (n = -1; ++n < length;) {
				`;
			}

			if (maxArgsLength) {
				if (maxArgsLength > 1) {
					if (p.startIndex) {
						iFn += `key = ${p.reverse ? 'dLength - (' : ''} n + ${p.startIndex + (p.reverse ? ')' : '')};`;

					} else {
						iFn += `key = ${p.reverse ? 'dLength - ' : ''} n;`;
					}
				}

				iFn += 'el = clone[n];';

				if (maxArgsLength > 3) {
					iFn += `i = cbCtx.i = filterCtx.i = n + ${p.startIndex};`;
				}
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
									continue;
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

				if (p.startIndex || p.endIndex !== false) {
					iFn += `tmpArray = tmpArray.slice(${p.startIndex}, ${p.endIndex !== false ? p.endIndex + 1 : 'tmpArray.length'});`;
				}

				iFn += ws`
					length = tmpArray.length;
					for (n = -1; ++n < length;) {
						key = tmpArray[n];

						if (key in data === false) {
							continue;
						}

						${maxArgsLength > 3 ? `i = cbCtx.i = filterCtx.i = n + ${p.startIndex};` : ''}
				`;

			} else {
				iFn += ws`
					for (key in data) {
						${p.notOwn === false ?
							`if (!data.hasOwnProperty(key)) {
								break;
							}` : p.notOwn === -1 ?

							`if (data.hasOwnProperty(key)) {
								continue;
							}` : ''
						}

						${maxArgsLength > 3 || p.startIndex || p.endIndex !== false ? 'cbCtx.i = filterCtx.i = ++i' : ''};
				`;

				if (p.startIndex) {
					iFn += ws`
						if (i < ${p.startIndex}) {
							continue;
						}
					`;
				}

				if (p.endIndex !== false) {
					iFn += ws`
						if (i > ${p.endIndex}) {
							break;
						};
					`;
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
			if (isMapSet && STRUCT_OPT) {
				iFn += ws`
					var
						tmpArray = data._keys,
						skip = 0;
				`;

				if (!p.live && !p.reverse) {
					iFn += 'var size = data.size;';
				}

				if (!p.live) {
					iFn += 'tmpArray = tmpArray.slice();';
				}

				if (p.reverse) {
					if (p.live) {
						iFn += 'tmpArray = tmpArray.slice().reverse();';

					} else {
						iFn += 'tmpArray.reverse();';
					}
				}

				iFn += ws`
					length = tmpArray.length;
					for (n = ${p.startIndex - 1}; ++n < ${!p.reverse && p.live ? 'tmpArray.length' : 'length'};) {
						key = tmpArray[n];

						if (key === NULL) {
							skip++;
							continue;
						}

						i = cbCtx.i = filterCtx.i = n - skip;
				`;

				if (p.startIndex) {
					iFn += ws`
						if (i < ${p.startIndex}) {
							continue;
						}
					`;
				}

				if (p.endIndex !== false) {
					iFn += ws`
						if (i > ${p.endIndex}) {
							break;
						};
					`;
				}

			} else {
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

					if (p.startIndex || p.endIndex !== false) {
						iFn += `tmpArray = tmpArray.slice(${p.startIndex}, ${p.endIndex !== false ? p.endIndex + 1 : 'tmpArray.length'});`;
					}

					iFn += ws`
						length = tmpArray.length;
						for (n = -1; ++n < length;) {
							${maxArgsLength ? 'key = tmpArray[n];' : ''}
							i = cbCtx.i = filterCtx.i = n + ${p.startIndex};
					`;

				} else {
					gen();

					iFn += ws`
						for (key = cursor.next(); !key.done; key = cursor.next()) {
							${maxArgsLength ? 'key = key.value;' : ''}
							cbCtx.i = filterCtx.i = ++i;
					`;

					if (p.startIndex) {
						iFn += ws`
							if (i < ${p.startIndex}) {
								continue;
							}
						`;
					}

					if (p.endIndex !== false) {
						iFn += ws`
							if (i > ${p.endIndex}) {
								break;
							};
						`;
					}
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
		iFn += ws`
			if (j === ${p.count}) {
				break;
			}
		`;
	}

	if (p.filter.length) {
		iFn += 'if (';

		for (let i = 0; i < p.filter.length; i++) {
			iFn += `(${p.inverseFilter ? '!' : ''}(f = filters[${i}]${p.this ? '.call(this' : '('}`;

			if (p.this && filterArgs[i].length) {
				iFn += ',';
			}

			iFn += `${filterArgs[i]})) || f === ${p.inverseFilter ? 'FALSE' : 'TRUE'})`;

			if (i !== p.filter.length - 1) {
				iFn += '&&';
			}
		}

		iFn += ') {';
	}

	const
		cbCall = `cb${p.this ? '.call(this' : '('}${p.this && cbArgs.length ? ',' : ''}${cbArgs})`;

	let tmp;
	if (p.mult) {
		if (p.return) {
			tmp = `if (${cbCall} === FALSE) { breaker = true; }`;

		} else {
			tmp = `${cbCall};`;
		}

	} else {
		tmp = `${cbCall}; breaker = true;`;
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
			${pop}
			yielder = false;

			if (link.self) {
				link.self.pause = true;

			} else {
				link.pause = true;
			}

			yield yieldVal;

			link.self.pause = false;
			delete link.pause;

			yieldVal = void 0;
			${push}
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

	iFn += ws`
			if (breaker) {
				break;
			}

			${threadEnd}
		}

		breaker = false;
		looper++;

		if (onIterationEnd) {
			onIterationEnd.call(this, this.result);
		}
	`;

	if (p.thread) {
		iFn += yielder;
	}

	iFn += ws`
		}

		${pop}

		if (onComplete) {
			onComplete.call(this, o.inject);
		}

		return o.inject;
	`;

	if (p.thread) {
		tmpCycle[key] = eval(ws`(function *(o) { ${iFn} })`);

	} else {
		tmpCycle[key] = Function('o', iFn);
	}

	return tmpCycle[key];
}
