export interface IArgument {
    name: string;
    value: any;
    min?: number;
    max?: number;
    step?: number;
    type?: any;
    invalidVar?: boolean|string;
    usedVars?: string[];
    linked?: boolean;
}
