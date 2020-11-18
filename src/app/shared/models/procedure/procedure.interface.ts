import { ProcedureTypes } from './types';
import { IArgument } from '@models/code';
import { IFlowchart } from '@models/flowchart';

export interface IProcedure {
    type: ProcedureTypes;
    ID: string;

    parent: IProcedure;
    children: IProcedure[];

    variable: string;

    argCount: number;
    args: IArgument[];

    meta: {
        name: string,
        module: string,
        inputMode?: number,
        description?: string,
        otherInfo?: any
    };

    enabled: boolean;

    selected: boolean;
    lastSelected?: boolean;

    hasError: boolean;

    print: boolean;
    terminate: boolean;
    selectGeom?: boolean;

    resolvedValue?: any;
}

export interface IModule {
    module: string;
    functions: IFunction[];
}

export interface IFunction {
    module: any;
    name: string;
    argCount: number;
    hasReturn: boolean;
    args: IArgument[];
    flowchart?: IFlowchart;
    doc?: any;
    importedFile?: string;
}

