/* tslint:disable:no-shadowed-variable no-duplicate-string */

/* eslint-disable no-useless-escape,computed-property-spacing */
import { ObjectMap } from '../../../../../../main/common/lists/ObjectMap';
import { ObjectSet } from '../../../../../../main/common/lists/ObjectSet';
import { ObservableMap } from '../../../../../../main/common/lists/ObservableMap';
import { ObservableSet } from '../../../../../../main/common/lists/ObservableSet';
import { SortedList } from '../../../../../../main/common/lists/SortedList';
import { ANY, ANY_DISPLAY, COLLECTION_PREFIX } from '../../../../../../main/common/rx/deep-subscribe/contracts/constants';
import { RuleType } from '../../../../../../main/common/rx/deep-subscribe/contracts/rules';
import { RuleBuilder } from '../../../../../../main/common/rx/deep-subscribe/RuleBuilder';
import { ObservableObjectBuilder } from '../../../../../../main/common/rx/object/ObservableObjectBuilder';
import { assert } from '../../../../../../main/common/test/Assert';
describe('common > main > rx > deep-subscribe > RuleBuilder', function () {
  // noinspection JSUnusedLocalSymbols
  function checkType(builder) {
    return true;
  }

  it('constructor', function () {
    const builder = new RuleBuilder({
      autoInsertValuePropertyDefault: false
    });
    assert.strictEqual(builder.result(), undefined);
  });
  const nonSubscribeProperty = Math.random().toString(36);

  function testSubscribe(isCollection, isMap, nonObservableObject, observableObject, subscribe, properties, subscribeProperties, add, change, remove) {
    const nonSubscribeProperties = properties.slice();

    for (const property of subscribeProperties) {
      let index; // tslint:disable-next-line:no-conditional-assignment

      while ((index = nonSubscribeProperties.indexOf(property)) >= 0) {
        nonSubscribeProperties.splice(index, 1);
      }
    }

    function checkDebugPropertyName(value, debugPropertyName) {
      assert.ok(debugPropertyName);
      assert.ok(debugPropertyName.length);

      if (isCollection) {
        assert.strictEqual(debugPropertyName[0], COLLECTION_PREFIX);
        debugPropertyName = debugPropertyName.substring(1);
      }

      if (isMap) {
        assert.strictEqual('value_' + debugPropertyName, value);
      }
    }

    let subscribedItems = [];

    function subscribeItem(value, debugPropertyName) {
      if (typeof value === 'undefined') {
        return;
      }

      assert.ok(value);
      assert.strictEqual(typeof value, 'string', value);
      value = value.trim();
      checkDebugPropertyName(value, debugPropertyName);
      subscribedItems.push('+' + value);
    } // tslint:disable-next-line:no-identical-functions


    function unsubscribeItem(value, debugPropertyName) {
      if (typeof value === 'undefined') {
        return;
      }

      assert.ok(value);
      value = value.trim();
      checkDebugPropertyName(value, debugPropertyName);
      subscribedItems.push('-' + value);
    }

    function testNonSubscribeProperties(object) {
      for (const property of nonSubscribeProperties) {
        add(object, property);
        assert.deepStrictEqual(subscribedItems, []);

        if (change) {
          change(object, property);
          assert.deepStrictEqual(subscribedItems, []);
        }

        remove(object, property, true);
        assert.deepStrictEqual(subscribedItems, []);

        if (property === nonSubscribeProperty) {
          add(object, nonSubscribeProperty);
          assert.deepStrictEqual(subscribedItems, []);
        } // if (object === observableObject) {
        // 	assert.deepStrictEqual(subscribedItems, ['+undefined'])
        // 	subscribedItems = []
        // }

      }
    }

    let lastError;

    for (let debugIteration = 0; debugIteration < 2; debugIteration++) {
      try {
        // region Non Observable
        const testNonObservableObject = object => {
          let unsubscribe = subscribe(object, false, subscribeItem, unsubscribeItem);
          assert.strictEqual(unsubscribe, null);
          testNonSubscribeProperties(object);
          unsubscribe = subscribe(object, true, subscribeItem, unsubscribeItem);
          assert.ok(unsubscribe);
          assert.strictEqual(typeof unsubscribe, 'function');
          assert.deepStrictEqual(subscribedItems, []);
          subscribedItems = [];
          testNonSubscribeProperties(object);

          for (const property of subscribeProperties) {
            add(object, property);
            assert.deepStrictEqual(subscribedItems, []);

            if (change) {
              change(object, property);
              assert.deepStrictEqual(subscribedItems, []);
            }
          }

          testNonSubscribeProperties(object);
          unsubscribe();
          assert.deepStrictEqual(subscribedItems.sort(), subscribeProperties.map(o => '-value_' + o).sort());
          subscribedItems = [];
          unsubscribe = subscribe(object, true, subscribeItem, unsubscribeItem);
          assert.ok(unsubscribe);
          assert.strictEqual(typeof unsubscribe, 'function');
          assert.deepStrictEqual(subscribedItems.sort(), subscribeProperties.map(o => '+value_' + o).sort());
          subscribedItems = [];
          testNonSubscribeProperties(object);

          for (const property of subscribeProperties) {
            remove(object, property, false);
            assert.deepStrictEqual(subscribedItems, []);
          }

          testNonSubscribeProperties(object);
          unsubscribe();
          assert.deepStrictEqual(subscribedItems, []);
          subscribedItems = [];
          unsubscribe = subscribe(object, false, subscribeItem, unsubscribeItem);
          assert.strictEqual(unsubscribe, null);
          assert.deepStrictEqual(subscribedItems, []);
        }; // endregion
        // region Observable


        const testObservableObject = object => {
          let unsubscribe = subscribe(object, false, subscribeItem, unsubscribeItem);
          assert.ok(unsubscribe);
          assert.strictEqual(typeof unsubscribe, 'function');
          testNonSubscribeProperties(object);
          unsubscribe();
          assert.deepStrictEqual(subscribedItems, []);
          subscribedItems = [];
          unsubscribe = subscribe(object, true, subscribeItem, unsubscribeItem);
          assert.ok(unsubscribe);
          assert.strictEqual(typeof unsubscribe, 'function');
          assert.deepStrictEqual(subscribedItems, []);
          subscribedItems = [];
          testNonSubscribeProperties(object);

          for (const property of subscribeProperties) {
            add(object, property);
            assert.deepStrictEqual(subscribedItems, [// '-undefined',
            '+value_' + property]);
            subscribedItems = [];

            if (change) {
              change(object, property);
              assert.deepStrictEqual(subscribedItems, ['-value_' + property, '+value_' + property]);
              subscribedItems = [];
            }
          }

          testNonSubscribeProperties(object);
          unsubscribe();
          assert.deepStrictEqual(subscribedItems.sort(), subscribeProperties.map(o => '-value_' + o).sort());
          subscribedItems = [];
          unsubscribe = subscribe(object, false, subscribeItem, unsubscribeItem);
          assert.ok(unsubscribe);
          assert.strictEqual(typeof unsubscribe, 'function');
          unsubscribe();
          assert.deepStrictEqual(subscribedItems.sort(), subscribeProperties.map(o => '-value_' + o).sort());
          subscribedItems = [];
          unsubscribe = subscribe(object, true, subscribeItem, unsubscribeItem);
          assert.ok(unsubscribe);
          assert.strictEqual(typeof unsubscribe, 'function');
          assert.deepStrictEqual(subscribedItems.sort(), subscribeProperties.map(o => '+value_' + o).sort());
          subscribedItems = [];
          testNonSubscribeProperties(object);

          for (const property of subscribeProperties) {
            remove(object, property, false);
            assert.deepStrictEqual(subscribedItems, ['-value_' + property // '+undefined',
            ]);
            subscribedItems = [];
          }

          testNonSubscribeProperties(object);
          unsubscribe();
          assert.deepStrictEqual(subscribedItems, []);
          subscribedItems = [];
        }; // endregion


        if (observableObject) {
          testObservableObject(observableObject);
        }

        if (nonObservableObject) {// Obsolete
          // testNonObservableObject(nonObservableObject)
          // testObservableObject(nonObservableObject)
        }
      } catch (ex) {
        if (!lastError) {
          console.log(ex);
          lastError = ex;
        }
      }
    }

    if (lastError) {
      throw lastError;
    }
  }

  function testObject(properties, subscribe) {
    const builder = new ObservableObjectBuilder();

    if (properties !== ANY) {
      builder.writable(nonSubscribeProperty, null, 'value_' + nonSubscribeProperty);
    }

    function add(object, property) {
      if (object.propertyChanged) {
        new ObservableObjectBuilder(object).writable(property, null, 'value_' + property);
      } else {
        change(object, property);
      }
    }

    function change(object, property) {
      object[property] = object[property] ? object[property] + ' ' : 'value_' + property;
    }

    function remove(object, property, isNonSubscribe) {
      if (object.propertyChanged) {
        new ObservableObjectBuilder(object).delete(property);
      } else {
        delete object[property];
      }
    }

    testSubscribe(false, true, { ...builder.object
    }, builder.object, subscribe, [nonSubscribeProperty, ...(properties === ANY ? [] : properties)], properties === ANY ? [nonSubscribeProperty, 'p1', 'p2', 'p3'] : properties, add, change, remove); // builder
    // 	.writable('p1', null, 'value_p1')
    // 	.writable('p2', null, 'value_p2')
    // 	.writable('p3', null, 'value_p3')

    testSubscribe(false, true, Object.create({ ...builder.object
    }), Object.create(builder.object), subscribe, [nonSubscribeProperty, ...(properties === ANY ? [] : properties)], [], (object, property) => {
      Object.defineProperty(object, property, {
        configurable: true,
        writable: true,
        value: 'value_' + property
      });
    }, change, (object, property) => {
      delete object[property];
    });
  }

  function testArray(properties, subscribe) {
    if (properties === ANY || properties.indexOf('length') >= 0) {
      return;
    }

    const object = [];
    object[nonSubscribeProperty] = 'value_' + nonSubscribeProperty; // tslint:disable-next-line:no-identical-functions

    function change(object, property) {
      object[property] = object[property] ? object[property] + ' ' : 'value_' + property;
    }

    function remove(object, property) {
      delete object[property];
    }

    testSubscribe(false, true, object, null, subscribe, [nonSubscribeProperty, ...(properties === ANY ? [] : properties)], properties === ANY ? [nonSubscribeProperty] : properties, change, change, remove);
  }

  function testMap(properties, subscribe) {
    const map = new ObjectMap();
    const observableMap = new ObservableMap(new ObjectMap());

    if (properties !== ANY) {
      map.set(nonSubscribeProperty, 'value_' + nonSubscribeProperty);
      observableMap.set(nonSubscribeProperty, 'value_' + nonSubscribeProperty);
    }

    function change(object, property) {
      object.set(property, object.get(property) ? object.get(property) + ' ' : 'value_' + property);
    }

    function remove(object, property) {
      object.delete(property);
    }

    testSubscribe(true, true, map, observableMap, subscribe, [nonSubscribeProperty, ...(properties === ANY ? [] : properties)], properties === ANY ? [nonSubscribeProperty, 'p1', 'p2', 'p3'] : properties, change, change, remove);
  }

  function testSet(properties, subscribe) {
    const set = new ObjectSet();
    const observableSet = new ObservableSet(new ObjectSet());

    function add(object, property) {
      object.add('value_' + property);
    }

    function remove(object, property) {
      object.delete('value_' + property);
    }

    testSubscribe(true, false, set, observableSet, subscribe, [], ['p1', 'p2', 'p3'], add, null, remove);
  }

  function testIterable(properties, subscribe) {
    assert.strictEqual(subscribe({}, true, item => {
      assert.fail();
    }, item => {
      assert.fail();
    }), null);
    const array = []; // tslint:disable-next-line:no-identical-functions

    function add(object, property) {
      object.push('value_' + property);
    }

    function change(object, property) {
      for (let i = object.length - 1; i >= 0; i--) {
        if (object[i].trim() === 'value_' + property) {
          object[i] += ' ';
          return;
        }
      }
    }

    function remove(object, property) {
      for (let i = object.length - 1; i >= 0; i--) {
        if (object[i].trim() === 'value_' + property) {
          object.splice(i, 1);
          return;
        }
      }
    }

    testSubscribe(true, false, array, null, subscribe, [], ['p1', 'p2', 'p3'], add, change, remove);
  }

  function testList(properties, subscribe) {
    const list = new SortedList({
      autoSort: true,
      notAddIfExists: true
    }); // @ts-ignore

    Object.defineProperty(list, 'listChanged', {
      configurable: true,
      writable: true,
      value: null
    });
    const observableList = new SortedList({
      autoSort: true,
      notAddIfExists: true
    }); // tslint:disable-next-line:no-identical-functions

    function add(object, property) {
      object.add('value_' + property);
    }

    function change(object, property) {
      for (let i = object.size - 1; i >= 0; i--) {
        if (object.get(i).trim() === 'value_' + property) {
          object.set(i, object.get(i) + ' ');
          return;
        }
      }
    }

    function remove(object, property) {
      for (let i = object.size - 1; i >= 0; i--) {
        if (object.get(i).trim() === 'value_' + property) {
          object.removeAt(i);
          return;
        }
      }
    }

    testSubscribe(true, false, list, observableList, subscribe, [], ['p1', 'p2', 'p3'], add, change, remove);
  }

  function assertRuleParams(rule, expected) {
    rule = { ...rule
    };
    expected = { ...expected
    };

    if ('unsubscribers' in rule) {
      expected.unsubscribers = rule.unsubscribers;
      expected.unsubscribersCount = rule.unsubscribersCount;
    }

    delete rule.subscribe;
    delete rule.next;
    delete rule.rule;
    delete rule.rules;
    delete expected.objectTypes;
    delete expected.properties;
    delete expected.next;
    delete expected.rule;
    delete expected.rules;
    assert.deepStrictEqual(rule, expected);
  }

  function _assertRule(rule, expected) {
    if (!expected) {
      assert.strictEqual(rule, expected);
      return;
    }

    assertRuleParams(rule, expected);

    if (rule.type === RuleType.Action) {
      assert.ok(expected.objectTypes && expected.objectTypes.length);
      assert.ok(expected.properties === ANY || expected.properties.length);
      assert.ok(rule.subscribe);

      for (const objectType of expected.objectTypes) {
        switch (objectType) {
          case 'object':
            testObject(expected.properties, rule.subscribe);
            break;

          case 'array':
            testArray(expected.properties, rule.subscribe);
            break;

          case 'map':
            testMap(expected.properties, rule.subscribe);
            break;

          case 'list':
            testList(expected.properties, rule.subscribe);
            break;

          case 'iterable':
            testIterable(expected.properties, rule.subscribe);
            break;

          case 'set':
            testSet(expected.properties, rule.subscribe);
            break;

          default:
            assert.fail('Unknown objectType: ' + objectType);
        }
      }
    } else {
      assert.notOk(expected.objectTypes);
      assert.notOk(expected.properties);
    }

    _assertRule(rule.next, expected.next);

    _assertRule(rule.rule, expected.rule);

    if (!expected.rules) {
      assert.strictEqual(rule.rules, undefined);
    } else {
      assert.ok(rule.rules);
      assert.strictEqual(rule.rules.length, expected.rules.length);

      for (let i = 0; i < expected.rules.length; i++) {
        _assertRule(rule.rules[i], expected.rules[i]);
      }
    }
  }

  function assertRule(rule, expected) {
    try {
      _assertRule(rule, expected);
    } catch (ex) {
      console.log('Actual:\n', rule, '\n');
      console.log('Expected:\n', expected, '\n');
      throw ex;
    }
  }

  it('path', function () {
    const builder = new RuleBuilder({
      autoInsertValuePropertyDefault: false
    });
    assert.strictEqual(builder.result(), undefined);
    const builder1 = builder.path(o => o.prop1);
    const rule1 = builder1.result();
    assert.strictEqual(builder1, builder);
    assertRule(rule1, {
      type: RuleType.Action,
      objectTypes: ['object', 'array'],
      properties: ['prop1'],
      description: 'prop1'
    });
    const builder3 = builder1.path(o => o["prop '2'"].prop3);
    checkType(builder3);
    assert.strictEqual(builder3, builder);
    assert.strictEqual(builder3.result(), rule1);
    assertRule(rule1, {
      type: RuleType.Action,
      objectTypes: ['object', 'array'],
      properties: ['prop1'],
      description: 'prop1',
      next: {
        type: RuleType.Action,
        objectTypes: ['object', 'array'],
        properties: ["prop '2'"],
        description: "prop '2'",
        next: {
          type: RuleType.Action,
          objectTypes: ['object', 'array'],
          properties: ['prop3'],
          description: 'prop3'
        }
      }
    });
    const builder4 = builder3.path(o => o.length);
    checkType(builder4);
    assert.strictEqual(builder4, builder);
    assert.strictEqual(builder4.result(), rule1);
    assertRule(rule1, {
      type: RuleType.Action,
      objectTypes: ['object', 'array'],
      properties: ['prop1'],
      description: 'prop1',
      next: {
        type: RuleType.Action,
        objectTypes: ['object', 'array'],
        properties: ["prop '2'"],
        description: "prop '2'",
        next: {
          type: RuleType.Action,
          objectTypes: ['object', 'array'],
          properties: ['prop3'],
          description: 'prop3',
          next: {
            type: RuleType.Action,
            objectTypes: ['object', 'array'],
            properties: ['length'],
            description: 'length'
          }
        }
      }
    });
  });
  it('path complex', function () {
    const builder = new RuleBuilder({
      autoInsertValuePropertyDefault: false
    });
    assert.strictEqual(builder.result(), undefined);
    const builder1 = builder.path(o => o['prop1|prop2']['#prop3']['#prop4||prop5']['*']['#']['#*']);
    const rule1 = builder1.result();
    assert.strictEqual(builder1, builder);
    assertRule(rule1, {
      type: RuleType.Action,
      objectTypes: ['object', 'array'],
      properties: ['prop1', 'prop2'],
      description: 'prop1|prop2',
      next: {
        type: RuleType.Action,
        objectTypes: ['map'],
        properties: ['prop3'],
        description: '#prop3',
        next: {
          type: RuleType.Action,
          objectTypes: ['map'],
          properties: ['prop4', '', 'prop5'],
          description: '#prop4||prop5',
          next: {
            type: RuleType.Action,
            objectTypes: ['object', 'array'],
            properties: ANY,
            description: ANY_DISPLAY,
            next: {
              type: RuleType.Action,
              objectTypes: ['map', 'set', 'list', 'iterable'],
              properties: ANY,
              description: COLLECTION_PREFIX,
              next: {
                type: RuleType.Action,
                objectTypes: ['map'],
                properties: ANY,
                description: COLLECTION_PREFIX + ANY_DISPLAY
              }
            }
          }
        }
      }
    });
  });
  it('property', function () {
    const builder = new RuleBuilder({
      autoInsertValuePropertyDefault: false
    });
    assert.strictEqual(builder.result(), undefined); // @ts-ignore

    assert.throws(() => builder.propertyRegexp(), Error); // @ts-ignore

    assert.throws(() => builder.propertyRegexp('string'), Error);
    assert.throws(() => builder.propertyRegexp(null), Error); // @ts-ignore

    assert.throws(() => builder.propertyPredicate('string'), Error);
    assert.strictEqual(builder.result(), undefined);
    const builder1 = builder.propertyRegexp(/prop1|prop2/);
    const rule1 = builder1.result();
    assert.strictEqual(builder1, builder);
    assertRule(rule1, {
      type: RuleType.Action,
      objectTypes: ['object', 'array'],
      properties: ['prop1', 'prop2'],
      description: '/prop1|prop2/'
    });
    const builder2 = builder.propertyRegexp(/prop2|prop3/);
    checkType(builder2);
    assert.strictEqual(builder2, builder);
    assert.strictEqual(builder2.result(), rule1);
    assertRule(rule1, {
      type: RuleType.Action,
      objectTypes: ['object', 'array'],
      properties: ['prop1', 'prop2'],
      description: '/prop1|prop2/',
      next: {
        type: RuleType.Action,
        objectTypes: ['object', 'array'],
        properties: ['prop2', 'prop3'],
        description: '/prop2|prop3/'
      }
    });
    const builder3 = builder.propertyRegexp(/prop3|prop4/);
    checkType(builder3);
    assert.strictEqual(builder3, builder);
    assert.strictEqual(builder3.result(), rule1);
    assertRule(rule1, {
      type: RuleType.Action,
      objectTypes: ['object', 'array'],
      properties: ['prop1', 'prop2'],
      description: '/prop1|prop2/',
      next: {
        type: RuleType.Action,
        objectTypes: ['object', 'array'],
        properties: ['prop2', 'prop3'],
        description: '/prop2|prop3/',
        next: {
          type: RuleType.Action,
          objectTypes: ['object', 'array'],
          properties: ['prop3', 'prop4'],
          description: '/prop3|prop4/'
        }
      }
    }); // noinspection JSUnusedLocalSymbols

    const rule3 = builder3.result().next.next;
  });
  it('propertyAny', function () {
    const builder = new RuleBuilder({
      autoInsertValuePropertyDefault: false
    });
    assert.strictEqual(builder.result(), undefined);
    const builder1 = builder.propertyAny();
    const rule1 = builder1.result();
    assert.strictEqual(builder1, builder);
    assertRule(rule1, {
      type: RuleType.Action,
      objectTypes: ['object', 'array'],
      properties: ANY,
      description: ANY_DISPLAY
    });
    const builder2 = builder.propertyNames(ANY);
    checkType(builder2);
    assert.strictEqual(builder2, builder);
    assert.strictEqual(builder2.result(), rule1);
    assertRule(rule1, {
      type: RuleType.Action,
      objectTypes: ['object', 'array'],
      properties: ANY,
      description: ANY_DISPLAY,
      next: {
        type: RuleType.Action,
        objectTypes: ['object', 'array'],
        properties: ANY,
        description: ANY_DISPLAY
      }
    });
    const builder3 = builder.propertyNames('prop1', ANY, 'prop2');
    checkType(builder3);
    assert.strictEqual(builder3, builder);
    assert.strictEqual(builder3.result(), rule1);
    assertRule(rule1, {
      type: RuleType.Action,
      objectTypes: ['object', 'array'],
      properties: ANY,
      description: ANY_DISPLAY,
      next: {
        type: RuleType.Action,
        objectTypes: ['object', 'array'],
        properties: ANY,
        description: ANY_DISPLAY,
        next: {
          type: RuleType.Action,
          objectTypes: ['object', 'array'],
          properties: ANY,
          description: `prop1|${ANY_DISPLAY}|prop2`
        }
      }
    }); // noinspection JSUnusedLocalSymbols

    const rule3 = builder3.result().next.next;
  });
  it('propertyNames', function () {
    const builder = new RuleBuilder({
      autoInsertValuePropertyDefault: false
    });
    assert.strictEqual(builder.result(), undefined);
    assert.strictEqual(builder.result(), undefined);
    const builder1 = builder.propertyNames('prop1');
    const rule1 = builder1.result();
    assert.strictEqual(builder1, builder);
    assertRule(rule1, {
      type: RuleType.Action,
      objectTypes: ['object', 'array'],
      properties: ['prop1'],
      description: 'prop1'
    });
    const builder2 = builder.propertyName('prop2');
    checkType(builder2);
    assert.strictEqual(builder2, builder);
    assert.strictEqual(builder2.result(), rule1);
    assertRule(rule1, {
      type: RuleType.Action,
      objectTypes: ['object', 'array'],
      properties: ['prop1'],
      description: 'prop1',
      next: {
        type: RuleType.Action,
        objectTypes: ['object', 'array'],
        properties: ['prop2'],
        description: 'prop2'
      }
    });
    const builder3 = builder.propertyNames('prop3', 'prop4', 'prop5');
    checkType(builder3);
    assert.strictEqual(builder3, builder);
    assert.strictEqual(builder3.result(), rule1);
    assertRule(rule1, {
      type: RuleType.Action,
      objectTypes: ['object', 'array'],
      properties: ['prop1'],
      description: 'prop1',
      next: {
        type: RuleType.Action,
        objectTypes: ['object', 'array'],
        properties: ['prop2'],
        description: 'prop2',
        next: {
          type: RuleType.Action,
          objectTypes: ['object', 'array'],
          properties: ['prop3', 'prop4', 'prop5'],
          description: 'prop3|prop4|prop5'
        }
      }
    }); // noinspection JSUnusedLocalSymbols

    const rule3 = builder3.result().next.next;
  });
  it('map', function () {
    const builder = new RuleBuilder({
      autoInsertValuePropertyDefault: false
    });
    assert.strictEqual(builder.result(), undefined); // @ts-ignore

    assert.throws(() => builder.mapRegexp(), Error); // @ts-ignore

    assert.throws(() => builder.mapRegexp('string'), Error);
    assert.throws(() => builder.mapRegexp(null), Error); // @ts-ignore

    assert.throws(() => builder.mapPredicate('string'), Error);
    assert.strictEqual(builder.result(), undefined);
    const builder1 = builder.mapRegexp(/prop1|prop2/);
    const rule1 = builder1.result();
    assert.strictEqual(builder1, builder);
    assertRule(rule1, {
      type: RuleType.Action,
      objectTypes: ['map'],
      properties: ['prop1', 'prop2'],
      description: '/prop1|prop2/'
    });
    const builder2 = builder.mapRegexp(/prop2|prop3/);
    checkType(builder2);
    assert.strictEqual(builder2, builder);
    assert.strictEqual(builder2.result(), rule1);
    assertRule(rule1, {
      type: RuleType.Action,
      objectTypes: ['map'],
      properties: ['prop1', 'prop2'],
      description: '/prop1|prop2/',
      next: {
        type: RuleType.Action,
        objectTypes: ['map'],
        properties: ['prop2', 'prop3'],
        description: '/prop2|prop3/'
      }
    });
    const builder3 = builder.mapRegexp(/prop3|prop4/);
    checkType(builder3);
    assert.strictEqual(builder3, builder);
    assert.strictEqual(builder3.result(), rule1);
    assertRule(rule1, {
      type: RuleType.Action,
      objectTypes: ['map'],
      properties: ['prop1', 'prop2'],
      description: '/prop1|prop2/',
      next: {
        type: RuleType.Action,
        objectTypes: ['map'],
        properties: ['prop2', 'prop3'],
        description: '/prop2|prop3/',
        next: {
          type: RuleType.Action,
          objectTypes: ['map'],
          properties: ['prop3', 'prop4'],
          description: '/prop3|prop4/'
        }
      }
    }); // noinspection JSUnusedLocalSymbols

    const rule3 = builder3.result().next.next;
  });
  it('mapAny', function () {
    const builder = new RuleBuilder({
      autoInsertValuePropertyDefault: false
    });
    assert.strictEqual(builder.result(), undefined);
    const builder1 = builder.mapAny();
    const rule1 = builder1.result();
    assert.strictEqual(builder1, builder);
    assertRule(rule1, {
      type: RuleType.Action,
      objectTypes: ['map'],
      properties: ANY,
      description: COLLECTION_PREFIX
    });
    const builder2 = builder.mapKeys();
    checkType(builder2);
    assert.strictEqual(builder2, builder);
    assert.strictEqual(builder2.result(), rule1);
    assertRule(rule1, {
      type: RuleType.Action,
      objectTypes: ['map'],
      properties: ANY,
      description: COLLECTION_PREFIX,
      next: {
        type: RuleType.Action,
        objectTypes: ['map'],
        properties: ANY,
        description: COLLECTION_PREFIX
      }
    });
    const builder3 = builder.mapKeys('prop1', ANY, 'prop2');
    checkType(builder3);
    assert.strictEqual(builder3, builder);
    assert.strictEqual(builder3.result(), rule1);
    assertRule(rule1, {
      type: RuleType.Action,
      objectTypes: ['map'],
      properties: ANY,
      description: COLLECTION_PREFIX,
      next: {
        type: RuleType.Action,
        objectTypes: ['map'],
        properties: ANY,
        description: COLLECTION_PREFIX,
        next: {
          type: RuleType.Action,
          objectTypes: ['map'],
          properties: ANY,
          description: `${COLLECTION_PREFIX}prop1|${ANY_DISPLAY}|prop2`
        }
      }
    });
    const builder4 = builder.mapKeys(ANY);
    checkType(builder4);
    assert.strictEqual(builder4, builder);
    assert.strictEqual(builder4.result(), rule1);
    assertRule(rule1, {
      type: RuleType.Action,
      objectTypes: ['map'],
      properties: ANY,
      description: COLLECTION_PREFIX,
      next: {
        type: RuleType.Action,
        objectTypes: ['map'],
        properties: ANY,
        description: COLLECTION_PREFIX,
        next: {
          type: RuleType.Action,
          objectTypes: ['map'],
          properties: ANY,
          description: `${COLLECTION_PREFIX}prop1|${ANY_DISPLAY}|prop2`,
          next: {
            type: RuleType.Action,
            objectTypes: ['map'],
            properties: ANY,
            description: COLLECTION_PREFIX + ANY_DISPLAY
          }
        }
      }
    });
  });
  it('mapKeys', function () {
    const builder = new RuleBuilder({
      autoInsertValuePropertyDefault: false
    });
    assert.strictEqual(builder.result(), undefined);
    assert.strictEqual(builder.result(), undefined);
    const builder1 = builder.mapKeys('prop1');
    const rule1 = builder1.result();
    assert.strictEqual(builder1, builder);
    assertRule(rule1, {
      type: RuleType.Action,
      objectTypes: ['map'],
      properties: ['prop1'],
      description: COLLECTION_PREFIX + 'prop1'
    });
    const builder2 = builder.mapKey('prop2');
    checkType(builder2);
    assert.strictEqual(builder2, builder);
    assert.strictEqual(builder2.result(), rule1);
    assertRule(rule1, {
      type: RuleType.Action,
      objectTypes: ['map'],
      properties: ['prop1'],
      description: COLLECTION_PREFIX + 'prop1',
      next: {
        type: RuleType.Action,
        objectTypes: ['map'],
        properties: ['prop2'],
        description: COLLECTION_PREFIX + 'prop2'
      }
    });
    const builder3 = builder.mapKeys('prop3', 'prop4', 'prop5');
    checkType(builder3);
    assert.strictEqual(builder3, builder);
    assert.strictEqual(builder3.result(), rule1);
    assertRule(rule1, {
      type: RuleType.Action,
      objectTypes: ['map'],
      properties: ['prop1'],
      description: COLLECTION_PREFIX + 'prop1',
      next: {
        type: RuleType.Action,
        objectTypes: ['map'],
        properties: ['prop2'],
        description: COLLECTION_PREFIX + 'prop2',
        next: {
          type: RuleType.Action,
          objectTypes: ['map'],
          properties: ['prop3', 'prop4', 'prop5'],
          description: COLLECTION_PREFIX + 'prop3|prop4|prop5'
        }
      }
    }); // noinspection JSUnusedLocalSymbols

    const rule3 = builder3.result().next.next;
  });
  it('collection', function () {
    const builder = new RuleBuilder({
      autoInsertValuePropertyDefault: false
    });
    assert.strictEqual(builder.result(), undefined);
    const builder1 = builder.collection();
    const rule1 = builder1.result();
    assert.strictEqual(builder1, builder);
    assertRule(rule1, {
      type: RuleType.Action,
      objectTypes: ['set'],
      properties: ANY,
      description: COLLECTION_PREFIX
    });
    const builder2 = builder.collection();
    checkType(builder2);
    assert.strictEqual(builder2, builder);
    assert.strictEqual(builder2.result(), rule1);
    assertRule(rule1, {
      type: RuleType.Action,
      objectTypes: ['map', 'set', 'list', 'iterable'],
      properties: ANY,
      description: COLLECTION_PREFIX,
      next: {
        type: RuleType.Action,
        objectTypes: ['set'],
        properties: ANY,
        description: COLLECTION_PREFIX
      }
    });
    const builder3 = builder.collection();
    checkType(builder3);
    assert.strictEqual(builder3, builder);
    assert.strictEqual(builder3.result(), rule1);
    assertRule(rule1, {
      type: RuleType.Action,
      objectTypes: ['set'],
      properties: ANY,
      description: COLLECTION_PREFIX,
      next: {
        type: RuleType.Action,
        objectTypes: ['set'],
        properties: ANY,
        description: COLLECTION_PREFIX,
        next: {
          type: RuleType.Action,
          objectTypes: ['set'],
          properties: ANY,
          description: COLLECTION_PREFIX
        }
      }
    }); // noinspection JSUnusedLocalSymbols

    const rule3 = builder3.result().next.next;
  });
  it('repeat', function () {
    const builder = new RuleBuilder({
      autoInsertValuePropertyDefault: false
    });
    assert.strictEqual(builder.result(), undefined);
    assert.throws(() => builder.repeat(1, 1, null, b => null), [Error, TypeError, ReferenceError]);
    assert.throws(() => builder.repeat(1, 1, null, b => ({
      rule: null
    })), [Error, TypeError, ReferenceError]);
    const builder1 = builder.repeat(null, null, null, b => b.repeat(1, null, null, b => b.path(o => o.prop1)).repeat(null, 2, null, b => b.path(o => o["prop '2'"])).repeat(3, 4, null, b => b.path(o => o.prop4))).repeat(5, 6, null, b => b.path(o => o.prop5)).repeat(7, 8, null, b => b.path(o => o.length));
    checkType(builder1);
    assert.strictEqual(builder1, builder);
    assertRule(builder1.result(), {
      type: RuleType.Repeat,
      countMin: 0,
      countMax: Number.MAX_SAFE_INTEGER,
      condition: null,
      rule: {
        type: RuleType.Repeat,
        countMin: 1,
        countMax: Number.MAX_SAFE_INTEGER,
        condition: null,
        rule: {
          type: RuleType.Action,
          objectTypes: ['object', 'array'],
          properties: ['prop1'],
          description: 'prop1'
        },
        next: {
          type: RuleType.Repeat,
          countMin: 0,
          countMax: 2,
          condition: null,
          rule: {
            type: RuleType.Action,
            objectTypes: ['object', 'array'],
            properties: ["prop '2'"],
            description: "prop '2'"
          },
          next: {
            type: RuleType.Repeat,
            countMin: 3,
            countMax: 4,
            condition: null,
            rule: {
              type: RuleType.Action,
              objectTypes: ['object', 'array'],
              properties: ['prop4'],
              description: 'prop4'
            }
          }
        }
      },
      next: {
        type: RuleType.Repeat,
        countMin: 5,
        countMax: 6,
        condition: null,
        rule: {
          type: RuleType.Action,
          objectTypes: ['object', 'array'],
          properties: ['prop5'],
          description: 'prop5'
        },
        next: {
          type: RuleType.Repeat,
          countMin: 7,
          countMax: 8,
          condition: null,
          rule: {
            type: RuleType.Action,
            objectTypes: ['object', 'array'],
            properties: ['length'],
            description: 'length'
          }
        }
      }
    });
  });
  it('any', function () {
    const builder = new RuleBuilder({
      autoInsertValuePropertyDefault: false
    });
    assert.strictEqual(builder.result(), undefined);
    assert.throws(() => builder.any(), [Error, TypeError, ReferenceError]);
    assert.throws(() => builder.any(null), [Error, TypeError, ReferenceError]);
    assert.throws(() => builder.any(b => null), [Error, TypeError, ReferenceError]);
    assert.throws(() => builder.any(b => ({
      rule: null
    })), [Error, TypeError, ReferenceError]);
    const builder1 = builder.any(b => b.path(o => o.prop1)).any(b => b.path(o => o["prop '2'"])).any(b => b.any(b => b.path(o => o.prop4)), b => b.any(b => b.path(o => o.prop4), b => b.path(o => o.prop4_1)), b => b.any(b => b.path(o => o.prop4), b => b.path(o => o.prop4_1), b => b.path(o => o.prop4_2))).any(b => b.path(o => o.prop5)).any(b => b.path(o => o.length));
    checkType(builder1);
    assert.strictEqual(builder1, builder);
    assertRule(builder1.result(), {
      type: RuleType.Any,
      rules: [{
        type: RuleType.Action,
        objectTypes: ['object', 'array'],
        properties: ['prop1'],
        description: 'prop1'
      }],
      next: {
        type: RuleType.Any,
        rules: [{
          type: RuleType.Action,
          objectTypes: ['object', 'array'],
          properties: ["prop '2'"],
          description: "prop '2'"
        }],
        next: {
          type: RuleType.Any,
          rules: [{
            type: RuleType.Any,
            rules: [{
              type: RuleType.Action,
              objectTypes: ['object', 'array'],
              properties: ['prop4'],
              description: 'prop4'
            }]
          }, {
            type: RuleType.Any,
            rules: [{
              type: RuleType.Action,
              objectTypes: ['object', 'array'],
              properties: ['prop4'],
              description: 'prop4'
            }, {
              type: RuleType.Action,
              objectTypes: ['object', 'array'],
              properties: ['prop4_1'],
              description: 'prop4_1'
            }]
          }, {
            type: RuleType.Any,
            rules: [{
              type: RuleType.Action,
              objectTypes: ['object', 'array'],
              properties: ['prop4'],
              description: 'prop4'
            }, {
              type: RuleType.Action,
              objectTypes: ['object', 'array'],
              properties: ['prop4_1'],
              description: 'prop4_1'
            }, {
              type: RuleType.Action,
              objectTypes: ['object', 'array'],
              properties: ['prop4_2'],
              description: 'prop4_2'
            }]
          }],
          next: {
            type: RuleType.Any,
            rules: [{
              type: RuleType.Action,
              objectTypes: ['object', 'array'],
              properties: ['prop5'],
              description: 'prop5'
            }],
            next: {
              type: RuleType.Any,
              rules: [{
                type: RuleType.Action,
                objectTypes: ['object', 'array'],
                properties: ['length'],
                description: 'length'
              }]
            }
          }
        }
      }
    });
  });
});