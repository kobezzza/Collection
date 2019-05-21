/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

describe('Collection.search', () => {
	it('empty search from an array', () => {
		expect($C([1, 2, 3, 4, 5]).search((el) => el > 10)).toEqual([]);
	});

	it('single empty search from an array', () => {
		expect($C([1, 2, 3, 4, 5]).one.search((el) => el > 10)).toBeNull();
	});

	it('search from an array', () => {
		expect($C([1, 2, 3, 4, 5]).search((el) => el % 2)).toEqual([0, 2, 4]);
	});

	it('search from an array without a filter', () => {
		expect($C([1, 2, 3, 4, 5]).search()).toEqual([0, 1, 2, 3, 4]);
	});

	it('search from an array with multiple filters', () => {
		expect(
			$C([1, 2, 3, 4, 5]).search([
				(el) => el > 1,
				(el) => el % 2
			])
		).toEqual([2, 4]);
	});

	it('single search from an array', () => {
		expect($C([1, 2, 3, 4, 5]).one.search((el) => el > 2)).toBe(2);
	});

	it('search from an array with {mult: false} parameter', () => {
		expect($C([1, 2, 3, 4, 5]).search((el) => el > 2, {mult: false})).toBe(2);
	});

	it('search from an array with multiple parameters', () => {
		expect(
			$C([1, 2, 3, 4, 5, 6, 7, 8, 9]).filter((el) => el > 1).search({
				filter: (el) => el % 2,
				from: 1,
				count: 2
			})
		).toEqual([4, 6]);
	});

	it('search from a set', () => {
		expect($C(new Set([1, 2, 3, 4, 5])).search((el) => el % 2)).toEqual([1, 3, 5]);
	});

	it('single search from a set', () => {
		expect($C(new Set([1, 2, 3, 4, 5])).one.search((el) => el % 2)).toEqual({value: 1});
	});

	it('search from a map', () => {
		expect($C(new Map([[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]])).search((el) => el % 2)).toEqual([0, 2, 4]);
	});

	it('single search from a set', () => {
		expect($C(new Map([[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]])).one.search((el) => el % 2)).toEqual({value: 0});
	});

	it('search from a set with multiple parameters', () => {
		expect(
			$C(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9])).filter((el) => el > 1).search({
				filter: (el) => el % 2,
				from: 1,
				count: 2
			})
		).toEqual([5, 7]);
	});

	it('async search from a set with multiple parameters', async () => {
		expect(
			await $C(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]))
				.async
				.filter((el) => Promise.resolve(el > 1))
				.search({
					filter: (el) => el % 2,
					from: 1,
					count: 2
				})

		).toEqual([5, 7]);
	});
});
