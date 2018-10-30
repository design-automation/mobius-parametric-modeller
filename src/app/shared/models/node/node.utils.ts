import { INode } from './node.interface';
import { ProcedureTypes, IFunction, IProcedure } from '@models/procedure';
import { PortType, InputType, OutputType, PortUtils } from '@models/port';
import { not } from '@angular/compiler/src/output/output_ast';
import * as circularJSON from 'circular-json';
import { IdGenerator } from '@utils';
import { templateJitUrl } from '@angular/compiler';

export abstract class NodeUtils{

    static getNewNode(): INode{
        let node: INode = <INode>{
            name: "Node", 
            id: IdGenerator.getNodeID(),
            position: {x: 0, y: 0}, 
            enabled: true,
            type: '',
            procedure: [],
            state: {
                procedure: [], 
                input_port: undefined, 
                output_port: undefined
            },
            input: PortUtils.getNewInput(),
            output: PortUtils.getNewOutput()
        }
        node.input.parentNode = node;
        node.output.parentNode = node;
        
        return node;
    };

    static getStartNode(): INode{
        let node = NodeUtils.getNewNode();
        node.name = 'Start';
        node.type = 'start';
        node.position= {x: 400, y: 0};
        return node;
    };

    static getEndNode(): INode{
        let node = NodeUtils.getNewNode();
        node.name = 'End';
        node.type = 'end';
        node.position= {x: 400, y: 400};
        return node;
    };
    

    static deselect_procedure(node: INode){
        for (let prod of node.state.procedure){
            prod.selected = false;
        }
        node.state.procedure = [];
    }


    static rearrangeSelected(prodList: IProcedure[], tempList: IProcedure[], prods: IProcedure[]){
        for (let pr of prods){
            if (!pr.selected) {
                if (pr.children) NodeUtils.rearrangeSelected(prodList, tempList, pr.children)
                continue
            };
            var i = 0;
            while (i < tempList.length){
                if (tempList[i] === pr){
                    prodList.push(pr)
                    tempList.splice(i,1)
                    break;
                }
                i += 1;
            }
            if (pr.children) NodeUtils.rearrangeSelected(prodList, tempList, pr.children)
        }
    }

    static select_procedure(node: INode, procedure: IProcedure, ctrl: boolean){
        if (!procedure){
            return
        }
        if (ctrl){
            var selIndex = 0;
            var selected = false;
            while (selIndex < node.state.procedure.length){
                if (node.state.procedure[selIndex] === procedure){
                    selected = true;
                    node.state.procedure.splice(selIndex, 1)
                    procedure.selected = false;
                    break
                }
                selIndex += 1;
            }
            if (!selected){
                procedure.selected = true
                node.state.procedure.push(procedure)
                let tempArray = node.state.procedure.splice(0, node.state.procedure.length);
                NodeUtils.rearrangeSelected(node.state.procedure, tempArray, node.procedure)
                console.log(node.state.procedure)
            }
        } else {
            let sel = procedure.selected
            for (let prod of node.state.procedure){
                prod.selected = false
            }
            if (sel && node.state.procedure.length === 1 && node.state.procedure[0] === procedure){
                node.state.procedure = []
            } else {
                node.state.procedure = [procedure]
                procedure.selected = true
            }
        }
    }

    static insert_procedure(node: INode, prod: IProcedure){
        if (node.state.procedure[0]){
            if (node.state.procedure[0].children){
                node.state.procedure[0].children.push(prod);
                prod.parent = node.state.procedure[0];
            } else {
                if (node.state.procedure[0].parent){
                    prod.parent = node.state.procedure[0].parent;
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
        NodeUtils.select_procedure(node, prod, false);

        switch(prod.type){
            case ProcedureTypes.Variable:
                prod.argCount = 2;
                prod.args = [ {name: 'var_name', value: undefined, default: undefined}, {name: 'value', value: undefined, default: undefined} ];
                break;
            
            case ProcedureTypes.Foreach:
                prod.argCount = 2; 
                prod.args = [ {name: 'i', value: undefined, default: undefined}, {name: 'arr', value: undefined, default: []} ];
                prod.children = [];
                break;

            case ProcedureTypes.While:
                prod.argCount = 1; 
                prod.args = [ {name: 'conditional_statement', value: undefined, default: undefined} ];
                prod.children = [];
                break;

            case ProcedureTypes.If: 
            case ProcedureTypes.Elseif:
                prod.argCount = 1;
                prod.args = [ {name: 'conditional_statement', value: undefined, default: undefined} ];
                prod.children = [];
                break;

            case ProcedureTypes.Else:
                prod.argCount = 0;
                prod.args = [];
                prod.children = [];
                break;

            case ProcedureTypes.Break:
            case ProcedureTypes.Continue:
                prod.argCount = 0;
                prod.args = [];
                break;

            case ProcedureTypes.Function:
                if(!data) throw Error('No function data');
                
                prod.meta = { module: data.module, name: data.name };
                prod.argCount = data.argCount + 1;
                prod.args = [ {name: 'var_name', value: 'result', default: undefined}, ...data.args];
                break;

            case ProcedureTypes.Imported:
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
        newProd.parent = undefined;
        NodeUtils.insert_procedure(node, newProd);
        NodeUtils.select_procedure(node, newProd, false);
    }

}