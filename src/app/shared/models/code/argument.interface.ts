export interface IArgument {
    name: string;
    default: any;
    value: any;
    min?: number;
    max?: number;
    step?: number;
    type?: any;
    invalidVar?: boolean|string;
    usedVars?: string[];
}
