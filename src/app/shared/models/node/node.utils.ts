import { INode } from './node.interface';
import { ProcedureTypes, IFunction, IProcedure } from '@models/procedure';
import { PortType, InputType, OutputType, PortUtils } from '@models/port';
import { not } from '@angular/compiler/src/output/output_ast';
import * as circularJSON from 'circular-json';
import { IdGenerator } from '@utils';
import { templateJitUrl } from '@angular/compiler';

export abstract class NodeUtils {

    static getNewNode(): INode {
        const node: INode = <INode>{
            name: 'Node',
            id: IdGenerator.getNodeID(),
            position: {x: 0, y: 0},
            enabled: false,
            type: '',
            procedure: [],
            state: {
                procedure: [],
                input_port: undefined,
                output_port: undefined
            },
            input: PortUtils.getNewInput(),
            output: PortUtils.getNewOutput()
        };
        node.input.parentNode = node;
        node.output.parentNode = node;

        return node;
    }

    static getStartNode(): INode {
        const node = NodeUtils.getNewNode();
        node.enabled = true;
        node.name = 'Start';
        node.type = 'start';
        node.position = {x: 700, y: 400};
        return node;
    }

    static getEndNode(): INode {
        const node = NodeUtils.getNewNode();
        node.name = 'End';
        node.type = 'end';
        node.position = {x: 700, y: 800};
        return node;
    }


    static deselect_procedure(node: INode) {
        for (const prod of node.state.procedure) {
            prod.selected = false;
        }
        node.state.procedure = [];
    }


    static rearrangeSelected(prodList: IProcedure[], tempList: IProcedure[], prods: IProcedure[]) {
        for (const pr of prods) {
            if (!pr.selected) {
                if (pr.children) { NodeUtils.rearrangeSelected(prodList, tempList, pr.children); }
                continue;
            }
            let i = 0;
            while (i < tempList.length) {
                if (tempList[i] === pr) {
                    prodList.push(pr);
                    tempList.splice(i, 1);
                    break;
                }
                i += 1;
            }
            if (pr.children) { NodeUtils.rearrangeSelected(prodList, tempList, pr.children); }
        }
    }

    static select_procedure(node: INode, procedure: IProcedure, ctrl: boolean) {
        if (!procedure) {
            return;
        }
        if (ctrl) {
            let selIndex = 0;
            let selected = false;
            while (selIndex < node.state.procedure.length) {
                if (node.state.procedure[selIndex] === procedure) {
                    selected = true;
                    node.state.procedure.splice(selIndex, 1);
                    procedure.selected = false;
                    break;
                }
                selIndex += 1;
            }
            if (!selected) {
                procedure.selected = true;
                node.state.procedure.push(procedure);
                const tempArray = node.state.procedure.splice(0, node.state.procedure.length);
                NodeUtils.rearrangeSelected(node.state.procedure, tempArray, node.procedure);
                console.log(node.state.procedure);
            }
        } else {
            const sel = procedure.selected;
            for (const prod of node.state.procedure) {
                prod.selected = false;
            }
            if (sel && node.state.procedure.length === 1 && node.state.procedure[0] === procedure) {
                node.state.procedure = [];
            } else {
                node.state.procedure = [procedure];
                procedure.selected = true;
            }
        }
    }

    static insert_procedure(node: INode, prod: IProcedure) {
        if (node.state.procedure[0]) {
            if (node.state.procedure[0].children) {
                node.state.procedure[0].children.push(prod);
                prod.parent = node.state.procedure[0];
            } else {
                let list;
                if (node.state.procedure[0].parent) {
                    prod.parent = node.state.procedure[0].parent;
                    list = prod.parent.children;
                } else {
                    list = node.procedure;
                }
                for (const index in list) {
                    if (list[index].selected) {
                        list.splice(parseInt(index, 10) + 1, 0, prod);
                        break;
                    }
                }
            }
        } else {
            node.procedure.push(prod);
        }

    }

    static add_procedure(node: INode, type: ProcedureTypes, data: IFunction ) {
        const prod: IProcedure = <IProcedure>{};
        prod.type = type;

        NodeUtils.insert_procedure(node, prod);

        // add ID to the procedure
        prod.ID = IdGenerator.getProdID();
        prod.enabled = true;
        prod.print = false;

        // select the procedure
        NodeUtils.select_procedure(node, prod, false);

        switch (prod.type) {
            case ProcedureTypes.Variable:
                prod.argCount = 2;
                prod.args = [
                    {name: 'var_name', value: undefined, default: undefined},
                    {name: 'value', value: undefined, default: undefined} ];
                break;

            case ProcedureTypes.Foreach:
                prod.argCount = 2;
                prod.args = [ {name: 'i', value: undefined, default: undefined}, {name: 'arr', value: undefined, default: []} ];
                prod.children = [];
                break;

            case ProcedureTypes.While:
                prod.argCount = 1;
                prod.args = [ {name: 'condition', value: undefined, default: undefined} ];
                prod.children = [];
                break;

            case ProcedureTypes.If:
            case ProcedureTypes.Elseif:
                prod.argCount = 1;
                prod.args = [ {name: 'condition', value: undefined, default: undefined} ];
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
                if (!data) { throw Error('No function data'); }

                prod.meta = { module: data.module, name: data.name, inputMode: InputType.SimpleInput, description: undefined};
                prod.argCount = data.argCount + 1;
                let returnArg = {name: 'var_name', value: undefined, default: undefined};
                if (!data.hasReturn) {
                    returnArg = {name: '__none__', value: undefined, default: undefined};
                }

                // --UNSTABLE--
                // changing the value of the last argument of all functions in input node to be undefined
                if (node.type === 'start') {
                    data.args[data.argCount - 1].value = undefined;
                }

                prod.args = [ returnArg, ...data.args];
                break;

            case ProcedureTypes.Imported:
                prod.meta = { module: data.module, name: data.name, inputMode: InputType.SimpleInput, description: undefined};
                prod.argCount = data.argCount + 1;
                prod.args = [ {name: 'var_name', value: undefined, default: undefined}, ...data.args];
                break;
        }
    }

    static updateNode(newNode: INode, newPos): INode {
        newNode.id = IdGenerator.getNodeID();
        newNode.input = PortUtils.getNewInput();
        newNode.output = PortUtils.getNewOutput();
        newNode.input.parentNode = newNode;
        newNode.output.parentNode = newNode;
        newNode.position.x = newPos.x;
        newNode.position.y = newPos.y;
        return newNode;
    }

    static updateID(prod: IProcedure): any {
        if (prod.hasOwnProperty('children')) {
            prod.children.map((child: IProcedure) => {
                NodeUtils.updateID(child);
            });
        }
        prod.ID = IdGenerator.getProdID();
        return prod;
    }

    static paste_procedure(node: INode, prod: IProcedure ) {
        const newProd = NodeUtils.updateID(circularJSON.parse(circularJSON.stringify(prod)));
        newProd.parent = undefined;
        NodeUtils.insert_procedure(node, newProd);
        NodeUtils.select_procedure(node, newProd, false);
    }

}
