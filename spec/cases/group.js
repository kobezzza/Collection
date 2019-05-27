/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

describe('Collection.group', () => {
	const data = [
		{name: 'Andrey', features: {code: true, music: true}, lvl: 80},
		{name: 'Dmitry', features: {code: true, design: true}, lvl: 70},
		{name: 'Daria', features: {management: true, speak: true}, lvl: 80}
	];

	it('group by an element', () => {
		expect($C([1, 2, 2]).group()).toEqual({
			1: [1],
			2: [2, 2]
		});
	});

	it('group keys by an element', () => {
		expect($C([1, 2, 2]).group(null, {saveKeys: true})).toEqual({
			1: [0],
			2: [1, 2]
		});
	});

	it('group keys by an element to a map', () => {
		expect($C([1, 2, 2]).to(new Map()).group(null, {saveKeys: true})).toEqual(new Map([
			[1, [0]],
			[2, [1, 2]]
		]));
	});

	it('group by a link to an object', () => {
		expect($C(data).group('lvl')).toEqual({
			70: [
				{
					name: 'Dmitry',
					features: {code: true, design: true},
					lvl: 70
				}
			],

			80: [
				{
					name: 'Andrey',
					features: {code: true, music: true},
					lvl: 80
				},

				{
					name: 'Daria',
					features: {management: true, speak: true},
					lvl: 80
				}
			]
		});

		expect($C(data).group('features.code')).toEqual({
			true: [
				{
					name: 'Andrey',
					features: {code: true, music: true},
					lvl: 80
				},

				{
					name: 'Dmitry',
					features: {code: true, design: true},
					lvl: 70
				}
			],

			undefined: [
				{
					name: 'Daria',
					features: {management: true, speak: true},
					lvl: 80
				}
			]
		});
	});

	it('group by a link to a custom object', () => {
		expect($C(data).to({}).group('lvl')).toEqual({
			70: [
				{
					name: 'Dmitry',
					features: {code: true, design: true},
					lvl: 70
				}
			],

			80: [
				{
					name: 'Andrey',
					features: {code: true, music: true},
					lvl: 80
				},

				{
					name: 'Daria',
					features: {management: true, speak: true},
					lvl: 80
				}
			]
		});
	});

	it('group by a link to a map', () => {
		expect($C(data).to(new Map()).group('lvl')).toEqual(new Map([
			[70, [
				{
					name: 'Dmitry',
					features: {code: true, design: true},
					lvl: 70
				}
			]],

			[80, [
				{
					name: 'Andrey',
					features: {code: true, music: true},
					lvl: 80
				},

				{
					name: 'Daria',
					features: {management: true, speak: true},
					lvl: 80
				}
			]]
		]));

		expect($C(data).group('lvl', {useMap: true})).toEqual(new Map([
			[70, [
				{
					name: 'Dmitry',
					features: {code: true, design: true},
					lvl: 70
				}
			]],

			[80, [
				{
					name: 'Andrey',
					features: {code: true, music: true},
					lvl: 80
				},

				{
					name: 'Daria',
					features: {management: true, speak: true},
					lvl: 80
				}
			]]
		]));

		expect($C(data).to(new Map()).group('features.code')).toEqual(new Map([
			[true, [
				{
					name: 'Andrey',
					features: {code: true, music: true},
					lvl: 80
				},

				{
					name: 'Dmitry',
					features: {code: true, design: true},
					lvl: 70
				}
			]],

			[undefined, [
				{
					name: 'Daria',
					features: {management: true, speak: true},
					lvl: 80
				}
			]]
		]));
	});

	it('group by a function to an object with a filter', () => {
		expect($C(data).filter((el) => el.name !== 'Andrey').group((el, i, data, o) => el.lvl)).toEqual({
			70: [
				{
					name: 'Dmitry',
					features: {code: true, design: true},
					lvl: 70
				}
			],

			80: [
				{
					name: 'Daria',
					features: {management: true, speak: true},
					lvl: 80
				}
			]
		});
	});

	it('group by a function to a weak map', () => {
		expect($C(data).to(new WeakMap()).group((el) => Object(el.lvl))).toEqual(new WeakMap([
			[Object(70), [
				{
					name: 'Dmitry',
					features: {code: true, design: true},
					lvl: 70
				}
			]],

			[Object(80), [
				{
					name: 'Andrey',
					features: {code: true, music: true},
					lvl: 80
				},

				{
					name: 'Daria',
					features: {management: true, speak: true},
					lvl: 80
				}
			]]
		]));
	});

	it('async group by a function to an object', async () => {
		expect(await $C(data).async.group((el) => Promise.resolve(el.lvl))).toEqual({
			70: [
				{
					name: 'Dmitry',
					features: {code: true, design: true},
					lvl: 70
				}
			],

			80: [
				{
					name: 'Andrey',
					features: {code: true, music: true},
					lvl: 80
				},

				{
					name: 'Daria',
					features: {management: true, speak: true},
					lvl: 80
				}
			]
		});

		expect(await $C(data).async.to({}).group((el) => Promise.resolve(el.lvl))).toEqual({
			70: [
				{
					name: 'Dmitry',
					features: {code: true, design: true},
					lvl: 70
				}
			],

			80: [
				{
					name: 'Andrey',
					features: {code: true, music: true},
					lvl: 80
				},

				{
					name: 'Daria',
					features: {management: true, speak: true},
					lvl: 80
				}
			]
		});
	});

	it('async group by a function to a map', async () => {
		expect(await $C(data).to(new Map()).async.group((el) => Promise.resolve(el.lvl))).toEqual(new Map([
			[70, [
				{
					name: 'Dmitry',
					features: {code: true, design: true},
					lvl: 70
				}
			]],

			[80, [
				{
					name: 'Andrey',
					features: {code: true, music: true},
					lvl: 80
				},

				{
					name: 'Daria',
					features: {management: true, speak: true},
					lvl: 80
				}
			]]
		]));
	});
});
