"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.RuleRepeat = exports.RuleAny = exports.RuleIf = exports.RuleNever = exports.RuleNothing = exports.Rule = void 0;

var _freeze = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/freeze"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _get2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/get"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _rules = require("./contracts/rules");

var Rule =
/*#__PURE__*/
function () {
  function Rule(type) {
    (0, _classCallCheck2.default)(this, Rule);
    this.type = type;
  }

  (0, _createClass2.default)(Rule, [{
    key: "clone",
    value: function clone() {
      var type = this.type,
          subType = this.subType,
          description = this.description,
          next = this.next;
      var clone = {
        type: type,
        subType: subType,
        description: description
      };

      if (next != null) {
        clone.next = next.clone();
      }

      return clone;
    }
  }]);
  return Rule;
}();

exports.Rule = Rule;

var RuleNothing =
/*#__PURE__*/
function (_Rule) {
  (0, _inherits2.default)(RuleNothing, _Rule);

  function RuleNothing() {
    var _this;

    (0, _classCallCheck2.default)(this, RuleNothing);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(RuleNothing).call(this, _rules.RuleType.Nothing));
    _this.description = 'nothing';
    return _this;
  }

  return RuleNothing;
}(Rule);

exports.RuleNothing = RuleNothing;

var RuleNever =
/*#__PURE__*/
function (_Rule2) {
  (0, _inherits2.default)(RuleNever, _Rule2);

  function RuleNever() {
    var _this2;

    (0, _classCallCheck2.default)(this, RuleNever);
    _this2 = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(RuleNever).call(this, _rules.RuleType.Never));
    _this2.description = 'never';
    return _this2;
  }

  (0, _createClass2.default)(RuleNever, [{
    key: "clone",
    value: function clone() {
      return this;
    }
  }, {
    key: "next",
    get: function get() {
      return null;
    } // tslint:disable-next-line:no-empty
    ,
    set: function set(value) {}
  }]);
  return RuleNever;
}(Rule);

exports.RuleNever = RuleNever;
RuleNever.instance = (0, _freeze.default)(new RuleNever());

var RuleIf =
/*#__PURE__*/
function (_Rule3) {
  (0, _inherits2.default)(RuleIf, _Rule3);

  function RuleIf(conditionRules) {
    var _this3;

    (0, _classCallCheck2.default)(this, RuleIf);
    _this3 = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(RuleIf).call(this, _rules.RuleType.If));
    _this3.conditionRules = conditionRules;
    return _this3;
  }

  (0, _createClass2.default)(RuleIf, [{
    key: "clone",
    value: function clone() {
      var _context;

      var clone = (0, _get2.default)((0, _getPrototypeOf2.default)(RuleIf.prototype), "clone", this).call(this);
      clone.conditionRules = (0, _map.default)(_context = this.conditionRules).call(_context, function (o) {
        return (0, _isArray.default)(o) ? [o[0], o[1].clone()] : o.clone();
      });
      return clone;
    }
  }]);
  return RuleIf;
}(Rule);

exports.RuleIf = RuleIf;

var RuleAny =
/*#__PURE__*/
function (_Rule4) {
  (0, _inherits2.default)(RuleAny, _Rule4);

  function RuleAny(rules) {
    var _this4;

    (0, _classCallCheck2.default)(this, RuleAny);
    _this4 = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(RuleAny).call(this, _rules.RuleType.Any));
    _this4.rules = rules;
    return _this4;
  }

  (0, _createClass2.default)(RuleAny, [{
    key: "clone",
    value: function clone() {
      var _context2;

      var clone = (0, _get2.default)((0, _getPrototypeOf2.default)(RuleAny.prototype), "clone", this).call(this);
      clone.rules = (0, _map.default)(_context2 = this.rules).call(_context2, function (o) {
        return o.clone();
      });
      return clone;
    }
  }]);
  return RuleAny;
}(Rule);

exports.RuleAny = RuleAny;

var RuleRepeat =
/*#__PURE__*/
function (_Rule5) {
  (0, _inherits2.default)(RuleRepeat, _Rule5);

  function RuleRepeat(countMin, countMax, condition, rule) {
    var _this5;

    (0, _classCallCheck2.default)(this, RuleRepeat);
    _this5 = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(RuleRepeat).call(this, _rules.RuleType.Repeat));
    _this5.countMin = countMin;
    _this5.countMax = countMax;
    _this5.condition = condition;
    _this5.rule = rule;
    return _this5;
  }

  (0, _createClass2.default)(RuleRepeat, [{
    key: "clone",
    value: function clone() {
      var clone = (0, _get2.default)((0, _getPrototypeOf2.default)(RuleRepeat.prototype), "clone", this).call(this);
      clone.rule = this.rule.clone();
      clone.countMin = this.countMin;
      clone.countMax = this.countMax;
      clone.condition = this.condition;
      return clone;
    }
  }]);
  return RuleRepeat;
}(Rule);

exports.RuleRepeat = RuleRepeat;