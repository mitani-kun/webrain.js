import _typeof from "@babel/runtime/helpers/typeof";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";

/* eslint-disable guard-for-in */
import { ObservableObject, ObservableObjectBuilder } from '../../../../../../main/common/rx/object/ObservableObject';
describe('common > main > rx > observable-object-builder-prototype', function () {
  it('base', function () {
    var BaseClass1 =
    /*#__PURE__*/
    function (_ObservableObject) {
      _inherits(BaseClass1, _ObservableObject);

      function BaseClass1() {
        _classCallCheck(this, BaseClass1);

        return _possibleConstructorReturn(this, _getPrototypeOf(BaseClass1).apply(this, arguments));
      }

      return BaseClass1;
    }(ObservableObject);

    var BaseClass2 =
    /*#__PURE__*/
    function (_BaseClass) {
      _inherits(BaseClass2, _BaseClass);

      function BaseClass2() {
        _classCallCheck(this, BaseClass2);

        return _possibleConstructorReturn(this, _getPrototypeOf(BaseClass2).apply(this, arguments));
      }

      return BaseClass2;
    }(BaseClass1);

    var Class1 =
    /*#__PURE__*/
    function (_BaseClass2) {
      _inherits(Class1, _BaseClass2);

      function Class1() {
        _classCallCheck(this, Class1);

        return _possibleConstructorReturn(this, _getPrototypeOf(Class1).apply(this, arguments));
      }

      return Class1;
    }(BaseClass1);

    var Class2 =
    /*#__PURE__*/
    function (_BaseClass3) {
      _inherits(Class2, _BaseClass3);

      function Class2() {
        _classCallCheck(this, Class2);

        return _possibleConstructorReturn(this, _getPrototypeOf(Class2).apply(this, arguments));
      }

      return Class2;
    }(BaseClass2);

    var baseBuilder1 = new ObservableObjectBuilder(BaseClass1.prototype).writable('baseProp1');
    var baseBuilder2 = new ObservableObjectBuilder(BaseClass2.prototype).writable('baseProp2');
    var builder1 = new ObservableObjectBuilder(Class1.prototype).writable('prop1');
    var builder2 = new ObservableObjectBuilder(Class2.prototype).writable('prop2');
    var baseObject1 = new BaseClass1();
    var baseObject2 = new BaseClass2();
    var object1 = new Class1();
    var object2 = new Class2(); // eslint-disable-next-line prefer-const

    var baseResults1 = [];

    var baseSubscriber1 = function baseSubscriber1(value) {
      baseResults1.push(value);
    }; // eslint-disable-next-line prefer-const


    var baseResults2 = [];

    var baseSubscriber2 = function baseSubscriber2(value) {
      baseResults2.push(value);
    }; // eslint-disable-next-line prefer-const


    var results1 = [];

    var subscriber1 = function subscriber1(value) {
      results1.push(value);
    }; // eslint-disable-next-line prefer-const


    var results2 = [];

    var subscriber2 = function subscriber2(value) {
      results2.push(value);
    };

    var baseUnsubscribe1 = [];
    var baseUnsubscribe2 = [];
    var unsubscribe1 = [];
    var unsubscribe2 = [];
    assert.strictEqual(_typeof(baseUnsubscribe1[0] = baseObject1.propertyChanged.subscribe(baseSubscriber1)), 'function');
    assert.strictEqual(_typeof(baseUnsubscribe2[0] = baseObject2.propertyChanged.subscribe(baseSubscriber2)), 'function');
    assert.strictEqual(_typeof(unsubscribe1[0] = object1.propertyChanged.subscribe(subscriber1)), 'function');
    assert.strictEqual(_typeof(unsubscribe2[0] = object2.propertyChanged.subscribe(subscriber2)), 'function');
    baseObject1.baseProp1 = '1';
    assert.deepStrictEqual(baseResults1, [{
      name: 'baseProp1',
      newValue: '1',
      oldValue: undefined
    }]);
    baseResults1 = [];
    assert.deepStrictEqual(baseResults2, []);
    assert.deepStrictEqual(results1, []);
    assert.deepStrictEqual(results2, []);
    assert.deepStrictEqual(baseObject1.baseProp1, '1');
    assert.deepStrictEqual(baseObject2.baseProp1, undefined);
    assert.deepStrictEqual(object1.baseProp1, undefined);
    assert.deepStrictEqual(object2.baseProp1, undefined);
    baseObject2.baseProp1 = '2';
    assert.deepStrictEqual(baseResults1, []);
    assert.deepStrictEqual(baseResults2, [{
      name: 'baseProp1',
      newValue: '2',
      oldValue: undefined
    }]);
    baseResults2 = [];
    assert.deepStrictEqual(results1, []);
    assert.deepStrictEqual(results2, []);
    assert.deepStrictEqual(baseObject1.baseProp1, '1');
    assert.deepStrictEqual(baseObject2.baseProp1, '2');
    assert.deepStrictEqual(object1.baseProp1, undefined);
    assert.deepStrictEqual(object2.baseProp1, undefined);
    baseObject2.baseProp2 = '3';
    assert.deepStrictEqual(baseResults1, []);
    assert.deepStrictEqual(baseResults2, [{
      name: 'baseProp2',
      newValue: '3',
      oldValue: undefined
    }]);
    baseResults2 = [];
    assert.deepStrictEqual(results1, []);
    assert.deepStrictEqual(results2, []);
    assert.deepStrictEqual(baseObject1.baseProp2, undefined);
    assert.deepStrictEqual(baseObject2.baseProp2, '3');
    assert.deepStrictEqual(object1.baseProp2, undefined);
    assert.deepStrictEqual(object2.baseProp2, undefined);
    object1.baseProp1 = '4';
    assert.deepStrictEqual(baseResults1, []);
    assert.deepStrictEqual(baseResults2, []);
    assert.deepStrictEqual(results1, [{
      name: 'baseProp1',
      newValue: '4',
      oldValue: undefined
    }]);
    results1 = [];
    assert.deepStrictEqual(results2, []);
    assert.deepStrictEqual(baseObject1.baseProp1, '1');
    assert.deepStrictEqual(baseObject2.baseProp1, '2');
    assert.deepStrictEqual(object1.baseProp1, '4');
    assert.deepStrictEqual(object2.baseProp1, undefined);
    object2.baseProp1 = '5';
    assert.deepStrictEqual(baseResults1, []);
    assert.deepStrictEqual(baseResults2, []);
    assert.deepStrictEqual(results1, []);
    assert.deepStrictEqual(results2, [{
      name: 'baseProp1',
      newValue: '5',
      oldValue: undefined
    }]);
    results2 = [];
    assert.deepStrictEqual(baseObject1.baseProp1, '1');
    assert.deepStrictEqual(baseObject2.baseProp1, '2');
    assert.deepStrictEqual(object1.baseProp1, '4');
    assert.deepStrictEqual(object2.baseProp1, '5');
    object2.baseProp2 = '6';
    assert.deepStrictEqual(baseResults1, []);
    assert.deepStrictEqual(baseResults2, []);
    assert.deepStrictEqual(results1, []);
    assert.deepStrictEqual(results2, [{
      name: 'baseProp2',
      newValue: '6',
      oldValue: undefined
    }]);
    results2 = [];
    assert.deepStrictEqual(baseObject1.baseProp2, undefined);
    assert.deepStrictEqual(baseObject2.baseProp2, '3');
    assert.deepStrictEqual(object1.baseProp2, undefined);
    assert.deepStrictEqual(object2.baseProp2, '6');
    new ObservableObjectBuilder(object2).readable('baseProp1', null, '7');
    assert.deepStrictEqual(baseResults1, []);
    assert.deepStrictEqual(baseResults2, []);
    assert.deepStrictEqual(results1, []);
    assert.deepStrictEqual(results2, [{
      name: 'baseProp1',
      newValue: '7',
      oldValue: '5'
    }]);
    results2 = [];
    assert.deepStrictEqual(baseObject1.baseProp1, '1');
    assert.deepStrictEqual(baseObject2.baseProp1, '2');
    assert.deepStrictEqual(object1.baseProp1, '4');
    assert.deepStrictEqual(object2.baseProp1, '7');
  });
});