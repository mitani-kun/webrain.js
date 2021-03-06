"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.registerSerializable = registerSerializable;
exports.registerSerializer = registerSerializer;
exports.serializeArray = serializeArray;
exports.deSerializeArray = deSerializeArray;
exports.serializeIterable = serializeIterable;
exports.deSerializeIterableOrdered = deSerializeIterableOrdered;
exports.deSerializeIterable = deSerializeIterable;
exports.serializeObject = serializeObject;
exports.deSerializeObject = deSerializeObject;
exports.serializePrimitiveAsObject = serializePrimitiveAsObject;
exports.deSerializePrimitiveAsObject = deSerializePrimitiveAsObject;
exports.ObjectSerializer = exports.TypeMetaSerializerCollection = exports.DeSerializerVisitor = exports.SerializerVisitor = void 0;

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _getIteratorMethod2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator-method"));

var _symbol = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _construct2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/reflect/construct"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/map"));

var _set = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _construct3 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/construct"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _map2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _ThenableSync = require("../../async/ThenableSync");

var _helpers = require("../../helpers/helpers");

var _objectUniqueId = require("../../helpers/object-unique-id");

var _TypeMeta = require("../TypeMeta");

var _marked = /*#__PURE__*/_regenerator.default.mark(deSerializeIterableOrdered);

function _createForOfIteratorHelperLoose(o) { var _context12; var i = 0; if (typeof _symbol.default === "undefined" || (0, _getIteratorMethod2.default)(o) == null) { if ((0, _isArray.default)(o) || (o = _unsupportedIterableToArray(o))) return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } i = (0, _getIterator2.default)(o); return (0, _bind.default)(_context12 = i.next).call(_context12, i); }

function _unsupportedIterableToArray(o, minLen) { var _context11; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = (0, _slice.default)(_context11 = Object.prototype.toString.call(o)).call(_context11, 8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return (0, _from.default)(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = (0, _construct2.default)(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_construct2.default) return false; if (_construct2.default.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call((0, _construct2.default)(Date, [], function () {})); return true; } catch (e) { return false; } }

// region SerializerVisitor
var SerializerVisitor = /*#__PURE__*/function () {
  function SerializerVisitor(typeMeta) {
    var _context;

    (0, _classCallCheck2.default)(this, SerializerVisitor);
    this._typeMeta = typeMeta;
    this.serialize = (0, _bind.default)(_context = this.serialize).call(_context, this);
  }

  (0, _createClass2.default)(SerializerVisitor, [{
    key: "addType",
    value: function addType(uuid) {
      // tslint:disable-next-line:prefer-const
      var types = this.types,
          typesMap = this.typesMap;

      if (!typesMap) {
        this.typesMap = typesMap = {};
        this.types = types = [];
      }

      var typeIndex = typesMap[uuid];

      if (typeIndex == null) {
        typeIndex = types.length;
        types[typeIndex] = uuid;
        typesMap[uuid] = typeIndex;
      }

      return typeIndex;
    }
  }, {
    key: "addObject",
    value: function addObject(object, serialize) {
      // tslint:disable-next-line:prefer-const
      var objects = this.objects,
          objectsMap = this.objectsMap;

      if (!objectsMap) {
        this.objectsMap = objectsMap = [];
        this.objects = objects = [];
      }

      var id = (0, _objectUniqueId.getObjectUniqueId)(object);
      var ref = objectsMap[id];

      if (ref == null) {
        var index = objects.length;
        ref = {
          id: index
        };
        objectsMap[id] = ref;
        var data = {};
        objects[index] = data;
        serialize(data);
      }

      return ref;
    }
  }, {
    key: "serializeObject",
    value: function serializeObject(out, value, options) {
      var meta = this._typeMeta.getMeta(options && options.valueType || value.constructor);

      if (!meta) {
        throw new Error("Class (" + value.constructor.name + ") have no type meta");
      }

      var uuid = meta.uuid;

      if (!uuid) {
        throw new Error("Class (" + value.constructor.name + ") type meta have no uuid");
      }

      var serializer = meta.serializer;

      if (!serializer) {
        throw new Error("Class (" + value.constructor.name + ") type meta have no serializer");
      }

      if (!serializer.serialize) {
        throw new Error("Class (" + value.constructor.name + ") serializer have no serialize method");
      }

      out.type = this.addType(uuid);
      out.data = serializer.serialize(this.getNextSerialize(options), value, options);
    } // noinspection JSUnusedLocalSymbols

  }, {
    key: "getNextSerialize",
    value: function getNextSerialize(options) {
      var _this = this;

      return function (next_value, next_options) {
        return _this.serialize(next_value, next_options // next_options == null || next_options === options
        // 	? options
        // 	: (options == null ? next_options : {
        // 		...options,
        // 		...next_options,
        // 	}),
        );
      };
    }
  }, {
    key: "serialize",
    value: function serialize(value, options) {
      var _this2 = this;

      if (value == null || typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') {
        return value;
      }

      return this.addObject(value, function (out) {
        _this2.serializeObject(out, value, options);
      });
    }
  }]);
  return SerializerVisitor;
}(); // tslint:disable-next-line:no-shadowed-variable no-empty


exports.SerializerVisitor = SerializerVisitor;

var LOCKED = function LOCKED() {};

var DeSerializerVisitor = /*#__PURE__*/function () {
  function DeSerializerVisitor(typeMeta, types, objects) {
    var _context2;

    (0, _classCallCheck2.default)(this, DeSerializerVisitor);
    this._countDeserialized = 0;
    this._typeMeta = typeMeta;
    this._types = types;
    this._objects = objects;
    var len = objects.length;
    var instances = new Array(len);

    for (var i = 0; i < len; i++) {
      instances[i] = null;
    }

    this._instances = instances;
    this.deSerialize = (0, _bind.default)(_context2 = this.deSerialize).call(_context2, this);
  }

  (0, _createClass2.default)(DeSerializerVisitor, [{
    key: "assertEnd",
    value: function assertEnd() {
      var _types = this._types,
          _objects = this._objects,
          _instances = this._instances,
          _typeMeta = this._typeMeta;

      var getDebugObject = function getDebugObject(deserialized, id) {
        var object = _objects[id];
        var uuid = _types[object.type];

        var type = _typeMeta.getType(uuid); // noinspection HtmlUnknownTag


        return {
          type: type == null ? "<Type not found: " + uuid + ">" : type.name,
          data: object.data,
          deserialized: deserialized == null ? deserialized : deserialized.constructor.name
        };
      };

      if (this._countDeserialized !== _instances.length) {
        var _context3, _context4;

        throw new Error(_instances.length - this._countDeserialized + " instances is not deserialized\r\n" + (0, _stringify.default)((0, _map2.default)(_context3 = (0, _filter.default)(_context4 = (0, _map2.default)(_instances).call(_instances, function (o, i) {
          return [o, i];
        })).call(_context4, function (o) {
          return !o[0] || o[0] === LOCKED || _ThenableSync.ThenableSync.isThenable(o[0]);
        })).call(_context3, function (o) {
          return getDebugObject(o[0], o[1]);
        })));
      }
    } // noinspection JSUnusedLocalSymbols

  }, {
    key: "getNextDeSerialize",
    value: function getNextDeSerialize(options) {
      var _this3 = this;

      return function (next_serializedValue, next_onfulfilled, next_options) {
        return _this3.deSerialize(next_serializedValue, next_onfulfilled, next_options // next_options == null || next_options === options
        // 	? options
        // 	: (options == null ? next_options : {
        // 		...options,
        // 		...next_options,
        // 	}),
        );
      };
    }
  }, {
    key: "deSerialize",
    value: function deSerialize(serializedValue, _onfulfilled, options) {
      var _this4 = this;

      if (_onfulfilled) {
        var input_onfulfilled = _onfulfilled;

        _onfulfilled = function onfulfilled(value) {
          var result = input_onfulfilled(value);
          _onfulfilled = null;
          return result;
        };
      }

      if (serializedValue == null || typeof serializedValue === 'number' || typeof serializedValue === 'string' || typeof serializedValue === 'boolean') {
        if (_onfulfilled) {
          return _ThenableSync.ThenableSync.resolve(_onfulfilled(serializedValue));
        }

        return serializedValue;
      }

      var id = serializedValue.id;

      if (id != null) {
        var cachedInstance = this._instances[id];

        if (cachedInstance) {
          if (cachedInstance === LOCKED) {
            this._instances[id] = cachedInstance = new _ThenableSync.ThenableSync();
          }

          if (_onfulfilled) {
            if (cachedInstance instanceof _ThenableSync.ThenableSync) {
              cachedInstance.thenLast(_onfulfilled);
            } else {
              return _ThenableSync.ThenableSync.resolve(_onfulfilled(cachedInstance));
            }
          }

          return cachedInstance;
        }

        this._instances[id] = LOCKED;
        serializedValue = this._objects[id];
      }

      var type = options && options.valueType;

      if (!type) {
        var typeIndex = serializedValue.type;

        if (typeof typeIndex !== 'number') {
          throw new Error("Serialized value have no type field: " + (0, _stringify.default)(serializedValue, null, 4));
        }

        var _uuid = this._types[typeIndex];

        if (typeof _uuid !== 'string') {
          throw new Error("type uuid not found for index (" + typeIndex + "): " + (0, _stringify.default)(serializedValue, null, 4));
        }

        type = this._typeMeta.getType(_uuid);

        if (!type) {
          throw new Error("type not found for uuid (" + _uuid + "): " + (0, _stringify.default)(serializedValue, null, 4));
        }
      }

      var meta = this._typeMeta.getMeta(type);

      if (!meta) {
        throw new Error("Class (" + (0, _helpers.typeToDebugString)(type) + ") have no type meta");
      }

      var serializer = meta.serializer;

      if (!serializer) {
        throw new Error("Class (" + (0, _helpers.typeToDebugString)(type) + ") type meta have no serializer");
      }

      if (!serializer.deSerialize) {
        throw new Error("Class (" + (0, _helpers.typeToDebugString)(type) + ") serializer have no deSerialize method");
      }

      var factory = options && options.valueFactory || meta.valueFactory || function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return (0, _construct3.default)(type, args);
      };

      if (id != null && !factory) {
        throw new Error("valueFactory not found for " + (0, _helpers.typeToDebugString)(type) + ". " + 'Any object serializers should have valueFactory');
      }

      var instance;
      var iteratorOrValue = serializer.deSerialize(this.getNextDeSerialize(options), serializedValue.data, function () {
        if (!factory) {
          throw new Error('Multiple call valueFactory is forbidden');
        }

        instance = factory.apply(void 0, arguments);
        factory = null;
        return instance;
      }, options);

      var resolveInstance = function resolveInstance(value) {
        var cachedInstance = _this4._instances[id];
        _this4._instances[id] = value;

        if (cachedInstance instanceof _ThenableSync.ThenableSync) {
          cachedInstance.resolve(value);
        }
      };

      var resolveValue = function resolveValue(value) {
        if (id != null) {
          if (!factory && instance !== value) {
            throw new Error("valueFactory instance !== return value in serializer for " + (0, _helpers.typeToDebugString)(type));
          }

          resolveInstance(value);
          _this4._countDeserialized++;
        }

        if (_onfulfilled) {
          return _ThenableSync.ThenableSync.resolve(_onfulfilled(value));
        }

        return value;
      };

      var valueOrThenFunc = _ThenableSync.ThenableSync.resolve(iteratorOrValue, resolveValue);

      if (id != null && !factory && _ThenableSync.ThenableSync.isThenable(valueOrThenFunc)) {
        resolveInstance(instance);

        if (_onfulfilled) {
          return _ThenableSync.ThenableSync.resolve(_onfulfilled(instance));
        }

        return instance;
      }

      return valueOrThenFunc;
    }
  }]);
  return DeSerializerVisitor;
}(); // endregion
// region TypeMetaSerializerCollection


exports.DeSerializerVisitor = DeSerializerVisitor;

var TypeMetaSerializerCollection = /*#__PURE__*/function (_TypeMetaCollectionWi) {
  (0, _inherits2.default)(TypeMetaSerializerCollection, _TypeMetaCollectionWi);

  var _super = _createSuper(TypeMetaSerializerCollection);

  function TypeMetaSerializerCollection(proto) {
    (0, _classCallCheck2.default)(this, TypeMetaSerializerCollection);
    return _super.call(this, proto || TypeMetaSerializerCollection.default);
  }

  (0, _createClass2.default)(TypeMetaSerializerCollection, [{
    key: "putSerializableType",
    value: function putSerializableType(type, meta) {
      return this.putType(type, TypeMetaSerializerCollection.makeTypeMetaSerializer(type, meta));
    }
  }], [{
    key: "makeTypeMetaSerializer",
    value: function makeTypeMetaSerializer(type, meta) {
      return (0, _extends2.default)((0, _extends2.default)({
        uuid: type.uuid
      }, meta), {}, {
        serializer: (0, _extends2.default)({
          serialize: function serialize(_serialize, value, options) {
            return value.serialize(_serialize, options);
          },
          deSerialize: /*#__PURE__*/_regenerator.default.mark(function deSerialize(_deSerialize, serializedValue, valueFactory, options) {
            var value;
            return _regenerator.default.wrap(function deSerialize$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    value = valueFactory();
                    _context5.next = 3;
                    return value.deSerialize(_deSerialize, serializedValue, options);

                  case 3:
                    return _context5.abrupt("return", value);

                  case 4:
                  case "end":
                    return _context5.stop();
                }
              }
            }, deSerialize);
          })
        }, meta ? meta.serializer : {})
      });
    }
  }]);
  return TypeMetaSerializerCollection;
}(_TypeMeta.TypeMetaCollectionWithId);

exports.TypeMetaSerializerCollection = TypeMetaSerializerCollection;
TypeMetaSerializerCollection.default = new TypeMetaSerializerCollection();

function registerSerializable(type, meta) {
  TypeMetaSerializerCollection.default.putSerializableType(type, meta);
}

function registerSerializer(type, meta) {
  TypeMetaSerializerCollection.default.putType(type, meta);
} // endregion
// region ObjectSerializer


var ObjectSerializer = /*#__PURE__*/function () {
  function ObjectSerializer(typeMeta) {
    (0, _classCallCheck2.default)(this, ObjectSerializer);
    this.typeMeta = new TypeMetaSerializerCollection(typeMeta);
  }

  (0, _createClass2.default)(ObjectSerializer, [{
    key: "serialize",
    value: function serialize(value, options) {
      var serializer = new SerializerVisitor(this.typeMeta);
      var serializedValue = serializer.serialize(value, options);

      if (!serializedValue || typeof serializedValue !== 'object') {
        return serializedValue;
      }

      var serializedData = {
        data: serializedValue
      };

      if (serializer.types) {
        serializedData.types = serializer.types;
      }

      if (serializer.objects) {
        serializedData.objects = serializer.objects;
      }

      return serializedData;
    }
  }, {
    key: "deSerialize",
    value: function deSerialize(serializedValue, options) {
      if (!serializedValue || typeof serializedValue !== 'object') {
        return serializedValue;
      }

      var _ref = serializedValue,
          types = _ref.types,
          objects = _ref.objects,
          data = _ref.data;

      if (!(0, _isArray.default)(types)) {
        throw new Error("serialized value types field is not array: " + types);
      }

      var deSerializer = new DeSerializerVisitor(this.typeMeta, types, objects);
      var value = deSerializer.deSerialize(data, null, options);
      deSerializer.assertEnd();
      return value;
    }
  }]);
  return ObjectSerializer;
}(); // endregion
// region Primitive Serializers
// Handled in SerializerVisitor:
// undefined
// null
// number
// string
// boolean
// region Helpers


exports.ObjectSerializer = ObjectSerializer;
ObjectSerializer.default = new ObjectSerializer();

function serializeArray(serialize, value, length) {
  if (length == null) {
    length = value.length;
  }

  var serializedValue = [];

  for (var i = 0; i < length; i++) {
    serializedValue[i] = serialize(value[i]);
  }

  return serializedValue;
}

function deSerializeArray(deSerialize, serializedValue, value) {
  var _loop = function _loop(i, _len2) {
    var index = i;

    if (_ThenableSync.ThenableSync.isThenable(deSerialize(serializedValue[index], function (o) {
      value[index] = o;
    }))) {
      value[index] = null;
    }
  };

  for (var i = 0, _len2 = serializedValue.length; i < _len2; i++) {
    _loop(i, _len2);
  }

  return value;
}

function serializeIterable(serialize, value) {
  var serializedValue = [];

  for (var _iterator = _createForOfIteratorHelperLoose(value), _step; !(_step = _iterator()).done;) {
    var _item = _step.value;
    serializedValue.push(serialize(_item));
  }

  return serializedValue;
}

function deSerializeIterableOrdered(serializedValue, add) {
  var i, _len3;

  return _regenerator.default.wrap(function deSerializeIterableOrdered$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          i = 0, _len3 = serializedValue.length;

        case 1:
          if (!(i < _len3)) {
            _context6.next = 7;
            break;
          }

          _context6.next = 4;
          return add(serializedValue[i]);

        case 4:
          i++;
          _context6.next = 1;
          break;

        case 7:
        case "end":
          return _context6.stop();
      }
    }
  }, _marked);
}

function deSerializeIterable(serializedValue, add) {
  for (var i = 0, _len4 = serializedValue.length; i < _len4; i++) {
    add(serializedValue[i]);
  }
} // endregion
// region Object


function serializeObject(serialize, value, options) {
  var keepUndefined = options && options.objectKeepUndefined;
  var serializedValue = {};

  for (var key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      var _item2 = value[key];

      if (keepUndefined || typeof _item2 !== 'undefined') {
        serializedValue[key] = serialize(_item2);
      }
    }
  }

  return serializedValue;
}

function deSerializeObject(deSerialize, serializedValue, value) {
  var _loop2 = function _loop2(key) {
    if (Object.prototype.hasOwnProperty.call(serializedValue, key)) {
      // tslint:disable-next-line:no-collapsible-if
      if (_ThenableSync.ThenableSync.isThenable(deSerialize(serializedValue[key], function (o) {
        value[key] = o;
      }))) {
        value[key] = null;
      }
    }
  };

  for (var key in serializedValue) {
    _loop2(key);
  }

  return value;
} // noinspection SpellCheckingInspection


registerSerializer(Object, {
  uuid: '88968a59178c4e73a99f801e8cdfc37d',
  serializer: {
    serialize: function serialize(_serialize2, value, options) {
      return serializeObject(_serialize2, value, options);
    },
    deSerialize: function (_deSerialize2) {
      function deSerialize(_x, _x2, _x3) {
        return _deSerialize2.apply(this, arguments);
      }

      deSerialize.toString = function () {
        return _deSerialize2.toString();
      };

      return deSerialize;
    }(function (deSerialize, serializedValue, valueFactory) {
      var value = valueFactory();
      return deSerializeObject(deSerialize, serializedValue, value);
    })
  },
  valueFactory: function valueFactory() {
    return {};
  }
}); // endregion
// region Primitive as object

function serializePrimitiveAsObject(serialize, object) {
  var value = object.valueOf();

  if (value === object) {
    throw new Error("value is not primitive as object: " + (value && value.constructor.name));
  }

  return value; // return {
  // 	value: serialize(value),
  // 	object: serializeObject(serialize, object, options) as any,
  // }
}

function deSerializePrimitiveAsObject(deSerialize, serializedValue, valueFactory) {
  var object = valueFactory(serializedValue); // deSerializeObject(deSerialize, serializedValue.object as any, object)

  return object;
}

var primitiveAsObjectSerializer = {
  serialize: serializePrimitiveAsObject,
  deSerialize: deSerializePrimitiveAsObject
}; // @ts-ignore
// noinspection SpellCheckingInspection

registerSerializer(String, {
  uuid: '96104fd7d6f84a32b8f2feaa4f3666d8',
  serializer: primitiveAsObjectSerializer
}); // @ts-ignore

registerSerializer(Number, {
  uuid: 'dea0de4018014025b6a4b6f6c7a4fa11',
  serializer: primitiveAsObjectSerializer
}); // @ts-ignore

registerSerializer(Boolean, {
  uuid: 'e8d1ac82a0fa4431a23e3d8f954f736f',
  serializer: primitiveAsObjectSerializer
}); // endregion
// region Array

registerSerializer(Array, {
  uuid: 'f8c84ed084634f45b14a228967dfb0de',
  serializer: {
    serialize: function serialize(_serialize3, value, options) {
      if (options && options.arrayAsObject) {
        return serializeObject(_serialize3, value, options);
      }

      return serializeArray(_serialize3, value, options && options.arrayLength);
    },
    deSerialize: function (_deSerialize3) {
      function deSerialize(_x4, _x5, _x6, _x7) {
        return _deSerialize3.apply(this, arguments);
      }

      deSerialize.toString = function () {
        return _deSerialize3.toString();
      };

      return deSerialize;
    }(function (deSerialize, serializedValue, valueFactory, options) {
      var value = valueFactory();

      if (options && options.arrayAsObject) {
        return deSerializeObject(deSerialize, serializedValue, value);
      }

      return deSerializeArray(deSerialize, serializedValue, value);
    })
  },
  valueFactory: function valueFactory() {
    return [];
  }
}); // endregion
// region Set

registerSerializer(_set.default, {
  uuid: '17b11d99ce034349969e4f9291d0778c',
  serializer: {
    serialize: function serialize(_serialize4, value) {
      return serializeIterable(_serialize4, value);
    },
    deSerialize: function (_deSerialize4) {
      var _marked2 = /*#__PURE__*/_regenerator.default.mark(deSerialize);

      function deSerialize(_x8, _x9, _x10) {
        var _args3 = arguments;
        return _regenerator.default.wrap(function deSerialize$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                return _context7.delegateYield(_deSerialize4.apply(this, _args3), "t0", 1);

              case 1:
                return _context7.abrupt("return", _context7.t0);

              case 2:
              case "end":
                return _context7.stop();
            }
          }
        }, _marked2, this);
      }

      deSerialize.toString = function () {
        return _deSerialize4.toString();
      };

      return deSerialize;
    }( /*#__PURE__*/_regenerator.default.mark(function _callee(deSerialize, serializedValue, valueFactory) {
      var value;
      return _regenerator.default.wrap(function _callee$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              value = valueFactory();
              _context8.next = 3;
              return deSerializeIterableOrdered(serializedValue, function (o) {
                return deSerialize(o, function (val) {
                  value.add(val);
                });
              });

            case 3:
              return _context8.abrupt("return", value);

            case 4:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee);
    }))
  } // valueFactory: () => new Set(),

}); // endregion
// region Map

registerSerializer(_map.default, {
  uuid: 'fdf40f2159b74cb2804f3d18ebb19b57',
  serializer: {
    serialize: function serialize(_serialize5, value) {
      return serializeIterable(function (item) {
        return [_serialize5(item[0]), _serialize5(item[1])];
      }, value);
    },
    deSerialize: function (_deSerialize5) {
      var _marked3 = /*#__PURE__*/_regenerator.default.mark(deSerialize);

      function deSerialize(_x11, _x12, _x13) {
        var _args5 = arguments;
        return _regenerator.default.wrap(function deSerialize$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                return _context9.delegateYield(_deSerialize5.apply(this, _args5), "t0", 1);

              case 1:
                return _context9.abrupt("return", _context9.t0);

              case 2:
              case "end":
                return _context9.stop();
            }
          }
        }, _marked3, this);
      }

      deSerialize.toString = function () {
        return _deSerialize5.toString();
      };

      return deSerialize;
    }( /*#__PURE__*/_regenerator.default.mark(function _callee2(deSerialize, serializedValue, valueFactory) {
      var value;
      return _regenerator.default.wrap(function _callee2$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              value = valueFactory();
              _context10.next = 3;
              return deSerializeIterableOrdered(serializedValue, function (item) {
                return deSerialize(item[0], function (key) {
                  return deSerialize(item[1], function (val) {
                    value.set(key, val);
                  });
                });
              });

            case 3:
              return _context10.abrupt("return", value);

            case 4:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee2);
    }))
  } // valueFactory: () => new Map(),

}); // endregion
// region Date

registerSerializer(Date, {
  uuid: '7a6c01dba6b84822a9a586e4d3a4460b',
  serializer: {
    serialize: function serialize(_serialize6, value) {
      return value.getTime();
    },
    deSerialize: function (_deSerialize6) {
      function deSerialize(_x14, _x15, _x16) {
        return _deSerialize6.apply(this, arguments);
      }

      deSerialize.toString = function () {
        return _deSerialize6.toString();
      };

      return deSerialize;
    }(function (deSerialize, serializedValue, valueFactory) {
      return valueFactory(serializedValue);
    })
  } // valueFactory: (value: number|string|Date) => new Date(value),

}); // endregion
// endregion