export module Output{
    export function return_value(__model__: JSON, val: any): any{
        return __model__[val];
    }
}