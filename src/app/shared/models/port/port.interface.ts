import { IArgument } from '@models/code';
import { PortType, InputType, OutputType } from './types';

interface IPort extends IArgument {
    // id: string;
    type: PortType;
    edges: any[];
    parentNode: any;
}

export interface IPortInput extends IPort {
    type: PortType.Input;
    meta: {
        mode: InputType,
        opts: any
    };
}

export interface IPortOutput extends IPort {
    type: PortType.Output;
    meta: {
        mode: OutputType,
    };
}
