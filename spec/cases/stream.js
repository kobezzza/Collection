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

	function generateStream(i, error = false, method = 'push') {
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
					if (error && j) {
						stream.destroy(error);
						return;
					}

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
			dataHandler = jasmine.createSpy('dataHandler');

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

	it('async map from a stream', (done) => {
		const
			length = 5,
			dataHandler = jasmine.createSpy('dataHandler');

		$C(generateStream(length)).async.map((el) => Promise.resolve(el * 2))
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

	it('map from a stream with a water mark', (done) => {
		const
			length = 5,
			dataHandler = jasmine.createSpy('dataHandler');

		$C([0, 1, 2, 3, 4])
			.to(new Transform({
				readableObjectMode: true,
				writableObjectMode: true,
				highWaterMark: 2,
				transform(chunk, enc, cb) {
					setImmediate(() => cb(null, chunk));
				}
			}))

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

	it('map from a stream with an error', (done) => {
		const
			length = 5,
			dataHandler = jasmine.createSpy('dataHandler'),
			errorHandler = jasmine.createSpy('errorHandler');

		const
			err = new Error('boom!');

		$C(generateStream(length)).map((el, i) => {
			if (i) {
				throw err;
			}

			return el * 2;
		})
			.addListener('data', dataHandler)
			.addListener('error', (err) => {
				errorHandler(err);
			})

			.addListener('close', () => setImmediate(() => {
				expect(dataHandler).toHaveBeenCalledTimes(1);
				expect(dataHandler).toHaveBeenCalledWith(0);

				expect(errorHandler).toHaveBeenCalledTimes(1);
				expect(errorHandler).toHaveBeenCalledWith(err);
				done();
			}));
	});

	it('map from a stream with a readable error', (done) => {
		const
			length = 5,
			dataHandler = jasmine.createSpy('dataHandler'),
			errorHandler = jasmine.createSpy('errorHandler');

		const
			err = new Error('boom!');

		$C(generateStream(length, err)).map((el, i) => {
			if (i) {
				throw err;
			}

			return el * 2;
		})
			.addListener('data', dataHandler)
			.addListener('error', errorHandler)
			.addListener('close', () => setImmediate(() => {
				expect(dataHandler).toHaveBeenCalledTimes(1);
				expect(dataHandler).toHaveBeenCalledWith(0);

				expect(errorHandler).toHaveBeenCalledTimes(1);
				expect(errorHandler).toHaveBeenCalledWith(err);
				done();
			}));
	});

	it('map from a stream with a writable error', (done) => {
		const
			length = 5,
			dataHandler = jasmine.createSpy('dataHandler'),
			errorHandler = jasmine.createSpy('errorHandler');

		const
			err = new Error('boom!');

		let
			i = 0;

		$C(generateStream(length))
			.to(new Transform({
				readableObjectMode: true,
				writableObjectMode: true,
				highWaterMark: 2,
				transform(chunk, enc, cb) {
					if (i++) {
						cb(err);
						return;
					}

					setImmediate(() => cb(null, chunk));
				}
			}))

			.map((el) => el * 2)

			.addListener('data', dataHandler)
			.addListener('error', errorHandler)
			.addListener('close', () => {
				expect(dataHandler).toHaveBeenCalledTimes(1);
				expect(dataHandler).toHaveBeenCalledWith(0);
				expect(errorHandler).toHaveBeenCalledWith(err);
				done();
			});
	});

	it('map from a stream with a write error', (done) => {
		const
			length = 5,
			dataHandler = jasmine.createSpy('dataHandler'),
			errorHandler = jasmine.createSpy('errorHandler');

		const
			err = new Error('boom!');

		let
			i = 0;

		$C(generateStream(length))
			.to(new Transform({
				readableObjectMode: true,
				writableObjectMode: true,
				highWaterMark: 2,
				transform(chunk, enc, cb) {
					if (i++) {
						throw err;
					}

					setImmediate(() => cb(null, chunk));
				}
			}))

			.map((el) => el * 2)

			.addListener('data', dataHandler)
			.addListener('error', errorHandler)
			.addListener('close', () => setImmediate(() => {
				expect(dataHandler).toHaveBeenCalledTimes(1);
				expect(dataHandler).toHaveBeenCalledWith(0);

				expect(errorHandler).toHaveBeenCalledTimes(1);
				expect(errorHandler).toHaveBeenCalledWith(err);
				done();
			}));
	});

	it('map from a stream with closing', (done) => {
		const
			length = 5,
			dataHandler = jasmine.createSpy('dataHandler'),
			errorHandler = jasmine.createSpy('errorHandler');

		let
			i = 0;

		$C(generateStream(length))
			.to(new Transform({
				readableObjectMode: true,
				writableObjectMode: true,
				highWaterMark: 2,
				transform(chunk, enc, cb) {
					if (i++) {
						this.destroy();
						return;
					}

					setImmediate(() => cb(null, chunk));
				}
			}))

			.map((el) => el * 2)

			.addListener('data', dataHandler)
			.addListener('error', errorHandler)
			.addListener('close', () => {
				expect(dataHandler).toHaveBeenCalledTimes(1);
				expect(dataHandler).toHaveBeenCalledWith(0);
				expect(errorHandler).toHaveBeenCalledTimes(0);
				done();
			});
	});

	it('map from a stream with break', (done) => {
		const
			length = 5,
			dataHandler = jasmine.createSpy('dataHandler');

		$C(generateStream(length))
			.map((el, i, data, o) => {
				if (i) {
					return o.break;
				}

				return el * 2;
			})

			.addListener('data', dataHandler)
			.addListener('end', () => {
				expect(dataHandler).toHaveBeenCalledTimes(1);
				expect(dataHandler).toHaveBeenCalledWith(0);
				done();
			});
	});

	it('map from a write stream', (done) => {
		const
			length = 5,
			dataHandler = jasmine.createSpy('dataHandler');

		$C(generateStream(length, false, 'write')).map((el) => el * 2)
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
			dataHandler = jasmine.createSpy('dataHandler');

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
			dataHandler = jasmine.createSpy('dataHandler');

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
			dataHandler = jasmine.createSpy('dataHandler');

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
			dataHandler = jasmine.createSpy('dataHandler');

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
			dataHandler = jasmine.createSpy('dataHandler');

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
			dataHandler = jasmine.createSpy('dataHandler');

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
			dataHandler = jasmine.createSpy('dataHandler');

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
