/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

describe('Collection.get', () => {
	it('get from an object by a string link', () => {
		const obj = {
			a: {
				b: [new Map([['c', new Set(['boom!'])]])]
			}
		};

		expect($C(obj).get('a.b.0.c.boom!')).toBe('boom!');
	});

	it('get from an object by an array link', () => {
		const
			linkStr = Object('boom!'),
			linkObj = {};

		const obj = {
			a: {
				b: [new Map([['c', new WeakMap([[linkObj, new WeakSet([linkStr])]])]])]
			}
		};

		expect($C(obj).get(['a', 'b', 0, 'c', linkObj, linkStr])).toBe(linkStr);
	});

	it('get from an array', () => {
		expect($C([1, 2, 3, 4, 5]).get((el) => el % 2)).toEqual([1, 3, 5]);
	});

	it('get from an array without a filter', () => {
		const
			arr = [1, 2, 3, 4, 5];

		expect($C(arr).get()).toEqual([1, 2, 3, 4, 5]);
		expect($C(arr).get()).not.toBe(arr);
	});

	it('get from an array with multiple filters', () => {
		expect(
			$C([1, 2, 3, 4, 5]).get([
				(el) => el > 1,
				(el) => el % 2
			])
		).toEqual([3, 5]);
	});

	it('single get from an array', () => {
		expect($C([1, 2, 3, 4, 5]).one.get((el) => el > 2)).toBe(3);
	});

	it('get from an array with {mult: false} parameter', () => {
		expect($C([1, 2, 3, 4, 5]).get((el) => el > 2, {mult: false})).toBe(3);
	});

	it('get from an array with multiple parameters', () => {
		expect(
			$C([1, 2, 3, 4, 5, 6, 7, 8, 9]).filter((el) => el > 1).get({
				filter: (el) => el % 2,
				from: 1,
				count: 2
			})
		).toEqual([5, 7]);
	});

	it('get from a set', () => {
		expect($C(new Set([1, 2, 3, 4, 5])).get((el) => el % 2)).toEqual([1, 3, 5]);
	});

	it('get from a set with multiple parameters', () => {
		expect(
			$C(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9])).filter((el) => el > 1).get({
				filter: (el) => el % 2,
				from: 1,
				count: 2
			})
		).toEqual([5, 7]);
	});

	it('async get from a set with multiple parameters', async () => {
		expect(
			await $C(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]))
				.async
				.filter((el) => Promise.resolve(el > 1))
				.get({
					filter: (el) => el % 2,
					from: 1,
					count: 2
				})

		).toEqual([5, 7]);
	});
});
