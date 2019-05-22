/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

describe('Collection.map', () => {
	it('map with a number', () => {
		expect($C(3).map((el, i) => (i + 1) * 2)).toEqual([2, 4, 6]);
	});

	it('map with a string', () => {
		expect($C('123').map((el) => el * 2)).toEqual([2, 4, 6]);
	});

	it('map with an array', () => {
		expect($C([1, 2, 3]).map((el) => el * 2)).toEqual([2, 4, 6]);
	});

	it('map with an array like', () => {
		expect($C({0: 1, 1: 2, 2: 3, length: 3}).map((el) => el * 2)).toEqual({0: 2, 1: 4, 2: 6, length: 3});
	});

	it('map with an array and a filter', () => {
		expect($C([1, 2, 3]).filter((el) => el > 1).map((el) => el * 2)).toEqual([4, 6]);
		expect($C([1, 2, 3]).map((el) => el * 2, (el) => el > 1)).toEqual([4, 6]);
		expect($C([1, 2, 3]).map((el) => el * 2, [(el) => el > 1, (el) => el > 2])).toEqual([6]);
	});

	it('map with a filter and without a map function', () => {
		expect($C([1, 2, 3]).filter((el) => el > 1).map()).toEqual([2, 3]);
	});

	it('reversed map with an array', () => {
		expect($C([1, 2, 3]).reverse.map((el) => el * 2)).toEqual([6, 4, 2]);
	});

	it('map with an array and bounds', () => {
		const
			data = [1, 2, 3, 4, 5, 6];

		expect(
			$C(data)
				.filter((el) => el > 1)
				.start(1)
				.from(1)
				.count(3)
				.map((el) => el * 2)
		).toEqual([6, 8, 10]);

		expect(
			$C(data)
				.filter((el) => el > 1)
				.start(1)
				.from(1)
				.count(3)
				.end(3)
				.map((el) => el * 2)
		).toEqual([6, 8]);

		expect(
			$C(data)
				.filter((el) => el > 1)
				.live
				.start(1)
				.from(1)
				.count(3)
				.end(3)
				.map((el) => el * 2)
		).toEqual([6, 8]);

		expect(
			$C(data)
				.reverse
				.filter((el) => el > 1)
				.start(1)
				.from(1)
				.count(3)
				.end(3)
				.map((el) => el * 2)
		).toEqual([8, 6]);
	});

	it('async map with an array and bounds', async () => {
		const
			data = [1, 2, 3, 4, 5, 6];

		expect(
			await $C(data)
				.async
				.reverse
				.filter((el) => el > 1)
				.start(1)
				.from(1)
				.count(3)
				.end(3)
				.map((el) => Promise.resolve(el * 2))
		).toEqual([8, 6]);
	});

	it('map with an object', () => {
		expect($C({a: 1, b: 2, c: 3}).map((el) => el * 2)).toEqual({a: 2, b: 4, c: 6});
	});

	it('map with an object and a filter', () => {
		expect($C({a: 1, b: 2, c: 3}).filter((el) => el > 1).map((el) => el * 2)).toEqual({b: 4, c: 6});
	});

	it('map with an object and bounds', () => {
		const
			data = {a: 1, b: 2, c: 3, d: 4, e: 5, f: 6};

		expect(
			$C(data)
				.filter((el) => el > 1)
				.start(1)
				.from(1)
				.count(3)
				.map((el) => el * 2)
		).toEqual({c: 6, d: 8, e: 10});

		expect(
			$C(data)
				.filter((el) => el > 1)
				.start(1)
				.from(1)
				.count(3)
				.end(3)
				.map((el) => el * 2)
		).toEqual({c: 6, d: 8});
	});

	it('async map with an object and bounds', async () => {
		const
			data = {a: 1, b: 2, c: 3, d: 4, e: 5, f: 6};

		expect(
			await $C(data)
				.async
				.filter((el) => el > 1)
				.start(1)
				.from(1)
				.count(3)
				.end(3)
				.map((el) => Promise.resolve(el * 2))
		).toEqual({c: 6, d: 8});
	});

	it('map with a set', () => {
		expect($C(new Set([1, 2, 3])).map((el) => el * 2)).toEqual(new Set([2, 4, 6]));
	});

	it('map with a set and a filter', () => {
		expect($C(new Set([1, 2, 3])).filter((el) => el > 1).map((el) => el * 2)).toEqual(new Set([4, 6]));
	});

	it('reversed map with a set', () => {
		expect($C(new Set([1, 2, 3])).reverse.map((el) => el * 2)).toEqual(new Set([6, 4, 2]));
	});

	it('map with a set and bounds', () => {
		const
			data = new Set([1, 2, 3, 4, 5, 6]);

		expect(
			$C(data)
				.filter((el) => el > 1)
				.start(1)
				.from(1)
				.count(3)
				.map((el) => el * 2)
		).toEqual(new Set([6, 8, 10]));

		expect(
			$C(data)
				.filter((el) => el > 1)
				.start(1)
				.from(1)
				.count(3)
				.end(3)
				.map((el) => el * 2)
		).toEqual(new Set([6, 8]));

		expect(
			$C(data)
				.reverse
				.filter((el) => el > 1)
				.start(1)
				.from(1)
				.count(3)
				.end(3)
				.map((el) => el * 2)
		).toEqual(new Set([8, 6]));
	});

	it('async map with a set and bounds', async () => {
		const
			data = new Set([1, 2, 3, 4, 5, 6]);

		expect(
			await $C(data)
				.async
				.reverse
				.filter((el) => el > 1)
				.start(1)
				.from(1)
				.count(3)
				.end(3)
				.map((el) => Promise.resolve(el * 2))
		).toEqual(new Set([8, 6]));
	});

	it('map with a map', () => {
		expect($C(new Map([['a', 1], ['b', 2], ['c', 3]])).map((el) => el * 2)).toEqual(new Map([['a', 2], ['b', 4], ['c', 6]]));
	});

	it('map with a map and a filter', () => {
		expect($C(new Map([['a', 1], ['b', 2], ['c', 3]])).filter((el) => el > 1).map((el) => el * 2))
			.toEqual(new Map([['b', 4], ['c', 6]]));
	});

	it('reversed map with a map', () => {
		expect($C(new Map([['a', 1], ['b', 2], ['c', 3]])).reverse.map((el) => el * 2)).toEqual(new Map([['c', 6], ['b', 4], ['a', 2]]));
	});

	it('map with a map and bounds', () => {
		const
			data = new Map([['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5], ['f', 6]]);

		expect(
			$C(data)
				.filter((el) => el > 1)
				.start(1)
				.from(1)
				.count(3)
				.map((el) => el * 2)
		).toEqual(new Map([['c', 6], ['d', 8], ['e', 10]]));

		expect(
			$C(data)
				.filter((el) => el > 1)
				.start(1)
				.from(1)
				.count(3)
				.end(3)
				.map((el) => el * 2)
		).toEqual(new Map([['c', 6], ['d', 8]]));

		expect(
			$C(data)
				.reverse
				.filter((el) => el > 1)
				.start(1)
				.from(1)
				.count(3)
				.end(3)
				.map((el) => el * 2)
		).toEqual(new Map([['d', 8], ['c', 6]]));
	});

	it('async map with a map and bounds', async () => {
		const
			data = new Map([['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5], ['f', 6]]);

		expect(
			await $C(data)
				.async
				.reverse
				.filter((el) => el > 1)
				.start(1)
				.from(1)
				.count(3)
				.end(3)
				.map((el) => Promise.resolve(el * 2))
		).toEqual(new Map([['d', 8], ['c', 6]]));
	});

	it('map with a generator', () => {
		function *data() {
			for (let i = 1; i <= 3; i++) {
				yield i;
			}
		}

		expect($C(data).map((el) => el * 2)).toEqual([2, 4, 6]);
	});

	it('map with a generator and a filter', () => {
		function *data() {
			for (let i = 1; i <= 3; i++) {
				yield i;
			}
		}

		expect($C(data).filter((el) => el > 1).map((el) => el * 2)).toEqual([4, 6]);
	});

	it('reversed map with a generator', () => {
		function *data() {
			for (let i = 1; i <= 3; i++) {
				yield i;
			}
		}

		expect($C(data).reverse.map((el) => el * 2)).toEqual([6, 4, 2]);
	});

	it('map with a generator and bounds', () => {
		function *data() {
			for (let i = 1; i <= 6; i++) {
				yield i;
			}
		}

		expect(
			$C(data)
				.filter((el) => el > 1)
				.start(1)
				.from(1)
				.count(3)
				.map((el) => el * 2)
		).toEqual([6, 8, 10]);

		expect(
			$C(data)
				.filter((el) => el > 1)
				.start(1)
				.from(1)
				.count(3)
				.end(3)
				.map((el) => el * 2)
		).toEqual([6, 8]);

		expect(
			$C(data)
				.reverse
				.filter((el) => el > 1)
				.start(1)
				.from(1)
				.count(3)
				.end(3)
				.map((el) => el * 2)
		).toEqual([8, 6]);
	});

	it('async map with a generator and bounds', async () => {
		function *data() {
			for (let i = 1; i <= 6; i++) {
				yield i;
			}
		}

		expect(
			await $C(data)
				.async
				.reverse
				.filter((el) => el > 1)
				.start(1)
				.from(1)
				.count(3)
				.end(3)
				.map((el) => Promise.resolve(el * 2))
		).toEqual([8, 6]);
	});

	it('map with an iterator', () => {
		function *foo() {
			for (let i = 1; i <= 3; i++) {
				yield i;
			}
		}

		expect($C(foo()).map((el) => el * 2)).toEqual([2, 4, 6]);
	});

	it('map with custom initial value', () => {
		expect($C([1, 2, 3]).to(0).map()).toBe(6);
		expect($C([1, 2, 3]).to('').map()).toBe('123');
		expect($C([1, 2, 3]).to({}).map()).toEqual({0: 1, 1: 2, 2: 3});
		expect($C([1, 2, 3]).to(new Set()).map()).toEqual(new Set([1, 2, 3]));
		expect($C([1, 2, 3]).to(new Map()).map()).toEqual(new Map([[0, 1], [1, 2], [2, 3]]));
	});

	it('async map with custom initial value', async () => {
		expect(await $C([1, 2, 3]).async.to(0).map((el) => Promise.resolve(el))).toBe(6);
	});
});
