import { assert } from '../../../../../../main/common/test/Assert';
import { DeepCloneEqual } from '../../../../../../main/common/test/DeepCloneEqual';
import { TestVariants } from '../../src/helpers/TestVariants';
export const deepCloneEqual = new DeepCloneEqual();

function resolveValue(opts, value) {
  if (typeof value === 'function' && !(value instanceof Error)) {
    value = value(opts);
  }

  return value;
}

function resolveOptions(optionsSource, optionsParams) {
  const resolvedOptions = { ...optionsSource
  };

  for (const key in resolvedOptions) {
    if (Object.prototype.hasOwnProperty.call(resolvedOptions, key)) {
      resolvedOptions[key] = key === 'action' ? resolvedOptions[key] : resolveValue(optionsParams || resolvedOptions, resolvedOptions[key]);
    }
  }

  resolvedOptions.expected = {};

  for (const key in optionsSource.expected) {
    if (Object.prototype.hasOwnProperty.call(optionsSource.expected, key)) {
      resolvedOptions.expected[key] = resolveValue(optionsParams || resolvedOptions, optionsSource.expected[key]);
    }
  }

  return resolvedOptions;
}

export class TestDeepEqual extends TestVariants {
  constructor() {
    super();
    this.baseOptionsVariants = {
      circular: [false, true],
      noCrossReferences: [false, true],
      equalTypes: [false, true],
      equalInnerReferences: [false, true],
      equalMapSetOrder: [false, true],
      strictEqualFunctions: [false, true]
    };
  }

  testVariant(inputOptions) {
    let error;

    for (let debugIteration = 0; debugIteration < 3; debugIteration++) {
      try {
        const options = inputOptions = resolveOptions(inputOptions, null);

        const action = () => {
          const result = deepCloneEqual.equal(options.value1, options.value2, {
            circular: options.circular,
            equalTypes: options.equalTypes,
            noCrossReferences: options.noCrossReferences,
            equalInnerReferences: options.equalInnerReferences,
            equalMapSetOrder: options.equalMapSetOrder,
            strictEqualFunctions: options.strictEqualFunctions
          });
          assert.strictEqual(result, options.expected.result);
        };

        if (options.expected.error) {
          assert.throws(action, options.expected.error);
        } else {
          action();
        }

        break;
      } catch (ex) {
        if (!debugIteration) {
          console.log(`Test number: ${TestDeepEqual.totalTests}\r\nError in: ${inputOptions.description}\n`, inputOptions, // ${
          // JSON.stringify(initialOptions, null, 4)
          // }
          `\n${inputOptions.action.toString()}\n${ex.stack}`);
          error = ex;
        }
      } finally {
        TestDeepEqual.totalTests++;
      }
    }

    if (error) {
      throw error;
    }
  }

  static test(testCases) {
    if (!testCases.actions) {
      // tslint:disable-next-line:no-empty
      testCases.actions = [() => {}];
    }

    TestDeepEqual._instance.test(testCases);
  }

}
TestDeepEqual.totalTests = 0;
TestDeepEqual._instance = new TestDeepEqual();