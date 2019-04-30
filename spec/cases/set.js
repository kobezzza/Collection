/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

describe('Collection.set', () => {
	it('set to an object by a string link', () => {
		const obj = {
			a: {
				b: 1,
				c: 2
			}
		};

		expect($C(obj).set(2, 'a.b')).toEqual({
			key: 'b',
			result: true,
			value: 1,
			newValue: 2
		});

		expect(obj).toEqual({a: {b: 2, c: 2}});
	});

	it('set to an array by a string link', () => {
		const obj = {
			a: [1, 2, 3]
		};

		expect($C(obj).set(3, 'a.1')).toEqual({
			key: 1,
			result: true,
			value: 2,
			newValue: 3
		});

		expect(obj).toEqual({a: [1, 3, 3]});
	});

	it('set to a map by a string link', () => {
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

	it('set to a set by a string link', () => {
		const obj = {
			a: new Set(['1', '2', '3'])
		};

		expect($C(obj).set('5', 'a.1')).toEqual({
			key: null,
			result: true,
			value: '1',
			newValue: '5'
		});

		expect(obj).toEqual({
			a: new Set(['2', '3', '5'])
		});
	});

	it('set to a set by a deep string link', () => {
		const obj = {
			a: {
				b: [new Map([['c', new Set(['boom!'])]])]
			}
		};

		const
			path = 'a.b.0.c.boom!';

		expect($C(obj).set('bang!', path)).toEqual({
			key: null,
			result: true,
			value: 'boom!',
			newValue: 'bang!'
		});

		expect($C(obj).get(path.split('.').slice(0, -1).join('.'))).toEqual(new Set(['bang!']));
	});

	it('set to an WeakSet by an array link', () => {
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

		const
			newValue = Object('bang!');

		expect($C(obj).set(newValue, path)).toEqual({
			key: null,
			result: true,
			value: 'boom!',
			newValue: 'bang!'
		});

		expect($C(obj).get(path.slice(0, -1))).toEqual(new WeakSet([newValue]));
	});

	it('set to an array', () => {
		const
			obj = [1, 2, 3, 4, 5];

		expect($C(obj).set(77, (el) => el % 2)).toEqual([
			{
				key: 0,
				result: true,
				value: 1,
				newValue: 77
			},

			{
				key: 2,
				result: true,
				value: 3,
				newValue: 77
			},

			{
				key: 4,
				result: true,
				value: 5,
				newValue: 77
			}
		]);

		expect(obj).toEqual([77, 2, 77, 4, 77]);
	});

	it('set a function to an array', () => {
		const
			obj = [1, 2, 3, 4, 5];

		expect($C(obj).set((v) => v * 2, (el) => el % 2)).toEqual([
			{
				key: 0,
				result: true,
				value: 1,
				newValue: 2
			},

			{
				key: 2,
				result: true,
				value: 3,
				newValue: 6
			},

			{
				key: 4,
				result: true,
				value: 5,
				newValue: 10
			}
		]);

		expect(obj).toEqual([2, 2, 6, 4, 10]);
	});

	it('set to an object', () => {
		const
			obj = {a: 1, b: 2, c: 3, d: 4, e: 5};

		expect($C(obj).set(77, (el) => el % 2)).toEqual([
			{
				key: 'a',
				result: true,
				value: 1,
				newValue: 77
			},

			{
				key: 'c',
				result: true,
				value: 3,
				newValue: 77
			},

			{
				key: 'e',
				result: true,
				value: 5,
				newValue: 77
			}
		]);

		expect(obj).toEqual({a: 77, b: 2, c: 77, d: 4, e: 77});
	});

	it('set a function to an object', () => {
		const
			obj = {a: 1, b: 2, c: 3, d: 4, e: 5};

		expect($C(obj).set((v) => v * 2, (el) => el % 2)).toEqual([
			{
				key: 'a',
				result: true,
				value: 1,
				newValue: 2
			},

			{
				key: 'c',
				result: true,
				value: 3,
				newValue: 6
			},

			{
				key: 'e',
				result: true,
				value: 5,
				newValue: 10
			}
		]);

		expect(obj).toEqual({a: 2, b: 2, c: 6, d: 4, e: 10});
	});

	it('set to a map', () => {
		const
			obj = new Map([[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]]);

		expect($C(obj).set(77, (el) => el % 2)).toEqual([
			{
				key: 0,
				result: true,
				value: 1,
				newValue: 77
			},

			{
				key: 2,
				result: true,
				value: 3,
				newValue: 77
			},

			{
				key: 4,
				result: true,
				value: 5,
				newValue: 77
			}
		]);

		expect(obj).toEqual(new Map([[0, 77], [1, 2], [2, 77], [3, 4], [4, 77]]));
	});

	it('set a function to a map', () => {
		const
			obj = new Map([[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]]);

		expect($C(obj).set((v) => v * 2, (el) => el % 2)).toEqual([
			{
				key: 0,
				result: true,
				value: 1,
				newValue: 2
			},

			{
				key: 2,
				result: true,
				value: 3,
				newValue: 6
			},

			{
				key: 4,
				result: true,
				value: 5,
				newValue: 10
			}
		]);

		expect(obj).toEqual(new Map([[0, 2], [1, 2], [2, 6], [3, 4], [4, 10]]));
	});

	it('set to a set', () => {
		const
			obj = new Set([1, 2, 3, 4, 5]);

		expect($C(obj).set(77, (el) => el % 2)).toEqual([
			{
				key: null,
				result: true,
				value: 1,
				newValue: 77
			},

			{
				key: null,
				result: false,
				value: 3,
				newValue: 77
			},

			{
				key: null,
				result: false,
				value: 5,
				newValue: 77
			}
		]);

		expect(obj).toEqual(new Set([77, 2, 3, 4, 5]));
	});

	it('set a function to a set', () => {
		const
			obj = new Set([1, 2, 3, 4, 5]);

		expect($C(obj).set((v) => v * 2, (el) => el % 2)).toEqual([
			{
				key: null,
				result: false,
				value: 1,
				newValue: 2
			},

			{
				key: null,
				result: true,
				value: 3,
				newValue: 6
			},

			{
				key: null,
				result: true,
				value: 5,
				newValue: 10
			}
		]);

		expect(obj).toEqual(new Set([1, 2, 6, 4, 10]));
	});
});
