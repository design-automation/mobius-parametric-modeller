import { INode } from './node.interface';
import { ProcedureTypes, IFunction, IProcedure } from '@models/procedure';
import { InputType, PortUtils } from '@models/port';
import * as circularJSON from 'circular-json';
import { IdGenerator } from '@utils';
import { ModuleList, ModuleDocList } from '@shared/decorators';
import { _parameterTypes } from '@modules';

export abstract class NodeUtils {

    static getNewNode(): INode {
        const node: INode = <INode>{
            name: 'Node',
            id: IdGenerator.getNodeID(),
            position: {x: 0, y: 0},
            enabled: false,
            type: '',
            procedure: [{type: 13, ID: '',
                parent: undefined,
                meta: {name: '', module: ''},
                children: undefined,
                argCount: 0,
                args: [],
                print: false,
                enabled: true,
                selected: false,
                hasError: false}],
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
        // node.procedure = [];
        node.enabled = true;
        node.name = 'Start';
        node.type = 'start';
        return node;
    }

    static getEndNode(): INode {
        const node = NodeUtils.getNewNode();
        const returnMeta = _parameterTypes.return.split('.');
        let check = false;
        for (const i of ModuleList) {
            if (i.module !== returnMeta[0]) { continue; }
            for ( const j of i.functions) {
                if (j.name !== returnMeta[1]) { continue; }
                const newReturn = {type: 11, ID: '',
                parent: undefined,
                meta: {name: '', module: ''},
                children: undefined,
                argCount: j.argCount,
                args: j.args,
                print: false,
                enabled: true,
                selected: false,
                hasError: false};
                for (const arg of newReturn.args) {
                    arg.value = '';
                }
                node.procedure.push(newReturn);
                check = true;
                break;
            }
            break;
        }
        if (!check) {
            console.log('CORE FUNCTION ERROR: Unable to retrieve return procedure, please check "Return" in _ParameterTypes.ts');
        }
        // node.procedure = [];
        node.name = 'End';
        node.type = 'end';
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
        if (prod.type === ProcedureTypes.Constant) {
            if (node.type !== 'start') { return; }
            if (node.state.procedure[0]) {
                if (node.state.procedure[0].type === ProcedureTypes.Constant) {
                    for (const index in node.procedure) {
                        if (node.procedure[index].selected) {
                            node.procedure.splice(parseInt(index, 10) + 1, 0, prod);
                            break;
                        }
                    }
                } else {
                    let addCheck = false;
                    for (const index in node.procedure) {
                        if (node.procedure[index].type === ProcedureTypes.Constant) {
                            node.procedure.splice(parseInt(index, 10), 0, prod);
                            addCheck = true;
                            break;
                        }
                    }
                    if (!addCheck) {
                        node.procedure.push(prod);
                    }
                }
            } else {
                node.procedure.push(prod);
            }
            return;
        }
        if (node.state.procedure[0] && node.state.procedure[0].type !== ProcedureTypes.Constant) {
            let list: IProcedure[];
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

        } else {
            if (node.type === 'end') {
                node.procedure.splice( node.procedure.length - 1, 0, prod);
                return;
            } else if (node.type === 'start') {
                for (let i = 0; i < node.procedure.length; i++) {
                    if (node.procedure[i].type === ProcedureTypes.Constant ) {
                        node.procedure.splice( i, 0, prod);
                        return;
                    }
                }
                node.procedure.push(prod);
                return;
            }
            node.procedure.push(prod);
        }
    }

    static initiateChildren(prod) {
        prod.children = [
            {type: 13, ID: '',
            parent: prod, meta: {name: '', module: ''},
            children: undefined,
            argCount: 0,
            args: [],
            print: false,
            enabled: true,
            selected: false,
            hasError: false}
        ];
    }
    static add_procedure(node: INode, type: ProcedureTypes, data: any) {
        const prod: IProcedure = <IProcedure>{};
        prod.type = type;

        NodeUtils.insert_procedure(node, prod);

        // add ID to the procedure
        prod.ID = IdGenerator.getProdID();
        prod.enabled = true;
        prod.print = false;


        switch (prod.type) {
            case ProcedureTypes.Variable:
                prod.argCount = 2;
                prod.args = [
                    {name: 'var_name', value: undefined, default: undefined},
                    {name: 'value', value: undefined, default: undefined} ];
                break;

            case ProcedureTypes.Foreach:
                prod.argCount = 2;
                prod.args = [ {name: 'item', value: undefined, default: undefined}, {name: 'list', value: undefined, default: []} ];
                this.initiateChildren(prod);
                break;

            case ProcedureTypes.While:
                prod.argCount = 1;
                prod.args = [ {name: 'condition', value: undefined, default: undefined} ];
                this.initiateChildren(prod);
                break;

            case ProcedureTypes.If:
            case ProcedureTypes.Elseif:
                prod.argCount = 1;
                prod.args = [ {name: 'condition', value: undefined, default: undefined} ];
                this.initiateChildren(prod);
                break;

            case ProcedureTypes.Else:
                prod.argCount = 0;
                prod.args = [];
                this.initiateChildren(prod);
                break;

            case ProcedureTypes.Break:
            case ProcedureTypes.Continue:
                prod.argCount = 0;
                break;

            case ProcedureTypes.Constant:
                prod.argCount = 2;
                prod.meta = { module: 'Input', name: 'Constant', inputMode: data, description: ''};
                prod.args = [
                {name: 'const_name', value: undefined, default: 0},
                {name: '__input__', value: undefined, default: 0} ];
            break;

            case ProcedureTypes.AddData:
                prod.argCount = 2;
                prod.meta = { module: 'Input', name: 'Constant', inputMode: InputType.SimpleInput, description: undefined};
                prod.args = [
                {name: 'const_name', value: undefined, default: 0},
                {name: '__input__', value: undefined, default: 0} ];
            break;

            case ProcedureTypes.Comment:
                prod.argCount = 1;
                prod.args = [{name: 'comment', value: undefined, default: 0}];
            break;


            case ProcedureTypes.Return:
                prod.meta = { module: 'Output', name: 'Return', description: undefined};
                prod.argCount = 1;
                prod.args = [ {name: 'index', value: undefined, default: 0} ];
                break;

            case ProcedureTypes.Function:
                if (!data) { throw Error('No function data'); }

                prod.meta = { module: data.module, name: data.name};
                prod.argCount = data.argCount + 1;
                let returnArg = {name: 'var_name', value: undefined, default: undefined};
                if (!data.hasReturn) {
                    returnArg = {name: '__none__', value: undefined, default: undefined};
                }

                prod.args = [ returnArg, ...data.args];
                break;

            case ProcedureTypes.Imported:
                prod.meta = { module: data.module, name: data.name};
                prod.argCount = data.argCount + 1;

                let iReturnArg = {name: 'var_name', value: undefined, default: undefined};
                if (!data.hasReturn) {
                    iReturnArg = {name: '__none__', value: undefined, default: undefined};
                }

                prod.args = [ iReturnArg, ...data.args];
                break;
        }
        // select the procedure
        if (prod.children) {
            NodeUtils.select_procedure(node, prod.children[0], false);
        } else {
            NodeUtils.select_procedure(node, prod, false);
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
