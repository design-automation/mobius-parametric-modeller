export module INPUT{
    export function declare_constant(__params__: JSON, const_name: string, const_value: any): void{
        __params__[const_name] = const_value;
    }
}