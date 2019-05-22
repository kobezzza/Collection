/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

describe('Collection.every', () => {
	it('every with an array', () => {
		const
			data = [1, 2, 0, 4, 5],
			filter = jasmine.createSpy('filter');

		expect($C(data).every((el) => {
			filter(el);
			return el > 0;
		})).toBeFalsy();

		expect(filter).toHaveBeenCalledTimes(3);
		expect(filter).toHaveBeenCalledWith(1);
		expect(filter).toHaveBeenCalledWith(2);
		expect(filter).toHaveBeenCalledWith(0);

		expect($C(data).some((el) => el >= 0)).toBeTruthy();
	});

	it('every with an array and multiple parameters', () => {
		expect(
			$C([1, 2, 3, 4, 5, 6, 7, 8, 9]).filter((el) => el > 0).every({
				filter: (el) => el < 10,
				from: 1,
				count: 2
			})
		).toBeTruthy();

		expect(
			$C([1, 2, 3, 4, 5, 6, 7, 8, 9]).every([(el) => el > 0, (el) => el < 10])
		).toBeTruthy();

		expect(
			$C([1, 2, 3, 4, 5, 6, 7, 8, 9]).every([(el) => el > 5, (el) => el < 9])
		).toBeFalsy();
	});

	it('async every with an array', async () => {
		function *data() {
			for (let i = 0; i < 5; i++) {
				yield Promise.resolve(i);
			}
		}

		expect(await $C(data()).async.every((el) => el >= 0)).toBeTruthy();
		expect(await $C(data).async.every((el) => el > 1)).toBeFalsy();
	});
});
