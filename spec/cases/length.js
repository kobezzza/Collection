/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

describe('Collection.length', () => {
	it('length with an array', () => {
		expect($C([1, 2, 3]).length()).toBe(3);
	});

	it('length with an array and a filter', () => {
		expect($C([1, 2, 3]).length((el) => el > 1)).toBe(2);
	});

	it('length with an array with multiple filters', () => {
		expect(
			$C([1, 2, 3, 4, 5]).length([
				(el) => el > 1,
				(el) => el % 2
			])
		).toBe(2);
	});

	it('single length with an array and a filter', () => {
		expect($C([1, 2, 3, 4, 5]).one.length((el) => el > 2)).toBe(1);
	});

	it('length with an array with multiple parameters', () => {
		expect(
			$C([1, 2, 3, 4, 5, 6, 7, 8, 9]).filter((el) => el > 1).length({
				filter: (el) => el % 2,
				from: 1,
				count: 2
			})
		).toBe(2);
	});

	it('length with a set', () => {
		expect($C(new Set([1, 2, 3, 4, 5])).length()).toBe(5);
	});

	it('length with a set and a filter', () => {
		expect($C(new Set([1, 2, 3, 4, 5])).length((el) => el % 2)).toBe(3);
	});

	it('length with a map', () => {
		expect($C(new Map([[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]])).length()).toBe(5);
	});

	it('length with a map and a filter', () => {
		expect($C(new Map([[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]])).length((el) => el % 2)).toBe(3);
	});

	it('length with a set with multiple parameters', () => {
		expect(
			$C(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9])).filter((el) => el > 1).length({
				filter: (el) => el % 2,
				from: 1,
				count: 2
			})
		).toBe(2);
	});

	it('async length with a set with multiple parameters', async () => {
		expect(
			await $C(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]))
				.async
				.filter((el) => Promise.resolve(el > 1))
				.length({
					filter: (el) => el % 2,
					from: 1,
					count: 2
				})

		).toBe(2);
	});
});
