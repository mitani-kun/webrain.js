export type TResolve<TValue extends any>
	= (value?: TValue | ThenableSync<TValue>) => TValue | ThenableSync<TValue>
export type TExecutor<TValue extends any> = (resolve: TResolve<TValue>) => void
export type TOnFulfilled<TValue extends any, TResult extends any> = (value: TValue) => TResult|ThenableSync<TResult>

export enum ThenableSyncStatus {
	Resolving = 'Resolving',
	Resolved = 'Resolved',
}

export class ThenableSync<TValue extends any> {
	private _onfulfilled: Array<TOnFulfilled<TValue, any>>
	private _value: TValue
	private _status: ThenableSyncStatus

	constructor(executor?: TExecutor<TValue>) {
		if (executor) {
			executor(this.resolve.bind(this))
		}
	}

	public resolve(value?: TValue | ThenableSync<TValue>): TValue | ThenableSync<TValue> {
		if (this._status != null) {
			throw new Error(`Multiple call resolve() is forbidden; status = ${this._status}`)
		}

		return this._resolve(value)
	}

	private _resolve(value?: TValue | ThenableSync<TValue>): TValue | ThenableSync<TValue> {
		const {_status} = this
		if (_status != null && _status !== ThenableSyncStatus.Resolving) {
			throw new Error(`Multiple call resolve() is forbidden; status = ${_status}`)
		}

		if (ThenableSync.isThenableSync(value)) {
			this._status = ThenableSyncStatus.Resolving

			return (value as ThenableSync<TValue>)
				.then(this._resolve.bind(this))
		}

		this._status = ThenableSyncStatus.Resolved

		this._value = value as TValue

		const {_onfulfilled} = this
		if (_onfulfilled) {
			delete this._onfulfilled
			for (let i = 0, len = _onfulfilled.length; i < len; i++) {
				_onfulfilled[i](value as TValue)
			}
		}
	}

	public then<TResult extends any>(
		onfulfilled?: TOnFulfilled<TValue, TResult>,
	): TResult|ThenableSync<TResult> {
		if (Object.prototype.hasOwnProperty.call(this, '_value')) {
			const {_value} = this
			if (!onfulfilled) {
				return _value as any
			}

			return onfulfilled(_value as TValue)
		} else {
			if (!onfulfilled) {
				return this as any
			}

			let {_onfulfilled} = this
			if (!_onfulfilled) {
				this._onfulfilled = _onfulfilled = []
			}

			const result = new ThenableSync<TResult>()

			_onfulfilled.push(value => {
				result.resolve(onfulfilled(value))
			})

			return result
		}
	}

	public static isThenableSync(value: any): boolean {
		return value instanceof ThenableSync
	}

	public static resolveIterator<TValue extends any, TResult extends any = TValue>(
		value: TValue|ThenableSync<TValue>|Iterator<TValue|ThenableSync<any>|any>,
		onfulfilled?: TOnFulfilled<TValue, TResult>,
	): TResult|ThenableSync<TResult> {
		if (value && Symbol.iterator in value && !ThenableSync.isThenableSync(value)) {
			const resolveIterator = (
				iteration: IteratorResult<TValue|ThenableSync<TValue>|Iterator<TValue|ThenableSync<any>>>,
			): TValue|ThenableSync<TValue> => {
				if (iteration.done) {
					return iteration.value as TValue
				} else {
					return ThenableSync.resolve(iteration.value as TValue|ThenableSync<TValue>, o => {
						return resolveIterator((value as Iterator<TValue | ThenableSync<any>>).next(o))
					})
				}
			}

			value = resolveIterator((value as Iterator<TValue | ThenableSync<any>>).next())
		}

		return ThenableSync.resolve(value as any, onfulfilled)
	}

	public static resolve<TValue extends any, TResult extends any = TValue>(
		value: TValue|ThenableSync<TValue>,
		onfulfilled?: TOnFulfilled<TValue, TResult>,
	): TResult|ThenableSync<TResult> {
		if (ThenableSync.isThenableSync(value)) {
			value = (value as ThenableSync<TValue>)
				.then(onfulfilled) as any
		} else if (onfulfilled) {
			value = onfulfilled(value as TValue) as any
		}

		return value as any
	}
}
