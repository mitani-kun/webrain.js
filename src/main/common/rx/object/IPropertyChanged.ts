import {IHasSubscribersSubject} from '../subjects/hasSubscribers'

export interface IPropertyChangedEvent {
	name?: string | number,
	oldValue?: any,
	newValue?: any,
}

// Is slower than simple object
// export class PropertyChangedEvent<TValue> implements IPropertyChangedEvent {
// 	public name: string
// 	public oldValue: TValue
// 	public newValue: TValue
//
// 	constructor(name, oldValue: TValue, newValue: TValue) {
// 		this.name = name
// 		this.oldValue = oldValue
// 		this.newValue = newValue
// 	}
// }

export class PropertyChangedEvent<TValue> implements IPropertyChangedEvent {
	public name: string
	public oldValue: TValue
	private readonly _getNewValue: () => TValue

	constructor(name, oldValue: TValue, getNewValue: () => TValue) {
		this.name = name
		this.oldValue = oldValue
		this._getNewValue = getNewValue
	}

	get newValue() {
		return this._getNewValue()
	}
}

export type EventOrPropertyName = string | number | IPropertyChangedEvent
// export type EventsOrPropertyNames = EventOrPropertyName | Array<EventOrPropertyName | any>

export interface IPropertyChangedSubject extends IHasSubscribersSubject<IPropertyChangedEvent> {
	onPropertyChanged(...eventsOrPropertyNames: EventOrPropertyName[]): this
}

export interface IPropertyChanged {
	readonly propertyChanged: IPropertyChangedSubject
	readonly propertyChangedIfCanEmit: IPropertyChangedSubject
}

export interface IPropertyChangedObject extends IPropertyChanged {

}
