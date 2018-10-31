export module Model{
    export function set(__model__: JSON, var_name: string, var_value: any): void{
        __model__[var_name] = var_value;
    }

    export function get(__model__: JSON, var_name: string): any{
        return __model__[var_name];
    }

    export function remove(__model__: JSON, var_name: string): void{
        delete __model__[var_name];
    }

}