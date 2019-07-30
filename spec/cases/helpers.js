/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

describe('Collection helpers', () => {
	it('filter helper', () => {
		const
			data = [1, 2, 3, 4, 5];

		expect($C(data).filter((el) => el > 2).get()).toEqual([3, 4, 5]);
		expect($C(data)
			.filter((el) => el > 2)
			.filter((el) => el < 5)
			.get()
		).toEqual([3, 4]);
	});

	it('start helper', () => {
		const
			data = [1, 2, 3, 4, 5];

		expect($C(data).start(1).get()).toEqual([2, 3, 4, 5]);
		expect($C(data)
			.start(2)
			.filter((el) => el > 1)
			.get()
		).toEqual([3, 4, 5]);
	});

	it('end helper', () => {
		const
			data = [1, 2, 3, 4, 5];

		expect($C(data).end(2).get()).toEqual([1, 2, 3]);
		expect($C(data)
			.end(2)
			.filter((el) => el < 5)
			.get()
		).toEqual([1, 2, 3]);
	});

	it('from helper', () => {
		const
			data = [1, 2, 3, 4, 5];

		expect($C(data).from(1).get()).toEqual([2, 3, 4, 5]);
		expect($C(data)
			.from(1)
			.filter((el) => el > 1)
			.get()
		).toEqual([3, 4, 5]);
	});

	it('count helper', () => {
		const
			data = [1, 2, 3, 4, 5];

		expect($C(data).count(2).get()).toEqual([1, 2]);
		expect($C(data)
			.count(2)
			.filter((el) => el > 1)
			.get()
		).toEqual([2, 3]);
	});

	it('object helper', () => {
		const
			data = {a: 1, b: 2, __proto__: {c: 3}};

		expect($C(data).get()).toEqual([1, 2]);
		expect($C(data).object(true).get()).toEqual([1, 2, 3]);
		expect($C(data).object(-1).get()).toEqual([3]);
	});

	it('descriptor helper', () => {
		const data = {};

		Object.defineProperty(data, 'a', {
			enumerable: true,

			get() {
				return 1;
			}
		});

		expect($C(data).descriptor.get()).toEqual([{
			enumerable: true,
			configurable: false,
			set: undefined,
			get: Object.getOwnPropertyDescriptor(data, 'a').get
		}]);
	});

	it('one helper', () => {
		expect($C([1, 2, 3]).one.get()).toEqual(1);
	});

	it('reverse helper', () => {
		expect($C([1, 2, 3]).reverse.get()).toEqual([3, 2, 1]);
	});

	it('inverse helper', () => {
		expect($C([1, 2, 3]).inverse.get((el) => el > 1)).toEqual([1]);
	});

	it('iterator helper', async () => {
		const
			data = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];

		data[Symbol.iterator] = function *() {
			for (let i = 1; i < data.length; i++) {
				yield data[i];
			}
		};

		expect($C(data).iterator().get()).toEqual(data.slice(1));
		expect($C(data).iterator(false).get()).toEqual(data.slice(1));
		expect(await $C(data).iterator(true).get()).toEqual([2, 3]);
	});

	it('array helper', () => {
		const data = {0: 1, 1: 2, length: 2};
		expect($C(data).array.get()).toEqual([1, 2]);
	});

	it('live helper', () => {
		const
			data = [0];

		$C(data).live.forEach((el, i) => {
			if (i < 3) {
				data.push(i + 1);
			}
		});

		expect(data).toEqual([0, 1, 2, 3]);
	});

	it('async helper', async () => {
		const data = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];
		expect(await $C(data).async.get()).toEqual([1, 2, 3]);
	});

	it('to helper', async () => {
		expect($C([1, 2, 3]).to(0).reduce((res, el) => res + el)).toBe(6);
	});
});
