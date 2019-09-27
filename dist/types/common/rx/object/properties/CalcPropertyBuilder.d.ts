import { IDeferredCalcOptions } from '../../deferred-calc/DeferredCalc';
import { CalcProperty, CalcPropertyFunc } from './CalcProperty';
import { CalcPropertyDependenciesBuilder } from './CalcPropertyDependenciesBuilder';
import { IPropertyOptions } from './Property';
export declare function calcPropertyFactory<TValue, TInput, TMergeSource, TTarget extends CalcProperty<TValue, TInput, TMergeSource> = CalcProperty<TValue, TInput, TMergeSource>>({ dependencies: buildDependencies, calcFunc, name, calcOptions, valueOptions, initValue, }: {
    dependencies: null | ((dependenciesBuilder: CalcPropertyDependenciesBuilder<CalcProperty<TValue, TInput, TMergeSource>, TInput>) => void);
    calcFunc: CalcPropertyFunc<TInput, TValue, TMergeSource>;
    name?: string;
    calcOptions?: IDeferredCalcOptions;
    valueOptions?: IPropertyOptions<TValue, TMergeSource>;
    initValue?: TValue;
}): () => CalcProperty<TValue, TInput, TMergeSource>;
