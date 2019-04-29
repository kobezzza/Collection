/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

describe('Collection.get', () => {
	it('get with a string link', () => {
		const obj = {
			a: {
				b: [new Map([['c', new Set(['boom!'])]])]
			}
		};

		expect($C(obj).get('a.b.0.c.boom!')).toBe('boom!');
	});

	it('get with an array link', () => {
		const
			linkStr = Object('boom!'),
			linkObj = {};

		const obj = {
			a: {
				b: [new Map([['c', new WeakMap([[linkObj, new WeakSet([linkStr])]])]])]
			}
		};

		expect($C(obj).get(['a', 'b', 0, 'c', linkObj, linkStr])).toBe(linkStr);
	});
});
