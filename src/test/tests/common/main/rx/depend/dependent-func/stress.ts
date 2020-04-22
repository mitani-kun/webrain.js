/* tslint:disable:no-identical-functions no-shadowed-variable */
import {assert} from '../../../../../../../main/common/test/Assert'
import {describe, it, xdescribe, xit} from '../../../../../../../main/common/test/Mocha'
import {stressTest} from '../src/stress-test'

describe('common > main > rx > depend > dependent-func / stress', function() {
	this.timeout(60 * 60 * 1000)

	it('async + deferred + sync + lazy', async function() {
		await stressTest({
			// seed: 1,
			testsCount: 100,
			iterationsPerTest: 200000,
			maxLevelsCount: 10,
			maxFuncsCount: 10,
			maxCallsCount: 100,
			countRootCalls: 5,
			disableAsync: false,
			disableDeferred: false,
			disableLazy: false,
		})
	})

	it('async + deferred + sync', async function() {
		await stressTest({
			// seed: 1,
			testsCount: 100,
			iterationsPerTest: 200000,
			maxLevelsCount: 10,
			maxFuncsCount: 10,
			maxCallsCount: 100,
			countRootCalls: 5,
			disableAsync: false,
			disableDeferred: false,
			disableLazy: true,
		})
	})

	it('deferred + sync', async function() {
		await stressTest({
			// seed: 843622927,
			testsCount: 100,
			iterationsPerTest: 200000,
			maxLevelsCount: 10,
			maxFuncsCount: 10,
			maxCallsCount: 100,
			countRootCalls: 5,
			disableAsync: true,
			disableDeferred: false,
			disableLazy: true,
		})
	})

	it('async + sync + lazy', async function() {
		await stressTest({
			// seed: 593595214,
			testsCount: 10,
			iterationsPerTest: 200000,
			maxLevelsCount: 10,
			maxFuncsCount: 10,
			maxCallsCount: 100,
			countRootCalls: 5,
			disableAsync: false,
			disableDeferred: true,
			disableLazy: false,
		})
	})

	it('async + sync', async function() {
		await stressTest({
			// seed: 788871949,
			testsCount: 100,
			iterationsPerTest: 200000,
			maxLevelsCount: 10,
			maxFuncsCount: 10,
			maxCallsCount: 100,
			countRootCalls: 5,
			disableAsync: false,
			disableDeferred: true,
			disableLazy: true,
		})
	})

	it('sync + lazy', async function() {
		await stressTest({
			// seed: 92684389,
			testsCount: 5,
			iterationsPerTest: 200000,
			maxLevelsCount: 10,
			maxFuncsCount: 10,
			maxCallsCount: 100,
			countRootCalls: 5,
			disableAsync: true,
			disableDeferred: true,
			disableLazy: false,
		})
	})

	it('sync', async function() {
		await stressTest({
			// seed: 1,
			testsCount: 5,
			iterationsPerTest: 200000,
			maxLevelsCount: 10,
			maxFuncsCount: 10,
			maxCallsCount: 100,
			countRootCalls: 5,
			disableAsync: true,
			disableDeferred: true,
			disableLazy: true,
		})
	})
})