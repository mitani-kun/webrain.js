import _typeof from "@babel/runtime/helpers/typeof";

/* eslint-disable class-methods-use-this */
import { TestSubject } from '../src/TestSubject';
import { hasSubscribers as toHasSubscribers } from '../../../../../../main/common/rx/subjects/hasSubscribers';
describe('common > main > rx > subjects > hasSubscribers', function () {
  function deleteFromArray(array, item) {
    var index = array.indexOf(item);

    if (index > -1) {
      array.splice(index, 1);
    }
  }

  it('hasSubscribers', function () {
    var subscribers = [];
    var subject = new (toHasSubscribers(TestSubject))();
    assert.strictEqual(subject.subscribe(null), null);
    assert.strictEqual(subject.subscribe(false), null);
    assert.strictEqual(subject.subscribe(''), null);
    assert.strictEqual(subject.subscribe(0), null);
    var hasSubscribers = [];

    var hasSubscribersSubscriber = function hasSubscribersSubscriber(value) {
      hasSubscribers.push(value);
    };

    var hasSubscribersUnsubscribe = [];
    assert.strictEqual(_typeof(hasSubscribersUnsubscribe[0] = subject.hasSubscribersObservable.subscribe(hasSubscribersSubscriber)), 'function');
    assert.deepStrictEqual(hasSubscribers, [false]);
    hasSubscribers = [];
    assert.strictEqual(subject.hasSubscribers, false);
    assert.strictEqual(subject.emit('1'), subject);
    var results = [];

    var subscriber = function subscriber(value) {
      results.push(value);
    };

    var unsubscribe = [];
    assert.strictEqual(_typeof(unsubscribe[0] = subject.subscribe(subscriber)), 'function');
    assert.deepStrictEqual(results, []);
    assert.deepStrictEqual(hasSubscribers, [true]);
    hasSubscribers = [];
    assert.strictEqual(hasSubscribersUnsubscribe[0](), undefined);
    assert.deepStrictEqual(hasSubscribers, [null]);
    hasSubscribers = [];
    assert.deepStrictEqual(results, []);
    assert.strictEqual(subject.emit('2'), subject);
    assert.deepStrictEqual(results, ['2']);
    results = [];
    assert.strictEqual(_typeof(hasSubscribersUnsubscribe[0] = subject.hasSubscribersObservable.subscribe(hasSubscribersSubscriber)), 'function');
    assert.deepStrictEqual(hasSubscribers, [true]);
    hasSubscribers = [];
    assert.strictEqual(subject.emit('3'), subject);
    assert.deepStrictEqual(results, ['3']);
    results = [];
    assert.deepStrictEqual(hasSubscribers, []);
    hasSubscribers = [];
    assert.strictEqual(unsubscribe[0](), undefined);
    assert.deepStrictEqual(hasSubscribers, [false]);
    hasSubscribers = [];
    assert.strictEqual(subject.emit('4'), subject);
    assert.deepStrictEqual(results, []);
    assert.strictEqual(unsubscribe[0](), undefined);
    assert.strictEqual(unsubscribe[0](), undefined);
    assert.strictEqual(subject.emit('5'), subject);
    assert.deepStrictEqual(results, []);
    assert.deepStrictEqual(hasSubscribers, []);
    assert.strictEqual(_typeof(unsubscribe[0] = subject.subscribe(subscriber)), 'function');
    assert.deepStrictEqual(hasSubscribers, [true]);
    hasSubscribers = [];
    assert.strictEqual(_typeof(unsubscribe[1] = subject.subscribe(subscriber)), 'function');
    assert.deepStrictEqual(hasSubscribers, []);
    assert.strictEqual(hasSubscribersUnsubscribe[0](), undefined);
    assert.deepStrictEqual(hasSubscribers, [null]);
    hasSubscribers = [];
    assert.strictEqual(subject.emit('6'), subject);
    assert.deepStrictEqual(results, ['6', '6']);
    results = [];
    assert.strictEqual(unsubscribe[0](), undefined);
    assert.strictEqual(subject.emit('7'), subject);
    assert.deepStrictEqual(results, ['7']);
    results = [];
    assert.strictEqual(unsubscribe[1](), undefined);
    assert.strictEqual(subject.emit('8'), subject);
    assert.deepStrictEqual(results, []);
    assert.strictEqual(unsubscribe[0](), undefined);
    assert.strictEqual(unsubscribe[1](), undefined);
    assert.strictEqual(subject.emit('9'), subject);
    assert.deepStrictEqual(results, []);
  });
});