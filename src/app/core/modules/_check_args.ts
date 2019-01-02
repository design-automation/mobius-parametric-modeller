import { EEntityTypeStr } from "@libs/geo-info/common";
import { isDim0 } from "@libs/geo-info/id";

export function isStringArg(arg_name: string, arg: any): void {
    throw new Error('The ' + arg_name + ' is not a string');
}

export function isIdListArg(arg_name: string, arg: any, ent_type_strs: EEntityTypeStr[]): void {
    throw new Error('The ' + arg_name + ' is not a string');
}
export function isIdListDim0Arg(arg_name: string, arg: any): void {
    throw new Error('The ' + arg_name + ' is not a string');
}
export function isIdListDim1Arg(arg_name: string, arg: any): void {
    throw new Error('The ' + arg_name + ' is not a string');
}
export function isIdListDim2Arg(arg_name: string, arg: any): void {
    throw new Error('The ' + arg_name + ' is not a string');
}
