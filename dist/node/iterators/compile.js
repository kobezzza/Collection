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

/**
 * Compiles a loop by the specified parameters
 *
 * @param {string} key - cache key
 * @param {!Object} p - compile parameters
 * @return {!Function}
 */
function compileCycle(key, p) {
	const isMapSet = { 'map': true, 'set': true }[p.type];
	const cantModI = !(p.type === 'array' || p.reverse || p.type === 'object' && p.notOwn && _hacks.OBJECT_KEYS_NATIVE_SUPPORT);

	let iFn = _string.ws`
		var 
			that = this,
			data = o.data,
			cb = o.cb,
			filters = o.filters,
			link = o.link,
			onIterationEnd = o.onIterationEnd,
			onComplete = o.onComplete;

		var
			wait = 0,
			onGlobalComplete,
			onGlobalError;

		var
			i = -1,
			j = 0,
			n = -1;

		var
			results = [],
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
			startIndex: ${ p.startIndex },
			endIndex: ${ p.endIndex },
			from: ${ p.from },
			count: ${ p.count },
			live: ${ p.live },
			reverse: ${ p.reverse },
			notOwn: ${ p.notOwn },
			inverseFilter: ${ p.inverseFilter },
			type: '${ p.type }',
			thread: ${ p.thread }
		};

		var ctx = {
			$: $,
			info: info,
			get result() {
				return p.result;
			},

			yield: function (opt_val) {
				if (${ !p.thread }) {
					return false;
				}

				yielder = true;
				yieldVal = opt_val;

				return true;
			},

			get next() {
				if (${ !p.thread }) {
					return false;
				}

				link.self.next();
				return true;
			},

			sleep: function (time, opt_test, opt_interval) {
				if (${ !p.thread }) {
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
									link.self.next();

								} else if (opt_interval !== false) {
									ctx.sleep(time, opt_test, opt_interval).then(resolve, reject);
								}

							} catch (err) {
								reject(err);
								throw err;
							}

						} else {
							resolve();
							link.self.next();
						}
					}, time);
				});
			},

			wait: function (promise) {
				var thread = promise.thread;

				if (!thread || !thread.thread) {
					results.push(thread);

					if (!wait) {
						if (onGlobalComplete) {
							onGlobalComplete(results);
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
					that._stack.push(ctx);

					if (onComplete) {
						onComplete(res);
					}

					if (!wait) {
						yielder = false;
						if (onGlobalComplete) {
							onGlobalComplete(results);
							onGlobalComplete = null;
						}

						results = [];
						that._stack.pop();

						if (!yielder) {
							ctx.next;
						}

					} else {
						that._stack.pop();
					}
				};

				return promise.catch(function (err) {
					if (onGlobalError) {
						onGlobalError(err);
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
				if (${ cantModI }) {
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

				if (${ cantModI }) {
					return false;
				}

				n += val;
				i += val;

				return i;
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

		var cbCtx = Object.create(ctx);
		cbCtx.length = o.cbLength;

		var filterCtx = Object.create(ctx);
		filterCtx.length = o.fLength;
	`;

	if (p.thread) {
		iFn += _string.ws`
			ctx.thread = link.self;
			link.self.ctx = ctx;
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
		iFn += `var from = ${ p.from };`;
	}

	let threadStart = '',
	    threadEnd = '';

	if (p.thread) {
		threadStart = _string.ws`
			if (timeStart == null) {
				that._stack.push(ctx);
				timeStart = new Date().valueOf();
			}
		`;

		threadEnd = _string.ws`
			timeEnd = new Date().valueOf();
			time += timeEnd - timeStart;
			timeStart = timeEnd;

			if (time > this._priority[link.self.priority]) {
				that._stack.pop();
				yield n;
				time = 0;
				timeStart = null;
			}
		`;
	} else {
		iFn += 'that._stack.push(ctx);';
	}

	iFn += 'while (limit !== looper) {';

	switch (p.type) {
		case 'array':
			iFn += _string.ws`
				var
					clone = data,
					dLength = data.length - 1;
			`;

			if (p.reverse) {
				iFn += 'clone = arr.slice.call(clone).reverse();';
			}

			if ((p.reverse || !p.live) && (startIndex || endIndex)) {
				iFn += _string.ws`
					clone = arr.slice.call(clone, ${ startIndex }, ${ endIndex || 'data.length' });
				`;
			}

			if (!p.reverse && p.live) {
				iFn += _string.ws`
					for (n = ${ startIndex - 1 }; ++n < clone.length;) {
						i = n;
				`;

				if (startIndex) {
					iFn += _string.ws`
						if (n < ${ startIndex }) {
							continue;
						}
					`;
				}

				if (endIndex) {
					iFn += _string.ws`
						if (n > ${ endIndex }) {
							break;
						};
					`;
				}
			} else {
				iFn += _string.ws`
					length = clone.length;
					for (n = -1; ++n < length;) {
						i = n + ${ startIndex };
				`;
			}

			if (maxArgsLength) {
				if (maxArgsLength > 1) {
					if (startIndex) {
						iFn += `key = ${ p.reverse ? 'dLength - (' : '' } n + ${ startIndex + (p.reverse ? ')' : '') };`;
					} else {
						iFn += `key = ${ p.reverse ? 'dLength - ' : '' } n;`;
					}
				}

				iFn += 'el = clone[n];';
			}

			break;

		case 'object':
			if (p.reverse || _hacks.OBJECT_KEYS_NATIVE_SUPPORT && !p.notOwn) {
				iFn += 'var tmpArray;';

				if (!p.notOwn && _hacks.OBJECT_KEYS_NATIVE_SUPPORT && !p.thread) {
					iFn += 'tmpArray = Object.keys(data);';
				} else {
					iFn += 'tmpArray = [];';

					if (p.notOwn) {
						if (p.notOwn === -1) {
							iFn += _string.ws`
								for (var key in data) {
									${ threadStart }
									if (data.hasOwnProperty(key)) {
										continue;
									}

									tmpArray.push(key);
									${ threadEnd }
								}
							`;
						} else {
							iFn += _string.ws`
								for (var key in data) {
									${ threadStart }
									tmpArray.push(key);
									${ threadEnd }
								}
							`;
						}
					} else {
						iFn += _string.ws`
							for (var key in data) {
								${ threadStart }
								if (!data.hasOwnProperty(key)) {
									break;
								}

								tmpArray.push(key);
								${ threadEnd }
							}
						`;
					}
				}

				if (p.reverse) {
					iFn += 'tmpArray.reverse();';
				}

				if (startIndex || endIndex) {
					iFn += `tmpArray = tmpArray.slice(${ startIndex }, ${ endIndex || 'tmpArray.length' });`;
				}

				iFn += _string.ws`
					length = tmpArray.length;
					for (n = -1; ++n < length;) {
						key = tmpArray[n];

						if (key in data === false) {
							continue;
						}

						i = n + ${ startIndex };
				`;
			} else {
				iFn += 'for (key in data) {';

				if (p.notOwn === false) {
					iFn += _string.ws`
						if (!data.hasOwnProperty(key)) {
							break;
						}`;
				} else if (p.notOwn === -1) {
					iFn += _string.ws`
						if (!data.hasOwnProperty(key)) {
							continue;
						}`;
				}

				iFn += _string.ws`
					n++;
					i = n;
				`;

				if (startIndex) {
					iFn += _string.ws`
						if (n < ${ startIndex }) {
							continue;
						}
					`;
				}

				if (endIndex) {
					iFn += _string.ws`
						if (n > ${ endIndex }) {
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
				iFn += _string.ws`
					var tmpArray = [];

					for (var step = cursor.next(); !step.done; step = cursor.next()) {
						${ threadStart }
						tmpArray.push(step.value);
						${ threadEnd }
					}

					tmpArray.reverse();
					var size = tmpArray.length;
				`;

				if (startIndex || endIndex) {
					iFn += `tmpArray = tmpArray.slice(${ startIndex }, ${ endIndex || 'tmpArray.length' });`;
				}

				iFn += _string.ws`
					length = tmpArray.length;
					for (n = -1; ++n < length;) {
						${ maxArgsLength ? 'key = tmpArray[n];' : '' }
						i = n + ${ startIndex };
				`;
			} else {
				gen();

				iFn += _string.ws`
					for (key = cursor.next(); !key.done; key = cursor.next()) {
						${ maxArgsLength ? 'key = key.value;' : '' }
						n++;
						i = n;
				`;

				if (startIndex) {
					iFn += _string.ws`
						if (n < ${ startIndex }) {
							continue;
						}
					`;
				}

				if (endIndex) {
					iFn += _string.ws`
						if (n > ${ endIndex }) {
							break;
						};
					`;
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
		iFn += _string.ws`
			if (j === ${ p.count }) {
				break;
			}
		`;
	}

	if (p.filter.length) {
		iFn += 'if (';

		for (let i = 0; i < p.filter.length; i++) {
			iFn += `(${ p.inverseFilter ? '!' : '' }(f = filters[${ i }](${ filterArgs[i] })) || f === ${ p.inverseFilter ? 'FALSE' : 'TRUE' })`;
			if (i !== p.filter.length - 1) {
				iFn += '&&';
			}
		}

		iFn += ') {';
	}

	let tmp;
	if (p.mult) {
		tmp = `cb(${ cbArgs });`;
	} else {
		tmp = `cb(${ cbArgs }); breaker = true;`;
	}

	if (p.count) {
		tmp += 'j++;';
	}

	if (p.from) {
		iFn += _string.ws`
			if (from !== 0) {
				from--;

			} else {
				${ tmp }
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
			that._stack.pop();
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
			that._stack.push(ctx);
		}
	`;

	if (p.thread) {
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

	iFn += _string.ws`
			if (breaker) {
				break;
			}

			${ threadEnd }
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

	iFn += _string.ws`
		}

		that._stack.pop();

		if (onComplete) {
			onComplete(p.result);
		}

		return p.result;
	`;

	if (p.thread) {
		_cache.tmpCycle[key] = eval(_string.ws`(function *(o, p) { ${ iFn } })`);
	} else {
		_cache.tmpCycle[key] = Function('o', 'p', iFn);
	}

	if (_core2.default.ready) {
		const delay = 5e3;

		const text = `${ _base.NAMESPACE }.cache.cycle["${ key }"] = ${ _cache.tmpCycle[key].toString() };`;
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
						exports.version = ${ _base.CACHE_VERSION };
						exports.cache = ${ JSON.stringify(cache) };
						exports.exec = function () { ${ returnCache(cache) } };
					`, () => {});
			}, delay);
			timeout['unref']();
		}
	}

	return _cache.tmpCycle[key];
}