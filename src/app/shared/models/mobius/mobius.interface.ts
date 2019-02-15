import { IFlowchart } from '@models/flowchart';

export interface IMobius {
    name: string;
    author: string;
    flowchart: IFlowchart;
    last_updated: Date;
    version: number;
    settings: any;
}
