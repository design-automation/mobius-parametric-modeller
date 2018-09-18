import { ProcedureTypes } from './types';

export interface IProcedure{
    type: ProcedureTypes;

    parent: IProcedure;
    children: IProcedure[];

    argCount: number;
    args: { name: string, value: string }[];

    meta: { name: string, module: string };
}

export interface IModule{
    module: string;
    functions: IFunction[]
}

export interface IFunction{
    module: string,
    name: string, 
    argCount: number,
    args: {name: string, value: string}[];
}

