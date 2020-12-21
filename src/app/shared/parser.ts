import { inline_func } from '@assets/core/inline/inline';
import { IProcedure, ProcedureTypes } from '@models/procedure';
import { IArgument } from '@models/code';
import { INode } from '@models/node';
import { InputType } from '@models/port';
import { _parameterTypes } from '@assets/core/_parameterTypes';
import { modify } from '@assets/core/modules';

enum strType {
    NUM,
    VAR,
    STR,
    OTHER
}

const mathOperators = new Set(['+', '*', '/', '%']);
const binaryOperators = new Set([   '+' , '+=' , '-=', '*' , '/' , '%'  , '<' , '<=',
                                // '==', '===', '>' , '>=', '!=', '!==', '&&', '||', 'and', 'or', 'not']);
                                '==', '===', '>' , '>=', '!=', '!==', '&&', '||' ]);

const postfixUnaryOperators = new Set(['++', '--']);
const prefixUnaryOperators = new Set(['-', '!']);
// const prefixUnaryOperators = new Set(['-', '!', 'not']);

const componentStartSymbols = new Set(['-', '!', '(', '[', '{', '#', '@']);
// const componentStartSymbols = new Set(['-', '!', '(', '[', '{', '#', '@', 'not']);

const otherSymbols = new Set(['.', '#', ',']);

const noSpaceBefore = new Set(['@', ',', ']', '[']);

let allConstants = [];
for (const inline of inline_func) {
    if (inline[0] === 'constants') {
        allConstants = JSON.parse(JSON.stringify(inline[1]));
    }
}
const specialVars = new Set(['undefined', 'null', 'Infinity', 'true', 'false', 'True', 'False', 'None'].concat(allConstants));
const constantSet = new Set(allConstants);

const reservedWords = [
    'abstract', 'arguments', 'await', 'boolean',
    'break', 'byte', 'case', 'catch',
    'char', 'class', 'const', 'continue',
    'debugger', 'default', 'delete', 'do',
    'double', 'else', 'enum', 'eval',
    'export', 'extends', 'False', 'final',
    'finally', 'float', 'for', 'function',
    'goto', 'if', 'implements', 'import',
    'in', 'instanceof', 'int', 'interface',
    'let', 'long', 'native', 'new',
    'null', 'package', 'private', 'protected',
    'public', 'return', 'short', 'static',
    'super', 'switch', 'synchronized', 'this',
    'throw', 'throws', 'transient', 'true',
    'try', 'typeof', 'var', 'void',
    'volatile', 'while', 'with', 'yield',

    'Array', 'Date', 'hasOwnProperty', 'Infinity',
    'isFinite', 'isNaN', 'isPrototypeOf', 'length',
    'Math', 'NaN', 'name', 'Number', 'Object',
    'prototype', 'String', 'toString', 'undefined', 'valueOf',

    'pythonList', 'JSON', 'stringify', 'parse'
];
const reservedWordsSet = new Set(reservedWords);

const varStartSymbols = new Set(['#', '@', '?']);

const mathFuncs = [];
for (const funcMod of inline_func) {
    for (const func of funcMod[1]) {
        if (typeof func === 'string') {
            mathFuncs.push(func.split('(')[0]);
        } else {
            mathFuncs.push(func[0].split('(')[0]);
        }
    }
}


let globals = [];

export function updateGlobals(startNode: INode) {
    globals = [];
    for (let i = startNode.procedure.length - 1; i > -1; i-- ) {
        const prod = startNode.procedure[i];
        if (prod.type !== ProcedureTypes.Constant || !prod.args[0].value) { return; }
        prod.args[0].value = prod.args[0].value.toUpperCase();
        globals.push(prod.args[0].value);
        prod.args[0].jsValue = prod.args[0].value + '_';
    }
}

export function modifyVar(procedure: IProcedure, nodeProdList: IProcedure[]) {
    procedure.variable = null;
    if (!procedure.args[0].value) { return; }

    procedure.args[0].value = modifyVarArg(procedure.args[0]).trim();
    const modifiedVar = parseVariable(procedure.args[0].value);
    procedure.args[0].jsValue = modifiedVar.jsStr;
    if (modifiedVar.jsStr && modifiedVar.jsStr.startsWith('__modules__')) {
        procedure.args[0].invalidVar = `Error: Invalid query call: "${procedure.args[0].value}"`;
        return;
    }
    if (modifiedVar.valueStr) {
        procedure.args[0].value = modifiedVar.valueStr.trim();
    }

    if (modifiedVar.error) {
        procedure.args[0].invalidVar = modifiedVar.error;
        return;
    }
    if (modifiedVar.declaredVar) {
        procedure.variable = modifiedVar.declaredVar;
        if (globals.indexOf(procedure.variable) !== -1) {
            procedure.args[0].invalidVar = `Error: Variable shadowing global constant: ${procedure.variable}`;
            return;
        }
    }
    if (modifiedVar.usedVars) {
        const result = checkValidVar(modifiedVar.usedVars, procedure, nodeProdList);
        if (!result.error) {
            procedure.args[0].usedVars = result.vars;
        } else {
            procedure.args[0].invalidVar = result.error;
            return;
        }
    }
    procedure.args[0].invalidVar = false;
}

export function modifyLocalFuncVar(procedure: IProcedure, nodeProdList: IProcedure[]) {
    procedure.variable = null;
    if (!procedure.args[0].value) { return; }
    if (!procedure.meta) {
        procedure.meta = {
            'name': '',
            'module': '',
            'otherInfo': {
                'prev_name': procedure.args[0].value,
                'num_returns': null
            }
        };
    } else if (!procedure.meta.otherInfo) {
        procedure.meta.otherInfo = {
            'prev_name': procedure.args[0].value,
            'num_returns': null
        };
    }
    procedure.meta.otherInfo.num_returns = findLocalFuncNumReturns(procedure.children);

    const declaredVars = [];
    let argToLower = false;
    procedure.args.forEach(arg => {
        if (!arg.value) { return; }
        arg.value = modifyVarArg(arg, argToLower).replace(/[\@\#\?]/g, '_');
        argToLower = true;
        arg.jsValue = arg.value + '_';
        if (arg.name === 'func_name') { return; }
        arg.usedVars = [arg.value];

        const existingCheck = declaredVars.indexOf(arg.value);
        if (existingCheck !== -1) {
            arg.invalidVar = `Error: Argument name "${arg.value}" already exists`;
            procedure.args[existingCheck + 1].invalidVar = `Error: Argument name "${arg.value}" already exists`;
        }
        declaredVars.push(arg.value);
    });
    for (const prod of nodeProdList) {
        if (prod.ID === procedure.ID) {
            continue;
        }
        if (prod.type === ProcedureTypes.LocalFuncDef && procedure.args[0].value === prod.args[0].value) {
            procedure.args[0].invalidVar = `Error: Function name "${procedure.args[0].value}" already exists`;
            return;
        }
    }
    updateLocalFuncProperties(nodeProdList, procedure.meta.otherInfo, procedure.args);
    procedure.args[0].invalidVar = false;
    procedure.meta.otherInfo.prev_name = procedure.args[0].value;
}

function findLocalFuncNumReturns(procedureList: IProcedure[]): number {
    let num_returns = 0;
    for (const prod of procedureList) {
        if (prod.type === ProcedureTypes.Return && prod.enabled) {
            num_returns ++;
        }
        if (prod.children) {
            num_returns += findLocalFuncNumReturns(prod.children);
        }
    }
    return num_returns;
}

function updateLocalFuncProperties(prodList: IProcedure[],
                                   oldFuncInfo: {'prev_name': string, 'num_returns': number},
                                   newFuncArgs: IArgument[]) {
    for (const prod of prodList) {
        if (prod.children) {
            updateLocalFuncProperties(prod.children, oldFuncInfo, newFuncArgs);
            continue;
        }
        if (prod.type === ProcedureTypes.LocalFuncCall && prod.meta.name === oldFuncInfo.prev_name) {

            if (oldFuncInfo.num_returns > 0 && prod.args[0].name === '__none__') {
                prod.args[0].name = 'var_name';
            } else if (oldFuncInfo.num_returns === 0 && prod.args[0].name === 'var_name') {
                prod.args[0].name = '__none__';
            }
            prod.meta.name = newFuncArgs[0].value;
            let i = 1;
            for (; i < newFuncArgs.length; i++) {
                if (i >= prod.args.length) {
                    prod.args.push(<IArgument> {
                        'name': 'arg_' + prod.argCount,
                        'value': '',
                        'jsValue': '',
                        'usedVars': [],
                        'linked': false,
                        'invalidVar': false
                    });
                    prod.argCount++;
                    continue;
                }
                prod.args[i].name = newFuncArgs[i].value;
            }
            while (i < prod.argCount - 1) {
                prod.args.pop();
                prod.argCount--;
            }
        }
    }
}


export function modifyVarArg(arg: IArgument, toLower = true) {
    let str = arg.value.trim();
    const repSplit = str.split(/\[/g);
    let bracketCount = -1;
    for (let i = 0; i < repSplit.length; i++) {
        bracketCount += 1;
        repSplit[i] = repSplit[i].split(/\]/g);
        bracketCount -= repSplit[i].length - 1;
        if (bracketCount === 0) {
            repSplit[i][repSplit[i].length - 1] = repSplit[i][repSplit[i].length - 1].replace(/ /g, '_');
            if (toLower) {
                repSplit[i][repSplit[i].length - 1] = repSplit[i][repSplit[i].length - 1].toLowerCase();
            }
        } else if (bracketCount < 0) {
            throw(new Error('Error: bracket closed before opening'));
        }
    }
    str = repSplit.map(splt => splt.join(']')).join('[');

    if ((str.match(/\[/g) || []).length !== (str.match(/\]/g) || []).length) {
        arg.invalidVar = 'Error: Invalid variable name';
        return str;
    }
    const strSplit = str.split(/[\@\[\]]/g);
    let teststr = str;
    for (const i of strSplit) {
        if (i === '') { continue; }
        if (i === '0' || Number(i)) {
            const sStr = `[${i}]`;
            const ind = teststr.indexOf(sStr);
            if (ind === -1) {
                arg.invalidVar = 'Error: Invalid variable name - cannot be a number';
                return str;
            }
            teststr = teststr.slice(0, ind) + teststr.slice(ind + sStr.length);
            continue;
        }
        try {
            if (i[0] === '_') {
                arg.invalidVar = 'Error: Invalid variable name - cannot start variable name with "_"';
                return str;
            }
            for (const reserved of reservedWords) {
                if (i === reserved) {
                    arg.invalidVar = 'Error: Invalid variable name - reserved word';
                    return str;
                }
            }
            for (const funcName of mathFuncs) {
                if (i === funcName) {
                    arg.invalidVar = 'Error: Invalid variable name - existing math function name';
                    return str;
                }
            }
            let currentWindow;
            if (window.hasOwnProperty(i)) {
                currentWindow = window[i];
            }
            const fn = new Function('', `${i}=1;`);
            fn();
            delete window[i];
            if (currentWindow) {
                window[i] = currentWindow;
            }

            arg.invalidVar = false;
        } catch (ex) {
            arg.invalidVar = 'Error: Invalid variable name';
            return str;
        }
    }
    return str;
}

export function modifyArgument(procedure: IProcedure, argIndex: number, nodeProdList: IProcedure[]) {
    procedure.args[argIndex].usedVars = [];
    if (!procedure.args[argIndex].value || procedure.args[argIndex].value === '"___LONG_STRING_DATA___"') { return; }
    // PARSER CALL
    let varResult = parseArgument(procedure.args[argIndex].value);
    if (varResult.error) {
        procedure.args[argIndex].invalidVar = varResult.error;
        return;
    }
    procedure.args[argIndex].value = varResult.str;
    procedure.args[argIndex].jsValue = varResult.jsStr;
    varResult = checkValidVar(varResult.vars, procedure, nodeProdList);
    if (!varResult.error) {
        procedure.args[argIndex].usedVars = varResult.vars;
        procedure.args[argIndex].invalidVar = false;
    } else {
        procedure.args[argIndex].invalidVar = varResult.error;
    }

    // const comps = splitComponents(procedure.args[argIndex].jsValue);
    // console.log('\n\n',procedure.args[argIndex].jsValue)
    // if (typeof comps === 'string') {
    //     return;
    // }
    // for (let i = 0; i < comps.length; i ++) {
    //     const comp = comps[i];
    //     if (comp.type === strType.OTHER && comp.value === ';' || comp.value === '=') {
    //         console.log('  .......', comp.value)
    //     }
    //     if (comp.type === strType.VAR && comp.value[comp.value.length - 1] !== '_') {
    //         console.log('  _',comp.value)
    //         console.log('    keyword1:', specialVars.has(comps[i].value))
    //         console.log('    keyword2:', reservedWordsSet.has(comps[i].value))
    //         if (i > 0) {
    //             console.log('    previous:', comps[i - 1].value)
    //         }
    //     }
    // }

    // REGEX CALL
    // const vals = procedure.args[argIndex].value.split('"');
    // let result = '';
    // let startOnEven = true;
    // for (let i = 0; i < vals.length; i += 2) {
    //     if (i > 0) {
    //         if (startOnEven) {
    //             result += ' "' + vals[i - 1] + '" ';
    //         } else {
    //             result += '"' + vals[i - 1] + '"';
    //         }
    //     }
    //     const valSplit = vals[i].split(`'`);
    //     for (let j = startOnEven ? 0 : 1; j < valSplit.length; j += 2) {
    //         if (j === 1) {
    //             result += valSplit[0] + `' `;
    //         } else if (j > 1) {
    //             result += ` '` + valSplit[j - 1] + `' `;
    //         }
    //         result += valSplit[j].replace(
    //             /\s*([\[\]])\s*/g, '$1').replace(
    //             /([\+\-\*\/\%\{\}\(\)\,\<\>\=\!])/g, ' $1 ')
    //             .replace(/([\<\>\=\!])\s+=/g, '$1=')
    //             .trim().replace(/\s{2,}/g, ' ');
    //         if (j === valSplit.length - 2 ) {
    //             result += ` '` + valSplit[j + 1];
    //         }
    //     }
    //     if (valSplit.length % 2 === 0) {
    //         startOnEven = !startOnEven;
    //     }

    //     if (i === vals.length - 2 ) {
    //         result += ' "' + vals[i + 1] + '" ';
    //     }
    // }
    // procedure.args[argIndex].value = result.trim();
}

// VAR INPUT
export function parseVariable(value: string): {'error'?: string, 'declaredVar'?: string, 
                                               'usedVars'?: string[], 'jsStr'?: string, 'valueStr'?: string} {

    const str = value.trim();
    const comps = splitComponents(str);
    if (typeof comps === 'string') {
        return {'error': comps};
    }

    if (comps[0].value === '.') {
        return {'error': 'Error: Invalid "."'};
    }
    if ((comps[0].value === '@' || comps[0].value === '#' || comps[0].value === '?')) {
        let i = 1;
        if (comps[0].value === '?') {
            if (comps[1].value !== '@') {
                return {'error': 'Error: Expect "@" name after "?"'};
            }
            i = 2;
        }
        if ( i >= comps.length || comps[i].type !== strType.VAR) {
            return {'error': 'Error: Expect attribute name after "' + comps[0].value + '"'};
        }
        const usedVars = [];
        const result = analyzeQuery(comps, 0, usedVars, '', '', true);
        if (result.error) { return result; }
        return {'usedVars': usedVars, 'jsStr': result.jsStr.trim()};
    }

    if (comps[0].type !== strType.VAR) {
        if (comps[0].value === '[') {
            let newString = ``;
            let jsString = ``;

            const usedVars = [];
            let result = analyzeArray(comps, 1, usedVars);
            if (result.error) { return result; }
            if (result.i + 1 >= comps.length || comps[result.i + 1].value !== ']') {
                return {'error': 'Error: Closing Bracket "]" expected\n' +
                `at: ... ${comps.slice(result.i + 1).map(cp => cp.value).join(' ')}`};
            }
            const i = result.i + 2;
            newString += `[${result.str}]`;
            jsString += `[${result.jsStr}]`;
            if (i >= comps.length || comps[i].value !== '@') {
                return {'error': `Error: Expect @ after an array in variable input`};
            }
            result = analyzeQuery(comps, i, usedVars, newString, jsString, true);
            if (result.error) { return result; }
            newString = result.str;
            jsString = result.jsStr;
            return {'usedVars': usedVars, 'jsStr': jsString.trim(), 'valueStr': newString};
        } else {
            return {'error': `Error: Expect a Variable at the start of the input`};
        }
    }
    if (comps.length === 1) {
        return {'declaredVar': comps[0].value, 'jsStr': value + '_'};
    }
    const vars = [];
    const check = analyzeVar(comps, 0, vars, false, true);

    if (check.error) {
        console.log(check.error, '\n', str);
        return check;
    }
    if (check.i !== comps.length - 1) {
        console.log('..... Var', check.i, comps.length);
        return {'error': `Error: Invalid "${comps[check.i + 1].value}"` +
        `at: ... ${comps.slice(check.i + 1).map(cp => cp.value).join(' ')}`};
    }
    return {'usedVars': vars, 'jsStr': check.jsStr.trim()};

}


// NEW ARGUMENT INPUT
export function parseArgument(str: string): {'error'?: string, 'vars'?: string[], 'str'?: string, 'jsStr'?: string} {
    const comps = splitComponents(str);
    if (typeof comps === 'string') {
        return {'error': comps};
    }
    let vars: string[] = [];
    let newString = '';
    let jsString = '';
    const check = analyzeComp(comps, 0, vars);
    if (check.error) {
        console.log(check.error, '\n', str);
        return check;
    }
    newString += check.str;
    jsString += check.jsStr;
    if (check.i !== comps.length - 1) {
        if (comps[check.i + 1].value === ',') {
            const newComps = JSON.parse(JSON.stringify(comps));
            newComps.unshift({'type': strType.OTHER, 'value': '['});
            newComps.push({'type': strType.OTHER, 'value': ']'});
            vars = [];
            const checkTest = analyzeComp(newComps, 0, vars);
            if (!checkTest.error) {
                return {'vars': vars, 'str': checkTest.str.trim(), 'jsStr': checkTest.jsStr.trim()};
            }
        } else if (comps[check.i + 1].value === ':') {
            const newComps = JSON.parse(JSON.stringify(comps));
            newComps.unshift({'type': strType.OTHER, 'value': '{'});
            newComps.push({'type': strType.OTHER, 'value': '}'});
            vars = [];
            const checkTest = analyzeComp(newComps, 0, vars);
            if (!checkTest.error) {
                return {'vars': vars, 'str': checkTest.str.trim(), 'jsStr': checkTest.jsStr.trim()};
            }
        }
        return {'error': `Error: Invalid "${comps[check.i + 1].value}"` +
        `at: ... ${comps.slice(check.i + 1).map(cp => cp.value).join(' ')}`};
    }
    return {'vars': vars, 'str': newString.trim(), 'jsStr': jsString.trim()};
}

function analyzeComp(comps: {'type': strType, 'value': string}[], i: number, vars: string[],
                    noSpace?: boolean, expressionType?: string):
                {'error'?: string, 'i'?: number, 'value'?: number, 'str'?: string, 'jsStr'?: string} {
    let newString = '';
    let jsString = '';
    // if variable ==> go to analyzeVar
    if (comps[i].type === strType.VAR) {
        const result = analyzeVar(comps, i, vars, false);
        if (result.error) { return result; }
        i = result.i;
        newString += result.str;
        jsString += result.jsStr;

    // if number/string ==> basic
    } else if (comps[i].type === strType.NUM) {
        newString += comps[i].value;
        jsString += comps[i].value;

    } else if (comps[i].type === strType.STR) {
        if (comps[i].value.length > 1000) {
            newString += '"___LONG_STRING_DATA___"';
            jsString += comps[i].value;
        } else {
            newString += comps[i].value;
            jsString += comps[i].value;
        }
        if (i + 1 < comps.length && comps[i + 1].value === '[') {
            const bResult = analyzePythonSlicing(comps, i + 1, vars, jsString, false);
            if (bResult.error) { return bResult; }
            newString += bResult.str;
            jsString +=  bResult.jsStr;
            // arrayName = bResult.arrayName;
            i = bResult.i;
        }
    // if "-" or "!" or "not" ==> add the operator then analyzeComp the next
    } else if (prefixUnaryOperators.has(comps[i].value)) {
        newString += comps[i].value; //////////
        jsString += comps[i].value; //////////

        // if (comps[i].value === 'not') {
        //     newString += 'not '; //////////
        //     jsString += '!'; //////////
        // } else {
        //     newString += comps[i].value; //////////
        //     jsString += comps[i].value; //////////
        // }

        if (i + 1 === comps.length) {
            return {'error': 'Error: Expressions expected after "-"\n' +
            `at: ... ${comps.slice(i).map(cp => cp.value).join(' ')}`};
        }
        const result = analyzeComp(comps, i + 1, vars);
        if (result.error) { return result; }
        i = result.i;
        newString += result.str;
        jsString += result.jsStr;

    // if '(' ==> calculation ==> analyze comp (first component inside the bracket)
    } else if (comps[i].value === '(') {
        if (i + 1 === comps.length) {
            return {'error': 'Error: Expressions expected after "("\n' +
            `at: ... ${comps.slice(i).map(cp => cp.value).join(' ')}`};
        }
        const result = analyzeComp(comps, i + 1, vars);
        if (result.error) { return result; }
        if (result.i + 1 >= comps.length || comps[result.i + 1].value !== ')') {
            return {'error': 'Error: Closing Bracket ")" expected\n' +
            `at: ... ${comps.slice(result.i + 1).map(cp => cp.value).join(' ')}`};
        }
        i = result.i + 1;
        newString += `(${result.str})`; //////////
        jsString += `(${result.jsStr})`; //////////
        if (i + 1 < comps.length && comps[i + 1].value === '[') {
            // look for all subsequent "." or "[]" for the variable
            // e.g. a[:][0].b.x[-1]
            while (i + 1 < comps.length && comps[i + 1].value === '[') {
                const bResult = analyzePythonSlicing(comps, i + 1, vars, jsString, false);
                if (bResult.error) { return bResult; }
                newString += bResult.str;
                jsString +=  bResult.jsStr;
                // arrayName = bResult.arrayName;
                i = bResult.i;
            }
        }
    // if '[' ==> array
    } else if (comps[i].value === '[') {
        if (comps[i + 1].value === ']') {
            newString += `[]`;
            jsString += `[]`;
            i += 1;
        } else {
            const result = analyzeArray(comps, i + 1, vars);
            if (result.error) { return result; }
            if (result.i + 1 >= comps.length || comps[result.i + 1].value !== ']') {
                return {'error': 'Error: Closing Bracket "]" expected\n' +
                `at: ... ${comps.slice(result.i + 1).map(cp => cp.value).join(' ')}`};
            }
            i = result.i + 1;
            newString += `[${result.str}]`;
            jsString += `[${result.jsStr}]`;
            // let arrayName = jsString;
            while (i + 1 < comps.length && comps[i + 1].value === '[') {
                const result2 = analyzePythonSlicing(comps, i + 1, vars, jsString, false);
                if (result2.error) { return result2; }
                newString += result2.str;
                jsString += result2.jsStr;
                // arrayName = result2.arrayName;
                i = result2.i;
            }
        }
    // if '{' ==> JSON
    } else if (comps[i].value === '{') {
        const result = analyzeJSON(comps, i + 1, vars);
        if (result.error) { return result; }
        if (result.i + 1 >= comps.length || comps[result.i + 1].value !== '}') {
            return {'error': 'Error: Closing Bracket "}" expected\n' +
            `at: ... ${comps.slice(result.i + 1).map(cp => cp.value).join(' ')}`};
        }
        i = result.i + 1;
        newString += `{${result.str}}`; //////////
        jsString += `{${result.jsStr}}`; //////////

        while (i + 1 < comps.length && comps[i + 1].value === '[') {
            const result2 = analyzeComp(comps, i + 2, vars);
            // const result2 = analyzePythonSlicing(comps, i + 1, vars, jsString, false);
            if (result2.error) { return result2; }
            newString += '[' + result2.str + ']';
            jsString += '[' + result2.jsStr + ']';
            // arrayName = result2.arrayName;
            i = result2.i + 1;
            if (i >= comps.length || comps[i].value !== ']') {
                return {'error': 'Error: Closing Square Bracket "]" expected\n' +
                `at: ... ${comps.slice(i).map(cp => cp.value).join(' ')}`};
            }
        }

    // if "@"/"#"/"?" ==> query
    } else if (comps[i].value === '@' || comps[i].value === '#' || comps[i].value === '?') {
        const result = analyzeQuery(comps, i, vars, '', '');
        if (result.error) { return result; }
        i = result.i;
        newString = result.str;
        jsString = result.jsStr;
        // return {'i': i, 'str': result.str, 'jsStr': result.jsStr};
    } else { return {'i': i, 'str': newString, 'jsStr': jsString}; }

    if (i + 1 >= comps.length) { return {'i': i, 'str': newString, 'jsStr': jsString}; }

    let nextComp = comps[i + 1];
    // if the next component is '++' or '--', add it in and continue to the next one
    if (postfixUnaryOperators.has(nextComp.value)) {
        newString += nextComp.value;
        jsString += nextComp.value;
        i += 1;
        if (i === comps.length) { return {'i': i, 'str': newString, 'jsStr': jsString}; }
        nextComp = comps[i + 1];
    }

    // if it is in an expression or array, return here
    if ((expressionType === 'array' && nextComp.value === ',') || expressionType === 'expr') {
        return {'i': i, 'str': newString, 'jsStr': jsString};
    }

    // if next comp is Variable/String/Number, not allowed
    if (nextComp.type !== strType.OTHER) {
        return {'error': 'Error: Variable/String/Number after Variable/String/Number\n' +
                `at: ... ${comps.slice(i - 1).map(cp => cp.value).join(' ')}`};
    }

    // if next comp is "," or ")" or "]" or "}", return
    if (nextComp.value === ',' || nextComp.value === ')' || nextComp.value === ']' || nextComp.value === '}') {
        return {'i': i, 'str': newString, 'jsStr': jsString};

    // if next comp is '-' or any other binary operators, continue to analyzeExpression
    } else if (nextComp.value === '-' || binaryOperators.has(nextComp.value)) {
        const result = analyzeExpression(comps, i + 1, vars);
        if (result.error) { return result; }
        i = result.i;
        if (newString[newString.length - 1] === ' ' && result.str[0] === ' ') {
            newString += result.str.substring(1);
            jsString += result.jsStr.substring(1);
        } else {
            newString += result.str;
            jsString += result.jsStr;
        }
    }
    return {'i': i, 'str': newString, 'jsStr': jsString};
}

function analyzeVar(comps: {'type': strType, 'value': string}[], i: number, vars: string[],
                    disallowAt: boolean, isVariable = false):
                    {'error'?: string, 'i'?: number, 'value'?: number, 'str'?: string, 'jsStr'?: string} {
    const comp = comps[i];

    if (globals.indexOf(comp.value.toUpperCase()) !== -1) {
        comp.value = comp.value.toUpperCase();
    }

    let newString = comp.value;
    let jsString = comp.value;


    // if (comp.value === 'and') {
    //     return {'i': i + 1, 'str': 'and', 'jsStr': '&&'};
    // } else if (comp.value === 'or') {
    //     return {'i': i + 1, 'str': 'or', 'jsStr': '||'};
    // } else if (comp.value === 'True') {
    //     jsString = 'true';
    // } else if (comp.value === 'False') {
    //     jsString = 'false';
    // } else if (comp.value === 'true') {
    //     newString = 'True';
    // } else if (comp.value === 'false') {
    //     newString = 'False';
    // } else if (comp.value === 'null') {
    //     newString = 'None';
    // } else if (comp.value === 'None') {
    //     jsString = 'null';
    // }

    if (constantSet.has(comp.value)) {
        jsString = `JSON.parse(JSON.stringify(${comp.value}))`;
    } else if (!disallowAt && !specialVars.has(comp.value)) {
        jsString += '_';
    }

    // if variable is the last component
    // add the variable to the var list
    if (i + 1 === comps.length) {
        if (!disallowAt) {
            addVars(vars, comp.value);
        }
        return {'i': i, 'str': newString, 'jsStr': jsString};
    }
    // if variable is followed immediately by another var/num/str --> not allowed
    if ( comps[i + 1].type !== strType.OTHER) {
        // if (comps[i + 1].value === 'and' || comps[i + 1].value === 'or') {
        //     return {'i': i + 1, 'str': newString, 'jsStr': jsString};
        // }
        return { 'error': 'Error: Variable followed by another variable/number/string \n' +
        `at: ... ${comps.slice(i).map(cp => cp.value).join(' ')}`};
    } else if ( comps[i + 1].value === '.') {
            return {'error': 'Error: Invalid "."'};
    // if variable is followed by "[" --> array/json
    // add the variable to var list and check for validity of the first component inside the bracket
    } else if (comps[i + 1].value === '[' || comps[i + 1].value === '.') {
        if (!disallowAt) {
            addVars(vars, comp.value);
        }

        // let arrayName = jsString;

        // look for all subsequent "." or "[]" for the variable
        // e.g. a[:][0].b.x[-1]
        while (i + 1 < comps.length && (comps[i + 1].value === '[' || comps[i + 1].value === '.')) {

            if (comps[i + 1].value === '[') {
                const result = analyzePythonSlicing(comps, i + 1, vars, jsString, isVariable);
                if (result.error) { return result; }
                newString += result.str;
                jsString +=  result.jsStr;
                // arrayName = result.arrayName;
                i = result.i;

            } else {
                i = i + 2;
                if (comps[i].type !== strType.VAR) {
                    return { 'error': `Error: attribute name expected \n
                    at: ... ${comps.slice(i).map(cp => cp.value).join(' ')}`};
                }
                newString += '.' + comps[i].value;
                jsString += '.' + comps[i].value;
                // arrayName += '.' + comps[i].value;
            }
        }

    // if variable is followed by "(" --> function
    // does not add to the var list since it's function name
    } else if (comps[i + 1].value === '(') {
        jsString = jsString.slice(0, -1);
        if (i + 2 >= comps.length) {
            return { 'error': `Error: ")" expected \nat: ... ${comps.slice(i).map(cp => cp.value).join(' ')}`};
        }
        if (comps[i + 2].value === ')') {
            i++;
            newString += '()';
            jsString += '(true)';
        } else {
            const result = analyzeArray(comps, i + 2, vars, true);
            if (result.error) { return result; }
            if (result.i + 1 >= comps.length || comps[result.i + 1].value !== ')') {
                return { 'error': `Error: ")" expected \nat: ... ${comps.slice(i).map(cp => cp.value).join(' ')}`}; }
            i = result.i + 1;
            newString += `(${result.str})`;
            jsString += `(__debug__, ${result.jsStr})`;

            if (i + 1 < comps.length && comps[i + 1].value === '[') {
                // look for all subsequent "." or "[]" for the variable
                // e.g. a[:][0].b.x[-1]
                while (i + 1 < comps.length && (comps[i + 1].value === '[')) {
                    if (comps[i + 1].value === '[') {
                        const sliceresult = analyzePythonSlicing(comps, i + 1, vars, jsString, isVariable);
                        if (sliceresult.error) { return sliceresult; }
                        newString += sliceresult.str;
                        jsString +=  sliceresult.jsStr;
                        // arrayName = sliceresult.arrayName;
                        i = sliceresult.i;
                    }
                }
            }
            return {'i': i, 'str': newString, 'jsStr': jsString};
        }
    // if variable is followed by "{" --> not allowed
    } else if (comps[i + 1].value === '{') {
        return { 'error': 'Error: Variable followed by "{" \n' +
        `at: ... ${comps.slice(i).map(cp => cp.value).join(' ')}`};

    // // if variable is followed by "#" / "." / ")" / "]" / "}"
    // } else if (otherSymbols.has(comps[i + 1].value) ||
    //            comps[i + 1].value === ')' ||
    //            comps[i + 1].value === ']' ||
    //            comps[i + 1].value === '}') {
    //     if (comps[i + 1].value === '#') {
    //         return { 'error': `Error: Variable followed by "${comps[i + 1].value}" \n` +
    //         `at: ... ${comps.slice(i).map(cp => cp.value).join(' ')}`};
    //     }
    //     addVars(vars, comp.value);
    //     i += 1;

    // all other cases
    } else if (!disallowAt) {
        addVars(vars, comp.value);
    }

    if (!disallowAt && i + 1 < comps.length && (comps[i + 1].value === '@' || comps[i + 1].value === '#' || comps[i + 1].value === '?')) {
        const result = analyzeQuery(comps, i + 1, vars, newString, jsString, isVariable);
        if (result.error) { return result; }
        i = result.i;
        newString = result.str;
        jsString = result.jsStr;
    }
    return {'i': i, 'str': newString, 'jsStr': jsString};
}

function analyzeArray(comps: {'type': strType, 'value': string}[], i: number, vars: string[], acceptFunc = false):
                {'error'?: string, 'i'?: number, 'value'?: number, 'str'?: string, 'jsStr'?: string} {
    if (comps[i].type === strType.OTHER && !componentStartSymbols.has(comps[i].value)) {
        if (comps[i].value === ',') {
            return {'error': `Error: Unexpected Token "," at: ... ${comps.slice(i).map(cp => cp.value).join(' ')}`};
        }
        return {'i': i, 'str': '', 'jsStr': ''};
    }
    const firstComp = analyzeComp(comps, i, vars, false, 'array');
    if (firstComp.error) { return firstComp; }
    if (firstComp.str === '') {
        i = firstComp.i;
    } else {
        i = firstComp.i + 1;
    }
    let newString = firstComp.str;
    let jsString = firstComp.jsStr;
    while (i < comps.length && comps[i].value === ',') {
        // if (i + 1 < comps.length && comps[i + 1].value === ',') {return { 'error': `Error: Unexpected Token ","`}; }
        newString += comps[i].value;
        jsString += comps[i].value;
        if (i + 1 >= comps.length) { return { 'error': `Error: "]" expected`}; }
        const result = analyzeComp(comps, i + 1, vars, false, 'array');
        if (result.error) { return result; }
        // if (result.str === '') { i = result.i; continue; }
        if (result.str === '') {
            return {'error': `Error: Unexpected Token "," at: ... ${comps.slice(i).map(cp => cp.value).join(' ')}`};
        }
        i = result.i + 1;
        if (i >= comps.length) { break; }
        if (result.str[0] !== ' ') {
            newString += ' ';
            jsString += ' ';
        }
        if (acceptFunc && comps[i].value === '=>') {
            const varIndex = vars.indexOf(result.str);
            if (varIndex !== -1) {
                vars.splice(varIndex, 1);
            }
            newString += result.str + ' => ';
            jsString += result.str + ' => ';
            i = result.i + 2;
            let bracketCount = 0;
            while (bracketCount > 0 || (comps[i].value !== ')' && comps[i].value !== ',')) {
                if (comps[i].value !== '(' || comps[i].value !== '[' || comps[i].value !== '{') {
                    bracketCount++;
                }
                if (comps[i].value !== ')' || comps[i].value !== ']' || comps[i].value !== '}') {
                    bracketCount--;
                }
                newString += comps[i].value;
                jsString += comps[i].value;
                i++;
            }
            newString = newString.trim();
            jsString = jsString.trim();
            continue;
        }
        newString += result.str;
        jsString += result.jsStr;
    }
    return {'i': i - 1, 'str': newString, 'jsStr': jsString};
}


function analyzeJSON(comps: {'type': strType, 'value': string}[], i: number, vars: string[]):
                {'error'?: string, 'i'?: number, 'value'?: number, 'str'?: string, 'jsStr'?: string} {
    if (comps[i].type !== strType.STR) {
        if (comps[i].value === '}') {
            return {'i': i - 1, 'str': '', 'jsStr': ''};
        }
        return {'i': i, 'str': '', 'jsStr': ''};
    }
    let newString = comps[i].value;
    let jsString = comps[i].value;

    if (comps[i + 1].value !== ':') {
        return {'error': 'Error: ":" expected\n' +
        `at: ... ${comps.slice(i + 1).map(cp => cp.value).join(' ')}`};
    }
    newString += ':';
    jsString += ':';

    const firstComp = analyzeComp(comps, i + 2, vars, false, 'array');
    if (firstComp.error) { return firstComp; }
    if (firstComp.str === '') {
        return {'error': 'Error: Expression expected after ":"'};
    }
    if (firstComp.str[0] !== ' ') {
        newString += ' ';
        jsString += ' ';
    }
    newString += firstComp.str;
    jsString += firstComp.jsStr;

    i = firstComp.i + 1;

    while (i < comps.length && comps[i].value === ',') {
        newString += comps[i].value;
        jsString += comps[i].value;
        if (comps[i + 1].type !== strType.STR) {
            return {'error': 'Error: key name expected after ","'};
        }
        newString += comps[i + 1].value;
        jsString += comps[i + 1].value;

        if (comps[i + 2].value !== ':') {
            return {'error': 'Error: ":" expected\n' +
            `at: ... ${comps.slice(i + 2).map(cp => cp.value).join(' ')}`};
        }
        newString += ':';
        jsString += ':';
        const result = analyzeComp(comps, i + 3, vars, false, 'array');
        if (result.error) { return firstComp; }
        if (result.str === '') {
            return {'error': 'Error: Expression expected after ":"'};
        }
        if (result.str[0] !== ' ') {
            newString += ' ';
            jsString += ' ';
        }
        newString += result.str;
        jsString += result.jsStr;

        i = result.i + 1;
    }

    return {'i': i - 1, 'str': newString, 'jsStr': jsString};
}

function analyzeQuery(comps: {'type': strType, 'value': string}[],
                      i: number, vars: string[], startStr: string, startJS: string, isVariable?: boolean):
                    {'error'?: string, 'i'?: number, 'str'?: string, 'jsStr'?: string} {
    let newString = startStr;
    let jsString = startJS;

    while (true) {
        if (comps[i].value === '@') {
            if (isVariable) {
                const attrbVar = analyzeVar(comps, i + 1, vars, true, false);
                if (attrbVar.error) { return attrbVar; }
                i = attrbVar.i;
                newString = ' ' + newString + '@' + attrbVar.str.replace(/ /g, '') + ' '; //////////
                jsString = ' ' + jsString + '@' + attrbVar.jsStr + ' '; //////////
                return {'i': i, 'str': newString, 'jsStr': jsString};
            }
            if (i + 1 === comps.length || comps[i + 1].type !== strType.VAR) {
                return {'error': 'Error: Attribute name expected after "@"\n' +
                `at: ... ${comps.slice(i).map(cp => cp.value).join(' ')}`};
            }
            const result = analyzeVar(comps, i + 1, vars, true);
            if (result.error) { return result; }
            i = result.i;


            let entity = jsString;
            if (newString === '') {
                entity = 'null';
            }
            newString += '@' + result.str.replace(/ /g, '') + ' '; //////////

            let bracketIndex = result.jsStr.indexOf('[pythonList(');
            if (bracketIndex !== -1) {
                const arrayName = result.jsStr.substring(0, bracketIndex);
                const index = result.jsStr.lastIndexOf(arrayName);
                jsString = ` __modules__.${_parameterTypes.getattrib}(__params__.model, ${entity},` +
                           ` ['${arrayName}', ${result.jsStr.substring(bracketIndex + 12, index - 2)}])`;
                // jsString = ` __modules__.${_parameterTypes.getattrib}(__params__.model, ${entity},` +
                //            ` '${arrayName}', ${result.jsStr.substring(bracketIndex + 12, index - 2)})`;
            } else if (result.jsStr.indexOf('[') !== -1) {
                bracketIndex = result.jsStr.indexOf('[');
                const arrayName = result.jsStr.substring(0, bracketIndex);
                const index = result.jsStr.slice(bracketIndex + 1, -1);
                jsString = ` __modules__.${_parameterTypes.getattrib}(__params__.model, ${entity}, ['${arrayName}', ${index}])`;
                // jsString = ` __modules__.${_parameterTypes.getattrib}(__params__.model, ${entity}, '${arrayName}', ${index})`; //////////
            } else {
                jsString = ` __modules__.${_parameterTypes.getattrib}(__params__.model, ${entity}, '${result.str}')`;
                // jsString = ` __modules__.${_parameterTypes.getattrib}(__params__.model, ${entity}, '${result.str}', null)`; //////////
            }
            // return {'i': i, 'str': newString, 'jsStr': jsString};

            if (i === comps.length - 1 || (comps[i + 1].value !== '@' && comps[i + 1].value !== '#' && comps[i + 1].value !== '?')) {
                return {'i': i, 'str': newString, 'jsStr': jsString};
            }
            i += 1;
        } else if (comps[i].value === '#') {
            if (i + 1 >= comps.length || comps[i + 1].type !== strType.VAR) {
                return {'error': 'Error: geometry type expected after "#"'};
            }
            const result = analyzeVar(comps, i + 1, vars, true);
            if (result.error) { return result; }
            i = result.i;

            let entity = jsString;
            if (newString === '') {
                entity = 'null';
            }

            newString += '#' + result.str.replace(/ /g, '') + ' '; //////////


            let bracketIndex = result.jsStr.indexOf('[pythonList(');
            if (bracketIndex !== -1) {
                const arrayName = result.jsStr.substring(0, bracketIndex);
                const index = result.jsStr.lastIndexOf(arrayName);
                jsString = ` __modules__.${_parameterTypes.queryGet}(__params__.model, '${arrayName}', ${entity})` +
                           `[pythonList(${result.jsStr.substring(bracketIndex + 12, index - 2)}, ` +
                           `__modules__.${_parameterTypes.queryGet}(__params__.model, '${arrayName}', ${entity}).length)]`;
                // const att_name = result.jsStr.slice(0, bracketIndex);
                // const att_index = result.jsStr.slice(bracketIndex + 7, -4);
                // jsString = ` __modules__.${_parameterTypes.queryGet}(__params__.model, '${att_name}', ${entity}).slice(${att_index})[0]`;
            } else if (result.jsStr.indexOf('.slice(') !== -1) {
                bracketIndex = result.jsStr.indexOf('.slice(');
                const arrayName = result.jsStr.substring(0, bracketIndex);
                jsString = ` __modules__.${_parameterTypes.queryGet}(__params__.model, '${arrayName}', ${entity})` +
                           result.jsStr.substring(bracketIndex);
            } else {
                jsString = ` __modules__.${_parameterTypes.queryGet}(__params__.model, '${result.str}', ${entity})`;
            }


            if (i === comps.length - 1 || (comps[i + 1].value !== '@' && comps[i + 1].value !== '#' && comps[i + 1].value !== '?')) {
                return {'i': i, 'str': newString, 'jsStr': jsString};
            }
            i += 1;
        } else if (comps[i].value === '?') {
            if (i + 1 === comps.length || comps[i + 1].value !== '@') {
                return {'error': 'Error: "@" expected after "?"\n' +
                `at: ... ${comps.slice(i).map(cp => cp.value).join(' ')}`};
            }
            if (i + 2 === comps.length || comps[i + 2].type !== strType.VAR) {
                return {'error': 'Error: Variable expected after "@"\n' +
                `at: ... ${comps.slice(i + 1).map(cp => cp.value).join(' ')}`};
            }
            const result = analyzeVar(comps, i + 2, vars, true);
            if (result.error) { return result; }
            i = result.i;

            let entity = jsString;
            if (newString === '') {
                entity = 'null';
            }
            let att_name: string;
            let att_index: string;
            let bracketIndex = result.jsStr.indexOf('[pythonList(');
            if (bracketIndex !== -1) {
                att_name = result.jsStr.slice(0, bracketIndex);
                const index = result.jsStr.lastIndexOf(att_name);
                att_index = result.jsStr.slice(bracketIndex + 12, index - 2);
            } else if (result.jsStr.indexOf('[') !== -1) {
                bracketIndex = result.jsStr.indexOf('[');
                att_name = result.jsStr.slice(0, bracketIndex);
                att_index = result.jsStr.slice(bracketIndex + 1, -1);
            } else {
                att_name = result.str;
                att_index = 'null';
            }
            if (i + 1 >= comps.length || comps[i + 1].type !== strType.OTHER) {
                return {'error': 'Error: Comparison operator expected after attribute name'};
            }

            const operator = comps[i + 1].value;

            if (i + 2 >= comps.length) { return {'error': 'Error: Expression expected after comparison operator'}; }

            const nComp = analyzeComp(comps, i + 2, vars);
            if (nComp.error) {
                return nComp;
            }
            i = nComp.i;

            bracketIndex = nComp.jsStr.indexOf('[pythonList(');
            if (bracketIndex !== -1) {
                newString += `?@${result.str}${operator}${nComp.str} `;
                jsString = ` __modules__.${_parameterTypes.queryFilter}(__params__.model, ${entity}, ['${att_name}'` +
                           `, ${att_index}], '${operator}', ${nComp.jsStr.slice(0, bracketIndex)})${nComp.jsStr.slice(bracketIndex)}`;
            } else {
                newString += `?@${result.str}${operator}${nComp.str} `;
                jsString = ` __modules__.${_parameterTypes.queryFilter}(__params__.model, ${entity}, ['${att_name}'` +
                           `, ${att_index}], '${operator}', ${nComp.jsStr})`;
            }

            if (i === comps.length - 1 || (comps[i + 1].value !== '@' && comps[i + 1].value !== '#' && comps[i + 1].value !== '?')) {
                return {'i': i, 'str': newString, 'jsStr': jsString};
            }
            i += 1;
        }
    }
}

function analyzePythonSlicing(
                comps: {'type': strType, 'value': string}[], i: number, vars: string[], arrayName: string, isVariable: boolean):
                {'error'?: string, 'i'?: number, 'str'?: string, 'jsStr'?: string
                // , 'arrayName'?: string
                } {
    let newString = '';
    let jsString = '';
    if (i + 1 >= comps.length) { return {'error': `Error: "]" expected`}; }
    if (comps[i + 1].type === strType.STR) {
        if (i + 2 >= comps.length || comps[i + 2].value !== ']') { return {'error': `Error: "]" expected`}; }
        newString += `[${comps[i + 1].value}]`;
        jsString += `[${comps[i + 1].value}]`;
        // arrayName += `[${comps[i + 1].value}]`;
        return {'i': i + 2, 'str': newString, 'jsStr': jsString }; // , 'arrayName': arrayName};
    }
    if (i + 2 < comps.length && comps[i + 1].value === ':') {
        if (comps[i + 2].value === ']') {
            i += 2;
            newString += '[:]';
            jsString += '.slice()';
            // arrayName += '.slice()';
            return {'i': i, 'str': newString, 'jsStr': jsString}; // , 'arrayName': arrayName};
        }
        const secondResult = analyzeComp(comps, i + 2, vars);
        if (secondResult.error) { return secondResult; }
        if (secondResult.i + 1 >= comps.length || comps[secondResult.i + 1].value !== ']') {
            return {'error': `Error: "]" expected \n
            at: ... ${comps.slice(secondResult.i - 1).map(cp => cp.value).join(' ')}`};
        }
        jsString += '.slice(0,' + secondResult.jsStr + ')';
        // arrayName += '.slice(0,' + secondResult.jsStr + ')';
        newString += '[ : ' + secondResult.str + ']';
        i = secondResult.i + 1;
        return {'i': i, 'str': newString, 'jsStr': jsString}; // , 'arrayName': arrayName};
    }
    const result = analyzeComp(comps, i + 1, vars);
    if (result.error) { return result; }
    if (result.str === ']' || result.str === '') { return { 'error': `Error: Content expected`};
    } else if (result.i + 1 >= comps.length) { return { 'error': `Error: "]" expected`};
    } else if (comps[result.i + 1].value === ':') {
        if (result.i + 2 >= comps.length) { return {'error': `Error: "]" expected`}; }
        jsString += `.slice(${result.jsStr}`;
        // arrayName += `.slice(${result.jsStr}`;
        if (comps[result.i + 2].value === ']') {
                jsString += `)`;
            // arrayName += `)`;
            i = result.i + 2;
            newString += `[${result.str} :]`;
            return {'i': i, 'str': newString, 'jsStr': jsString}; // , 'arrayName': arrayName};
        }
        const secondResult = analyzeComp(comps, result.i + 2, vars);
        if (secondResult.error) { return secondResult; }
        if (secondResult.i + 1 >= comps.length || comps[secondResult.i + 1].value !== ']') {
            return {'error': `Error: "]" expected`};
        }
        jsString += `, ${secondResult.jsStr})`;
        // arrayName += `, ${secondResult.jsStr})`;
        i = secondResult.i + 1;
        newString += `[${result.str} : ${secondResult.str}]`;
        return {'i': i, 'str': newString, 'jsStr': jsString}; // , 'arrayName': arrayName};
    }

    jsString += `[pythonList(${result.jsStr}, ${arrayName}.length)]`;
    // arrayName += `[pythonList(${result.jsStr}, ${arrayName}.length)]`;

    // if (isVariable) {
    //     jsString += `[pythonList(${result.jsStr}, ${arrayName}.length)]`;
    //     arrayName += `[pythonList(${result.jsStr}, ${arrayName}.length)]`;
    // } else {
    //     jsString += `.slice(${result.jsStr})[0]`;
    //     arrayName += `.slice(${result.jsStr})[0]`;
    // }
    i = result.i + 1;
    newString += '[' + result.str + ']';
    return {'i': i, 'str': newString, 'jsStr': jsString}; // , 'arrayName': arrayName};
}

function analyzeExpression(comps: {'type': strType, 'value': string}[], i: number, vars: string[], noSpace?: boolean):
                {'error'?: string, 'i'?: number, 'value'?: number, 'str'?: string, 'jsStr'?: string} {
    let newString = '';
    let jsString = '';
    while (i < comps.length && (comps[i].value === '-' || binaryOperators.has(comps[i].value))) {
        if (newString[newString.length - 1] !== ' ') {
            newString += ' ';
            jsString += ' ';
        }
        newString += comps[i].value;
        jsString += comps[i].value;
        // if (comps[i].value === 'and') {
        //     jsString += '&&';
        // } else if (comps[i].value === 'or') {
        //     jsString += '||';
        // } else {
        //     jsString += comps[i].value;
        // }
        if (i + 1 >= comps.length) { return {'error': `Error: Expression expected after ${comps[i].value}`}; }
        const result = analyzeComp(comps, i + 1, vars, false, 'expr');
        if (result.error) { return result; }
        i = result.i + 1;
        if (result.str[0] !== ' ') {
            newString += ' ';
            jsString += ' ';
        }
        newString += result.str;
        jsString += result.jsStr;
    }
    return {'i': i - 1, 'str': newString, 'jsStr': jsString};
}

function addVars(varList: string[], varName: string) {
    if (specialVars.has(varName)) { return; }
    if (reservedWords.indexOf(varName) !== -1) { return; }
    if (varList.indexOf(varName) === -1) {
        varList.push(varName);
    }
}


/**
 * __________________________________________________________________________
 * __________________________________________________________________________
 * __________________________________________________________________________
 * ____________________ SPLITTING COMPONENTS FROM STRING ____________________
 * __________________________________________________________________________
 * __________________________________________________________________________
 * __________________________________________________________________________
 *
*/
function splitComponents(str: string): {'type': strType, 'value': string}[] | string {
    const comps = [];
    let i = 0;

    if (typeof str !== 'string') { str = JSON.stringify(str); }

    while (i < str.length) {
        let code = str.charCodeAt(i);

        // numeric (0-9) ==> number
        if (code > 47 && code < 58) {
            const startI = i;
            while ((code > 47 && code < 58) || code === 46) {
                i ++;
                if (i === str.length) { break; }
                code = str.charCodeAt(i);
            }
            comps.push({'type': strType.NUM, 'value': str.substring(startI, i)});

        // upper alpha (A-Z) & lower alpha (a-z) or _ ==> variable
        } else if ((code > 64 && code < 91) || (code > 96 && code < 123) || code === 95) {
            const startI = i;
            // upper alpha (A-Z), lower alpha (a-z), numeric (0-9) and "_" are allowed for subsequent characters.
            while ((code > 64 && code < 91) || (code > 96 && code < 123) || (code > 47 && code < 58) || code === 95) {
                i += 1;
                if (i === str.length) { break; }
                code = str.charCodeAt(i);
            }
            comps.push({ 'type': strType.VAR, 'value': str.substring(startI, i)});

            // const varString = str.substring(startI, i);
            // if (varString === 'and' || varString === 'or' || varString === 'not') {
            //     comps.push({ 'type': strType.OTHER, 'value': varString});
            // } else {
            //     comps.push({ 'type': strType.VAR, 'value': varString});
            // }

        // double-quotes (") or single-quotes (')
        } else if (code === 34 || code === 39) {
            if (i === 0 && str.substring(0, 15) === '\'__model_data__' && str.charCodeAt(str.length - 1) === code) {
                return [{ 'type': strType.STR, 'value': str}];
            }
            const startCode = code;
            const startI = i;
            i += 1;
            code = str.charCodeAt(i);
            if (!code) {
                return 'Error: Missing ending quote.';
            }
            while (true) { // string must end with the same quote as well
                i += 1;
                if (i === str.length) { break; }
                code = str.charCodeAt(i);
                if (code === startCode) {
                    let checkI = i - 1;
                    let count = 0;
                    while (checkI >= 0 && str.charCodeAt(checkI) === 92) {
                        count++;
                        checkI--;
                    }
                    if (count % 2 === 0) {
                        break;
                    }
                }
            }
            if (code === startCode) { i += 1; }
            const subStr = str.substring(startI, i);
            if (subStr.charCodeAt(subStr.length - 1) !== startCode) {
                return 'Error: Missing ending quote.';
            }
            comps.push({ 'type': strType.STR, 'value': str.substring(startI, i)});

        // + sign or - sign ==> + / ++ / += / - / -- / -=
        } else if ( code === 43 || code === 45) {
            if (str.charCodeAt(i + 1) === code || str.charCodeAt(i + 1) === 61) {
                comps.push({ 'type': strType.OTHER, 'value': str.substring(i, i + 2)});
                i += 2;
            } else {
                comps.push({ 'type': strType.OTHER, 'value': str.charAt(i)});
                i++;
            }

        // attr.push operator (>>)
        } else if (code === 62 && str.charCodeAt(i + 1) === 62) {
            i += 2;
            comps.push({ 'type': strType.OTHER, 'value': '>>'});

        // comparison operator (!, <, =, >)
        } else if (code === 33 || (code > 59 && code < 63)) {
            const startI = i;
            if (str.charCodeAt(i) === 61 && str.charCodeAt(i + 1) === 62) {
                i += 2;
            } else {
                i++;
                if (str.charCodeAt(i) === 61) { // !=, <=, >=, ==
                    i++;
                    if (str.charCodeAt(i) === 61) { // !==, ===
                        if (code === 60 || code === 62) { // mark invalid for <== and >==
                            return 'Error: <== and >== not acceptable.';
                        }
                        i++;
                    }
                }
            }
            const stringCode = str.substring(startI, i);
            if (stringCode === '=') {
                return 'Error: "=" not acceptable.';
            }
            comps.push({ 'type': strType.OTHER, 'value': stringCode});

        // or operator (||); check 1st |
        } else if (code === 124) {
            i++;
            if (str.charCodeAt(i) !== 124) { // check 2nd |
                return 'Error: || expected.';
            }
            comps.push({ 'type': strType.OTHER, 'value': '||'});
            i++;
        } else if (code === 38) { // and operator (&&); check 1st &
            i++;
            if (str.charCodeAt(i) !== 38) { // check 2nd &
                return 'Error: && expected.';
            }
            comps.push({ 'type': strType.OTHER, 'value': '&&'});
            i++;

        // others: numeric operator (*, /, %), brackets ((), [], {}), comma (,), space, ...
        } else {
            if (code !== 32) { // add to comp if it's not space
                comps.push({ 'type': strType.OTHER, 'value': str.charAt(i)});
            }
            i++;
        }
    }
    return comps;
}




/**
 * __________________________________________________________________________
 * __________________________________________________________________________
 * __________________________________________________________________________
 * _________________ CHECK IF THE VARIABLES USED ARE VALID __________________
 * __________________________________________________________________________
 * __________________________________________________________________________
 * __________________________________________________________________________
 *
*/
export function checkValidVar(vars: string[], procedure: IProcedure, nodeProdList: IProcedure[]): {'error'?: string, 'vars'?: string[]} {
    let current = procedure;
    const validVars = [];
    // check global variables
    for (const glb of globals) {
        const i = vars.indexOf(glb);
        if (i !== -1) {
            validVars.push(vars.splice(i, 1)[0]);
        }
    }
    while (current.parent) {
        const prods = current.parent.children;
        for (const prod of prods) {
            if (prod.ID === current.ID) {
                if (current.type !== ProcedureTypes.Foreach) {
                    break;
                } else {
                    const i = vars.indexOf(prod.variable);
                    if (i !== -1) {
                        validVars.push(vars.splice(i, 1)[0]);
                    }
                    break;
                }
            }
            if (!prod.variable || prod.type === ProcedureTypes.Foreach) { continue; }
            const index = vars.indexOf(prod.variable);
            if (index !== -1) {
                validVars.push(vars.splice(index, 1)[0]);
            }
        }
        current = current.parent;
        if (current.type === ProcedureTypes.LocalFuncDef) {
            for (let i = 1; i < current.args.length; i++) {
                const index = vars.indexOf(current.args[i].value);
                if (index !== -1) {
                    validVars.push(vars.splice(index, 1)[0]);
                }
            }
        }
    }
    if (vars.length === 0) {
        return {'vars': validVars};
    }
    for (const prod of nodeProdList) {
        if (prod.ID === current.ID) {
            if (current.type !== ProcedureTypes.Foreach) {
                break;
            } else {
                const i = vars.indexOf(prod.variable);
                if (i !== -1) {
                    validVars.push(vars.splice(i, 1)[0]);
                }
                break;
            }
        }
        if (!prod.variable || prod.type === ProcedureTypes.Foreach) { continue; }
        const index = vars.indexOf(prod.variable);
        if (index !== -1) {
            validVars.push(vars.splice(index, 1)[0]);
        }
    }
    if (vars.length > 0) {
        return { 'error': `Error: Invalid vars: ${vars.join(', ')}`};
    }
    return {'vars': validVars};
}

/**
 * __________________________________________________________________________
 * __________________________________________________________________________
 * __________________________________________________________________________
 * ______________________ CHECK THE VALIDITY OF A NODE ______________________
 * __________________________________________________________________________
 * __________________________________________________________________________
 * __________________________________________________________________________
 *
*/
export function checkNodeValidity(node: INode) {
    if (node.type === 'start') {
        updateGlobals(node);
    }
    const full_prod_list = node.localFunc.concat(node.procedure);
    checkProdListValidity(full_prod_list, full_prod_list);
}

function checkProdListValidity(prodList: IProcedure[], nodeProdList: IProcedure[]) {
    for (const prod of prodList) {
        switch (prod.type) {
            case ProcedureTypes.Variable:
            case ProcedureTypes.Foreach:
                modifyVar(prod, nodeProdList);
                modifyArgument(prod, 1, nodeProdList);
                break;
            case ProcedureTypes.MainFunction:
            case ProcedureTypes.globalFuncCall:
            case ProcedureTypes.LocalFuncCall:
                if (prod.args[0].name !== '__none__') {
                    modifyVar(prod, nodeProdList);
                }
                for (let i = 1; i < prod.argCount; i++) {
                    if (prod.args[i].name[0] === '_') { continue; }
                    modifyArgument(prod, i, nodeProdList);
                }
                break;
            case ProcedureTypes.If:
            case ProcedureTypes.Elseif:
            case ProcedureTypes.While:
            case ProcedureTypes.Return:
                if (prod.args.length > 0) {
                    modifyArgument(prod, 0, nodeProdList);
                }
                break;
            case ProcedureTypes.Constant:
                if (prod.meta.inputMode === InputType.Constant || prod.meta.inputMode === InputType.SimpleInput) {
                    modifyArgument(prod, 1, nodeProdList);
                }
                break;
            case ProcedureTypes.EndReturn:
                modifyArgument(prod, 1, nodeProdList);
                break;
            case ProcedureTypes.LocalFuncDef:
                modifyLocalFuncVar(prod, nodeProdList);

        }
        if (prod.children) {
            checkProdListValidity(prod.children, nodeProdList);
        }
        if (prod.argCount === 0) {
            continue;
        }
        for (const arg of prod.args) {
            arg.linked = false;
        }
    }
}

export function checkConstantShadowing(node: INode): string {
    if (checkProdShadowingConstant(node.procedure)) {
        return `, "${node.name}"`;
    }
    return '';
}

function checkProdShadowingConstant(prodList: IProcedure[]): boolean {
    let check = false;
    for (const prod of prodList) {
        switch (prod.type) {
            case ProcedureTypes.Variable:
            case ProcedureTypes.MainFunction:
            case ProcedureTypes.globalFuncCall:
                if (prod.args[0].name !== '__none__' && globals.indexOf(prod.args[0].value) !== -1) {
                    prod.args[0].invalidVar = `Error: Variable shadowing global constant: ${prod.args[0].value}`;
                    check = true;
                } else if (prod.args[0].invalidVar && (<string>prod.args[0].invalidVar).indexOf('Variable shadowing global constant')) {
                    prod.args[0].invalidVar = false;
                }
                break;
        }
        if (prod.children) {
            check = check || checkProdShadowingConstant(prod.children);
        }
    }
    return check;
}

export function updateInputValidity(type: 'add'|'remove', procedure: IProcedure, nodeProdList: IProcedure[]) {
    let current = procedure;
    while (current.parent) {
        const prods = current.parent.children;
        for (const prod of prods) {
            if (prod.ID === current.ID) {
                if (current.type !== ProcedureTypes.Foreach) {
                    break;
                } else {
                    if (prod.variable !== procedure.variable) { break; }
                    return;
                }
            }
            if (!prod.variable || prod.type === ProcedureTypes.Foreach || prod.variable !== procedure.variable) { continue; }
            return;
        }
        current = current.parent;
    }
    for (const prod of nodeProdList) {
        if (prod.ID === current.ID) {
            if (current.type !== ProcedureTypes.Foreach) {
                break;
            } else {
                if (prod.variable !== procedure.variable) { break; }
                return;
            }
        }
        if (!prod.variable || prod.type === ProcedureTypes.Foreach || prod.variable !== procedure.variable) { continue; }
        return;
    }

    if (type === 'add') {
        if (procedure.parent) {
            updateAdd(procedure.parent.children, procedure.variable, procedure);
        } else {
            updateAdd(nodeProdList, procedure.variable, procedure);
        }
    } else {
        if (procedure.parent) {
            updateRemove(procedure.parent.children, procedure.variable, procedure);
        } else {
            updateRemove(nodeProdList, procedure.variable, procedure);
        }
    }
}

function updateAdd(prodList: IProcedure[], varName: string, procedure?: IProcedure) {
    for (let i = prodList.length - 1; i > 0; i--) {
        if (procedure && procedure.ID === prodList[i].ID) { break; }
        if (prodList[i].children) { updateAdd(prodList[i].children, varName); }
        if (prodList[i].argCount === 0) { continue; }
        for (const arg of prodList[i].args) {
            if (!arg.invalidVar) { continue; }
            if (arg.invalidVar === `Error: Invalid vars: ${varName}`) {
                arg.invalidVar = false;
            } else if (typeof arg.invalidVar === 'string' && arg.invalidVar.indexOf('Invalid vars') !== -1) {
                arg.invalidVar.replace(`${varName}\s,`, '');
                arg.invalidVar.replace(`, ${varName}`, '');
            }
        }
    }
}

function updateRemove(prodList: IProcedure[], varName: string, procedure?: IProcedure) {
    for (let i = prodList.length - 1; i > 0; i--) {
        if (procedure && procedure.ID === prodList[i].ID) { break; }
        if (prodList[i].children) { updateRemove(prodList[i].children, varName); }
        if (prodList[i].argCount === 0) { continue; }
        for (const arg of prodList[i].args) {
            if (arg.usedVars.indexOf(varName) === -1) { continue; }
            if (!arg.invalidVar) {
                arg.invalidVar = `Error: Invalid vars: ${varName}`;
            } else if (typeof arg.invalidVar === 'string' && arg.invalidVar.indexOf('Invalid vars') !== -1) {
                arg.invalidVar = arg.invalidVar.concat(`, ${varName}`);
            }
        }
    }
}

export function pythonicReplace(argList) {
    const args = [];
    for (const oldArg of argList) {
        const comps: any = splitComponents(oldArg.value || '');
        for (let i = 0; i < comps.length; i ++) {
            if (i > 0 && comps[i].value === '[' && comps[i - 1].type === strType.VAR) {
                replaceListSplice(comps, i);
            }
        }
        const arg = <IArgument>{
            name: oldArg.name,
            value: oldArg.value
        };
        args.push(arg);
    }
    return argList;
}

function replaceListSplice(compList: any[], i1: number) {
    const i0 = i1 - 1;
    let innerBrackets = 0;
    let i2 = 0;
    let i3 = 0;
    for (let i = i1 + 1; i < compList.length; i++) {
        if (compList[i] === ']') {
            if (innerBrackets > 0) {
                innerBrackets -= 1;
            } else {
                i3 = i;
                break;
            }
        } else if (compList[i] === ':') {
            i2 = i;
        } else if (compList[i] === '[') {
            innerBrackets += 1;
        }
    }
    if (i2 === 0) {
        return;
    }

}
