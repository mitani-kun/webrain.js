import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _regeneratorRuntime from "@babel/runtime/regenerator";

/* tslint:disable:no-shadowed-variable */

/* eslint-disable no-useless-escape,computed-property-spacing */
import { RuleType } from '../../../../../../main/common/rx/deep-subscribe/contracts/rules';
import { RuleBuilder } from '../../../../../../main/common/rx/deep-subscribe/RuleBuilder';
import { iterateRule } from '../../../../../../main/common/rx/deep-subscribe/iterate-rule';
describe('common > main > rx > deep-subscribe > RuleState', function () {
  var _marked =
  /*#__PURE__*/
  _regeneratorRuntime.mark(resolveRules),
      _marked2 =
  /*#__PURE__*/
  _regeneratorRuntime.mark(objectToPaths);

  function ruleToString(rule) {
    if (!rule) {
      return rule + '';
    }

    return "[".concat(RuleType[rule.type], "]").concat(rule.description ? ' ' + rule.description : '');
  }

  function resolveRules(ruleOrIterable) {
    var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, rule;

    return _regeneratorRuntime.wrap(function resolveRules$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (ruleOrIterable[Symbol.iterator]) {
              _context.next = 4;
              break;
            }

            _context.next = 3;
            return ruleOrIterable;

          case 3:
            return _context.abrupt("return");

          case 4:
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 7;
            _iterator = ruleOrIterable[Symbol.iterator]();

          case 9:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 15;
              break;
            }

            rule = _step.value;
            return _context.delegateYield(resolveRules(rule), "t0", 12);

          case 12:
            _iteratorNormalCompletion = true;
            _context.next = 9;
            break;

          case 15:
            _context.next = 21;
            break;

          case 17:
            _context.prev = 17;
            _context.t1 = _context["catch"](7);
            _didIteratorError = true;
            _iteratorError = _context.t1;

          case 21:
            _context.prev = 21;
            _context.prev = 22;

            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }

          case 24:
            _context.prev = 24;

            if (!_didIteratorError) {
              _context.next = 27;
              break;
            }

            throw _iteratorError;

          case 27:
            return _context.finish(24);

          case 28:
            return _context.finish(21);

          case 29:
          case "end":
            return _context.stop();
        }
      }
    }, _marked, null, [[7, 17, 21, 29], [22,, 24, 28]]);
  }

  function rulesToString(rules) {
    return Array.from(resolveRules(rules)).map(function (o) {
      return ruleToString(o);
    }).join('\n');
  }

  var endObject = {
    _end: true
  };

  function rulesToObject(ruleIterator) {
    var iteration = ruleIterator.next();

    if (iteration.done) {
      return endObject;
    }

    var ruleOrIterable = iteration.value;
    var obj = {};

    if (ruleOrIterable[Symbol.iterator]) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = ruleOrIterable[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var ruleIterable = _step2.value;
          Object.assign(obj, rulesToObject(ruleIterable[Symbol.iterator]()));
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    } else {
      var rule = iteration.value;
      obj = _defineProperty({}, rule.description, rulesToObject(ruleIterator));
    }

    return obj;
  }

  function objectToPaths(obj) {
    var parentPath,
        count,
        key,
        _args2 = arguments;
    return _regeneratorRuntime.wrap(function objectToPaths$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            parentPath = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : '';
            assert.ok(obj, parentPath);

            if (!obj._end) {
              _context2.next = 5;
              break;
            }

            _context2.next = 5;
            return parentPath;

          case 5:
            if (!(obj === endObject)) {
              _context2.next = 7;
              break;
            }

            return _context2.abrupt("return");

          case 7:
            count = 0;
            _context2.t0 = _regeneratorRuntime.keys(obj);

          case 9:
            if ((_context2.t1 = _context2.t0()).done) {
              _context2.next = 16;
              break;
            }

            key = _context2.t1.value;

            if (!(key !== '_end' && Object.prototype.hasOwnProperty.call(obj, key))) {
              _context2.next = 14;
              break;
            }

            count++;
            return _context2.delegateYield(objectToPaths(obj[key], (parentPath ? parentPath + '.' : '') + key), "t2", 14);

          case 14:
            _context2.next = 9;
            break;

          case 16:
            if (count) {
              _context2.next = 18;
              break;
            }

            throw new Error(parentPath + ' is empty');

          case 18:
          case "end":
            return _context2.stop();
        }
      }
    }, _marked2);
  }

  function testIterateRule(buildRule) {
    var result = iterateRule(buildRule(new RuleBuilder()).rule);
    assert.ok(result);
    var object = rulesToObject(result[Symbol.iterator]()); // console.log(JSON.stringify(objectTree, null, 4))

    var paths = Array.from(objectToPaths(object));

    for (var _len = arguments.length, expectedPaths = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      expectedPaths[_key - 1] = arguments[_key];
    }

    assert.deepStrictEqual(paths.sort(), expectedPaths.sort(), JSON.stringify(paths, null, 4));
  }

  it('path', function () {
    var builder = new RuleBuilder();
    testIterateRule(function (b) {
      return b.path(function (o) {
        return o.a;
      });
    }, 'a');
    testIterateRule(function (b) {
      return b.path(function (o) {
        return o.a.b.c;
      });
    }, 'a.b.c');
  });
  it('any', function () {
    var builder = new RuleBuilder();
    testIterateRule(function (b) {
      return b.any(function (b) {
        return b.path(function (o) {
          return o.a;
        });
      }, function (b) {
        return b.path(function (o) {
          return o.b;
        });
      });
    }, 'a', 'b');
    testIterateRule(function (b) {
      return b.any(function (b) {
        return b.path(function (o) {
          return o.a.b;
        });
      }, function (b) {
        return b.path(function (o) {
          return o.c.d;
        });
      });
    }, 'a.b', 'c.d');
    testIterateRule(function (b) {
      return b.any(function (b) {
        return b.any(function (b) {
          return b.path(function (o) {
            return o.a.b;
          });
        }, function (b) {
          return b.path(function (o) {
            return o.c.d;
          });
        });
      }, function (b) {
        return b.path(function (o) {
          return o.e.f;
        });
      });
    }, 'a.b', 'c.d', 'e.f');
    testIterateRule(function (b) {
      return b.any(function (b) {
        return b.path(function (o) {
          return o.a.b;
        }).any(function (b) {
          return b.path(function (o) {
            return o.c.d;
          });
        }, function (b) {
          return b.path(function (o) {
            return o.e.f;
          });
        });
      }, function (b) {
        return b.path(function (o) {
          return o.g.h;
        });
      }).path(function (o) {
        return o.i;
      });
    }, 'a.b.c.d.i', 'a.b.e.f.i', 'g.h.i');
  });
  it('repeat', function () {
    var builder = new RuleBuilder();
    testIterateRule(function (b) {
      return b.repeat(1, 1, function (b) {
        return b.path(function (o) {
          return o.a;
        });
      });
    }, 'a');
    testIterateRule(function (b) {
      return b.repeat(0, 2, function (b) {
        return b.path(function (o) {
          return o.a;
        });
      });
    }, '', 'a', 'a.a');
    testIterateRule(function (b) {
      return b.repeat(0, 2, function (b) {
        return b.repeat(0, 2, function (b) {
          return b.path(function (o) {
            return o.a;
          });
        }).path(function (o) {
          return o.b;
        });
      });
    }, '', 'b', 'a.b', 'a.a.b', 'b.b', 'b.a.b', 'b.a.a.b', 'a.b.b', 'a.b.a.b', 'a.b.a.a.b', 'a.a.b.b', 'a.a.b.a.b', 'a.a.b.a.a.b');
    testIterateRule(function (b) {
      return b.repeat(1, 2, function (b) {
        return b.any(function (b) {
          return b.repeat(1, 2, function (b) {
            return b.path(function (o) {
              return o.a;
            });
          });
        }, function (b) {
          return b.path(function (o) {
            return o.b.c;
          });
        });
      }).path(function (o) {
        return o.d;
      });
    }, 'a.d', 'a.a.d', 'b.c.d', // 'a.a.d',
    'a.a.a.d', 'a.b.c.d', // 'a.a.a.d',
    'a.a.a.a.d', 'a.a.b.c.d', 'b.c.a.d', 'b.c.a.a.d', 'b.c.b.c.d');
    testIterateRule(function (b) {
      return b.any(function (b) {
        return b.repeat(2, 2, function (b) {
          return b.any(function (b) {
            return b.path(function (o) {
              return o.a;
            });
          }, function (b) {
            return b.path(function (o) {
              return o.b;
            });
          });
        });
      }, function (b) {
        return b.path(function (o) {
          return o.c;
        });
      }).path(function (o) {
        return o.d;
      });
    }, 'a.a.d', 'a.b.d', 'b.a.d', 'b.b.d', 'c.d');
  });
  it('throws', function () {
    Array.from(iterateRule({
      type: 0
    }));
    assert.throws(function () {
      return Array.from(iterateRule({
        type: -1
      }));
    }, Error);
  });
});