import { INode } from './node.interface';
import { ProcedureTypes, IFunction, IProcedure } from '@models/procedure';
import { PortType, InputType, OutputType, PortUtils } from '@models/port';
import { not } from '@angular/compiler/src/output/output_ast';
import * as circularJSON from 'circular-json';
import { IdGenerator } from '@utils';

export abstract class NodeUtils{

    static getNewNode(): INode{
        let node: INode = <INode>{
            name: "a_new_node", 
            id: IdGenerator.getNodeID(),
            position: {x: 0, y: 0}, 
            enabled: true,
            type: '',
            procedure: [],
            state: {
                procedure: undefined, 
                input_port: undefined, 
                output_port: undefined
            },
            inputs: [ PortUtils.getNewInput() ],
            outputs: [ PortUtils.getNewOutput() ]
        }
        node.inputs[0].parentNode = node;
        node.outputs[0].parentNode = node;
        
        return node;
    };

    static getStartNode(): INode{
        let node = NodeUtils.getNewNode();
        node.name = 'start';
        node.type = 'start';
        node.position= {x: 0, y: 200}, 
        node.inputs[0].name = 'start_input';
        node.outputs[0].name = 'start_output';
        return node;
    };

    static getEndNode(): INode{
        let node = NodeUtils.getNewNode();
        node.name = 'end';
        node.type = 'end';
        node.position= {x: 400, y: 200}, 
        node.inputs[0].name = 'end_input';
        node.outputs[0].name = 'end_output';
        return node;
    };
    


    static deselect_procedure(node: INode){
        if (node.state.procedure){
            node.state.procedure.selected = false;
            node.state.procedure = undefined;
        }
    }

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

    static insert_procedure(node: INode, prod: IProcedure){
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

    }
    
    static add_procedure(node: INode, type: ProcedureTypes, data: IFunction ){
        let prod: IProcedure = <IProcedure>{};
        prod.type= type;
        
        NodeUtils.insert_procedure(node, prod);

        // add ID to the procedure
        prod.ID = IdGenerator.getProdID();

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
                break;

            case ProcedureTypes.FUNCTION:
                if(!data) throw Error('No function data');
                
                prod.meta = { module: data.module, name: data.name };
                prod.argCount = data.argCount + 1;
                prod.args = [ {name: 'var_name', value: 'result', default: undefined}, ...data.args];
                break;

            case ProcedureTypes.IMPORTED:
                prod.meta = { module: data.module, name: data.name };
                prod.argCount = data.argCount + 1;
                prod.args = [ {name: 'var_name', value: 'result', default: undefined}, ...data.args];
                break;
        }
        
    }

    static updateID(prod: IProcedure): any{
        if (prod.hasOwnProperty('children')){
            prod.children.map((child: IProcedure) => {	
                NodeUtils.updateID(child);	
            });
        }
        prod.ID = IdGenerator.getProdID();
        return prod
    }

    static paste_procedure(node: INode, prod: IProcedure ){
        const newProd = NodeUtils.updateID(circularJSON.parse(circularJSON.stringify(prod)));
        
        NodeUtils.insert_procedure(node, newProd);
        NodeUtils.select_procedure(node, newProd);
    }

}