function calcOptimalArraySize(desiredSize: number) {
	let optimalSize = 4
	while (desiredSize > optimalSize) {
		optimalSize <<= 1
	}
	return optimalSize
}

function getDefaultValue(value) {
	if (value === null || typeof value === 'undefined') {
		return value
	}
	if (typeof value === 'number') {
		return 0
	}
	if (typeof value === 'boolean') {
		return false
	}
	return null
}

export class List<T> {
	// region constructor

	private _array: T[]

	constructor({
		array,
		minAllocatedSize,
	}: {
		array?: T[],
		minAllocatedSize?: number,
	} = {}) {
		this._array = array || []
		this._size = this._array.length

		if (minAllocatedSize) {
			this._minAllocatedSize = minAllocatedSize
		}
	}

	// endregion

	// region Properties

	// region minAllocatedSize

	private _minAllocatedSize: number
	public get minAllocatedSize(): number {
		return this._minAllocatedSize
	}

	public set minAllocatedSize(value: number) {
		this._minAllocatedSize = value
		this._updateAllocatedSize()
	}

	// endregion

	// region allocatedSize

	public get allocatedSize(): number {
		return this._array.length
	}

	private _updateAllocatedSize() {
		const {_array, _size, _minAllocatedSize} = this

		// We should not manually increment array size,
		// because push() method do it faster and guarantees
		// that the array will not be converted to hashTable

		if (_size * 2 < _array.length) {
			let newLength = _size * 2
			if (newLength < _minAllocatedSize) {
				newLength = _minAllocatedSize
			}
			newLength = calcOptimalArraySize(newLength)
			if (newLength < _array.length) {
				_array.length = newLength
			}
		}
	}

	// endregion

	// region size

	private _size: number

	public get size(): number {
		return this._size
	}

	public set size(value: number) {
		this._setSize(value)
	}

	private _setSize(newSize: number): number {
		const oldSize = this._size
		if (oldSize === newSize) {
			return newSize
		}

		this._size = newSize

		const {_array} = this

		this._updateAllocatedSize()

		// Clear not used space to free memory from unnecessary objects
		if (newSize < oldSize) {
			const defaultValue = getDefaultValue(_array[newSize === 0 ? 0 : newSize - 1])

			const newLength = _array.length
			for (let i = newSize; i < newLength; i++) {
				_array[i] = defaultValue
			}
		}

		return newSize
	}

	// endregion

	// endregion

	// region Methods

	private static _prepareIndex(index: number, size: number): number {
		if (index < 0) {
			index += size
		}

		if (index < 0 || index >= size) {
			throw new Error(`index (${index}) is out of range [0..${size - 1}]`)
		}

		return index
	}

	private static _prepareStart(start: number, size: number) {
		if (start == null) {
			start = 0
		}

		if (start < 0) {
			start += size
		}

		if (start < 0) {
			throw new Error(`start (${start}) < 0`)
		}

		return start
	}

	private static _prepareEnd(end: number, size: number) {
		if (end == null) {
			end = size
		}

		if (end < 0) {
			end += size + 1
		}

		if (end > size) {
			throw new Error(`end (${end}) > size (${size})`)
		}

		return end
	}

	public get(index: number) {
		const {_size, _array} = this

		index = List._prepareIndex(index, _size)

		return _array[index]
	}

	public set(index: number, item: T): boolean {
		const {_size, _array} = this

		index = List._prepareIndex(index, _size + 1)

		_array[index] = item

		return true
	}

	public add(item: T): boolean {
		const {_size, _array} = this
		this._setSize(_size + 1)
		_array[_size] = item
		return true
	}

	public addArray(sourceItems: T[], sourceStart?: number, sourceEnd?: number): boolean {
		return this.insertArray(this._size, sourceItems, sourceStart, sourceEnd)
	}

	public addIterable(items: Iterable<T>, itemsSize: number): boolean {
		return this.insertIterable(this._size, items, itemsSize)
	}

	public insert(index: number, item: T): boolean {
		const {_size, _array} = this

		index = List._prepareIndex(index, _size + 1)

		const newSize = _size + 1

		this._setSize(newSize)

		for (let i = index + 1; i < newSize; i++) {
			_array[i] = _array[i - 1]
		}

		_array[index] = item

		return true
	}

	public insertArray(index: number, sourceItems: T[], sourceStart?: number, sourceEnd?: number): boolean {
		const {_size, _array} = this

		let itemsSize = sourceItems.length

		index = List._prepareIndex(index, _size + 1)
		sourceStart = List._prepareStart(sourceStart, itemsSize)
		sourceEnd = List._prepareEnd(sourceEnd, itemsSize)

		itemsSize = sourceEnd - sourceStart
		if (itemsSize <= 0) {
			return false
		}

		const newSize = _size + itemsSize

		this._setSize(newSize)

		for (let i = index + itemsSize; i < newSize; i++) {
			_array[i] = _array[i - itemsSize]
		}

		for (let i = 0; i < itemsSize; i++) {
			_array[index + i] = sourceItems[sourceStart + i]
		}

		return true
	}

	public insertIterable(index: number, items: Iterable<T>, itemsSize: number): boolean {
		const {_size, _array} = this

		index = List._prepareIndex(index, _size + 1)

		const newSize = _size + itemsSize

		this._setSize(newSize)

		for (let i = index + itemsSize; i < newSize; i++) {
			_array[i] = _array[i - itemsSize]
		}

		if (Array.isArray(items)) {
			for (let i = 0; i < itemsSize; i++) {
				_array[index + i] = items[i]
			}
		} else {
			let i
			for (const item of items) {
				_array[i++] = item
			}
		}

		return true
	}

	public removeAt(index: number, shift: boolean = true): T {
		const {_size, _array} = this

		index = List._prepareIndex(index, _size)

		const oldItem = _array[index]

		if (shift) {
			for (let i = index + 1; i < _size; i++) {
				_array[i - 1] = _array[i]
			}
		} else {
			_array[index] = _array[_size - 1]
		}

		this._setSize(_size - 1)

		return oldItem
	}

	public removeRange(start: number, end?: number, shift: boolean = true): boolean {
		const {_size, _array} = this

		start = List._prepareStart(start, _size)
		end = List._prepareEnd(end, _size)

		const removeSize = end - start

		if (removeSize <= 0) {
			return false
		}

		if (shift || removeSize >= _size - end) {
			for (let i = end; i < _size; i++) {
				_array[i - removeSize] = _array[i]
			}
		} else {
			for (let i = 0; i < removeSize; i++) {
				_array[i] = _array[_size - removeSize + i]
			}
		}

		this._setSize(_size - removeSize)

		return true
	}

	public remove(item: T, shift: boolean = true): boolean {
		const index = this.indexOf(item)

		if (index < 0) {
			return false
		}

		this.removeAt(index, shift)

		return true
	}

	public indexOf(item: T): number {
		const {_size, _array} = this

		for (let i = 0; i < _size; i++) {
			if (_array[i] === item) {
				return i
			}
		}

		return ~_size
	}

	public contains(item: T): boolean {
		return this.indexOf(item) >= 0
	}

	public clear(): boolean {
		if (this._size === 0) {
			return false
		}

		this._setSize(0)

		return true
	}

	public toArray(start?: number, end?: number): T[] {
		const {_size, _array} = this

		start = List._prepareStart(start, _size)
		end = List._prepareEnd(end, _size)

		return this._array.slice(start, end)
	}

	public copyTo(destArray: T[], destIndex?: number, start?: number, end?: number): void {
		const {_size, _array} = this

		if (destIndex == null) {
			destIndex = 0
		}

		start = List._prepareStart(start, _size)
		end = List._prepareEnd(end, _size)

		for (let i = start; i < end; i++) {
			destArray[destIndex + i] = _array[i]
		}
	}

	public *[Symbol.iterator](): Iterator<T> {
		const {_size, _array} = this
		for (let i = 0; i < _size; i++) {
			yield _array[i]
		}
	}

	// endregion
}
