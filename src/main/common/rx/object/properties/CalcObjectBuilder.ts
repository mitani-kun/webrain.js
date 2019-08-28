import {NotFunction} from '../../../helpers/typescript'
import {ObservableObject} from '../ObservableObject'
import {ObservableObjectBuilder} from '../ObservableObjectBuilder'
import {CalcProperty} from './CalcProperty'
import {ValueKeys} from './contracts'

export class CalcObjectBuilder<TObject extends ObservableObject, TValueKeys extends string | number = ValueKeys>
	extends ObservableObjectBuilder<TObject>
{
	public calc<
		TValue,
		TInput,
		TMergeSource,
		Name extends string | number
	>(
		name: Name,
		inputOrFactory: ((source: TObject) => TInput) | NotFunction<TInput>,
		calcPropertyFactory: (initValue?: TValue) => CalcProperty<TValue, TInput, TMergeSource>,
		initValue?: TValue,
	) {
		return this.readable<CalcProperty<
			TValue,
			TInput,
			TMergeSource
		>, Name>(name, {
			factory(this: TObject) {
				const property = calcPropertyFactory(initValue)
				property.input = typeof inputOrFactory === 'function'
					? (inputOrFactory as (object: TObject) => TInput)(this)
					: inputOrFactory

				return property
			},
		})
	}
}

// const builder = new CalcObjectBuilder(true as any)
//
// export function calc<
// 	TObject extends ObservableObject,
// 	TInput extends new (object: TObject) => any | NotFunction<any>,
// 	TValue = any,
// 	TMergeSource = any
// >(
// 	options?: IConnectPropertyOptions<TObject, TInput, TValue, TMergeSource>,
// 	initValue?: TValue,
// ) {
// 	return (target: TObject, propertyKey: string) => {
// 		builder.object = target
// 		builder.calc(propertyKey, options, initValue)
// 	}
// }

// class Class1 extends ObservableObject {
// }
// class Class extends Class1 {
// 	@calc()
// 	public prop: number
// }
