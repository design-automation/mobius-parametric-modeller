export module Model{
    export function set(__model__: any[], var_value: any): number[]{
        for (let i = 0; i < __model__.length; i++){
            if (__model__[i]["value"] == var_value){
                return [i]
            }
        }
        var obj = {  
            "value": var_value,
            "properties":{}
         };
        __model__.push(obj);
        return [__model__.length-1];
    }

    export function get(__model__: JSON[], indices: number[]): any{
        let result = [];
        
        for (let i of indices){
            if (i > __model__.length || i < 0){
                continue
            }
            result.push(__model__[i]);
        }
        return result
    }

    export function remove(__model__: JSON[], indices: number[]): void{
        indices.sort((a,b)=>{return b-a})
        indices.map((index)=>{
            if (index > __model__.length) {
                return;
            } 
            __model__.splice(index,1);
        });
    }

}