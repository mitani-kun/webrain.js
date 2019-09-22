/* tslint:disable:no-duplicate-string */
/* eslint-disable guard-for-in */
import {ThenableOrIteratorOrValue} from '../../../../../../../main/common/async/async'
import {ThenableSync} from '../../../../../../../main/common/async/ThenableSync'
import {delay} from '../../../../../../../main/common/helpers/helpers'
import {deepSubscribe} from '../../../../../../../main/common/rx/deep-subscribe/deep-subscribe'
import {ObservableObject} from '../../../../../../../main/common/rx/object/ObservableObject'
import {CalcObjectBuilder} from '../../../../../../../main/common/rx/object/properties/CalcObjectBuilder'
import {calcPropertyFactory} from '../../../../../../../main/common/rx/object/properties/CalcPropertyBuilder'
import {connectorFactory} from '../../../../../../../main/common/rx/object/properties/ConnectorBuilder'
import {ICalcProperty} from '../../../../../../../main/common/rx/object/properties/contracts'
import {resolvePath} from '../../../../../../../main/common/rx/object/properties/helpers'
import {Property} from '../../../../../../../main/common/rx/object/properties/Property'

declare const assert: any

describe('common > main > rx > properties > CalcObjectBuilder', function() {
	class ClassSync extends ObservableObject {
		public value = 'Value'
		public valuePrototype: string
		public calc1: ICalcProperty<Date>
		public calc2: ClassSync
		public source1: any = 123
		public source2: any
	}

	class ClassAsync extends ClassSync {
	
	}

	ClassSync.prototype.valuePrototype = 'Value Prototype'

	new CalcObjectBuilder(ClassSync.prototype)
		.writable('source1')
		.writable('source2')
		.calc('calc1',
			connectorFactory(c => c
				.connect('connectValue1', b => b.path(o => o['@lastOrWait'].source1['@wait']))),
			calcPropertyFactory(
				d => d.invalidateOn(b => b.propertyAll()),
				(input, property: Property<Date, number>): ThenableOrIteratorOrValue<void> => {
					property.value = new Date(input.connectValue1)
					return ThenableSync.createResolved(null)
				},
			),
		)
		.calc('calc2',
			connectorFactory(c => c
				.connect('connectValue1', b => b.path(o => o['@lastOrWait'].source2['@wait']))),
			calcPropertyFactory(
				d => d.invalidateOn(b => b.propertyAll()),
				(input, property: Property<ClassSync>): ThenableOrIteratorOrValue<void> => {
					property.value = input.connectorSource
					return ThenableSync.createResolved(null)
				},
			),
		)

	new CalcObjectBuilder(ClassAsync.prototype)
		.calc('calc1',
			connectorFactory(c => c
				.connect('connectValue1', b => b.path(o => o['@lastOrWait'].source1['@wait']))),
			calcPropertyFactory(
				d => d.invalidateOn(b => b.propertyAll()),
				function *(input, property: Property<Date, number>): ThenableOrIteratorOrValue<void> {
					yield new Promise(r => setTimeout(r, 100))
					property.value = new Date(input.connectValue1)
				},
			),
		)
		.calc('calc2',
			connectorFactory(c => c
				.connect('connectValue1', b => b.path(o => o['@lastOrWait'].source2['@wait']))),
			calcPropertyFactory(
				d => d.invalidateOn(b => b.propertyAll()),
				function *(input, property: Property<ClassSync>): ThenableOrIteratorOrValue<void> {
					yield new Promise(r => setTimeout(r, 100))
					property.value = input.connectorSource
				},
			),
		)

	it('calc sync', function() {
		let result: any = new ClassSync().calc1.last
		assert.deepStrictEqual(result, new Date(123))

		result = new ClassSync().calc1.wait
		assert.deepStrictEqual(result, new Date(123))

		result = new ClassSync().calc1.lastOrWait
		assert.deepStrictEqual(result, new Date(123))
	})

	it('calc sync resolve', function() {
		let val = resolvePath(new ClassSync())(o => o.calc1)()
		assert.deepStrictEqual(val, new Date(123))
		val = resolvePath(new ClassSync())(o => o.calc1)(o => o.last, true)()
		assert.deepStrictEqual(val, new Date(123))
		val = resolvePath(new ClassSync())(o => o.calc1.wait)(o => o.last, true)()
		assert.deepStrictEqual(val, new Date(123))
		val = resolvePath(new ClassSync())(o => o.calc1)(o => o.wait, true)(o => o.last, true)()
		assert.deepStrictEqual(val, new Date(123))
		val = resolvePath(new ClassSync())(o => o.wait, true)(o => o.calc1)(o => o.wait, true)(o => o.last, true)()
		assert.deepStrictEqual(val, new Date(123))

		let object = new ClassSync()
		let obj = resolvePath(object)()
		assert.deepStrictEqual(obj, object)

		object = new ClassSync()
		obj = resolvePath(object)(o => o.wait, true)()
		assert.deepStrictEqual(obj, object)

		object = new ClassSync()
		obj = resolvePath(object)(o => o.wait, true)(o => o.last, true)()
		assert.deepStrictEqual(obj, object)
	})

	it('calc async', async function() {
		assert.deepStrictEqual(new ClassAsync().calc1.last, void 0)

		let object = new ClassAsync().calc1
		assert.deepStrictEqual(await object.wait, new Date(123))
		assert.deepStrictEqual(object.last, new Date(123))

		object = new ClassAsync().calc1
		assert.deepStrictEqual(await object.lastOrWait, new Date(123))
		assert.deepStrictEqual(object.last, new Date(123))
	})

	it('calc async resolve', async function() {
		let val = resolvePath(new ClassAsync())(o => o.calc1)()
		assert.deepStrictEqual(await val, new Date(123))
		val = resolvePath(new ClassAsync())(o => o.calc1)(o => o.last, true)()
		assert.deepStrictEqual(await val, new Date(123))
		val = resolvePath(new ClassAsync())(o => o.calc1.wait)(o => o.last, true)()
		assert.deepStrictEqual(await val, new Date(123))
		val = resolvePath(new ClassAsync())(o => o.calc1)(o => o.wait, true)(o => o.last, true)()
		assert.deepStrictEqual(await val, new Date(123))
		val = resolvePath(new ClassAsync())(o => o.wait, true)(o => o.calc1)(o => o.wait, true)(o => o.last, true)()
		assert.deepStrictEqual(await val, new Date(123))

		let object = new ClassAsync()
		let obj = resolvePath(object)()
		assert.deepStrictEqual(await obj, object)

		object = new ClassAsync()
		obj = resolvePath(object)(o => o.wait, true)()
		assert.deepStrictEqual(await obj, object)

		object = new ClassAsync()
		obj = resolvePath(object)(o => o.wait, true)(o => o.last, true)()
		assert.deepStrictEqual(await obj, object)
	})

	it('circular calc sync', async function() {
		const object = new ClassSync()
		let value = resolvePath(object)(o => o.calc2)()
		assert.strictEqual(value, object)
		value = resolvePath(object)(o => o.calc2)(o => o.calc2)(o => o.calc2)(o => o.calc2)()
		assert.strictEqual(value, object)
		const value2 = resolvePath(object)(o => o.calc2)(o => o.calc2)(o => o.calc2)(o => o.calc1)()
		assert.deepStrictEqual(value2, new Date(123))
	})

	it('circular calc async', async function() {
		const object = new ClassSync()
		let value = resolvePath(object)(o => o.calc2)()
		assert.strictEqual(await value, object)
		value = resolvePath(object)(o => o.calc2)(o => o.calc2)(o => o.calc2)(o => o.calc2)()
		assert.strictEqual(await value, object)
		const value2 = resolvePath(object)(o => o.calc2)(o => o.calc2)(o => o.calc2)(o => o.calc1)()
		assert.deepStrictEqual(await value2, new Date(123))
	})

	it('deepSubscribe simple', async function() {
		const object = new ClassSync()
		let values = []

		deepSubscribe(object, value => {
			values.push(value)
			return null
		}, true, b => b.p('value'))
		assert.deepStrictEqual(values, ['Value'])
		values = []

		deepSubscribe(object, value => {
			values.push(value)
			return null
		}, true, b => b.p('valuePrototype'))
		assert.deepStrictEqual(values, ['Value Prototype'])
		values = []
	})

	it('deepSubscribe calc sync', async function() {
		const object = new ClassSync()
		let subscribeValues = []
		let unsubscribeValues = []
		deepSubscribe(object, value => {
			subscribeValues.push(value)
		}, value => {
			unsubscribeValues.push(value)
		},
		true, b => b.p('calc1'))
		assert.deepStrictEqual(subscribeValues, [new Date(123)])
		assert.deepStrictEqual(unsubscribeValues, [])
		subscribeValues = []
		unsubscribeValues = []

		deepSubscribe(object, value => {
			subscribeValues.push(value)
			return null
		}, value => {
			unsubscribeValues.push(value)
			return null
		},
		true, b => b.p('calc1').p('getTime'))
		assert.deepStrictEqual(subscribeValues, [Date.prototype.getTime])
		assert.deepStrictEqual(unsubscribeValues, [])
		subscribeValues = []
		unsubscribeValues = []
	})

	it('deepSubscribe calc async', async function() {
		let object = new ClassAsync()
		let subscribeValues = []
		let unsubscribeValues = []
		deepSubscribe(object, value => {
			subscribeValues.push(value)
		}, value => {
			unsubscribeValues.push(value)
		},
		true, b => b.p('calc1'))
		assert.deepStrictEqual(subscribeValues, [])
		assert.deepStrictEqual(unsubscribeValues, [])
		await delay(500)
		assert.deepStrictEqual(subscribeValues, [new Date(123)])
		assert.deepStrictEqual(unsubscribeValues, [])
		subscribeValues = []
		unsubscribeValues = []

		object = new ClassAsync()
		deepSubscribe(object, value => {
			subscribeValues.push(value)
		}, value => {
			unsubscribeValues.push(value)
		},
		true, b => b.p('calc1').p('getTime'))
		assert.deepStrictEqual(subscribeValues, [])
		assert.deepStrictEqual(unsubscribeValues, [])
		await delay(500)
		assert.deepStrictEqual(subscribeValues, [Date.prototype.getTime])
		assert.deepStrictEqual(unsubscribeValues, [])
		subscribeValues = []
		unsubscribeValues = []
	})

	it('deepSubscribe calc circular sync', async function() {
		const object = new ClassSync()
		let subscribeValues = []
		let unsubscribeValues = []
		deepSubscribe(object, value => {
			value = resolvePath(value)()
			subscribeValues.push(value)
		}, value => {
			value = resolvePath(value)()
			unsubscribeValues.push(value)
		},
		true, b => b.p('calc2').p('calc2').p('calc2').p('calc1'))
		assert.deepStrictEqual(subscribeValues, [new Date(123)])
		assert.deepStrictEqual(unsubscribeValues, [])
		subscribeValues = []
		unsubscribeValues = []

		object.source1 = 234
		assert.deepStrictEqual(subscribeValues, [new Date(234)])
		assert.deepStrictEqual(unsubscribeValues, [])
		subscribeValues = []
		unsubscribeValues = []

		object.source2 = 1
		object.source1 = 345
		assert.deepStrictEqual(subscribeValues, [new Date(345)])
		assert.deepStrictEqual(unsubscribeValues, [])
		subscribeValues = []
		unsubscribeValues = []
	})

	it('deepSubscribe calc circular async', async function() {
		const object = new ClassAsync()
		let subscribeValues = []
		let unsubscribeValues = []
		deepSubscribe(object, value => {
			value = resolvePath(value)()
			subscribeValues.push(value)
		}, value => {
			value = resolvePath(value)()
			unsubscribeValues.push(value)
		},
		true, b => b.p('calc2').p('calc2').p('calc2').p('calc1'))
		assert.deepStrictEqual(subscribeValues, [])
		assert.deepStrictEqual(unsubscribeValues, [])
		await delay(500)
		assert.deepStrictEqual(subscribeValues, [new Date(123)])
		assert.deepStrictEqual(unsubscribeValues, [])
		subscribeValues = []
		unsubscribeValues = []

		object.source1 = 234
		assert.deepStrictEqual(subscribeValues.length, 1)
		assert.deepStrictEqual(await subscribeValues[0], new Date(234))
		assert.deepStrictEqual(unsubscribeValues, [])
		subscribeValues = []
		unsubscribeValues = []
	})
})
