import { INode } from './node.interface';
import { ProcedureTypes, IFunction, IProcedure } from '@models/procedure';
import { PortType, InputType, OutputType } from '@models/port';
import { not } from '@angular/compiler/src/output/output_ast';

export abstract class NodeUtils{

    static getNewNode(): INode{
        let node: INode = <INode>{
            name: "a_new_node", 
            position: {x: 0, y: 0}, 
            procedure: [],
            state: {
                procedure: undefined, 
                input_port: undefined, 
                output_port: undefined
            },
            inputs: [
                {
                    name: 'first_input', 
                    default: 0,
                    value: undefined,
                    isConnected: false,
                    type: PortType.Input,
                    meta: {
                        mode: InputType.SimpleInput, 
                        opts: undefined
                    }
                }
            ],
            outputs: [
                {
                    name: 'first_output', 
                    isConnected: false,
                    type: PortType.Output,
                    meta: {
                        mode: OutputType.Text, 
                    }
                }
            ]
        }
        return node;
    };

    static select_procedure(node: INode, procedure: IProcedure){
        
        if(node.state.procedure === procedure){
            node.state.procedure = undefined;
            procedure.selected = false;
        }else{
            if(node.state.procedure){
                node.state.procedure.selected = false;
            }

            node.state.procedure = procedure;
            procedure.selected = true;
        }

    }
    
    static add_procedure(node: INode, type: ProcedureTypes, data: IFunction ){
        let prod: IProcedure = <IProcedure>{};
        prod.type= type;
        
        if (node.state.procedure){
            if (node.state.procedure.hasOwnProperty("children")){
                node.state.procedure.children.push(prod);
                prod.parent = node.state.procedure;
            } else {
                if (node.state.procedure.hasOwnProperty("parent")){
                    prod.parent = node.state.procedure.parent;
                    var list = prod.parent.children;
                } else {
                    var list = node.procedure;
                }
                for (let index in list){
                    if (list[index].selected){
                        list.splice(parseInt(index)+1, 0, prod);
                        break;
                    }
                }
            }
        } else {
            node.procedure.push(prod);
        }

        // add ID to the procedure
        prod.ID = 'prod-' + Math.random().toString(36).substr(2, 16);
        console.log(prod.ID);


        // select the procedure
        NodeUtils.select_procedure(node, prod);

        switch(prod.type){

            case ProcedureTypes.VARIABLE:
                prod.argCount = 2;
                prod.args = [ {name: 'var_name', value: undefined, default: undefined}, {name: 'value', value: undefined, default: undefined} ];
                break;
            
            case ProcedureTypes.FOREACH:
                prod.argCount = 2; 
                prod.args = [ {name: 'i', value: undefined, default: undefined}, {name: 'arr', value: undefined, default: []} ];
                prod.children = [];
                break;

            case ProcedureTypes.WHILE:
                prod.argCount = 1; 
                prod.args = [ {name: 'conditional_statement', value: undefined, default: undefined} ];
                prod.children = [];
                break;

            case ProcedureTypes.IF: 
            case ProcedureTypes.ELSEIF:
                prod.argCount = 1;
                prod.args = [ {name: 'conditional_statement', value: undefined, default: undefined} ];
                prod.children = [];
                break;

            case ProcedureTypes.ELSE:
                prod.argCount = 0;
                prod.args = [];
                prod.children = [];
                break;

            case ProcedureTypes.BREAK:
            case ProcedureTypes.CONTINUE:
                prod.argCount = 0;
                prod.args = [];

            case ProcedureTypes.FUNCTION:
                if(type == ProcedureTypes.FUNCTION){
                    if(!data) throw Error('No function data');
                    
                    prod.meta = { module: data.module, name: data.name };
                    prod.argCount = data.argCount + 1;
                    prod.args = [ {name: 'var_name', value: 'result', default: undefined}, ...data.args];
                }

        }
        
    }

}