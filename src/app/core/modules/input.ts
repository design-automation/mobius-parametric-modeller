export module Input{
    /**
     * Declare a new constant for the input node
     * @param __constList__  list of constants to be added.
     * @param const_name  Name of the constant.
     * @param __input__  value of the constant.
     * @returns void
     */
    export function declare_constant(__constList__: JSON, const_name: string, __input__: any): void{
        __constList__[const_name] = __input__;
    }
}