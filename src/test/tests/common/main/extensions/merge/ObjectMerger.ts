/* tslint:disable:no-empty no-identical-functions max-line-length no-construct use-primitive-type */
// @ts-ignore
// noinspection ES6UnusedImports
import deepClone from 'fast-copy'
// @ts-ignore
// noinspection ES6UnusedImports
import { deepEqual as deepStrictEqual } from 'fast-equals'
import {IMergeable, IMergeOptions, IMergeValue} from '../../../../../../main/common/extensions/merge/contracts'
import {registerMergeable} from '../../../../../../main/common/extensions/merge/mergers'
import {fillMap, fillSet} from '../../../../../../main/common/lists/helpers/set'
import {ObservableMap} from '../../../../../../main/common/lists/ObservableMap'
import {toIterable} from '../../lists/src/helpers/common'
import {BASE, IMergerOptionsVariant, isRefer, NEWER, NONE, OLDER, TestMerger} from './src/TestMerger'
import {ArrayMap} from "../../../../../../main/common/lists/ArrayMap";
import {ObjectMap} from "../../../../../../main/common/lists/ObjectMap";
import {ObjectHashMap} from "../../../../../../main/common/lists/ObjectHashMap";
import {ObservableSet} from "../../../../../../main/common/lists/ObservableSet";
import {ArraySet} from "../../../../../../main/common/lists/ArraySet";
import {ObjectSet} from "../../../../../../main/common/lists/ObjectSet";
import {SortedList} from "../../../../../../main/common/lists/SortedList";

declare const assert
declare const after
declare function deepStrictEqual(a, b): boolean
// declare function deepClone<T extends any>(o: T): T

describe('common > extensions > merge > ObjectMerger', function() {
	this.timeout(60000)

	const testMerger = TestMerger.test

	after(function() {
		console.log('Total ObjectMerger tests >= ' + TestMerger.totalTests)
	})

	function canBeReferObject(value) {
		return value != null
			&& !isRefer(value)
			&& (value.constructor === Object || typeof value === 'function')
	}

	function mustBeSet(o: IMergerOptionsVariant) {
		if (!o.setFunc) {
			return false
		}

		if (o.base === o.older && o.base === o.newer) {
			return false
		}

		// if (o.base != null && o.base.constructor === Object && Object.isFrozen(o.base)) {
		// 	return true
		// }

		if (o.base instanceof Class
			&& (deepStrictEqual(o.base, o.older) || deepStrictEqual(o.base.value, o.older) && o.older != null && o.older.constructor === Object)
			&& (deepStrictEqual(o.base, o.newer) || deepStrictEqual(o.base.value, o.newer) && o.newer != null && o.newer.constructor === Object)
		) {
			return false
		}

		return !deepStrictEqual(o.base, o.newer) || !deepStrictEqual(o.base, o.older)
	}

	function mustBeFilled(o: IMergerOptionsVariant) {
		return !o.preferCloneBase
			&& o.base != null && o.base.constructor === Object
			&& (!deepStrictEqual(o.base, o.newer) && o.newer != null && o.newer.constructor === Object
				|| deepStrictEqual(o.base, o.newer)
					&& !deepStrictEqual(o.base, o.older) && o.older != null && o.older.constructor === Object)
	}

	class Class implements IMergeable<Class, object> {
		public value: any

		constructor(value: any) {
			this.value = value
		}

		public canMerge(source: (Class | object)): boolean {
			if (source.constructor !== Class && source.constructor !== Object) {
				return false
			}
			return true
		}

		public merge(
			merge: IMergeValue,
			older: Class | object,
			newer: Class | object,
			preferCloneOlder?: boolean,
			preferCloneNewer?: boolean,
			options?: IMergeOptions,
		): boolean {
			let changed = false
			changed = merge(
				this.value,
				older instanceof Class ? (older as any).value : older,
				newer instanceof Class ? (newer as any).value : newer,
				o => this.value = o) || changed

			return changed
		}
	}

	registerMergeable(Class)

	it('base', function() {
		assert.ok(deepStrictEqual(
			new Class({a: {a: 1, b: 2}, b: 3}),
			new Class({a: {a: 1, b: 2}, b: 3}),
		))

		assert.ok(deepStrictEqual(
			deepClone(new Class({a: {a: 1, b: 2}, b: 3})),
			new Class({a: {a: 1, b: 2}, b: 3}),
		))

		// tslint:disable-next-line:use-primitive-type no-construct
		const symbol = {x: new String('SYMBOL')}
		const symbolClone = deepClone(symbol)
		assert.ok(deepStrictEqual(symbol, symbolClone))
	})

	describe('combinations', function() {
		const options = {
			preferCloneOlderParam: [null, false, true],
			preferCloneNewerParam: [null, false, true],
			preferCloneMeta: [null, false, true],
			valueType: [null],
			valueFactory: [null],
			setFunc: [false, true],
			exclude: o => {
				// if (typeof o.older.constructor === Object && typeof o.newer.constructor === Object) {
				// 	return true
				// }
				if (o.newer === NEWER || (o.base === NEWER || o.older === NEWER) && !canBeReferObject(o.newer)) {
					return true
				}
				if (o.older === OLDER || (o.base === OLDER || o.newer === OLDER) && !canBeReferObject(o.older)) {
					return true
				}
				if (o.base === BASE || (o.older === BASE || o.newer === BASE) && !canBeReferObject(o.base)) {
					return true
				}

				if (o.base != null && typeof o.base === 'object'
					&& o.older != null && typeof o.older === 'object'
					&& o.newer != null && typeof o.newer === 'object'
				) {
					return true
				}

				if (o.preferCloneMeta != null
					&& (o.older != null && typeof o.older === 'object'
						|| o.newer != null && typeof o.newer === 'object')
				) {
					return true
				}

				if (typeof o.base === 'object' && !Object.isFrozen(o.base) && !isRefer(o.base)) {
					o.base = deepClone(o.base)
				}
				if (typeof o.older === 'object' && !Object.isFrozen(o.older) && !isRefer(o.older)) {
					o.older = deepClone(o.older)
				}

				return false
			},
			expected: {
				error: null,
				returnValue: o => mustBeSet(o) || mustBeFilled(o),
				setValue: o => {
					const deepStrictEqual2 = deepStrictEqual

					if (!mustBeSet(o)) {
						return NONE
					}

					if (o.base != null && o.base.constructor === Object) {
						if (o.newer != null && o.newer.constructor === Object) {
							if (deepStrictEqual2(o.base, o.newer)) {
								if (o.older != null && o.older.constructor === Object) {
									return o.preferCloneBase
										? deepClone(o.older)
										: NONE
								} else {
									return OLDER
								}
							} else {
								return o.preferCloneBase
									? deepClone(o.newer)
									: NONE
							}
						}
					} else if (
						o.older != null && o.older.constructor === Object
						&& o.newer != null && o.newer.constructor === Object
					) {
						if (deepStrictEqual2(o.older, o.newer)) {
							return !o.preferCloneNewer
								? NEWER
								: (o.preferCloneOlder ? deepClone(o.newer) : OLDER)
						} else {
							return o.preferCloneOlder
								? deepClone(o.newer)
								: OLDER
						}
					}

					if (o.base != null && o.base.constructor === Object
						&& o.older != null && o.older.constructor === Object
						&& o.newer != null && o.newer.constructor === Object
					) {
						return o.preferCloneBase
							? deepClone(deepStrictEqual2(o.base, o.newer)
								? o.older
								: o.newer)
							: NONE
					}

					if (o.base instanceof Class
						&& (o.older instanceof Class || o.older != null && o.older.constructor === Object)
						&& (o.newer instanceof Class || o.newer != null && o.newer.constructor === Object)
					) {
						return NONE
					}

					if (o.base instanceof Class
						&& !(o.older instanceof Class || o.older != null && o.older.constructor === Object)
						&& (o.newer instanceof Class || o.newer != null && o.newer.constructor === Object)
						&& !deepStrictEqual2(o.base, o.newer)
						&& !deepStrictEqual2(o.base.value, o.newer)
					) {
						return NONE
					}

					if (o.base != null && o.base.constructor === Object && !Object.isFrozen(o.base)
						&& !(o.older != null && o.older.constructor === Object)
						&& (o.newer != null && o.newer.constructor === Object)
						&& !deepStrictEqual2(o.base, o.newer)
					) {
						return NONE
					}

					if (!(o.base instanceof Class)
						&& o.older instanceof Class
						&& (o.newer instanceof Class || o.newer != null && o.newer.constructor === Object)
					) {
						return OLDER
					}

					if (!deepStrictEqual2(o.base, o.newer)
						&& o.older !== o.newer
						&& deepStrictEqual2(o.older, o.newer)
						&& o.older instanceof Date && o.newer instanceof Date
						&& o.preferCloneNewer && !o.preferCloneOlder
					) {
						return OLDER
					}

					if ((o.older instanceof Class || o.older != null && o.older.constructor === Object)
						&& o.newer != null && o.newer.constructor === Object
						&& (o.preferCloneOlder && !deepStrictEqual2(o.older, o.newer)
							|| o.preferCloneOlder && o.preferCloneNewer)
						|| o.newer === o.older && (o.preferCloneOlder || o.preferCloneNewer)
					) {
						return deepClone(o.newer)
					}

					if (o.older != null && o.older.constructor === Object && !Object.isFrozen(o.older)
						&& o.newer != null && o.newer.constructor === Object
					) {
						return OLDER
					}

					return !(deepStrictEqual2(o.base, o.newer)
						|| o.base instanceof Class && deepStrictEqual2(o.base.value, o.newer)
						&& o.newer != null && o.newer.constructor === Object)
					|| o.newer !== o.base
					&& o.base != null && o.base.constructor === Object && Object.isFrozen(o.base)
						? NEWER
						: OLDER
				},
				base: BASE,
				older: OLDER,
				newer: NEWER,
			},
			actions: null,
		}

		it('primitives', function() {
			const createValues = () => [
				BASE, OLDER, NEWER,
				null, void 0, 0, 1, false, true,
			]

			testMerger({
				...options,
				base: createValues(),
				older: createValues(),
				newer: createValues(),
			})
		})

		it('strings', function() {
			const createValues = () => [
				BASE, OLDER, NEWER,
				void 0, 1, '', '1', '2',
			]

			testMerger({
				...options,
				base: createValues(),
				older: createValues(),
				newer: createValues(),
			})
		})

		it('date', function() {
			const createValues = () => [
				BASE, OLDER, NEWER,
				void 0, '', {}, new Date(1), new Date(2), new Date(3),
			]

			testMerger({
				...options,
				base: createValues(),
				older: createValues(),
				newer: createValues(),
			})
		})

		it('objects', function() {
			const createValues = () => [
				BASE, OLDER, NEWER,
				null, {}, new Date(1),
				/* new Class(new Date(1)), new Class({ a: {a: 1, b: 2}, b: 3 }), new Class(Object.freeze({ x: {y: 1} })), */
				{a: {a: 1, b: 2}, b: 3}, {a: {b: 4, c: 5}, c: 6}, {a: {a: 7, b: 8}, d: 9}, Object.freeze({x: {y: 1}}),
			]

			testMerger({
				...options,
				base: createValues(),
				older: createValues(),
				newer: createValues(),
			})
		})

		xit('full', function() {
			const createValues = () => [
				BASE, OLDER, NEWER,
				null, void 0, 0, 1, false, true, '', '1',
				/* new Class(new Date(1)), new Class({ a: {a: 1, b: 2}, b: 3 }), new Class(Object.freeze({ x: {y: 1} })), */
				{}, {a: {a: 1, b: 2}, b: 3}, {a: {b: 4, c: 5}, c: 6}, {a: {a: 7, b: 8}, d: 9}, Object.freeze({x: {y: 1}}),
				new Date(1), new Date(2),
			]

			testMerger({
				...options,
				base: createValues(),
				older: createValues(),
				newer: createValues(),
			})
		})
	})

	it('custom class', function() {
		testMerger({
			base: [new Class({ a: {a: 1, b: 2}, b: 3 })],
			older: [new Class({ a: {a: 4, b: 5}, c: 6 }), { a: {a: 4, b: 5}, c: 6 }],
			newer: [new Class({ a: {a: 7, b: 2}, d: 9 }), { a: {a: 7, b: 2}, d: 9 }],
			preferCloneOlderParam: [null],
			preferCloneNewerParam: [null],
			preferCloneMeta: [null],
			options: [null, {}],
			valueType: [null],
			valueFactory: [null],
			setFunc: [true],
			expected: {
				error: null,
				returnValue: true,
				setValue: NONE,
				base: new Class({ a: {a: 7, b: 5}, c: 6, d: 9 }),
				older: OLDER,
				newer: NEWER,
			},
			actions: null,
		})
	})

	it('strings', function() {
		testMerger({
			base: ['', '1', '2', new String('1')],
			older: ['2', new String('2')],
			newer: ['3', new String('3')],
			preferCloneOlderParam: [null],
			preferCloneNewerParam: [null],
			preferCloneMeta: [null],
			options: [null, {}],
			valueType: [null],
			valueFactory: [null],
			setFunc: [true],
			expected: {
				error: null,
				returnValue: true,
				setValue: '3',
				base: BASE,
				older: OLDER,
				newer: NEWER,
			},
			actions: null,
		})
	})

	it('number / boolean', function() {
		testMerger({
			base: [new Number(1)],
			older: [2, new Number(2)],
			newer: [3, new Number(3)],
			preferCloneOlderParam: [null],
			preferCloneNewerParam: [null],
			preferCloneMeta: [null],
			options: [null, {}],
			valueType: [null],
			valueFactory: [null],
			setFunc: [true],
			expected: {
				error: null,
				returnValue: true,
				setValue: 3,
				base: BASE,
				older: OLDER,
				newer: NEWER,
			},
			actions: null,
		})

		testMerger({
			base: [new Boolean(false)],
			older: [true, false, new Boolean(true), new Boolean(false)],
			newer: [true, new Boolean(true)],
			preferCloneOlderParam: [null],
			preferCloneNewerParam: [null],
			preferCloneMeta: [null],
			options: [null, {}],
			valueType: [null],
			valueFactory: [null],
			setFunc: [true],
			expected: {
				error: null,
				returnValue: true,
				setValue: true,
				base: BASE,
				older: OLDER,
				newer: NEWER,
			},
			actions: null,
		})
	})

	it('merge 3 objects', function() {
		testMerger({
			base: [{ a: {a: 1, b: 2}, b: 3 }],
			older: [{ a: {a: 4, b: 5}, c: 6 }],
			newer: [{ a: {a: 7, b: 2}, d: 9 }],
			preferCloneOlderParam: [null],
			preferCloneNewerParam: [null],
			preferCloneMeta: [null],
			options: [null, {}],
			valueType: [null],
			valueFactory: [null],
			setFunc: [false, true],
			expected: {
				error: null,
				returnValue: true,
				setValue: NONE,
				base: { a: {a: 7, b: 5}, c: 6, d: 9 },
				older: OLDER,
				newer: NEWER,
			},
			actions: null,
		})
	})

	it('value type', function() {
		testMerger({
			base: [{ a: {a: 1, b: 2}, b: 3 }],
			older: [{ a: {a: 4, b: 5}, c: 6 }],
			newer: [{ a: {a: 7, b: 2}, d: 9 }],
			preferCloneOlderParam: [null],
			preferCloneNewerParam: [null],
			preferCloneMeta: [null],
			options: [null, {}],
			valueType: [Class],
			valueFactory: [null],
			setFunc: [true],
			expected: {
				error: null,
				returnValue: true,
				setValue: new Class({ a: {a: 7, b: 5}, c: 6, d: 9 }),
				base: BASE,
				older: OLDER,
				newer: NEWER,
			},
			actions: null,
		})

		testMerger({
			base: [null, void 0, 0, 1, false, true, '', '1'],
			older: [{ a: {a: 4, b: 5}, c: 6 }],
			newer: [{ a: {a: 7, b: 2}, d: 9 }],
			preferCloneOlderParam: [null],
			preferCloneNewerParam: [null],
			preferCloneMeta: [null],
			options: [null, {}],
			valueType: [Class],
			valueFactory: [null, o => {
				const instance = new Class(null);
				(instance as any).custom = true
				return instance
			}],
			setFunc: [true],
			expected: {
				error: null,
				returnValue: true,
				setValue: o => {
					const value = new Class({ a: {a: 7, b: 2}, d: 9 })
					if (o.valueFactory) {
						(value as any).custom = true
					}
					return value
				},
				base: BASE,
				older: OLDER,
				newer: NEWER,
			},
			actions: null,
		})
	})

	it('array as primitive', function() {
		testMerger({
			base: [[], [1], [2]],
			older: [[], [1], [2]],
			newer: [[3]],
			preferCloneOlderParam: [null],
			preferCloneNewerParam: [null],
			preferCloneMeta: [null],
			options: [null, {}],
			valueType: [null],
			valueFactory: [null],
			setFunc: [true],
			expected: {
				error: null,
				returnValue: true,
				setValue: NEWER,
				base: BASE,
				older: OLDER,
				newer: NEWER,
			},
			actions: null,
		})
	})

	describe('merge maps', function() {
		const func = () => {}
		const func2 = () => {}
		const func3 = () => {}
		const func4 = () => {}
		const object = new Error('test error')
		assert.strictEqual(deepClone(func), func)
		assert.strictEqual(deepClone(object), object)
		const iterable = toIterable([1, 2, 3])
		assert.ok(iterable[Symbol.iterator])
		assert.deepStrictEqual(Array.from(iterable), [1, 2, 3])
		assert.deepStrictEqual(Array.from(iterable), [1, 2, 3])

		const testMergeMaps = (targetFactories, sourceFactories, base, older, newer, result) => {
			testMerger({
				base: [
					...targetFactories.map(o => fillMap(o(), base)),
				],
				older: [
					...sourceFactories.map(o => fillMap(o(), older)),
					older,
					toIterable(older),
				],
				newer: [
					...sourceFactories.map(o => fillMap(o(), newer)),
					newer,
					toIterable(newer),
				],
				preferCloneOlderParam: [null],
				preferCloneNewerParam: [null],
				preferCloneMeta: [true],
				options: [null, {}],
				valueType: [null],
				valueFactory: [null],
				setFunc: [true],
				expected: {
					error: null,
					returnValue: true,
					setValue: fillMap(new Map(), result),
					base: BASE,
					older: OLDER,
					newer: NEWER,
				},
				actions: null,
			})
		}

		it('Map', function() {
			testMergeMaps(
				[() => new Map(), () => new ObservableMap(new Map())],
				[() => new Map(), () => new ObservableMap(new Map())],
				[[0, null], [func, func], [void 0, {a: 1, b: 2}], [object, {a: 2, c: 3}]],
				[[0, object], [null, func], [void 0, {a: 4, c: 5}], [object, {a: 6, b: 7}]],
				[[0, null], [null, null], [func, func], [void 0, {a: 1, b: 2}], [object, {a: 10, c: 11}]],
				[[0, object], [void 0, {a: 4, c: 5}], [object, {a: 10, b: 7, c: 11}], [null, null]],
			)
		})

		it('ArrayMap', function() {
			testMergeMaps(
				[
					() => new ArrayMap(), () => new ObservableMap(new ArrayMap()),
					() => new ObjectHashMap(), () => new ObservableMap(new ObjectHashMap()),
				],
				[
					() => new Map(), () => new ObservableMap(new Map()),
					() => new ArrayMap(), () => new ObservableMap(new ArrayMap()),
					() => new ObjectHashMap(), () => new ObservableMap(new ObjectHashMap()),
				],
				[[func2, null], [func, func], [func4, {a: 1, b: 2}], [object, {a: 2, c: 3}]],
				[[func2, object], [func3, func], [func4, {a: 4, c: 5}], [object, {a: 6, b: 7}]],
				[[func2, null], [func3, null], [func, func], [func4, {a: 1, b: 2}], [object, {a: 10, c: 11}]],
				[[func2, object], [func4, {a: 4, c: 5}], [object, {a: 10, b: 7, c: 11}], [func3, null]],
			)
		})

		it('ObjectMap', function() {
			testMergeMaps(
				[() => new ObjectMap(), () => new ObservableMap(new ObjectMap())],
				[
					() => new Map(), () => new ObservableMap(new Map()),
					() => new ObjectMap(), () => new ObservableMap(new ObjectMap()),
				],
				[['0', null], ['1', func], ['3', {a: 1, b: 2}], ['5', {a: 2, c: 3}]],
				[['0', object], ['6', func], ['3', {a: 4, c: 5}], ['5', {a: 6, b: 7}]],
				[['0', null], ['6', null], ['1', func], ['3', {a: 1, b: 2}], ['5', {a: 10, c: 11}]],
				[['0', object], ['3', {a: 4, c: 5}], ['5', {a: 10, c: 11, b: 7}], ['6', null]],
			)
		})
	})

	describe('merge sets', function() {
		const func = () => {}
		const func2 = () => {}
		const func3 = () => {}
		const func4 = () => {}
		const object = new Error('test error')
		assert.strictEqual(deepClone(func), func)
		assert.strictEqual(deepClone(object), object)
		const iterable = toIterable([1, 2, 3])
		assert.ok(iterable[Symbol.iterator])
		assert.deepStrictEqual(Array.from(iterable), [1, 2, 3])
		assert.deepStrictEqual(Array.from(iterable), [1, 2, 3])

		const testMergeSets = (targetFactories, sourceFactories, base, older, newer, result) => {
			testMerger({
				base: [
					...targetFactories.map(o => fillSet(o(), base)),
				],
				older: [
					...sourceFactories.map(o => fillSet(o(), older)),
					older,
					toIterable(older),
				],
				newer: [
					...sourceFactories.map(o => fillSet(o(), newer)),
					newer,
					toIterable(newer),
				],
				preferCloneOlderParam: [null],
				preferCloneNewerParam: [null],
				preferCloneMeta: [true],
				options: [null, {}],
				valueType: [null],
				valueFactory: [null],
				setFunc: [true],
				expected: {
					error: null,
					returnValue: true,
					setValue: fillSet(new Set(), result),
					base: BASE,
					older: OLDER,
					newer: NEWER,
				},
				actions: null,
			})
		}

		it('Set', function() {
			testMergeSets(
				[() => new Set(), () => new ObservableSet(new Set())],
				[() => new Set(), () => new ObservableSet(new Set())],
				[0, func, void 0],
				[0, func, object],
				[0, 1, void 0, object],
				[0, 1, object],
			)
		})

		it('ArraySet', function() {
			testMergeSets(
				[
					() => new ArraySet(), () => new ObservableSet(new ArraySet()),
					// () => new ObjectHashSet(), () => new ObservableSet(new ObjectHashSet()),
				],
				[
					() => new Set(), () => new ObservableSet(new Set()),
					() => new ArraySet(), () => new ObservableSet(new ArraySet()),
					// () => new ObjectHashSet(), () => new ObservableSet(new ObjectHashSet()),
				],
				[func2, func, func4],
				[func2, func, object],
				[func2, func3, func4, object],
				[func2, func3, object],
			)
		})

		it('ObjectSet', function() {
			testMergeSets(
				[
					() => new ObjectSet(), () => new ObservableSet(new ObjectSet()),
					() => new SortedList({autoSort: true, notAddIfExists: true}),
				],
				[
					() => new Set(), () => new ObservableSet(new Set()),
					() => new ObjectSet(), () => new ObservableSet(new ObjectSet()),
					() => new SortedList({autoSort: true, notAddIfExists: true}),
				],
				['0', '2', '3'],
				['0', '2', '4'],
				['0', '1', '3', '4'],
				['0', '1', '4'],
			)
		})
	})
})