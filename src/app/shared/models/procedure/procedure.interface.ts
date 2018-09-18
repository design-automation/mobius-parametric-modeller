import { ProcedureTypes } from './types';

export interface IProcedure{
    type: ProcedureTypes;

    parent: IProcedure;
    children: IProcedure[];

    argCount: number;
    args: IArgument[];

    meta: { name: string, module: string };
    
    enabled: boolean;
}

export interface IModule{
    module: string;
    functions: IFunction[]
}

export interface IFunction{
    module: string,
    name: string, 
    argCount: number,
    args: IArgument[];
}


export interface IArgument{
    name: string, 
    default: any,
    value: any
}

