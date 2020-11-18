export interface IArgument {
    name: string;
    value: any;
    min?: any;
    max?: any;
    step?: number;
    type?: any;
    invalidVar?: boolean|string;
    usedVars?: string[];
    linked?: boolean;
    jsValue?: any;
    isEntity?: boolean;
}
