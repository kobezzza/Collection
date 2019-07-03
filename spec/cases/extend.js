/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

describe('Collection.extend', () => {
	it('simple extend with an object', () => {
		const base = {
			a: 1,
			b: 2
		};

		const
			clone = $C.extend(false, {}, base);

		expect(clone).not.toBe(base);
		expect(clone).toEqual(base);
	});

	it('simple extend with an object and without a base object', () => {
		const base = {
			a: 1,
			b: 2
		};

		const
			clone = $C.extend(false, undefined, base);

		expect(clone).not.toBe(base);
		expect(clone).toEqual(base);
	});

	it('simple extend with an array', () => {
		const
			base = [1, 2],
			clone = $C.extend(false, undefined, base);

		expect(clone).not.toBe(base);
		expect(clone).toEqual(base);
	});

	it('simple extend with a map', () => {
		const
			base = new Map([[0, 1], [1, 2]]),
			clone = $C.extend(false, undefined, base);

		expect(clone).not.toBe(base);
		expect(clone).toEqual(base);
	});

	it('simple extend with a weak map', () => {
		const
			key1 = Object(0),
			key2 = Object(1);

		const
			base = new Map([[key1, 1], [key2, 2]]),
			clone = $C.extend(false, new WeakMap(), base);

		expect(clone).not.toBe(base);
		expect(clone instanceof WeakMap).toBeTruthy();
		expect(clone.has(key1)).toBeTruthy();
		expect(clone.has(key2)).toBeTruthy();
	});

	it('simple extend with a set', () => {
		const
			base = new Set([1, 2]),
			clone = $C.extend(false, undefined, base);

		expect(clone).not.toBe(base);
		expect(clone).toEqual(base);
	});

	it('simple extend with a weak set', () => {
		const
			key1 = Object(0),
			key2 = Object(1);

		const
			base = new Set([key1, key2]),
			clone = $C.extend(false, new WeakSet(), base);

		expect(clone).not.toBe(base);
		expect(clone instanceof WeakSet).toBeTruthy();
		expect(clone.has(key1)).toBeTruthy();
		expect(clone.has(key2)).toBeTruthy();
	});

	it('extend with an object and undefined fields', () => {
		const base = {
			a: 1,
			b: 2,
			c: undefined
		};

		const
			clone1 = $C.extend(false, undefined, base);

		expect(clone1).not.toBe(base);
		expect(clone1).toEqual({a: 1, b: 2});

		const
			clone2 = $C.extend({withUndef: true}, undefined, base);

		expect(clone2).not.toBe(base);
		expect(clone2).toEqual(base);
	});

	it('extend objects with {traits: true}', () => {
		const base1 = {
			a: 1,
			b: 2
		};

		const base2 = {
			a: 2,
			c: 3
		};

		expect($C.extend({traits: true}, undefined, base1, base2)).toEqual({
			a: 1,
			b: 2,
			c: 3
		});
	});

	it('extend objects with traits: -1', () => {
		const base1 = {
			a: 1,
			b: 2
		};

		const base2 = {
			a: 2,
			c: 3
		};

		expect($C.extend({traits: -1}, base1, base2)).toEqual({
			a: 2,
			b: 2
		});
	});

	it('extend an object with accessors', () => {
		const base = {
			_a: 1,

			get a() {
				return this._a;
			},

			set a(value) {
				this._a = value;
			}
		};

		const
			clone = $C.extend({withAccessors: true}, undefined, base);

		expect(clone).not.toBe(base);
		expect(clone._a).toBe(1);

		clone.a = 2;
		expect(clone._a).toBe(2);
	});

	it('extend an object with descriptor', () => {
		const
			base = {};

		Object.defineProperty(base, 'a', {
			enumerable: true,
			writable: false,
			value: 1
		});

		const
			clone = $C.extend({withDescriptor: true}, undefined, base);

		expect(clone).not.toBe(base);
		expect(Object.getOwnPropertyDescriptor(clone, 'a')).toEqual({
			enumerable: true,
			configurable: false,
			writable: false,
			value: 1
		});
	});

	it('extend an object with proto', () => {
		const proto = {
			a: 1,
			b: {
				c: 2,
				arr: [1]
			}
		};

		const
			base1 = Object.create(proto);

		$C.extend(false, base1, {
			a: 2,
			b: {
				e: 3,
				arr: [2]
			}
		});

		expect(base1).toEqual({
			a: 2,
			b: {
				e: 3,
				arr: [2]
			}
		});

		expect(proto).toEqual({
			a: 1,
			b: {
				c: 2,
				arr: [1]
			}
		});

		const
			base2 = Object.create(proto);

		$C.extend({deep: true, withProto: true}, base2, {
			a: 2,
			b: {
				e: 3
			}
		});

		expect(base2).toEqual({
			a: 2,
			b: {
				e: 3
			}
		});

		expect(proto).toEqual({
			a: 1,
			b: {
				c: 2,
				arr: [1]
			}
		});

		const
			base3 = Object.create(proto);

		$C.extend({deep: true, withProto: true}, base3, {
			a: 2,
			b: {
				c: 3,
				arr: [1]
			}
		});

		expect(base3).toEqual({
			a: 2,
			b: {
				c: 3,
				arr: [1]
			}
		});

		expect(proto).toEqual({
			a: 1,
			b: {
				c: 2,
				arr: [1]
			}
		});

		const
			base4 = Object.create(proto);

		$C.extend({deep: true}, base4, {
			a: 2,
			b: {
				c: 3,
				arr: [1]
			}
		});

		expect(base4).toEqual({
			a: 2
		});

		expect(proto).toEqual({
			a: 1,
			b: {
				c: 3,
				arr: [1]
			}
		});
	});

	it('extend with an object and {notOwn: true | -1}', () => {
		const base = Object.assign(Object.create({
			a: 1,
			b: {
				c: 2
			}
		}), {
			d: 2
		});

		expect($C.extend(false, undefined, base))
			.toEqual({d: 2});

		expect($C.extend({notOwn: true}, undefined, base)).toEqual({
			a: 1,
			d: 2,
			b: {
				c: 2
			}
		});

		expect($C.extend({notOwn: -1}, undefined, base)).toEqual({
			a: 1,
			b: {
				c: 2
			}
		});
	});

	it('deep extend', () => {
		const base = {
			a: {
				b: 2
			},

			c: new Set([1, 2, 3]),
			d: [1, 2, 3]
		};

		$C.extend(true, base, {
			a: {
				b: 3,
				b2: 3
			},

			c: new Set([4]),
			d: [2, 3]
		});

		expect(base).toEqual({
			a: {
				b: 3,
				b2: 3
			},

			c: new Set([1, 2, 3, 4]),
			d: [2, 3, 3]
		});
	});

	it('async deep extend', async () => {
		const base = {
			a: {
				b: 2
			},

			c: new Set([1, 2, 3]),
			d: [1, 2, 3]
		};

		await $C.extend({async: true, deep: true, filter: () => Promise.resolve(true)}, base, {
			a: {
				b: 3,
				b2: 3
			},

			c: new Set([4]),
			d: [2, 3]
		});

		expect(base).toEqual({
			a: {
				b: 3,
				b2: 3
			},

			c: new Set([1, 2, 3, 4]),
			d: [2, 3, 3]
		});
	});

	it('deep extend with {arrayConcat: true}', () => {
		const base = {
			a: [1, 2, 3]
		};

		$C.extend({deep: true, concatArray: true}, base, {
			a: [2, 3]
		});

		expect(base).toEqual({
			a: [1, 2, 3, 2, 3]
		});
	});

	it('deep extend with {arrayConcat: true, withProto: true}', () => {
		const proto = {
			a: [1, 2, 3]
		};

		const clone = $C.extend({deep: true, concatArray: true}, Object.create(proto), {
			a: [2, 3]
		});

		expect(clone).toEqual({
			a: [1, 2, 3, 2, 3]
		});

		expect(proto).toEqual({
			a: [1, 2, 3]
		});
	});

	it('deep extend with custom array concat', () => {
		const base = {
			a: [1, 2, 3]
		};

		const
			concatFn = (a, b) => [...new Set(a.concat(b))];

		$C.extend({deep: true, concatArray: true, concatFn}, base, {
			a: [2, 3, 4]
		});

		expect(base).toEqual({
			a: [1, 2, 3, 4]
		});
	});

	it('deep extend with extend filter', () => {
		const base = {
			a: {
				b: 2
			},

			c: new Set([1, 2, 3])
		};

		const extendFilter = (data, val) => {
			if (val instanceof Set) {
				return false;
			}

			return true;
		};

		$C.extend({deep: true, extendFilter}, base, {
			a: {
				b: 3,
				b2: 3
			},

			c: new Set([4])
		});

		expect(base).toEqual({
			a: {
				b: 3,
				b2: 3
			},

			c: new Set([4])
		});
	});

	it('$C.clone', () => {
		const base = {
			a: 1,
			b: 2
		};

		const
			clone = $C.clone(base);

		expect(clone).not.toBe(base);
		expect(clone).toEqual(base);
	});
});
