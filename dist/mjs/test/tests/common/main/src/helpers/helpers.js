/* tslint:disable:object-literal-key-quotes no-construct use-primitive-type */
import { registerMergeable } from '../../../../../../main/common/extensions/merge/mergers';
import { registerSerializable } from '../../../../../../main/common/extensions/serialization/serializers';
import { isIterable } from '../../../../../../main/common/helpers/helpers';
import { ObservableClass } from '../../../../../../main/common/rx/object/ObservableClass';
import { ObservableObjectBuilder } from '../../../../../../main/common/rx/object/ObservableObjectBuilder';
import { Property } from '../../../../../../main/common/rx/object/properties/Property';
export class CircularClass extends ObservableClass {
  constructor(array, value) {
    super();
    this.array = array;
    this.value = value;
  } // region IMergeable


  _canMerge(source) {
    if (source.constructor === CircularClass) {
      return null;
    }

    return source.constructor === CircularClass; // || Array.isArray(source)
    // || isIterable(source)
  }

  _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
    let changed = false;
    changed = merge(this.array, older.array, newer.array, o => {
      this.array = o;
    }) || changed;
    changed = merge(this.value, older.value, newer.value, o => {
      this.value = o;
    }) || changed;
    return changed;
  } // endregion
  // region ISerializable


  serialize(serialize) {
    return {
      array: serialize(this.array),
      value: serialize(this.value)
    };
  }

  *deSerialize(deSerialize, serializedValue) {
    this.value = yield deSerialize(serializedValue.value);
  } // endregion


}
CircularClass.uuid = 'e729e03fd0f449949f0f97da23c7bab8';
registerMergeable(CircularClass);
registerSerializable(CircularClass, {
  serializer: {
    *deSerialize(deSerialize, serializedValue, valueFactory) {
      const array = yield deSerialize(serializedValue.array);
      const value = valueFactory(array);
      yield value.deSerialize(deSerialize, serializedValue);
      return value;
    }

  }
});
new ObservableObjectBuilder(CircularClass.prototype).writable('array');
export function* createIterableIterator(iterable) {
  const array = Array.from(iterable);

  for (const item of array) {
    yield item;
  }
}
export function createIterable(iterable) {
  const array = Array.from(iterable);
  return {
    [Symbol.iterator]() {
      return createIterableIterator(array);
    }

  };
}
export function createComplexObject(options = {}) {
  const array = [];
  const object = {};
  const circularClass = new CircularClass(array);
  circularClass.value = object;
  Object.assign(object, {
    _undefined: void 0,
    _null: null,
    _false: false,
    _stringEmpty: '',
    _zero: 0,
    true: true,
    string: 'string',
    date: new Date(12345),
    number: 123.45,
    'nan': NaN,
    'infinity': Infinity,
    '-infinity': -Infinity,
    StringEmpty: new String(''),
    String: new String('String'),
    Number: new Number(123),
    NaN: new Number(NaN),
    Infinity: new Number(Infinity),
    '-Infinity': new Number(-Infinity),
    Boolean: new Boolean(true),
    circularClass: options.circular && options.circularClass && circularClass,
    object: options.circular && object,
    array: options.array && array,
    set: options.set && new Set(),
    map: options.map && new Map(),
    iterable: options.function && createIterable(array),
    // iterator: options.function && toIterableIterator(array),
    promiseSync: options.function && {
      then: resolve => resolve(object)
    },
    promiseAsync: options.function && {
      then: resolve => setTimeout(() => resolve(object), 0)
    },
    property: new Property(null, object)
  });

  const valueIsCollection = value => {
    return value && (isIterable(value) || value.constructor === Object);
  };

  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      const value = object[key];

      if (!value && !key.startsWith('_')) {
        delete object[key];
        continue;
      }

      if (options.circular || !valueIsCollection(value)) {
        if (object.sortedList) {
          object.sortedList.add(value);
        }

        if (object.set) {
          object.set.add(value);
        }

        if (object.map) {
          object.map.set(value, value);
        }

        if (object.array) {
          array.push(value);
        }
      }
    }
  }

  for (const key of Object.keys(object).reverse()) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      const value = object[key];

      if (!options.undefined && typeof value === 'undefined') {
        delete object[key];
      }

      if (options.circular || !valueIsCollection(value)) {
        if (object.arraySet && value && typeof value === 'object') {
          object.arraySet.add(value);
        }

        if (object.objectSet) {
          object.objectSet.add(key);
        }

        if (object.arrayMap && value && typeof value === 'object') {
          object.arrayMap.set(value, value);
        }

        if (object.objectMap) {
          object.objectMap.set(key, value);
        }
      }
    }
  }

  return object;
}