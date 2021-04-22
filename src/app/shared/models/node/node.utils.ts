import { INode } from './node.interface';
import { ProcedureTypes, IFunction, IProcedure } from '@models/procedure';
import { InputType, PortUtils } from '@models/port';
import * as circularJSON from 'circular-json';
import { IdGenerator } from '@utils';
import { ModuleList, ModuleDocList } from '@shared/decorators';
import { _parameterTypes } from '@assets/core/_parameterTypes';
import { modifyLocalFuncVar } from '@shared/parser';

export abstract class NodeUtils {

    static getNewNode(): INode {
        const node: INode = <INode>{
            name: 'Node',
            id: IdGenerator.getNodeID(),
            position: {x: 0, y: 0},
            enabled: false,
            type: '',
            procedure: [{type: 13, ID: 'main_blank',
                parent: undefined,
                meta: {name: '', module: ''},
                variable: undefined,
                children: undefined,
                argCount: 0,
                args: [],
                print: false,
                enabled: true,
                selected: false,
                selectGeom: false,
                hasError: false}],
            localFunc: [{type: 13, ID: 'local_func_blank',
                parent: undefined,
                meta: {name: '', module: ''},
                variable: undefined,
                children: undefined,
                argCount: 0,
                args: [],
                print: false,
                enabled: true,
                selected: false,
                selectGeom: false,
                hasError: false}],
            state: {
                procedure: [],
                show_code: true,
                show_func: true
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
        node.state.show_code = false;
        node.state.show_func = false;
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
                const newReturn = {
                    type: ProcedureTypes.EndReturn,
                    ID: 'Return',
                    parent: undefined,
                    meta: {name: '', module: ''},
                    children: undefined,
                    variable: undefined,
                    argCount: j.argCount,
                    args: j.args,
                    print: false,
                    enabled: true,
                    selected: false,
                    terminate: false,
                    hasError: false
                };

                for (const arg of newReturn.args) {
                    arg.value = '';
                    arg.jsValue = '';
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
            prod.lastSelected = false;
        }
        node.state.procedure = [];
        NodeUtils.check_procedure_selected([], node.localFunc);
        NodeUtils.check_procedure_selected([], node.procedure);
    }

    static check_procedure_selected(selectedList: IProcedure[], prodList: IProcedure[]) {
        for (const prod of prodList) {
            if (prod.children) {
                NodeUtils.check_procedure_selected(selectedList, prod.children);
            }
            if (!prod.selected) {
                continue;
            }
            let check = false;
            for (const selProd of selectedList) {
                if (selProd.ID === prod.ID) {
                    check = true;
                    break;
                }
            }
            if (!check) {
                prod.selected = false;
                prod.lastSelected = false;
            }
        }
    }

    static rearrangeProcedures(prodList: IProcedure[], tempList: IProcedure[], prods: IProcedure[]) {
        for (const pr of prods) {
            let i = 0;
            while (i < tempList.length) {
                if (tempList[i].ID === pr.ID) {
                    prodList.push(pr);
                    tempList.splice(i, 1);
                    break;
                }
                i += 1;
            }
            if (pr.children) { NodeUtils.rearrangeProcedures(prodList, tempList, pr.children); }
        }
    }

    static select_procedure(node: INode, procedure: IProcedure, ctrl: boolean, shift: boolean) {
        if (!procedure) {
            return;
        }
        for (const selprod of node.state.procedure) {
            selprod.lastSelected = false;
        }
        if (ctrl) {
            let selIndex = 0;
            let selected = false;
            while (selIndex < node.state.procedure.length) {
                if (node.state.procedure[selIndex] === procedure) {
                    selected = true;
                    node.state.procedure.splice(selIndex, 1);
                    procedure.selected = false;
                    if (node.state.procedure.length > 0) {
                        node.state.procedure[node.state.procedure.length - 1].lastSelected = true;
                    }
                    return false;
                }
                selIndex += 1;
            }
            if (!selected) {
                procedure.selected = true;
                node.state.procedure.push(procedure);
            }
        } else if (shift) {
            if (node.state.procedure.length === 0) {
                node.state.procedure.push(procedure);
                procedure.selected = true;
                procedure.lastSelected = true;
                return;
            } else if (procedure.selected) {
                procedure.selected = false;
                const i = node.state.procedure.indexOf(procedure);
                if (i !== -1) {
                    node.state.procedure.splice(i, 1);
                    if (node.state.procedure.length > 0) {
                        node.state.procedure[node.state.procedure.length - 1].lastSelected = true;
                    }
                    return;
                }
            }
            // fromProd: the last selected procedure
            let fromProd = node.state.procedure[node.state.procedure.length - 1];
            // find the whole path to the fromProd from the base level
            const fromTree = [fromProd];
            while (fromProd.parent) {
                fromProd = fromProd.parent;
                fromTree.unshift(fromProd);
            }
            // toProd: the procedure that was shift + clicked on
            let toProd = procedure;
            // find the whole path to the toProd from the base level
            const toTree = [procedure];
            while (toProd.parent) {
                toProd = toProd.parent;
                toTree.unshift(toProd);
            }

            // removing the common parents in the fromProd-toProd path
            // env would be the list of procedure containing the first different parents between fromProd and toProd
            let env = node.localFunc.concat(node.procedure);
            while (fromTree[0] === toTree[0]) {
                env = fromTree[0].children;
                fromTree.splice(0, 1);
                toTree.splice(0, 1);
            }

            // find the indices of the first different parents of fromProd and toProd
            const fromIndex = env.indexOf(fromTree[0]);
            const toIndex = env.indexOf(toTree[0]);

            // check the direction from fromProd to toProd
            // reverse = false: fromProd is above toProd
            // reverse = true : fromProd is below toProd
            const reverse = fromIndex < toIndex ? false : true;

            // add the procedures between fromProd and toProd that are inside the fromTree
            while (fromTree.length > 1) {
                fromProd = fromTree.pop();
                const prodList = fromProd.parent.children;
                if (!reverse) {
                    // add procedure from the fromProcedure to the end, not inclusive of the fromProcedure
                    // since it is already selected
                    for (let i = prodList.indexOf(fromProd) + 1; i < prodList.length; i++) {
                        prodList[i].selected = true;
                        node.state.procedure.push(prodList[i]);
                    }
                } else {
                    // add procedure from the fromProcedure to the beginning,
                    // not inclusive of the fromProcedure since it is already selected.
                    // stop adding procedure when at index 1,
                    // procedure at index 0 is not added to the list since it is always a blank
                    for (let i = prodList.indexOf(fromProd) - 1; i > 0; i--) {
                        prodList[i].selected = true;
                        node.state.procedure.push(prodList[i]);
                    }
                }
            }

            // add the procedure between the first different parents of the fromProd and toProd
            if (!reverse) {
                for (let i = fromIndex + 1; i < toIndex; i++) {
                    env[i].selected = true;
                    node.state.procedure.push(env[i]);
                }
            } else {
                for (let i = fromIndex - 1; i > toIndex; i--) {
                    env[i].selected = true;
                    node.state.procedure.push(env[i]);
                }
            }

            // add the procedures between fromProd and toProd that are inside the toTree
            for (let ind = 1; ind < toTree.length; ind++) {
                toProd = toTree[ind];
                const prodList = toProd.parent.children;
                if (!reverse) {

                    // procedure at index 0 is not added to the list since it is always a blank
                    for (let i = prodList.indexOf(toProd) - 1; i > 0; i--) {
                        prodList[i].selected = true;
                        node.state.procedure.push(prodList[i]);
                    }
                } else {
                    for (let i = prodList.indexOf(toProd) + 1; i < prodList.length; i++) {
                        prodList[i].selected = true;
                        node.state.procedure.push(prodList[i]);
                    }
                }
            }

            // add the toProd itself
            procedure.selected = true;
            node.state.procedure.push(procedure);

        } else {
            const sel = procedure.selected;
            for (const prod of node.state.procedure) {
                prod.selected = false;
            }
            if (sel && node.state.procedure.length === 1 && node.state.procedure[node.state.procedure.length - 1] === procedure) {
                node.state.procedure = [];
            } else {
                procedure.selected = true;
                node.state.procedure = [procedure];
            }
        }
        procedure.lastSelected = true;
    }

    static insert_procedure(node: INode, prod: IProcedure) {
        if (prod.type === ProcedureTypes.Constant) {
            if (node.type !== 'start') { return; }
            if (node.state.procedure.length > 0 && node.state.procedure[node.state.procedure.length - 1]) {
                if (node.state.procedure[node.state.procedure.length - 1].type === ProcedureTypes.Constant) {
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
        if (prod.type === ProcedureTypes.LocalFuncDef) {
            if (node.type === 'start') { return; }
            const last_prod = node.state.procedure[node.state.procedure.length - 1]
            if (node.state.procedure.length > 0 && last_prod
            && (last_prod.type === ProcedureTypes.LocalFuncDef
            || (last_prod.type === ProcedureTypes.Blank && last_prod.ID === 'local_func_blank'))) {
                for (let index = 0; index < node.localFunc.length; index ++) {
                    if (node.localFunc[index].ID === node.state.procedure[node.state.procedure.length - 1].ID) {
                        node.localFunc.splice(index + 1, 0, prod);
                        break;
                    }
                }
            } else {
                node.localFunc.push(prod);
            }
            return;
        }
        const lastNode = node.state.procedure[node.state.procedure.length - 1];
        if (lastNode && lastNode.type !== ProcedureTypes.Constant) {
            if (lastNode.type === ProcedureTypes.EndReturn) {
                node.procedure.splice( node.procedure.length - 1, 0, prod);
                return;
            }
            if (lastNode.type === ProcedureTypes.LocalFuncDef || (lastNode.type === ProcedureTypes.Blank && lastNode.ID === 'local_func_blank')) {
                node.procedure.splice(1, 0, prod);
            }
            let list: IProcedure[];
            if (lastNode.parent) {
                prod.parent = lastNode.parent;
                list = prod.parent.children;
            } else {
                list = node.procedure;
            }
            for (const index in list) {
                if (list[index].ID === lastNode.ID) {
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
            {type: 13, ID: prod.ID + '-blank',
            parent: prod, meta: {name: '', module: ''},
            children: undefined,
            variable: undefined,
            argCount: 0,
            args: [],
            print: false,
            enabled: true,
            selected: false,
            selectGeom: false,
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
                    {name: 'var_name', value: undefined},
                    {name: 'value', value: undefined} ];
                break;

            case ProcedureTypes.Foreach:
                prod.argCount = 2;
                prod.args = [ {name: 'item', value: undefined}, {name: 'list', value: undefined} ];
                this.initiateChildren(prod);
                break;

            case ProcedureTypes.While:
                prod.argCount = 1;
                prod.args = [ {name: 'condition', value: undefined} ];
                this.initiateChildren(prod);
                break;

            case ProcedureTypes.If:
            case ProcedureTypes.Elseif:
                prod.argCount = 1;
                prod.args = [ {name: 'condition', value: undefined} ];
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
                prod.args = [];
                break;

            case ProcedureTypes.LocalFuncDef:
                prod.argCount = data + 1;
                prod.meta = { module: '', name: '', otherInfo: { 'prev_name': '', 'num_returns': 0, 'collapsed': false}};
                prod.args = [{name: 'func_name', value: undefined}];
                for (let argIndex = 0; argIndex < data; argIndex ++) {
                    prod.args.push({name: `arg_name_${argIndex}`, value: undefined});
                }
                this.initiateChildren(prod);
                break;

            case ProcedureTypes.Return:
                let topParent = prod.parent;
                while (topParent && topParent.parent) {
                    topParent = topParent.parent;
                }
                if (topParent && topParent.type === ProcedureTypes.LocalFuncDef) {
                    prod.argCount = 1;
                    prod.args = [ {name: 'Value', value: undefined} ];
                    let funcDef = prod.parent;
                    while (funcDef.parent) { funcDef = funcDef.parent; }
                    if (!funcDef.meta || !funcDef.meta.otherInfo) { break; }
                    funcDef.meta.otherInfo.num_returns ++;
                    if (funcDef.meta.otherInfo.num_returns === 1) {
                        modifyLocalFuncVar(funcDef, node.localFunc.concat(node.procedure));
                    }
                    break;
                } else if (node.type === 'end') {
                    prod.argCount = 1;
                    prod.args = [ {name: 'Value', value: undefined} ];
                    break;
                }
                prod.argCount = 0;
                prod.args = [];
                break;


            case ProcedureTypes.LocalFuncCall:
                prod.argCount = data.args.length;
                prod.meta = { module: 'localFunc', name: data.args[0].value};
                prod.argCount = data.argCount;

                const hasReturn = NodeUtils.checkLocalFuncReturn(data);
                if (hasReturn) {
                    prod.args = [ {name: 'var_name', value: undefined} ];
                } else {
                    prod.args = [ {name: '__none__', value: undefined} ];
                }
                data.args.slice(1).forEach(arg => {
                    prod.args.push({name: arg.value, value: undefined});
                });
                break;

            case ProcedureTypes.Constant:
                prod.argCount = 2;
                prod.meta = { module: 'Input', name: 'Constant', inputMode: data, description: ''};
                prod.args = [
                {name: 'const_name', value: undefined},
                {name: '__input__', value: 0} ];
                break;

            case ProcedureTypes.AddData:
                prod.argCount = 2;
                prod.meta = { module: 'Input', name: 'Constant', inputMode: InputType.SimpleInput, description: undefined};
                prod.args = [
                {name: 'const_name', value: undefined},
                {name: '__input__', value: undefined} ];
                break;

            case ProcedureTypes.Comment:
                prod.argCount = 1;
                prod.args = [{name: 'comment', value: undefined}];
                break;

            case ProcedureTypes.Terminate:
                prod.argCount = 0;
                prod.args = [];
                break;

            case ProcedureTypes.Error:
                prod.argCount = 1;
                prod.args = [{name: 'error_message', value: undefined}];
                break;

            case ProcedureTypes.EndReturn:
                prod.meta = { module: 'Output', name: 'Return', description: undefined};
                prod.argCount = 1;
                prod.args = [ {name: 'index', value: undefined} ];
                break;

            case ProcedureTypes.MainFunction:
                if (!data) { throw Error('No function data'); }
                prod.meta = { module: data.module, name: data.name};
                prod.argCount = data.argCount + 1;
                let returnArg = {name: 'var_name', value: undefined};
                if (!data.hasReturn) {
                    returnArg = {name: '__none__', value: undefined};
                }

                prod.args = [ returnArg, ...data.args];
                break;

            case ProcedureTypes.globalFuncCall:
                prod.meta = { module: data.module, name: data.name};
                prod.argCount = data.argCount + 1;

                let iReturnArg = {name: 'var_name', value: undefined};
                if (!data.hasReturn) {
                    iReturnArg = {name: '__none__', value: undefined};
                }

                prod.args = [ iReturnArg, ...data.args];
                break;

        }
        // select the procedure
        if (prod.children) {
            NodeUtils.select_procedure(node, prod.children[0], false, false);
        } else {
            NodeUtils.select_procedure(node, prod, false, false);
        }
    }

    static checkLocalFuncReturn(prod): boolean {
        if (!prod.children) { return false; }
        for (const child_prod of prod.children){
            if (child_prod.type === ProcedureTypes.Return
            && child_prod.args[0].value
            && child_prod.args[0].value !== 'null'
            && child_prod.args[0].value !== 'undefined'
            && child_prod.args[0].value !== '') {
                return true;
            }
            if (child_prod.children && NodeUtils.checkLocalFuncReturn(child_prod)) {
                return true;
            }
        }
        return false;
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
        NodeUtils.resetSelectGeom(prod);
        return prod;
    }

    static resetSelectGeom(prod: IProcedure) {
        prod.selectGeom = false;
        if (prod.children) {
            for (const chl of prod.children) {
                NodeUtils.resetSelectGeom(chl);
            }
        }
    }

    static paste_procedure(node: INode, prod: IProcedure ): boolean {
        if (NodeUtils.checkInvalid(ProcedureTypes[prod.type], node)) {
            return false;
        }
        const newProd = NodeUtils.updateID(circularJSON.parse(circularJSON.stringify(prod)));
        if (prod.type === ProcedureTypes.LocalFuncDef) {
            for (const existingFunc of node.localFunc) {
                if (existingFunc.type !== ProcedureTypes.LocalFuncDef) { continue; }
                if (existingFunc.args[0].value === newProd.args[0].value) {
                    newProd.args[0].value += '_copy';
                    newProd.args[0].jsValue += 'copy_';
                }
            }
        }
        newProd.parent = undefined;
        NodeUtils.insert_procedure(node, newProd);
        if (newProd.type === ProcedureTypes.Return) {
            let topProd = newProd.parent;
            while (topProd && topProd.parent) {
                topProd = topProd.parent;
            }
            if (node.type === 'end' || (topProd && topProd.type === ProcedureTypes.LocalFuncDef)) {
                if (newProd.args.length === 0) {
                    newProd.argCount = 1;
                    newProd.args = [ {name: 'Value', value: undefined} ];
                }
            } else {
                newProd.argCount = 0;
                newProd.args = [];
            }
        }
        NodeUtils.select_procedure(node, newProd, false, false);
        return true;
    }

    static checkInvalid(type: string, node: INode) {
        const tp = type.toUpperCase();
        if (tp === 'ELSE') {
            if (node.state.procedure.length === 0) { return true; }
            const checkNode = node.state.procedure[node.state.procedure.length - 1];
            if (checkNode.type.toString() !== ProcedureTypes.If.toString()
            && checkNode.type.toString() !== ProcedureTypes.Elseif.toString()) {
                return true;
            }
            let prods: IProcedure[];

            if (checkNode.parent) { prods = checkNode.parent.children;
            } else { prods = node.procedure; }

            for (let i = 0 ; i < prods.length - 1; i++) {
                if (prods[i].ID === checkNode.ID) {
                    if (prods[i + 1].type.toString() === ProcedureTypes.Elseif.toString() ||
                    prods[i + 1].type.toString() === ProcedureTypes.Else.toString()) {
                        return true;
                    }
                    return false;
                }
            }
            return false;
        } else if (tp === 'ELSEIF') {
            if (node.state.procedure.length === 0) { return true; }
            const checkNode = node.state.procedure[node.state.procedure.length - 1];
            return (checkNode.type.toString() !== ProcedureTypes.If.toString()
            && checkNode.type.toString() !== ProcedureTypes.Elseif.toString());
        // } else if (tp === 'RETURN') {
        //     let checkNode = node.state.procedure[node.state.procedure.length - 1];
        //     if (!checkNode || checkNode.type === ProcedureTypes.LocalFuncDef) { return true; }
        //     while (checkNode.parent) {
        //         checkNode = checkNode.parent;
        //     }
        //     if (checkNode.type === ProcedureTypes.LocalFuncDef) { return false; }
        //     return true;
        } else {
            let checkNode = node.state.procedure[node.state.procedure.length - 1];
            if (tp === 'BREAK' || tp === 'CONTINUE') {
            // if (tp === 'CONTINUE' || (tp === 'BREAK' && node.type === 'end')) {
                if (!checkNode) {return true; }
                while (checkNode.parent) {
                    if (checkNode.parent.type.toString() === ProcedureTypes.Foreach.toString() ||
                    checkNode.parent.type.toString() === ProcedureTypes.While.toString()) {
                        return false;
                    }
                    checkNode = checkNode.parent;
                }
                return true;
            }

            if (checkNode) {
                let prods: IProcedure[];

                if (checkNode.parent) { prods = checkNode.parent.children;
                } else { prods = node.procedure; }

                if (checkNode.type.toString() === ProcedureTypes.If.toString()
                || checkNode.type.toString() === ProcedureTypes.Elseif.toString()) {
                    for (let i = 0 ; i < prods.length - 1; i++) {
                        if (prods[i].ID === checkNode.ID) {
                            if (prods[i + 1].type.toString() === ProcedureTypes.Else.toString()
                            || prods[i + 1].type.toString() === ProcedureTypes.Elseif.toString()) {
                                return true;
                            }
                            return false;
                        }
                    }
                }
            }
        }
        return false;
    }
}
