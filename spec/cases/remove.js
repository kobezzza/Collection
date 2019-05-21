/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

describe('Collection.remove', () => {
	it('remove from an object by a string link', () => {
		const obj = {
			a: {
				b: 1,
				c: 2
			}
		};

		expect($C(obj).remove('a.b')).toEqual({
			key: 'b',
			result: true,
			value: 1
		});

		expect(obj).toEqual({a: {c: 2}});
	});

	it('remove from an array by a string link', () => {
		const obj = {
			a: [1, 2, 3]
		};

		expect($C(obj).remove('a.1')).toEqual({
			key: 1,
			result: true,
			value: 2
		});

		expect(obj).toEqual({a: [1, 3]});
	});

	it('remove from a map by a string link', () => {
		const obj = {
			a: new Map([['1', 1], ['2', 2], ['3', 3]])
		};

		expect($C(obj).remove('a.1')).toEqual({
			key: '1',
			result: true,
			value: 1
		});

		expect(obj).toEqual({
			a: new Map([['2', 2], ['3', 3]])
		});
	});

	it('remove from a set by a string link', () => {
		const obj = {
			a: new Set(['1', '2', '3'])
		};

		expect($C(obj).remove('a.1')).toEqual({
			key: null,
			result: true,
			value: '1'
		});

		expect(obj).toEqual({
			a: new Set(['2', '3'])
		});
	});

	it('remove from a set by a deep string link', () => {
		const obj = {
			a: {
				b: [new Map([['c', new Set(['boom!'])]])]
			}
		};

		const
			path = 'a.b.0.c.boom!';

		expect($C(obj).remove(path)).toEqual({
			key: null,
			result: true,
			value: 'boom!'
		});

		expect($C(obj).get(path)).toBeUndefined();
	});

	it('remove from an WeakSet by an array link', () => {
		const
			linkStr = Object('boom!'),
			linkObj = {};

		const
			path = ['a', 'b', 0, 'c', linkObj, linkStr];

		const obj = {
			a: {
				b: [new Map([['c', new WeakMap([[linkObj, new WeakSet([linkStr])]])]])]
			}
		};

		expect($C(obj).remove(path)).toEqual({
			key: null,
			result: true,
			value: 'boom!'
		});

		expect($C(obj).get(path)).toBeUndefined();
	});

	it('remove from an incorrect data type', () => {
		function *data() {
			for (let i = 0; i < 3; i++) {
				yield i;
			}
		}

		expect(() => $C(data).remove()).toThrowError('Incorrect data type');
	});

	it('remove from an array', () => {
		const
			obj = [1, 2, 3, 4, 5];

		expect($C(obj).remove((el) => el % 2)).toEqual([
			{
				key: 0,
				result: true,
				value: 1
			},

			{
				key: 2,
				result: true,
				value: 3
			},

			{
				key: 4,
				result: true,
				value: 5
			}
		]);

		expect(obj).toEqual([2, 4]);
	});

	it('single remove from an array', () => {
		const
			obj = [1, 2, 3, 4, 5];

		expect($C(obj).one.remove((el) => el % 2)).toEqual({
			key: 0,
			result: true,
			value: 1
		});

		expect(obj).toEqual([2, 3, 4, 5]);
	});

	it('async remove from an array', async () => {
		const
			obj = [1, 2, 3, 4, 5];

		expect(await $C(obj).async.remove((el) => Promise.resolve(el % 2))).toEqual([
			{
				key: 0,
				result: true,
				value: 1
			},

			{
				key: 2,
				result: true,
				value: 3
			},

			{
				key: 4,
				result: true,
				value: 5
			}
		]);

		expect(obj).toEqual([2, 4]);
	});

	it('remove from a reversed array', () => {
		const
			obj = [1, 2, 3, 4, 5];

		expect($C(obj).reverse.remove((el) => el % 2)).toEqual([
			{
				key: 4,
				result: true,
				value: 5
			},

			{
				key: 2,
				result: true,
				value: 3
			},

			{
				key: 0,
				result: true,
				value: 1
			}
		]);

		expect(obj).toEqual([2, 4]);
	});

	it('single remove from a reversed array', () => {
		const
			obj = [1, 2, 3, 4, 5];

		expect($C(obj).one.reverse.remove((el) => el % 2)).toEqual({
			key: 4,
			result: true,
			value: 5
		});

		expect(obj).toEqual([1, 2, 3, 4]);
	});

	it('remove from a live array', () => {
		const
			obj = [1, 2, 3, 4, 5];

		expect($C(obj).live.remove((el) => el % 2)).toEqual([
			{
				key: 0,
				result: true,
				value: 1
			},

			{
				key: 2,
				result: true,
				value: 3
			},

			{
				key: 4,
				result: true,
				value: 5
			}
		]);

		expect(obj).toEqual([2, 4]);
	});

	it('single remove from a live array', () => {
		const
			obj = [1, 2, 3, 4, 5];

		expect($C(obj).one.live.remove((el) => el % 2)).toEqual({
			key: 0,
			result: true,
			value: 1
		});

		expect(obj).toEqual([2, 3, 4, 5]);
	});

	it('remove from array like', () => {
		const
			obj = {0: 1, 1: 2, 2: 3, 3: 4, 4: 5, length: 5};

		expect($C(obj).remove((el) => el % 2)).toEqual([
			{
				key: 0,
				result: true,
				value: 1
			},

			{
				key: 2,
				result: true,
				value: 3
			},

			{
				key: 4,
				result: true,
				value: 5
			}
		]);

		expect(obj).toEqual({0: 2, 1: 4, length: 2});
	});

	it('single remove from array like', () => {
		const
			obj = {0: 1, 1: 2, 2: 3, 3: 4, 4: 5, length: 5};

		expect($C(obj).one.remove((el) => el % 2)).toEqual({
			key: 0,
			result: true,
			value: 1
		});

		expect(obj).toEqual({0: 2, 1: 3, 2: 4, 3: 5, length: 4});
	});

	it('remove from reversed array like', () => {
		const
			obj = {0: 1, 1: 2, 2: 3, 3: 4, 4: 5, length: 5};

		expect($C(obj).reverse.remove((el) => el % 2)).toEqual([
			{
				key: 4,
				result: true,
				value: 5
			},

			{
				key: 2,
				result: true,
				value: 3
			},

			{
				key: 0,
				result: true,
				value: 1
			}
		]);

		expect(obj).toEqual({0: 2, 1: 4, length: 2});
	});

	it('single remove from reversed array like', () => {
		const
			obj = {0: 1, 1: 2, 2: 3, 3: 4, 4: 5, length: 5};

		expect($C(obj).one.reverse.remove((el) => el % 2)).toEqual({
			key: 4,
			result: true,
			value: 5
		});

		expect(obj).toEqual({0: 1, 1: 2, 2: 3, 3: 4, length: 4});
	});

	it('remove from live array like', () => {
		const
			obj = {0: 1, 1: 2, 2: 3, 3: 4, 4: 5, length: 5};

		expect($C(obj).live.remove((el) => el % 2)).toEqual([
			{
				key: 0,
				result: true,
				value: 1
			},

			{
				key: 2,
				result: true,
				value: 3
			},

			{
				key: 4,
				result: true,
				value: 5
			}
		]);

		expect(obj).toEqual({0: 2, 1: 4, length: 2});
	});

	it('single remove from live array like', () => {
		const
			obj = {0: 1, 1: 2, 2: 3, 3: 4, 4: 5, length: 5};

		expect($C(obj).one.live.remove((el) => el % 2)).toEqual({
			key: 0,
			result: true,
			value: 1
		});

		expect(obj).toEqual({0: 2, 1: 3, 2: 4, 3: 5, length: 4});
	});

	it('remove from an object', () => {
		const
			obj = {a: 1, b: 2, c: 3, d: 4, e: 5};

		expect($C(obj).remove((el) => el % 2)).toEqual([
			{
				key: 'a',
				result: true,
				value: 1
			},

			{
				key: 'c',
				result: true,
				value: 3
			},

			{
				key: 'e',
				result: true,
				value: 5
			}
		]);

		expect(obj).toEqual({b: 2, d: 4});
	});

	it('single remove from an object', () => {
		const
			obj = {a: 1, b: 2, c: 3, d: 4, e: 5};

		expect($C(obj).one.remove((el) => el % 2)).toEqual({
			key: 'a',
			result: true,
			value: 1
		});

		expect(obj).toEqual({b: 2, c: 3, d: 4, e: 5});
	});

	it('remove from a map', () => {
		const
			obj = new Map([[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]]);

		expect($C(obj).remove((el) => el % 2)).toEqual([
			{
				key: 0,
				result: true,
				value: 1
			},

			{
				key: 2,
				result: true,
				value: 3
			},

			{
				key: 4,
				result: true,
				value: 5
			}
		]);

		expect(obj).toEqual(new Map([[1, 2], [3, 4]]));
	});

	it('single remove from a map', () => {
		const
			obj = new Map([[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]]);

		expect($C(obj).one.remove((el) => el % 2)).toEqual({
			key: 0,
			result: true,
			value: 1
		});

		expect(obj).toEqual(new Map([[1, 2], [2, 3], [3, 4], [4, 5]]));
	});

	it('remove from a set', () => {
		const
			obj = new Set([1, 2, 3, 4, 5]);

		expect($C(obj).remove((el) => el % 2)).toEqual([
			{
				key: null,
				result: true,
				value: 1
			},

			{
				key: null,
				result: true,
				value: 3
			},

			{
				key: null,
				result: true,
				value: 5
			}
		]);

		expect(obj).toEqual(new Set([2, 4]));
	});

	it('single remove from a set', () => {
		const
			obj = new Set([1, 2, 3, 4, 5]);

		expect($C(obj).one.remove((el) => el % 2)).toEqual({
			key: null,
			result: true,
			value: 1
		});

		expect(obj).toEqual(new Set([2, 3, 4, 5]));
	});

	it('remove from an array without a filter', () => {
		const
			arr = [1, 2];

		expect($C(arr).remove()).toEqual([
			{
				key: 0,
				result: true,
				value: 1
			},

			{
				key: 1,
				result: true,
				value: 2
			}
		]);

		expect(arr).toEqual([]);
	});

	it('remove from an array with multiple filters', () => {
		expect(
			$C([1, 2, 3, 4, 5]).remove([
				(el) => el > 1,
				(el) => el % 2
			])
		).toEqual([
			{
				key: 2,
				result: true,
				value: 3
			},

			{
				key: 4,
				result: true,
				value: 5
			}
		]);
	});

	it('single remove from an array', () => {
		expect($C([1, 2, 3, 4, 5]).one.remove((el) => el > 2)).toEqual({
			key: 2,
			result: true,
			value: 3
		});
	});

	it('remove from an array with {mult: false} parameter', () => {
		expect($C([1, 2, 3, 4, 5]).remove((el) => el > 2, {mult: false})).toEqual({
			key: 2,
			result: true,
			value: 3
		});
	});

	it('remove from an array with multiple parameters', () => {
		expect(
			$C([1, 2, 3, 4, 5, 6, 7, 8, 9]).filter((el) => el > 1).remove({
				filter: (el) => el % 2,
				from: 1,
				count: 2
			})
		).toEqual([
			{
				key: 4,
				result: true,
				value: 5
			},

			{
				key: 6,
				result: true,
				value: 7
			}
		]);
	});

	it('remove from a set with multiple parameters', () => {
		expect(
			$C(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9])).filter((el) => el > 1).remove({
				filter: (el) => el % 2,
				from: 1,
				count: 2
			})
		).toEqual([
			{
				key: null,
				result: true,
				value: 5
			},

			{
				key: null,
				result: true,
				value: 7
			}
		]);
	});
});
