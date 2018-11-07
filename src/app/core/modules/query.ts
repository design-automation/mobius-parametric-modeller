export module Query{
    export function set(__model__: any[], indices: number[], statement: string): void{
        let properties: any = statement.split('&');
        properties = properties.map(prop => {
            let property = prop.substring(1).split('=');
            property[1] =  property[1].substring(1,property[1].length-1)
            return property
        });
        for (let index of indices){
            if (index > __model__.length) {
                return
            } 
            for (let property of properties){
                __model__[index]["properties"][property[0]] = property[1];
            }
        }
        console.log(__model__)
    }

    export function get(__model__: JSON[], statement: string): any{
        let property = statement.substring(1).split('==');
        property[1] =  property[1].substring(1,property[1].length-1)

        let result = [];
        
        for (let i = 0; i < __model__.length; i++){
            if (__model__[i]["properties"][property[0]] == property[1]){
                result.push(i)
            }
        }
        return result
    }

}