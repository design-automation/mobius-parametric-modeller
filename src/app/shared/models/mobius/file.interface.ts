import { IFlowchart } from "../flowchart";

export interface IMobiusFile{
	name: string;
    author: string; 
    modules: string[];
    version: number;
    flowchart: IFlowchart;
}