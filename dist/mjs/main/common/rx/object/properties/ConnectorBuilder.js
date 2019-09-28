import { createFunction } from '../../../helpers/helpers';
import { deepSubscribeRule } from '../../deep-subscribe/deep-subscribe';
import { RuleBuilder } from '../../deep-subscribe/RuleBuilder';
import { _set, _setExt } from '../ObservableObject';
import { ObservableObjectBuilder } from '../ObservableObjectBuilder';
import { CalcObjectDebugger } from './CalcObjectDebugger';
import { Connector } from './Connector';
export class ConnectorBuilder extends ObservableObjectBuilder {
  constructor(object, buildSourceRule) {
    super(object);
    this.buildSourceRule = buildSourceRule;
  }

  connect(name, buildRule, options, initValue) {
    return this._connect(false, name, buildRule, options, initValue);
  }

  connectWritable(name, buildRule, options, initValue) {
    return this._connect(true, name, buildRule, options, initValue);
  }

  _connect(writable, name, buildRule, options, initValue) {
    const {
      object,
      buildSourceRule
    } = this;
    let ruleBuilder = new RuleBuilder();

    if (buildSourceRule) {
      ruleBuilder = buildSourceRule(ruleBuilder);
    }

    ruleBuilder = buildRule(ruleBuilder);
    const ruleBase = ruleBuilder && ruleBuilder.result();

    if (ruleBase == null) {
      throw new Error('buildRule() return null or not initialized RuleBuilder');
    }

    const setOptions = options && options.setOptions; // optimization

    const baseGetValue = options && options.getValue || createFunction(`return this.__fields["${name}"]`);
    const baseSetValue = options && options.setValue || createFunction('v', `this.__fields["${name}"] = v`);
    const getValue = !writable ? baseGetValue : function () {
      return baseGetValue.call(this).value;
    };
    const setValue = !writable ? baseSetValue : function (value) {
      const baseValue = baseGetValue.call(this);
      baseValue.value = value;
    };
    const set = setOptions ? _setExt.bind(null, name, getValue, setValue, setOptions) : _set.bind(null, name, getValue, setValue);
    return this.updatable(name, {
      setOptions,
      hidden: options && options.hidden,

      // tslint:disable-next-line:no-shadowed-variable
      factory(initValue) {
        if (writable) {
          baseSetValue.call(this, {
            value: initValue,
            parent: null,
            key: null,
            keyType: null
          });
        }

        let setVal = (obj, value) => {
          if (typeof value !== 'undefined') {
            initValue = value;
          }
        };

        const receiveValue = writable ? (value, parent, key, keyType) => {
          CalcObjectDebugger.Instance.onConnectorChanged(this, value, parent, key, keyType);
          const baseValue = baseGetValue.call(this);
          baseValue.parent = parent;
          baseValue.key = key;
          baseValue.keyType = keyType;
          setVal(this, value);
          return null;
        } : (value, parent, key, keyType) => {
          CalcObjectDebugger.Instance.onConnectorChanged(this, value, parent, key, keyType);
          setVal(this, value);
          return null;
        };
        const rule = this === object ? ruleBase : ruleBase.clone();
        this.propertyChanged.hasSubscribersObservable.subscribe(hasSubscribers => {
          this._setUnsubscriber(name, null);

          if (hasSubscribers) {
            const unsubscribe = deepSubscribeRule({
              object: this,
              lastValue: receiveValue,
              rule
            });

            if (unsubscribe) {
              this._setUnsubscriber(name, unsubscribe);
            }
          }
        });
        setVal = set;
        return initValue;
      },

      update: writable && function (value) {
        const baseValue = baseGetValue.call(this);

        if (baseValue.parent != null) {
          // TODO implement set value for different keyTypes
          baseValue.parent[baseValue.key] = value;
        } // return value

      },
      getValue,
      setValue
    }, initValue);
  }

}
export function connectorClass(build, baseClass) {
  class NewConnector extends (baseClass || Connector) {}

  build(new ConnectorBuilder(NewConnector.prototype, b => b.p('connectorSource')));
  return NewConnector;
}
export function connectorFactory(build, baseClass) {
  const NewConnector = connectorClass(build, baseClass);
  return source => new NewConnector(source);
} // const builder = new ConnectorBuilder(true as any)
//
// export function connect<TObject extends ObservableObject, TValue = any>(
// 	options?: IConnectFieldOptions<TObject, TValue>,
// 	initValue?: TValue,
// ) {
// 	return (target: TObject, propertyKey: string) => {
// 		builder.object = target
// 		builder.connect(propertyKey, options, initValue)
// 	}
// }
// class Class1 extends ObservableObject {
// }
// class Class extends Class1 {
// 	@connect()
// 	public prop: number
// }