/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

describe('Collection methods with streams', () => {
	if (typeof window !== 'undefined') {
		return;
	}

	const
		{Transform} = require('stream');

	function generateStream(i, method = 'push') {
		const stream = new Transform({
			readableObjectMode: true,
			writableObjectMode: true,
			transform(chunk, enc, cb) {
				cb(null, chunk);
			}
		});

		let
			j = 0;

		(function loop() {
			setTimeout(() => {
				if (i--) {
					stream[method](j++);
					loop();

				} else {
					stream.end();
				}
			}, 50);
		})();

		return stream;
	}

	it('map from a stream', (done) => {
		const
			length = 5,
			dataHandler = jasmine.createSpy();

		$C(generateStream(length)).map((el) => el * 2)
			.addListener('data', dataHandler)
			.addListener('end', () => {
				expect(dataHandler).toHaveBeenCalledTimes(length);
				expect(dataHandler).toHaveBeenCalledWith(0);
				expect(dataHandler).toHaveBeenCalledWith(2);
				expect(dataHandler).toHaveBeenCalledWith(4);
				expect(dataHandler).toHaveBeenCalledWith(6);
				expect(dataHandler).toHaveBeenCalledWith(8);
				expect(dataHandler).not.toHaveBeenCalledWith(10);
				done();
			});
	});

	it('map from a write stream', (done) => {
		const
			length = 5,
			dataHandler = jasmine.createSpy();

		$C(generateStream(length, 'write')).map((el) => el * 2)
			.addListener('data', dataHandler)
			.addListener('end', () => {
				expect(dataHandler).toHaveBeenCalledTimes(length);
				expect(dataHandler).toHaveBeenCalledWith(0);
				expect(dataHandler).toHaveBeenCalledWith(2);
				expect(dataHandler).toHaveBeenCalledWith(4);
				expect(dataHandler).toHaveBeenCalledWith(6);
				expect(dataHandler).toHaveBeenCalledWith(8);
				expect(dataHandler).not.toHaveBeenCalledWith(10);
				done();
			});
	});

	it('map from a stream with parameters', (done) => {
		const
			dataHandler = jasmine.createSpy();

		$C(generateStream(9))
			.filter((el) => el % 2)
			.from(1)
			.count(2)
			.map()

			.addListener('data', dataHandler)
			.addListener('end', () => {
				expect(dataHandler).toHaveBeenCalledTimes(2);
				expect(dataHandler).toHaveBeenCalledWith(3);
				expect(dataHandler).toHaveBeenCalledWith(5);
				done();
			});
	});

	it('map from a stream with .one helper', (done) => {
		const
			dataHandler = jasmine.createSpy();

		$C(generateStream(5))
			.one
			.map()

			.addListener('data', dataHandler)
			.addListener('end', () => {
				expect(dataHandler).toHaveBeenCalledTimes(1);
				expect(dataHandler).toHaveBeenCalledWith(0);
				expect(dataHandler).not.toHaveBeenCalledWith(1);
				done();
			});
	});

	it('reduce from a stream to an array', async () => {
		expect(
			await $C(generateStream(3)).to([]).reduce((res, el) => {
				res.push(el * 2);
				return res;
			})
		).toEqual([0, 2, 4]);
	});

	it('reduce from a stream to a stream', (done) => {
		const
			length = 5,
			dataHandler = jasmine.createSpy();

		$C(generateStream(length)).toStream().reduce((res, el) => {
			res.write(el * 2);
			return res;
		})
			.addListener('data', dataHandler)
			.addListener('end', () => {
				expect(dataHandler).toHaveBeenCalledTimes(length);
				expect(dataHandler).toHaveBeenCalledWith(0);
				expect(dataHandler).toHaveBeenCalledWith(2);
				expect(dataHandler).toHaveBeenCalledWith(4);
				expect(dataHandler).toHaveBeenCalledWith(6);
				expect(dataHandler).toHaveBeenCalledWith(8);
				expect(dataHandler).not.toHaveBeenCalledWith(10);
				done();
			});
	});

	it('map from reduce from a stream to a stream', (done) => {
		const
			length = 5,
			dataHandler = jasmine.createSpy();

		$C(
			$C(generateStream(length)).toStream().reduce((res, el) => {
				res.write(el);
				return res;
			})
		)
			.map((el) => el * 2)

			.addListener('data', dataHandler)
			.addListener('end', () => {
				expect(dataHandler).toHaveBeenCalledTimes(length);
				expect(dataHandler).toHaveBeenCalledWith(0);
				expect(dataHandler).toHaveBeenCalledWith(2);
				expect(dataHandler).toHaveBeenCalledWith(4);
				expect(dataHandler).toHaveBeenCalledWith(6);
				expect(dataHandler).toHaveBeenCalledWith(8);
				expect(dataHandler).not.toHaveBeenCalledWith(10);
				done();
			});
	});

	it('reduce from a stream to an array with parameters', async () => {
		expect(
			await $C(generateStream(9))
				.filter((el) => el % 2)
				.from(1)
				.count(2)
				.to([])
				.reduce((res, el) => {
					res.push(el);
					return res;
				})
		).toEqual([3, 5]);
	});

	it('reduce from a stream to a stream with parameters', (done) => {
		const
			dataHandler = jasmine.createSpy();

		$C(generateStream(9))
			.filter((el) => el % 2)
			.from(1)
			.count(2)
			.toStream()
			.reduce((res, el) => {
				res.write(el);
				return res;
			})

			.addListener('data', dataHandler)
			.addListener('end', () => {
				expect(dataHandler).toHaveBeenCalledTimes(2);
				expect(dataHandler).toHaveBeenCalledWith(3);
				expect(dataHandler).toHaveBeenCalledWith(5);
				done();
			});
	});

	it('reduce from a stream with .one helper', (done) => {
		const
			dataHandler = jasmine.createSpy();

		$C(generateStream(5))
			.one
			.toStream()
			.reduce((res, el) => {
				res.write(el);
				return res;
			})

			.addListener('data', dataHandler)
			.addListener('end', () => {
				expect(dataHandler).toHaveBeenCalledTimes(1);
				expect(dataHandler).toHaveBeenCalledWith(0);
				expect(dataHandler).not.toHaveBeenCalledWith(1);
				done();
			});
	});

	it('race map with a stream', (done) => {
		const
			dataHandler = jasmine.createSpy();

		$C(generateStream(5))
			.race(2)
			.map()

			.addListener('data', dataHandler)
			.addListener('end', () => {
				expect(dataHandler).toHaveBeenCalledTimes(2);
				expect(dataHandler).toHaveBeenCalledWith(0);
				expect(dataHandler).toHaveBeenCalledWith(1);
				done();
			});
	});
});
