import { ProcedureTypes } from './types';
import { IArgument } from '@models/code';

export interface IProcedure{
    type: ProcedureTypes;
    ID: string;

    parent: IProcedure;
    children: IProcedure[];

    argCount: number;
    args: IArgument[];

    meta: { name: string, module: string, inputMode: number};
    
    print: boolean;
    enabled: boolean;
    selected: boolean;
    hasError: boolean;
}

export interface IModule{
    module: string;
    functions: IFunction[]
}

export interface IFunction{
    module: any,
    name: string, 
    argCount: number,
    hasReturn: boolean,
    args: IArgument[];
}

