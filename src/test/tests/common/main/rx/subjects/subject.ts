import {Subject} from '../../../../../../main/common/rx/subjects/subject'
import {assert} from '../../../../../../main/common/test/Assert'
import {describe, it} from '../../../../../../main/common/test/Mocha'

describe('common > main > rx > subjects > subject', function() {
	it('Subject', function() {
		const subject = new Subject()

		assert.strictEqual(subject.hasSubscribers, false)

		assert.strictEqual(subject.subscribe(null), null)
		assert.strictEqual(subject.subscribe(false as any), null)
		assert.strictEqual(subject.subscribe('' as any), null)
		assert.strictEqual(subject.subscribe(0 as any), null)

		assert.strictEqual(subject.emit('1'), subject)

		let results = []
		const subscriber = value => {
			results.push(value)
		}

		assert.strictEqual(subject.hasSubscribers, false)

		const unsubscribe = []

		assert.strictEqual(typeof (unsubscribe[0] = subject.subscribe(subscriber)), 'function')
		assert.strictEqual(subject.hasSubscribers, true)
		assert.deepStrictEqual(results, [])

		assert.strictEqual(subject.emit('2'), subject)
		assert.deepStrictEqual(results, ['2'])
		assert.strictEqual(subject.hasSubscribers, true)
		results = []

		assert.strictEqual(subject.emit('3'), subject)
		assert.deepStrictEqual(results, ['3'])
		assert.strictEqual(subject.hasSubscribers, true)
		results = []

		assert.strictEqual(unsubscribe[0](), undefined)
		assert.strictEqual(subject.hasSubscribers, false)

		assert.strictEqual(subject.emit('4'), subject)
		assert.strictEqual(subject.hasSubscribers, false)
		assert.deepStrictEqual(results, [])

		assert.strictEqual(unsubscribe[0](), undefined)
		assert.strictEqual(subject.hasSubscribers, false)
		assert.strictEqual(unsubscribe[0](), undefined)
		assert.strictEqual(subject.hasSubscribers, false)

		assert.strictEqual(subject.emit('5'), subject)
		assert.strictEqual(subject.hasSubscribers, false)
		assert.deepStrictEqual(results, [])

		assert.strictEqual(typeof (unsubscribe[0] = subject.subscribe(subscriber)), 'function')
		assert.strictEqual(subject.hasSubscribers, true)
		assert.strictEqual(typeof (unsubscribe[1] = subject.subscribe(subscriber)), 'function')
		assert.strictEqual(subject.hasSubscribers, true)

		assert.strictEqual(subject.emit('6'), subject)
		assert.strictEqual(subject.hasSubscribers, true)
		assert.deepStrictEqual(results, ['6', '6'])
		results = []

		assert.strictEqual(unsubscribe[0](), undefined)
		assert.strictEqual(subject.hasSubscribers, true)

		assert.strictEqual(subject.emit('7'), subject)
		assert.strictEqual(subject.hasSubscribers, true)
		assert.deepStrictEqual(results, ['7'])
		results = []

		assert.strictEqual(unsubscribe[1](), undefined)
		assert.strictEqual(subject.hasSubscribers, false)

		assert.strictEqual(subject.emit('8'), subject)
		assert.strictEqual(subject.hasSubscribers, false)
		assert.deepStrictEqual(results, [])

		assert.strictEqual(unsubscribe[0](), undefined)
		assert.strictEqual(unsubscribe[1](), undefined)

		assert.strictEqual(subject.emit('9'), subject)
		assert.deepStrictEqual(results, [])
	})
})
