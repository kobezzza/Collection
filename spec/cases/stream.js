/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

describe('Collection methods with streams', () => {
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
});
