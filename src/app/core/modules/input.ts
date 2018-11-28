/**
 * Declare a new constant for the input node
 * @summary Declare new constant
 * 
 * @param {JSON} __constList__  List of constants to be added.
 * @param {string} const_name  Name of the constant.
 * @param {any} __input__  Value of the constant.
 * 
 * @returns Void
 */
export function declare_constant(__constList__: JSON, const_name: string, __input__: any): void{
    __constList__[const_name] = __input__;
}