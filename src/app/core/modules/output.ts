export module Output{
    export function return_value(__model__: any[], index: number): any{
        if (index > __model__.length) return __model__;
        return __model__[index].value;
    }
}