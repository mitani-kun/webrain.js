"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RuleBuilder = void 0;

var _constants = require("./contracts/constants");

var _rules = require("./contracts/rules");

var _funcPropertiesPath = require("./helpers/func-properties-path");

var _RuleSubscribe = require("./RuleSubscribe");

const RuleSubscribeObjectPropertyNames = _RuleSubscribe.RuleSubscribeObject.bind(null, null);

const RuleSubscribeMapKeys = _RuleSubscribe.RuleSubscribeMap.bind(null, null);

class RuleBuilder {
  subscribe(ruleSubscribe, description) {
    const {
      _ruleLast: ruleLast
    } = this;

    if (description) {
      ruleSubscribe.description = description;
    }

    if (ruleLast) {
      ruleLast.next = ruleSubscribe;
    } else {
      this.rule = ruleSubscribe;
    }

    this._ruleLast = ruleSubscribe;
    return this;
  }
  /**
   * Object property, Array index
   */


  propertyName(propertyName) {
    return this.subscribe(new RuleSubscribeObjectPropertyNames(propertyName), propertyName);
  }
  /**
   * Object property, Array index
   */


  propertyNames(...propertiesNames) {
    return this.subscribe(new RuleSubscribeObjectPropertyNames(...propertiesNames), propertiesNames.join('|'));
  }
  /**
   * Object property, Array index
   */


  propertyAll() {
    return this.subscribe(new _RuleSubscribe.RuleSubscribeObject(), _constants.ANY_DISPLAY);
  }
  /**
   * Object property, Array index
   */


  propertyPredicate(predicate, description) {
    return this.subscribe(new _RuleSubscribe.RuleSubscribeObject(predicate), description);
  }
  /**
   * Object property, Array index
   */


  propertyRegexp(regexp) {
    if (!(regexp instanceof RegExp)) {
      throw new Error(`regexp (${regexp}) is not instance of RegExp`);
    }

    return this.propertyPredicate(name => regexp.test(name), regexp.toString());
  }
  /**
   * IListChanged & Iterable, ISetChanged & Iterable, IMapChanged & Iterable, Iterable
   */


  collection() {
    return this.subscribe(new _RuleSubscribe.RuleSubscribeCollection(), _constants.COLLECTION_PREFIX);
  }
  /**
   * IMapChanged & Map, Map
   */


  mapKey(key) {
    return this.subscribe(new RuleSubscribeMapKeys(key), _constants.COLLECTION_PREFIX + key);
  }
  /**
   * IMapChanged & Map, Map
   */


  mapKeys(...keys) {
    return this.subscribe(new RuleSubscribeMapKeys(...keys), _constants.COLLECTION_PREFIX + keys.join('|'));
  }
  /**
   * IMapChanged & Map, Map
   */


  mapAll() {
    return this.subscribe(new _RuleSubscribe.RuleSubscribeMap(), _constants.COLLECTION_PREFIX);
  }
  /**
   * IMapChanged & Map, Map
   */


  mapPredicate(keyPredicate, description) {
    return this.subscribe(new _RuleSubscribe.RuleSubscribeMap(keyPredicate), description);
  }
  /**
   * IMapChanged & Map, Map
   */


  mapRegexp(keyRegexp) {
    if (!(keyRegexp instanceof RegExp)) {
      throw new Error(`keyRegexp (${keyRegexp}) is not instance of RegExp`);
    }

    return this.mapPredicate(name => keyRegexp.test(name), keyRegexp.toString());
  }

  path(getValueFunc) {
    for (const propertyNames of (0, _funcPropertiesPath.getFuncPropertiesPath)(getValueFunc)) {
      if (!propertyNames.startsWith(_constants.COLLECTION_PREFIX)) {
        this.propertyNames(...propertyNames.split('|'));
      } else {
        const keys = propertyNames.substring(1);

        if (keys === _constants.ANY) {
          this.collection();
        } else {
          this.mapKeys(...keys.split('|'));
        }
      }
    }

    return this;
  }

  any(...getChilds) {
    const {
      _ruleLast: ruleLast
    } = this;
    const rule = {
      type: _rules.RuleType.Any,
      rules: getChilds.map(o => o(new RuleBuilder()).rule)
    };

    if (ruleLast) {
      ruleLast.next = rule;
    } else {
      this.rule = rule;
    }

    this._ruleLast = rule;
    return this;
  }

  repeat(countMin, countMax, getChild) {
    const {
      _ruleLast: ruleLast
    } = this;
    const rule = {
      type: _rules.RuleType.Repeat,
      countMin,
      countMax,
      rule: getChild(new RuleBuilder()).rule
    };

    if (ruleLast) {
      ruleLast.next = rule;
    } else {
      this.rule = rule;
    }

    this._ruleLast = rule;
    return this;
  }

}

exports.RuleBuilder = RuleBuilder;