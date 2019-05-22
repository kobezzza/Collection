/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

describe('Collection.some', () => {
	it('some with an array', () => {
		const
			data = [1, 2, 3, 4, 5],
			filter = jasmine.createSpy('filter');

		expect($C(data).some((el) => {
			filter(el);
			return el > 2;
		})).toBeTruthy();

		expect(filter).toHaveBeenCalledTimes(3);
		expect(filter).toHaveBeenCalledWith(1);
		expect(filter).toHaveBeenCalledWith(2);
		expect(filter).toHaveBeenCalledWith(3);

		expect($C(data).some((el) => el > 5)).toBeFalsy();
	});

	it('some with an array and multiple parameters', () => {
		expect(
			$C([1, 2, 3, 4, 5, 6, 7, 8, 9]).filter((el) => el > 1).some({
				filter: (el) => el % 2,
				from: 1,
				count: 2
			})
		).toBeTruthy();

		expect(
			$C([1, 2, 3, 4, 5, 6, 7, 8, 9]).some([(el) => el > 5, (el) => el < 9])
		).toBeTruthy();

		expect(
			$C([1, 2, 3, 4, 5, 6, 7, 8, 9]).end(4).some([(el) => el > 5, (el) => el < 9])
		).toBeFalsy();
	});

	it('async some with an array', async () => {
		function *data() {
			for (let i = 0; i < 5; i++) {
				yield Promise.resolve(i);
			}
		}

		expect(await $C(data()).async.some((el) => el > 2)).toBeTruthy();
		expect(await $C(data).async.some((el) => el > 5)).toBeFalsy();
	});
});
