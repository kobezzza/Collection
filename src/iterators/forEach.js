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
import { getType, isObjectInstance } from '../helpers/types';
import { STRUCT_OPT } from '../helpers/structs';
import { compileCycle } from './compile';

const
	stack = $C.prototype['_stack'] = [];

$C.prototype.forEach = function (cb, opt_params) {
	const p = Object.assign({
		mult: true,
		count: false,
		from: false,
		startIndex: false,
		endIndex: false,
		reverse: false,
		inverseFilter: false,
		notOwn: false,
		live: false,
		thread: false,
		priority: 'normal',
		this: false,
		return: false,
		length: true
	}, opt_params);

	if (p.notOwn) {
		p.use = 'for in';
	}

	const
		{data} = this;

	const
		type = p.type = getType(data, p.use);

	if (!isObjectInstance(data) || {'weakMap': true, 'weakSet': true}[type]) {
		throw new TypeError('Incorrect data type');
	}

	const
		filter = p.filter = [].concat(p.filter || []);

	// Optimization for length
	if (!filter.length && cb['__COLLECTION_TMP__lengthQuery']) {
		if (type === 'array') {
			cb['__COLLECTION_TMP__lengthQuery'] = (
				p.startIndex !== false || p.endIndex !== false ?
					[].slice.call(data, p.startIndex || 0, p.endIndex !== false ? p.endIndex + 1 : data.length) :
					data

			).length;

			return this;

		} else if ({'map': true, 'set': true}[type] && p.startIndex === false && p.endIndex === false) {
			cb['__COLLECTION_TMP__lengthQuery'] = data.size;
			return this;
		}
	}

	let
		cbArgs = false,
		filterArgs = false;

	if (p.length) {
		cbArgs = p.cbArgs = cb.length;
		p.filterArgs = [];

		for (let i = 0; i < filter.length; i++) {
			p.filterArgs.push(filter[i].length);
		}

		filterArgs = p.filterArgs.length ? p.filterArgs : false;
	}

	const key = [
		STRUCT_OPT,
		type,
		cbArgs,
		filter.length,
		filterArgs,
		p.this,
		p.length,
		p.return,
		p.thread,
		p.notOwn,
		p.live,
		p.inverseFilter,
		p.reverse,
		p.mult,
		p.count,
		p.from,
		p.startIndex,
		p.endIndex
	].join();

	let fn = tmpCycle[key];
	if (!fn) {
		fn = compileCycle(key, p);
	}

	const link = {};
	const res = fn.call(
		this,
		data,
		cb,
		() => 0,
		filter,
		() => 0,
		p.inject,
		link,
		p.onIterationEnd,
		p.onComplete
	);

	link.self = res;
	if (link.pause) {
		link.self.pause = true;
	}

	//#if iterators.thread

	if (p.thread) {
		const
			length = stack.length;

		let
			cursor,
			pos = 1;

		while ((cursor = stack[length - pos])) {
			if (cursor.thread) {
				cursor.thread.children.push(res);
				break;
			}

			pos++;
		}

		this._addToStack(p.priority, res, p.onComplete, p.onChunk);
	}

	if (p.thread) {
		return res;
	}

	//#endif

	return this;
};
