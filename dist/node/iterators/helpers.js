'use strict';
/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

var _core = require("../core");

var _types = require("../helpers/types");

var _gcc = require("../helpers/gcc");

var _thread = require("../consts/thread");

/**
 * Appends a filter to the operation
 *
 * @param {...($$CollectionFilter|Array<$$CollectionFilter>|undefined)} filters - function filter
 * @return {!Collection}
 */
_core.Collection.prototype.filter = function (filters) {
  let newFilters = [];

  for (let i = 0; i < arguments.length; i++) {
    const el = arguments[i];

    if (el) {
      newFilters = newFilters.concat(el);
    }
  }

  this.p.filter = this.p.filter.concat.apply(this.p.filter, newFilters);
  return this;
};
/**
 * @private
 * @param {?} p
 * @param {...?} filters - function filter
 * @return {!Collection}
 */


_core.Collection.prototype._initParams = function (p, filters) {
  const threadNodDefined = !p.hasOwnProperty('thread') && p.thread === false,
        asyncNotDefined = !p.hasOwnProperty('async') && p.async === false;

  if (!p.use && p.notOwn) {
    p.use = 'for in';
  }

  if (threadNodDefined && (p.priority || p.onChunk)) {
    p.thread = true;
  }

  if (p.thread && !_thread.priorities[p.priority]) {
    p.priority = 'normal';
  }

  if (p.data !== this.data) {
    p.data = this.data;
    p.type = (0, _types.getType)(this.data, p.use || this.p.use);
  }

  if (p.initial != null && !p.initialType) {
    const type = typeof p.initial;
    p.initialType = type !== 'object' ? type : (0, _types.getType)(p.initial);
  }

  if (asyncNotDefined && (p.thread || p.use === 'async for of' || p.parallel != null && p.parallel !== false || p.race != null && p.race !== false) || _types.asyncTypes[p.type] || p.initialType === 'stream') {
    p.async = true;
  }

  if (filters !== false && (p.filter || filters)) {
    let newFilters = [];

    for (let i = 0; i < arguments.length; i++) {
      let el = arguments[i];

      if (i === 0) {
        if (!el || !el.filter) {
          continue;
        }

        el = [el.filter, delete el.filter][0];
      }

      if (el) {
        newFilters = newFilters.concat(el);
      }
    }

    this.p.filter = this.p.filter.concat.apply(this.p.filter, newFilters);
  }

  return this;
}; //#if iterators/async
//#if iterators/thread

/**
 * Marks the operation as thread
 *
 * @param {(?string|$$CollectionThreadCb)=} [opt_priority] - thread priority (low, normal, hight, critical)
 * @param {?$$CollectionThreadCb=} [opt_onChunk] - callback function for chunks
 * @return {!Collection}
 */


_core.Collection.prototype.thread = function (opt_priority, opt_onChunk) {
  if ((0, _types.isFunction)(opt_priority)) {
    opt_onChunk = (0, _gcc.any)(opt_priority);
    opt_priority = null;
  }

  const {
    p
  } = this;
  p.async = true;
  p.thread = true;

  if (opt_priority) {
    p.priority = opt_priority;
  }

  if (!_thread.priorities[p.priority]) {
    p.priority = 'normal';
  }

  if (opt_onChunk) {
    p.onChunk = opt_onChunk;
  }

  return this;
}; //#endif
//#endif

/**
 * Sets .startIndex for the operation
 *
 * @param {number} value - source value
 * @return {!Collection}
 */


_core.Collection.prototype.start = function (value) {
  this.p.startIndex = value;
  return this;
};
/**
 * Sets .endIndex for the operation
 *
 * @param {number} value - source value
 * @return {!Collection}
 */


_core.Collection.prototype.end = function (value) {
  this.p.endIndex = value;
  return this;
};
/**
 * Sets .from for the operation
 *
 * @param {number} value - source value
 * @return {!Collection}
 */


_core.Collection.prototype.from = function (value) {
  this.p.from = value;
  return this;
};
/**
 * Sets .count for the operation
 *
 * @param {number} value - source value
 * @return {!Collection}
 */


_core.Collection.prototype.count = function (value) {
  this.p.count = value;
  return this;
};
/**
 * Sets .use to 'for in' for the operation
 *
 * @param {(boolean|number|null)=} [opt_notOwn] - iteration type:
 *
 *   1) if false, then hasOwnProperty test is enabled and all not own properties will be skipped
 *   2) if true, then hasOwnProperty test is disabled
 *   3) if -1, then hasOwnProperty test is enabled and all own properties will be skipped
 *
 * @return {!Collection}
 */


_core.Collection.prototype.object = function (opt_notOwn) {
  this.p.use = 'for in';

  if (opt_notOwn) {
    this.p.notOwn = opt_notOwn;
  }

  return this;
};
/**
 * Sets .use to 'for of' for the operation
 *
 * @param {?boolean=} [opt_async] - if true, then will be used async for of
 * @return {!Collection}
 */


_core.Collection.prototype.iterator = function (opt_async) {
  this.p.use = `${opt_async === false ? 'sync ' : opt_async ? 'async ' : ''}for of`;

  if (opt_async) {
    this.p.async = true;
  }

  return this;
};
/**
 * Sets .initial for the operation
 *
 * @param {?} value
 * @return {!Collection}
 */


_core.Collection.prototype.to = function (value) {
  const type = typeof value;
  this.p.initialType = value != null && type !== 'object' ? type : (0, _types.getType)(value);
  this.p.initial = value;
  return this;
};
/**
 * Sets .initial as a transform stream for the operation
 *
 * @param {?boolean=} [opt_readObj] - readableObjectMode
 * @param {?boolean=} [opt_writeObj=opt_readObj] - writableObjectMode
 * @return {!Collection}
 */


_core.Collection.prototype.toStream = function (opt_readObj, opt_writeObj) {
  opt_readObj = Boolean(opt_readObj != null ? opt_readObj : true); //#if isNode

  const {
    p
  } = this,
        {
    Transform
  } = require('stream');

  p.async = true;
  p.initialType = 'stream';
  p.initial = new Transform({
    readableObjectMode: Boolean(opt_readObj),
    writableObjectMode: Boolean(opt_writeObj != null ? opt_writeObj : opt_readObj),

    transform(data, enc, cb) {
      cb(null, data);
    }

  }); //#endif

  return this;
}; //#if iterators/async

/**
 * Sets .async to true and .parallel for the operation
 *
 * @param {(boolean|number|null)=} [opt_max]
 * @return {!Collection}
 */


_core.Collection.prototype.parallel = function (opt_max) {
  this.p.async = true;
  this.p.parallel = (0, _types.isNumber)(opt_max) ? opt_max || true : opt_max !== false;
  return this;
};
/**
 * Sets .async to true and .race for the operation
 *
 * @param {(boolean|number|null)=} [opt_max]
 * @return {!Collection}
 */


_core.Collection.prototype.race = function (opt_max) {
  this.p.async = true;
  this.p.race = (0, _types.isNumber)(opt_max) ? opt_max || true : opt_max !== false;
  return this;
}; //#endif


Object.defineProperties(_core.Collection.prototype,
/** @lends {Collection.prototype} */
{
  //#if iterators/async
  async: {
    /**
     * Sets .async to true for the operation
     */
    get() {
      this.p.async = true;
      return this;
    }

  },
  //#endif
  live: {
    /**
     * Sets .live to true for the operation
     */
    get() {
      this.p.live = true;
      return this;
    }

  },
  descriptor: {
    /**
     * Sets .withDescriptor to true for the operation
     */
    get() {
      this.p.withDescriptor = true;
      return this;
    }

  },
  array: {
    /**
     * Sets .use to 'for' for the operation
     */
    get() {
      this.p.use = 'for';
      return this;
    }

  },
  one: {
    /**
     * Sets .mult to false for the operation
     */
    get() {
      this.p.mult = false;
      return this;
    }

  },
  inverse: {
    /**
     * Sets .inverseFilter to true for the operation
     */
    get() {
      this.p.inverseFilter = true;
      return this;
    }

  },
  reverse: {
    /**
     * Sets .reverse to true for the operation
     */
    get() {
      this.p.reverse = true;
      return this;
    }

  }
});