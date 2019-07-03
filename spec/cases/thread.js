/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

describe('Collection methods with threads', () => {
	it('simple thread with forEach', async () => {
		let
			last = 0;

		await $C(1e5).thread().forEach((el, i) => {
			last = i;
		});

		expect(last).toBe(99999);
	});

	it('multiple threads with forEach and priorities', async () => {
		const
			res = new Map();

		await Promise.all([
			$C(1e5).thread('low').forEach((el, i) => {
				res.set('low', i);
			}),

			$C(1e5).thread().forEach((el, i) => {
				res.set('normal', i);
			}),

			$C(1e5).thread('hight').forEach((el, i) => {
				res.set('hight', i);
			}),

			$C(1e5).thread('critical').forEach((el, i) => {
				res.set('critical', i);
			})
		]);

		expect(res).toEqual(new Map([
			['critical', 99999],
			['hight', 99999],
			['normal', 99999],
			['low', 99999]
		]));
	});

	it('thread with forEach and destructor', async () => {
		const
			chunkHandler = jasmine.createSpy('chunkHandler');

		let
			last,
			chunks = 0;

		const thread = $C(new Array(1e6)).thread().forEach((el, i) => last = i, {
			onChunk: (ctx) => {
				chunks++;
				chunkHandler(ctx.length());

				if (chunks >= 2) {
					$C.destroy(thread);
				}
			}
		});

		try {
			await thread;

		} catch (err) {
			expect(err.message).toBe('Thread was destroyed');
			expect(chunkHandler).toHaveBeenCalledTimes(2);
			expect(chunkHandler).toHaveBeenCalledWith(1e6);
			expect(chunkHandler).toHaveBeenCalledWith(1e6);
		}

		expect(last).not.toBe(999999);
	});

	it('thread with child threads', async () => {
		const
			last = [];

		const thread = $C(new Array(3)).thread().forEach((el, i, data, o) => {
			o.wait($C(new Array(1e5)).thread().forEach((el, j) => last[i] = j));
		});

		await thread;
		expect(last).toEqual([99999, 99999, 99999]);
	});

	it('thread with child threads and destructor', async () => {
		const
			last = [0, 0, 0];

		const thread = $C(new Array(3)).thread().forEach((el, i, data, o) => {
			o.wait($C(new Array(1e5)).thread().forEach((el, j) => last[i] = j));

			if (i > 1) {
				$C.destroy(thread);
			}
		});

		try {
			await thread;

		} catch (err) {
			expect(err.message).toBe('Thread was destroyed');
		}

		expect(last).toEqual([0, 0, 0]);
	});

	it('thread with sleep', async () => {
		const
			time = Date.now(),
			times = [];

		const thread = $C(new Array(3)).thread().forEach((el, i, data, o) => {
			times.push(Date.now() - time);
			o.sleep(100);
		});

		await thread;
		expect(times[0]).toBeLessThan(100);
		expect(times[1]).toBeLessThan(200);
		expect(times[2]).toBeLessThan(300);
	});

	it('thread with sleep with destructor', async () => {
		const
			time = Date.now(),
			times = [];

		const thread = $C(new Array(3)).thread().forEach((el, i, data, o) => {
			if (i) {
				// Fake destructor
				$C.destroy(null);
				$C.destroy(thread);
			}

			times.push(Date.now() - time);
			o.sleep(100);
		});

		try {
			await thread;

		} catch (err) {
			expect(err.message).toBe('Thread was destroyed');
		}

		expect(times[0]).toBeLessThan(100);
		expect(times[1]).toBeLessThan(200);
		expect(times[2]).toBeUndefined();
	});
});
