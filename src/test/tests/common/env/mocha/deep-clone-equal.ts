/* tslint:disable:no-construct use-primitive-type */
import {deepClone, deepEqual, IDeepCloneOptions, IDeepEqualOptions} from '../../../../../../env/mocha/deep-clone-equal'
import {createComplexObject, IComplexObjectOptions} from '../../main/src/helpers/helpers'
import {TestDeepEqual} from './src/TestDeepEqual'

declare const assert
declare const after

describe('common > env > mocha > deep-clone-equal', function() {
	this.timeout(60000)

	const _testDeepEqual = TestDeepEqual.test

	after(function() {
		console.log('Total deepEqual tests >= ' + TestDeepEqual.totalTests)
	})

	const objectOptions: IComplexObjectOptions = {
		// undefined: true,
		// array: true,
		//
		// map: true,
		arrayMap: true,
		// objectMap: true,
		observableMap: true,
		//
		// set: true,
		// arraySet: true,
		// objectSet: true,
		// observableSet: true,
		//
		// sortedList: true,
		// circularClass: true,
	}

	// 	if (options.noCrossReferences && expected.array) {
	// 		assert.notStrictEqual(actual.array, expected.array)
	// 		for (let i = 0; i < obj.array.length; i++) {
	// 			const value = obj.array[i]
	// 			if (value && typeof value === 'object') {
	// 				assert.notStrictEqual(actual.array[i], value)
	// 			}
	// 		}
	// 	}

	const testDeepEqual = (actual: any[], expected: any[], options: IDeepEqualOptions) => {
		_testDeepEqual({
			value1: actual,
			value2: expected,
			// equalInnerReferences: [false],
			// ignoreOrderForMapSet: [options.ignoreOrderForMapSet],
			exclude: o => {
				if (!o.circular && options.circular) {
					return true
				}
				if (!o.ignoreOrderForMapSet && options.ignoreOrderForMapSet) {
					return true
				}
				return false
			},
			expected: {
				result: o => {
					if (o.equalTypes && !options.equalTypes) {
						return false
					}
					if (o.noCrossReferences && !options.noCrossReferences) {
						return false
					}
					if (o.equalInnerReferences && !options.equalInnerReferences) {
						return false
					}

					return true
				},
			},
			actions: null,
		})
	}

	const deepCloneWrapper = <T>(value: T, options?: IDeepCloneOptions, cache?: any[]): T => {
		const result = deepClone(value, options, cache)

		return result
	}

	const notCircularTest = (ignoreOrderForMapSet: boolean) => {
		const obj = createComplexObject({
			...objectOptions,
			arraySet: objectOptions.arraySet && ignoreOrderForMapSet,
			objectSet: objectOptions.objectSet && ignoreOrderForMapSet,
			arrayMap: objectOptions.arrayMap && ignoreOrderForMapSet,
			objectMap: objectOptions.objectMap && ignoreOrderForMapSet,
		})

		let clone = deepCloneWrapper(obj)
		testDeepEqual([clone], [obj], {
			circular: false,
			ignoreOrderForMapSet,
			equalTypes: true,
			noCrossReferences: true,
			// equalInnerReferences: true,
		})

		clone = deepCloneWrapper(clone, {
			circular: false,
		})
		testDeepEqual([clone], [obj], {
			circular: true,
			ignoreOrderForMapSet,
			equalTypes: true,
			noCrossReferences: true,
			// equalInnerReferences: true,
		})
	}

	const circularTest = (ignoreOrderForMapSet: boolean) => {
		const obj = createComplexObject({
			...objectOptions,
			circular: true,
			arraySet: objectOptions.arraySet && ignoreOrderForMapSet,
			objectSet: objectOptions.objectSet && ignoreOrderForMapSet,
			arrayMap: objectOptions.arrayMap && ignoreOrderForMapSet,
			objectMap: objectOptions.objectMap && ignoreOrderForMapSet,
		})

		let cache1: any = []
		const clone = deepCloneWrapper(obj, {
			circular: true,
		}, cache1)

		let cache2: any = []
		const clone2 = deepCloneWrapper(obj, {
			circular: true,
		}, cache2)

		cache1 = new Set(cache1)
		cache2 = new Set(cache2)

		assert.strictEqual(cache1.size, cache2.size)
		for (const value of cache1) {
			if (value && typeof value === 'object') {
				assert.notOk(cache2.has(value))
			} else {
				assert.ok(cache2.has(value))
			}
		}

		for (const value of cache2) {
			if (value && typeof value === 'object') {
				assert.notOk(cache1.has(value))
			} else {
				assert.ok(cache1.has(value))
			}
		}

		testDeepEqual([clone], [obj], {
			circular: true,
			ignoreOrderForMapSet,
			equalTypes: true,
			noCrossReferences: true,
			equalInnerReferences: true,
		})

		clone.cross = {}
		obj.cross = clone.cross
		testDeepEqual([clone], [obj], {
			circular: true,
			ignoreOrderForMapSet,
			equalTypes: true,
			equalInnerReferences: true,
		})

		obj.cross = {}
		testDeepEqual([clone], [obj], {
			circular: true,
			ignoreOrderForMapSet,
			equalTypes: true,
			noCrossReferences: true,
			equalInnerReferences: true,
		})

		if (obj.array) {
			clone.array.push(clone)
			obj.array.push(clone)
			testDeepEqual([clone], [obj], {
				circular: true,
				ignoreOrderForMapSet,
				equalTypes: true,
				equalInnerReferences: true,
			})

			obj.array[obj.array.length - 1] = obj
			testDeepEqual([clone], [obj], {
				circular: true,
				ignoreOrderForMapSet,
				equalTypes: true,
				noCrossReferences: true,
				equalInnerReferences: true,
			})

			clone.array.length--
			obj.array.length--

			obj.object = {...obj.object}
			testDeepEqual([clone], [obj], {
				circular: true,
				ignoreOrderForMapSet,
				equalTypes: true,
				noCrossReferences: true,
				// equalInnerReferences: true,
			})

			obj.array = new Set(obj.array)
			testDeepEqual([clone], [obj], {
				circular: true,
				ignoreOrderForMapSet,
				// equalTypes: true,
				noCrossReferences: true,
				// equalInnerReferences: true,
			})

			clone.cross = new String('cross')
			clone.cross2 = new String('cross')
			obj.cross = clone.cross2
			obj.cross2 = clone.cross
			obj.object.cross = clone.cross2
			obj.object.cross2 = clone.cross
			testDeepEqual([clone], [obj], {
				circular: true,
				ignoreOrderForMapSet,
				// equalTypes: true,
				// noCrossReferences: true,
				// equalInnerReferences: true,
			})
		}
	}

	it('not circular', function() {
		notCircularTest(false)
	})

	it('not circular ignoreOrderForMapSet', function() {
		notCircularTest(true)
	})

	it('circular', function() {
		circularTest(false)
	})

	it('circular ignoreOrderForMapSet', function() {
		circularTest(true)
	})
})
