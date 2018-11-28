import { IPortInput, IPortOutput } from '@models/port';

export interface IEdge {
    source: IPortOutput;
    target: IPortInput;
    selected: boolean;
}
