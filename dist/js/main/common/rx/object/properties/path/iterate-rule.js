"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.compressForks = compressForks;
exports.iterateRule = iterateRule;
exports.subscribeNextRule = subscribeNextRule;

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _getIteratorMethod2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator-method"));

var _symbol = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _helpers = require("../../../../helpers/helpers");

var _rules = require("./builder/contracts/rules");

var _rules2 = require("./builder/rules");

var _marked = /*#__PURE__*/_regenerator.default.mark(iterateFork),
    _marked2 = /*#__PURE__*/_regenerator.default.mark(compressForks),
    _marked3 = /*#__PURE__*/_regenerator.default.mark(_iterateRule);

function _createForOfIteratorHelperLoose(o) { var _context7; var i = 0; if (typeof _symbol.default === "undefined" || (0, _getIteratorMethod2.default)(o) == null) { if ((0, _isArray.default)(o) || (o = _unsupportedIterableToArray(o))) return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } i = (0, _getIterator2.default)(o); return (0, _bind.default)(_context7 = i.next).call(_context7, i); }

function _unsupportedIterableToArray(o, minLen) { var _context6; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = (0, _slice.default)(_context6 = Object.prototype.toString.call(o)).call(_context6, 8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return (0, _from.default)(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var ARRAY_EMPTY = [];

function forkToArray(ruleIterable) {
  var array;
  var nothing;
  var never;

  for (var _iterator = _createForOfIteratorHelperLoose(ruleIterable), _step; !(_step = _iterator()).done;) {
    var item = _step.value;

    if ((0, _helpers.isIterable)(item)) {
      var itemArray = (0, _from.default)(item);

      if (!itemArray.length) {
        if (!nothing) {
          if (!array) {
            array = [itemArray];
          } else {
            array.unshift(itemArray);
          }

          nothing = true;
        }

        continue;
      }

      if (!array) {
        array = [itemArray];
      } else {
        array.push(itemArray);
      }
    } else {
      if (item.type === _rules.RuleType.Never) {
        never = true;
      } else {
        throw new Error('Unexpected rule type: ' + _rules.RuleType[item.type]);
      }
    }
  }

  if (array) {
    return array;
  } else {
    if (never) {
      return _rules2.RuleNever.instance;
    }

    return ARRAY_EMPTY;
  }
}

var COMPRESS_FORKS_DISABLED = false;

function iterateFork(fork) {
  var _iterator2, _step2, ruleIterable, iterator, iteration;

  return _regenerator.default.wrap(function iterateFork$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _iterator2 = _createForOfIteratorHelperLoose(fork);

        case 1:
          if ((_step2 = _iterator2()).done) {
            _context.next = 33;
            break;
          }

          ruleIterable = _step2.value;

          if (!(0, _helpers.isIterable)(ruleIterable)) {
            _context.next = 29;
            break;
          }

          if (!COMPRESS_FORKS_DISABLED) {
            _context.next = 9;
            break;
          }

          _context.next = 7;
          return compressForks(ruleIterable);

        case 7:
          _context.next = 27;
          break;

        case 9:
          iterator = (0, _getIterator2.default)(ruleIterable);
          iteration = iterator.next();

          if (iteration.done) {
            _context.next = 25;
            break;
          }

          if (!(0, _helpers.isIterable)(iteration.value)) {
            _context.next = 16;
            break;
          }

          return _context.delegateYield(iterateFork(iteration.value), "t0", 14);

        case 14:
          _context.next = 23;
          break;

        case 16:
          if (!(iteration.value.type === _rules.RuleType.Never)) {
            _context.next = 21;
            break;
          }

          _context.next = 19;
          return iteration.value;

        case 19:
          _context.next = 23;
          break;

        case 21:
          _context.next = 23;
          return compressForks(ruleIterable, iterator, iteration);

        case 23:
          _context.next = 27;
          break;

        case 25:
          _context.next = 27;
          return ARRAY_EMPTY;

        case 27:
          _context.next = 31;
          break;

        case 29:
          _context.next = 31;
          return ruleIterable;

        case 31:
          _context.next = 1;
          break;

        case 33:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}

function compressForks(ruleOrForkIterable, iterator, iteration) {
  var ruleOrFork, fork, array, nextIterable;
  return _regenerator.default.wrap(function compressForks$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!iterator) {
            iterator = (0, _getIterator2.default)(ruleOrForkIterable);
          }

          if (!iteration) {
            iteration = iterator.next();
          }

          if (!iteration.done) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return");

        case 4:
          ruleOrFork = iteration.value;

          if (!(0, _helpers.isIterable)(ruleOrFork)) {
            _context2.next = 13;
            break;
          }

          fork = iterateFork(ruleOrFork);
          array = forkToArray(fork); // TODO optimize this array

          _context2.next = 10;
          return array;

        case 10:
          return _context2.abrupt("return");

        case 13:
          _context2.next = 15;
          return ruleOrFork;

        case 15:
          iteration = iterator.next();
          nextIterable = iteration.value;

          if (!nextIterable) {
            _context2.next = 20;
            break;
          }

          _context2.next = 20;
          return function (nextObject) {
            return compressForks(nextIterable(nextObject));
          };

        case 20:
        case "end":
          return _context2.stop();
      }
    }
  }, _marked2);
}

function iterateRule(object, rule, next) {
  if (next === void 0) {
    next = null;
  }

  return compressForks(_iterateRule(object, rule, next));
}

function _iterateRule(object, rule, next) {
  var ruleNext, _ref, conditionRules, len, i, conditionRule, _ref2, rules, any, _ref3, countMin, countMax, condition, subRule, repeatNext;

  return _regenerator.default.wrap(function _iterateRule$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          if (rule) {
            _context5.next = 4;
            break;
          }

          if (!next) {
            _context5.next = 3;
            break;
          }

          return _context5.delegateYield(next(object), "t0", 3);

        case 3:
          return _context5.abrupt("return");

        case 4:
          ruleNext = rule.next || next ? function (nextObject) {
            return _iterateRule(nextObject, rule.next, next);
          } : null;
          _context5.t1 = rule.type;
          _context5.next = _context5.t1 === _rules.RuleType.Nothing ? 8 : _context5.t1 === _rules.RuleType.Never ? 11 : _context5.t1 === _rules.RuleType.Action ? 14 : _context5.t1 === _rules.RuleType.If ? 19 : _context5.t1 === _rules.RuleType.Any ? 38 : _context5.t1 === _rules.RuleType.Repeat ? 50 : 58;
          break;

        case 8:
          if (!ruleNext) {
            _context5.next = 10;
            break;
          }

          return _context5.delegateYield(ruleNext(object), "t2", 10);

        case 10:
          return _context5.abrupt("break", 59);

        case 11:
          _context5.next = 13;
          return rule;

        case 13:
          return _context5.abrupt("break", 59);

        case 14:
          _context5.next = 16;
          return rule;

        case 16:
          _context5.next = 18;
          return ruleNext;

        case 18:
          return _context5.abrupt("break", 59);

        case 19:
          _ref = rule, conditionRules = _ref.conditionRules;
          len = conditionRules.length;
          i = 0;

        case 22:
          if (!(i < len)) {
            _context5.next = 35;
            break;
          }

          conditionRule = conditionRules[i];

          if (!(0, _isArray.default)(conditionRule)) {
            _context5.next = 30;
            break;
          }

          if (!conditionRule[0](object)) {
            _context5.next = 28;
            break;
          }

          return _context5.delegateYield(_iterateRule(object, conditionRule[1], ruleNext), "t3", 27);

        case 27:
          return _context5.abrupt("break", 35);

        case 28:
          _context5.next = 32;
          break;

        case 30:
          return _context5.delegateYield(_iterateRule(object, conditionRule, ruleNext), "t4", 31);

        case 31:
          return _context5.abrupt("break", 35);

        case 32:
          i++;
          _context5.next = 22;
          break;

        case 35:
          if (!(i === len && ruleNext)) {
            _context5.next = 37;
            break;
          }

          return _context5.delegateYield(ruleNext(object), "t5", 37);

        case 37:
          return _context5.abrupt("break", 59);

        case 38:
          _ref2 = rule, rules = _ref2.rules;

          if (rules.length) {
            _context5.next = 43;
            break;
          }

          _context5.next = 42;
          return _rules2.RuleNever.instance;

        case 42:
          return _context5.abrupt("break", 59);

        case 43:
          if (!(rules.length === 1)) {
            _context5.next = 46;
            break;
          }

          _context5.next = 46;
          return [_iterateRule(object, rules[0], ruleNext)];

        case 46:
          any = /*#__PURE__*/_regenerator.default.mark(function any() {
            var _i, _len, subRule;

            return _regenerator.default.wrap(function any$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _i = 0, _len = rules.length;

                  case 1:
                    if (!(_i < _len)) {
                      _context3.next = 10;
                      break;
                    }

                    subRule = rules[_i];

                    if (subRule) {
                      _context3.next = 5;
                      break;
                    }

                    throw new Error("RuleType.Any rule=" + subRule);

                  case 5:
                    _context3.next = 7;
                    return _iterateRule(object, subRule, ruleNext);

                  case 7:
                    _i++;
                    _context3.next = 1;
                    break;

                  case 10:
                  case "end":
                    return _context3.stop();
                }
              }
            }, any);
          });
          _context5.next = 49;
          return any();

        case 49:
          return _context5.abrupt("break", 59);

        case 50:
          _ref3 = rule, countMin = _ref3.countMin, countMax = _ref3.countMax, condition = _ref3.condition, subRule = _ref3.rule; // if (countMin === 0 && countMin === countMax) {
          // 	// == RuleType.Nothing
          // 	if (ruleNext) {
          // 		yield* ruleNext(object)
          // 	}
          // 	break
          // }

          if (!(countMax < countMin || countMax < 0)) {
            _context5.next = 55;
            break;
          }

          _context5.next = 54;
          return _rules2.RuleNever.instance;

        case 54:
          return _context5.abrupt("break", 59);

        case 55:
          repeatNext = /*#__PURE__*/_regenerator.default.mark(function repeatNext(nextObject, index) {
            var repeatAction, nextIteration;
            return _regenerator.default.wrap(function repeatNext$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    nextIteration = function _nextIteration(newCount) {
                      return _iterateRule(nextObject, subRule, function (nextIterationObject) {
                        return repeatNext(nextIterationObject, newCount);
                      });
                    };

                    repeatAction = condition ? condition(nextObject, index) : _rules.RuleRepeatAction.All;

                    if (index < countMin) {
                      repeatAction = repeatAction & ~_rules.RuleRepeatAction.Fork;
                    }

                    if (index >= countMax) {
                      repeatAction = repeatAction & ~_rules.RuleRepeatAction.Next;
                    }

                    if (!((repeatAction & _rules.RuleRepeatAction.Fork) === 0)) {
                      _context4.next = 11;
                      break;
                    }

                    if (!((repeatAction & _rules.RuleRepeatAction.Next) === 0)) {
                      _context4.next = 9;
                      break;
                    }

                    _context4.next = 8;
                    return _rules2.RuleNever.instance;

                  case 8:
                    return _context4.abrupt("return");

                  case 9:
                    return _context4.delegateYield(nextIteration(index + 1), "t0", 10);

                  case 10:
                    return _context4.abrupt("return");

                  case 11:
                    if (!((repeatAction & _rules.RuleRepeatAction.Next) === 0)) {
                      _context4.next = 15;
                      break;
                    }

                    if (!ruleNext) {
                      _context4.next = 14;
                      break;
                    }

                    return _context4.delegateYield(ruleNext(nextObject), "t1", 14);

                  case 14:
                    return _context4.abrupt("return");

                  case 15:
                    _context4.next = 17;
                    return [ruleNext ? ruleNext(nextObject) : ARRAY_EMPTY, nextIteration(index + 1)];

                  case 17:
                  case "end":
                    return _context4.stop();
                }
              }
            }, repeatNext);
          });
          return _context5.delegateYield(repeatNext(object, 0), "t6", 57);

        case 57:
          return _context5.abrupt("break", 59);

        case 58:
          throw new Error('Unknown RuleType: ' + rule.type);

        case 59:
        case "end":
          return _context5.stop();
      }
    }
  }, _marked3);
}

function subscribeNextRule(ruleIterator, iteration, fork, subscribeNode) {
  var ruleOrIterable = iteration.value;

  if ((0, _helpers.isIterable)(ruleOrIterable)) {
    var unsubscribers; // for (let step, innerIterator = ruleOrIterable[Symbol.iterator](); !(step = innerIterator.next()).done;) {
    // 	const ruleIterable = step.value
    // 	const unsubscribe = fork(ruleIterable[Symbol.iterator]())
    // 	if (unsubscribe != null) {
    // 		if (!unsubscribers) {
    // 			unsubscribers = [unsubscribe]
    // 		} else {
    // 			unsubscribers.push(unsubscribe)
    // 		}
    // 	}
    // }

    for (var _iterator3 = _createForOfIteratorHelperLoose(ruleOrIterable), _step3; !(_step3 = _iterator3()).done;) {
      var ruleIterable = _step3.value;
      var unsubscribe = fork((0, _getIterator2.default)(ruleIterable));

      if (unsubscribe) {
        if (!unsubscribers) {
          unsubscribers = [unsubscribe];
        } else {
          unsubscribers.push(unsubscribe);
        }
      }
    }

    if (!unsubscribers) {
      return null;
    }

    return function () {
      for (var i = 0, len = unsubscribers.length; i < len; i++) {
        unsubscribers[i]();
      }
    };
  }

  var nextIterable = ruleIterator.next().value;
  return subscribeNode(ruleOrIterable, nextIterable // ? () => nextIterable(object)[Symbol.iterator]()
  // : null,
  );
}