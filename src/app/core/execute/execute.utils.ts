import * as __MOBIUS_MODULES__ from "@modules";
import { INode } from "@models/node";
import { IProcedure } from "@models/procedure";
import { Input, Output } from "@models/port";
export module ExecuteUtils{

    export function print_modules(): void{
        console.log(__MOBIUS_MODULES__);
    }

    export function execute_node( node: INode ): void{

        console.log(NodeExecuteUtils.get_code_node(node));

        node.outputs.map( (op) => {
                op.value = 12;

        })
    }

}


module NodeExecuteUtils{

    export function get_code_port_input(port: Input): string{
        if( port.isConnected == true ) 
            return "";

        return "let " + port.name + " = " + port.args.value; 
    }

    export function get_code_port_output(port: Output): string{

        let prepend: string = "let ";
        return prepend + port.name + " = " + port.args.default; 
    }

    function get_code_node_io(node: INode, output_idx: number): string{
        return node.name + "." + node.outputs[output_idx].name; 
    }

    function get_code_function_call(node: INode, params?: any, executionCode?: boolean): string{

        let fn_call: string = "";
        let param_values: string[] = [];

        let inputs = node.inputs;
        for(let i=0; i < inputs.length; i++ ){

            // if node is connected
            if(inputs[i].isConnected == true){
                let input_name:string = inputs[i].name;
                if( params ){

                    if( executionCode == true){
                        param_values.push( "params." + input_name );
                    }
                    else{
                        let p =  params[ input_name ];
                        param_values.push( p );
                    }
                }
                else{
                    param_values.push( input_name );
                }
            }
            else{
                let val = inputs[i].value;
                param_values.push(val);
            }
        }

        param_values = param_values.map(function(p){
            if(p === undefined){
                return "undefined";
            }
            else{
                return p;
            }
        });

        // make function call and assign to variable of same name
        fn_call = "let " + node.name +  "=" + node.name + node.version + "( " + param_values.join(", ") + " );" ;

        if(!node.enabled){
            fn_call = "/* " + fn_call + " */";
        }
        
        return fn_call;
    }

    function get_code_node_def(node: INode): string{
        let fn_def: string = "";

        let params :string[] = [];
        let inputs = node.inputs;
        for(let i=0; i < inputs.length; i++ ){
            params.push(inputs[i].name);
        }

        // make function
        fn_def += "function " + node.name + node.version + "( " + params.join(", ") + " )() \n" ;
        
        return fn_def;
    }

    export function get_code_node(node: INode): string{ 	

        let prodArr = [];

        let nodeVars: string[] = [];
        let fn_code :string = "";

        // add initializations
        // get params
        let params:string[] = [];
        let initializations :string[] = [];
        let inputs: Input[] = node.inputs;
        for(let i=0; i < inputs.length; i++ ){

            let inp = inputs[i];
            nodeVars.push(inp.name);

            if( 1/*inp.isConnected() == true*/ ){
                params.push(inp.name);
            }
            
            let input_port_code: string = this.get_code_port_input(inp);
            if(input_port_code !== ""){
                //initializations.push( input_port_code );
            }

        }

        // make function
        fn_code += "function " + node.name + node.version + "( " + params.join(", ") + " ) { \n" ;
        fn_code += ( initializations.length > 0 ? initializations.join(";\n") + ";\n" : "" );
        
        // add outputs 
        let results :string[]= [], opInits :string[] = [];
        let outputs : Output[] = node.outputs;
        for( let o=0; o < outputs.length; o++ ){
            let oname = outputs[o].name; 
            nodeVars.push(oname);
            results.push( oname + " : " + oname);
            opInits.push( this.get_code_port_output(outputs[o]) )
        }
        
        // add initialization for outputs
        fn_code += ( opInits.length > 0 ? "\n" + opInits.join(";\n") + ";\n" : ""); 

        // add procedure
        for( let line=0; line <  node.procedure.length; line ++ ){
            let procedure: IProcedure = node.procedure[line];

            // if procedure is disabled - skip
            if(!procedure.enabled){
                continue;
            }

            // if(prodArr)	fn_code += "\n" + "prodArr.push(" + procedure.id + ")";
            fn_code += "\n" +  this.get_code_procedure(procedure, nodeVars, undefined, prodArr); 

        }

        // add return object
        fn_code += "\n" + "return " + " { " + results.join(", ") + " } " + ";";

        // ending
        fn_code += "\n }\n"

        return fn_code;
    }
}