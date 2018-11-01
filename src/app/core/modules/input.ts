export module Input{
    export function declare_constant(__constList__: JSON, const_name: string, const_value: any = 3): void{
        __constList__[const_name] = const_value;
    }
}