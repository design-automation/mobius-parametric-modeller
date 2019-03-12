import { IFlowchart } from '@models/flowchart';

export interface IMobius {
    name: string;
    author: string;
    flowchart: IFlowchart;
    version: number;
    settings: any;
}
