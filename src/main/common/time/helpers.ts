import {Thenable} from '../async/async'

export const performanceNow = typeof performance !== 'undefined'
	// eslint-disable-next-line no-undef
	? (): number => performance.now()
	: (): number => {
		const time = process.hrtime()
		return time[0] * 1000 + time[1] * 0.000001
	}

export function delay(timeMilliseconds): Thenable<any> {
	return new Promise(resolve => setTimeout(resolve, timeMilliseconds))
}