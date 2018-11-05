export module Input{
    export function declare_constant(__constList__: JSON, const_name: string, __input__: any): void{
        __constList__[const_name] = __input__;
    }
}