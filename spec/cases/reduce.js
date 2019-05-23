/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

describe('Collection.reduce', () => {
	it('reduce an array without an initial value to a number', () => {
		expect($C([1, 2, 3]).reduce((res, el) => res + el)).toBe(6);
	});

	it('reduce an array with an initial value to a number', () => {
		expect($C([1, 2, 3]).to(1).reduce((res, el) => res + el)).toBe(7);
	});

	it('reduce an array with an initial value and a filter to a number', () => {
		expect(
			$C([1, 2, 3]
				.filter((el) => el > 1))
				.to(1)
				.reduce((res, el) => res + el)
		).toBe(6);
	});

	it('single reduce an array without an initial value to a number', () => {
		expect($C([1, 2, 3]).one.reduce((res, el) => res + el)).toBe(1);
	});

	it('single reduce an array with an initial value to a number', () => {
		expect($C([1, 2, 3]).one.to(1).reduce((res, el) => res + el)).toBe(2);
	});

	it('reduce an array without an initial value to a number with break', () => {
		expect(
			$C([1, 2, 3]).reduce((res, el, i, data, o) => {
				if (i === 1) {
					return o.break;
				}

				return res + el;
			})
		).toBe(1);
	});

	it('async reduce an array without an initial value to a number', async () => {
		expect(await $C([1, 2, 3]).async.reduce((res, el) => Promise.resolve(res + el))).toBe(6);
	});
});
