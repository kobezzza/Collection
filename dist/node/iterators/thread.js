'use strict';

/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

var _math = require('../helpers/math');

var _thread = require('../consts/thread');

require('./map');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const intervals = [[0, 40], [41, 160], [161, 500], [501, 2000]];

const lastPos = {},
      execStack = {};

for (const key in _thread.PRIORITY) {
	if (!_thread.PRIORITY.hasOwnProperty(key)) {
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
	const tasks = {},
	      tmp = {},
	      mods = {},
	      exec = Object.assign({}, execStack);

	let total = 0,
	    count = 0;

	(0, _core2.default)(exec).forEach((el, key) => {
		tmp[key] = (0, _core2.default)(el).map((el, key) => key);
		mods[key] = 0;
		count++;
	}, el => el.length);

	/* eslint-disable no-loop-func */

	const sort = (a, b) => b.value - a.value;

	while (total <= _thread.MAX_PRIORITY) {
		const rands = [];

		(0, _core2.default)(exec).forEach((el, key) => {
			rands.push({
				key,
				value: _thread.PRIORITY[key]
			});
		}, el => el.length);

		rands.sort(sort);

		let pos = rands.length - 1,
		    max = 0;

		(0, _core2.default)(rands).forEach((el, i) => {
			const interval = intervals[pos];

			if (interval[1] > max) {
				max = interval[1];
			}

			rands[i].value = interval;
			pos--;
		});

		const rand = (0, _math.getRandomInt)(0, max);

		(0, _core2.default)(rands).forEach(({ key, value }) => {
			const arr = tmp[key];

			if (rand >= value[0] && rand <= value[1]) {
				tasks[key] = tasks[key] || [];
				let pos = lastPos[key];

				if (arr[pos] == null) {
					lastPos[key] = pos = 0;
					mods[key] = 0;
				}

				const point = exec[key][arr[pos]];

				if (point && !point.pause) {
					mods[key]++;
					tasks[key].push(arr[pos]);
					total += _thread.PRIORITY[key];
				}

				arr.splice(pos, 1);
				if (!arr.length) {
					delete exec[key];
					count--;
				}

				return false;
			}
		});

		if (!count) {
			break;
		}
	}

	/* eslint-enable no-loop-func */

	(0, _core2.default)(mods).forEach((el, key) => {
		lastPos[key] += el;
	});

	return tasks;
}

let exec = 0;

/**
 * Adds a task to the execution stack
 *
 * @private
 * @param {?} obj - generator object
 * @param {string} priority - task priority
 * @param {?function(?)} onComplete - callback function for complete
 * @param {?function($$CollectionCtx)} [opt_onChunk] - callback function for chunks
 */
_core.Collection.prototype._addToStack = function (obj, priority, onComplete, opt_onChunk) {
	obj.value = undefined;
	obj.thread = true;
	obj.priority = priority;
	obj.destroy = () => _core2.default.destroy(obj);
	obj.onComplete = onComplete;
	obj.onChunk = opt_onChunk;
	obj.pause = false;
	obj.sleep = null;
	obj.children = [];

	const next = obj.next;

	// With strictMode in Chrome (bug?) that method can't define as obj.next =
	Object.defineProperty(obj, 'next', {
		value() {
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
		(0, _core2.default)(getTasks()).forEach((el, key) => {
			const prop = execStack[key];

			(0, _core2.default)(el).forEach((el, i, data) => {
				const obj = prop[el],
				      res = obj.next();

				obj.value = res.value;

				if (res.done) {
					prop.splice(el, 1);

					(0, _core2.default)(data).forEach((el, i) => {
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
			setTimeout(loop, _thread.MAX_PRIORITY);
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
_core2.default.destroy = function (obj) {
	if (!obj || !obj.thread) {
		return false;
	}

	const thread = obj.priority ? obj : obj.thread;

	clearTimeout(thread.sleep);
	(0, _core2.default)(thread.children).forEach(child => _core2.default.destroy(child));

	if ((0, _core2.default)(execStack[thread.priority]).remove(el => el === thread, { mult: false }).result) {
		thread.destroyed = true;
		exec--;
	}

	return true;
};

Object.assign(_core2.default, { destroy: _core2.default.destroy });