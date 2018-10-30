var model = {};

export module JSON{
    export function store(string: string, value: any): void{
        model[string] = value;
    }

    export function get(string: string): number{
        return model[string];
    }

}