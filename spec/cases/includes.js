/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

describe('Collection.includes', () => {
	it('includes with an array', () => {
		const data = [1, 2, 3, 4, 5];
		expect($C(data).includes(4)).toBeTruthy();
		expect($C(data).includes(10)).toBeFalsy();
	});

	it('includes with an array and NaN', () => {
		expect($C([NaN]).includes(NaN)).toBeTruthy();
		expect($C([1, 2, 3]).includes(NaN)).toBeFalsy();
		expect($C(['foo']).includes(NaN)).toBeFalsy();
	});

	it('async includes with an array', async () => {
		function *data() {
			for (let i = 0; i < 5; i++) {
				yield Promise.resolve(i);
			}
		}

		expect(await $C(data()).async.includes(2)).toBeTruthy();
		expect(await $C(data).async.includes(10)).toBeFalsy();
	});
});
