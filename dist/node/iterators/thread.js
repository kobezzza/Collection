'use strict';
/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

var _core = _interopRequireWildcard(require("../core"));

require("./map");

var _math = require("../helpers/math");

var _thread = require("../consts/thread");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const intervals = [[0, 40], [41, 160], [161, 500], [501, 2000]];
const lastPos = {},
      execStack = {};

for (const key in _thread.priorities) {
  if (!_thread.priorities.hasOwnProperty(key)) {
    continue;
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
  (0, _core.default)(exec).forEach((el, key) => {
    tmp[key] = (0, _core.default)(el).map((el, key) => key);
    mods[key] = 0;
    count++;
  }, el => el.length);
  /* eslint-disable no-loop-func */

  const sort = (a, b) => b.value - a.value;

  while (total <= _thread.MAX_PRIORITY) {
    const rands = [];
    (0, _core.default)(exec).forEach((el, key) => {
      rands.push({
        key,
        value: _thread.priorities[key]
      });
    }, el => el.length);
    rands.sort(sort);
    let pos = rands.length - 1,
        max = 0;
    (0, _core.default)(rands).forEach((el, i) => {
      const interval = intervals[pos];

      if (interval[1] > max) {
        max = interval[1];
      }

      rands[i].value = interval;
      pos--;
    });
    const rand = (0, _math.getRandomInt)(0, max);
    (0, _core.default)(rands).forEach(({
      key,
      value
    }) => {
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
          total += _thread.priorities[key];
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


  (0, _core.default)(mods).forEach((el, key) => {
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
 * @param {function(!Error)} onError - callback function for error handling
 * @param {?function($$CollectionCtx)} [opt_onChunk] - callback function for chunks
 */

_core.Collection.prototype._addToStack = function (obj, priority, onError, opt_onChunk) {
  obj.destroy = err => {
    if (obj.destroyed) {
      return false;
    }

    clearTimeout(obj.sleep);
    (0, _core.default)(obj.children).forEach(child => child.destroy());
    (0, _core.default)(execStack[obj.priority]).remove(el => el === obj, {
      mult: false
    });
    exec--;
    obj.destroyed = true;

    if (err) {
      if (typeof err !== 'object') {
        err = new Error(err);
      }
    } else {
      err = new Error('Thread was destroyed');
      err.type = 'CollectionThreadDestroy';
    }

    err.thread = obj;

    if (obj.stream) {
      obj.stream.destroy();
    }

    try {
      obj.throw(err);
    } catch {}

    onError(err);
    return err;
  };

  obj.thread = true;
  obj.priority = priority;
  obj.onChunk = opt_onChunk;
  const next = obj.next; // With strictMode in Chrome (bug?) that method can't define as obj.next =

  Object.defineProperty(obj, 'next', {
    value() {
      obj.pause = false;

      if (obj.sleep !== null) {
        obj.sleep.resume();
      }

      return next.apply(this, arguments);
    }

  });
  exec++;
  execStack[priority].push(obj);

  function loop() {
    (0, _core.default)(getTasks()).forEach((el, key) => {
      const prop = execStack[key];
      (0, _core.default)(el).forEach((el, i, data) => {
        const obj = prop[el];

        if (!obj) {
          return;
        }

        const res = obj.next();
        obj.value = res.value;

        if (res.done) {
          prop.splice(el, 1);
          (0, _core.default)(data).forEach((el, i) => {
            if (el) {
              data[i]--;
            }
          }, {
            startIndex: i + 1
          });
          exec--;
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
 * @return {(!Error|boolean)}
 */


_core.default.destroy = function (obj) {
  if (!obj || !obj.thread) {
    return false;
  }

  return (obj.priority ? obj : obj.thread).destroy();
};

Object.assign(_core.default, {
  destroy: _core.default.destroy
});