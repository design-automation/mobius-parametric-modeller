// import * as dc from './doc.json';
// import * as fs from 'fs';
const dc = require('./doc.json');
const fs = require('fs');
const config = require('../gallery/__config__.json');
const varString = require('../core/_inlineList.js')._varString;

const urlString = 'https://mobius.design-automation.net';

// Edit this ModuleList to include modules that are to be converted into MD file
const ModuleList = [
    'query',
    'make',
    'modify',
    'isect',
    'calc',
    'util',
    'pattern',
    'virtual',
    'list',
];


let examples;
for (const s of config.data){
    if (s.name === 'Function Examples'){
        examples = s;
        break;
    }
}
if (examples === undefined) {
    examples = {
        "name": "Function Examples",
        "files": [
        ],
        "link": "https://raw.githubusercontent.com/design-automation/mobius-parametric-modeller/master/src/assets/gallery/function_examples/"
    };
    config.data.push(examples);
}

function compare(a, b) {
    if (a.id < b.id) {
        return -1;
    }
    if (a.id > b.id) {
        return 1;
    }
    return 0;
}

function analyzeParamType(fn, paramType) {
    if (paramType.type === 'array') {
        return `${analyzeParamType(fn, paramType.elementType)}[]`;
    } else if (paramType.type === 'intrinsic' || paramType.type === 'reference') {
        return paramType.name;
    } else if (paramType.type === 'union') {
        return paramType.types.map((tp) => analyzeParamType(fn, tp)).join(' | ');
    } else if (paramType.type === 'tuple') {
        return '[' + paramType.elements.map((tp) => analyzeParamType(fn, tp)).join(', ') + ']';
    } else {
        /**
         * TODO: Update unrecognized param type here
         */
        console.log('param type requires updating:', paramType);
        console.log('in function:', fn.module + '.' + fn.name);
        return paramType.type;
    }
}

function addDoc(mod, modName, docs) {
    const moduleDoc = {};
    moduleDoc['id'] = mod.id;
    moduleDoc['name'] = modName;
    moduleDoc['func'] = [];
    if (!mod.children) { return; }
    for (const func of mod.children) {
        if (func.name[0] === '_') { continue; }
        const fn = {};
        fn['id'] = func.id;
        fn['name'] = func.name;
        fn['module'] = modName;
        if (!func['signatures']) { continue; }
        if (func['signatures'][0].comment) {
            const cmmt = func['signatures'][0].comment;
            fn['description'] = cmmt.shortText;
            if (cmmt.tags) {
                for (const fnTag of cmmt.tags) {
                    if (fnTag.tag === 'summary') { fn['summary'] = fnTag.text;
                    } else {
                        if (fn[fnTag.tag]) {
                            fn[fnTag.tag].push(fnTag.text);
                        } else {
                            fn[fnTag.tag] = [fnTag.text];
                        }

                    }
                }
            }
            fn['returns'] = cmmt.returns;
            if (fn['returns']) { fn['returns'] = fn['returns'].trim(); }
        }
        fn['parameters'] = [];
        if (func['signatures'][0].parameters) {
            for (const param of func['signatures'][0].parameters) {
                let namecheck = true;

                const constList = ['__constList__', '__model__', '__input__'];
                if (constList.indexOf(param.name) !== -1) {
                    namecheck = false;
                }
                if (!namecheck) {
                    fn['parameters'].push(undefined);
                    continue;
                }
                const pr = {};

                pr['name'] = param.name;
                if (param.comment) {
                    pr['description'] = param.comment.shortText || param.comment.text;
                }
                pr['type'] = analyzeParamType(fn, param.type);
                fn['parameters'].push(pr);
            }
        }
        moduleDoc.func.push(fn);
    }
    if (moduleDoc.func.length === 0) {return; }
    moduleDoc.func.sort(compare);
    docs.push(moduleDoc);
}

function genModuleDocs(ModuleList, docs) {
    let count = 0;
    for (const modName of ModuleList) {
        let mod;
        for (let m of docs) {
            if (m.name === modName) {
                mod = m;
                break;
            }
        }
        if (!mod) {continue;}
        // if (!docs[modName]) { continue; }
        // const mod = docs[modName];
        // Module name
        if (ModuleList.indexOf (mod.name) === -1) { continue; }``
        let mdString = `# ${modName.toUpperCase()}    \n\n`;
        for (const func of mod.func) {
            // if (!mod[funcName]) { continue; }
    
            // const func = mod[funcName];
    
            mdString += `## ${func.name}  \n`;
            mdString += `* **Description:** ${func.description}  \n`;
            if (func.parameters && func.parameters.length > 0) {
                mdString += `* **Parameters:**  \n`;
                for (const param of func.parameters) {
                    if (!param) {continue; }
                    mdString += `  * *${param.name}:* ${param.description}  \n`;
                }
            }
            if (func.returns) {
                mdString += `* **Returns:** ${func.returns}  \n`;
            }
            if (func.example) {
                mdString += `* **Examples:**  \n`;
                for (const i in func.example) {
                    if (!func.example[i]) {continue; }
                    mdString += `  * ${func.example[i]}  \n`;
                    if (func.example_info) {
                        mdString += `    ${func.example_info[i]}  \n`;
                    }
    
                }
            }
            if (func.example_link) {
                mdString += `* **Example URLs:**  \n`;
                for (const ex of func.example_link) {
                    let check = false;
                    f = ex.trim();
                    fNoNode = f.split('.mob')[0].trim();
                    for (const exampleFile of examples.files) {
                        if (exampleFile.indexOf(fNoNode) !== -1) {
                            check =true;
                        }
                    }
                    if (!check) {
                        examples.files.push(f);
                    }
                    mdString += `  1. [${f.split('&node=')[0]}](${urlString}/flowchart?file=https://raw.githubusercontent.com/design-automation/` +
                                `mobius-parametric-modeller/master/src/assets/gallery/function_examples/${ex})  \n`;
    
                }
            }
            mdString += `  \n`;
    
        }
    
        count += 1;
        let countStr = count.toString();
        if (countStr.length === 1) {
            countStr = '0' + countStr;
        }
        fs.writeFile(`./src/assets/typedoc-json/docMD/${countStr}_${modName}.md`, mdString, function(err) {
            if (err) {
                return console.log(err);
            }
            console.log(`successfully saved ${countStr}_${modName}.md`);
        });
    }
}

function genInlineDocs(inlineList, inlineDocs) {
    ilString = ''
    for (const inlineFunc of inlineList) {
        if (!inlineFunc) { continue; }
        const funcNames = inlineFunc[1].split('.')
        let mod;
        let func
        for (let m of inlineDocs) {
            if (m.name[2] === funcNames[1]) {
                mod = m;
                for (let f of mod.func) {
                    if (f.name === funcNames[2]) {
                        func = f;
                        break;
                    }
                }
                break;
            }
        }
        if (!mod || !func) { continue; }
        ilString += `# ## ${inlineFunc[0]}  \n`;
        ilString += `* **Description:** ${func.description}  \n`;
        if (func.parameters && func.parameters.length > 0) {
            ilString += `* **Parameters:**  \n`;
            for (const param of func.parameters) {
                if (!param || param.name === 'debug') {continue; }
                ilString += `  * *${param.name}:* ${param.description?param.description:''}  \n`;
            }
        }
        if (func.returns) {
            ilString += `* **Returns:** ${func.returns}  \n`;
        }
        if (func.example) {
            ilString += `* **Examples:**  \n`;
            for (const i in func.example) {
                if (!func.example[i]) {continue; }
                ilString += `  * ${func.example[i]}  \n`;
                if (func.example_info) {
                    ilString += `    ${func.example_info[i]}  \n`;
                }

            }
        }
        if (func.example_link) {
            ilString += `* **Example URLs:**  \n`;
            for (const ex of func.example_link) {
                let check = false;
                f = ex.trim();
                fNoNode = f.split('.mob')[0].trim();
                for (const exampleFile of examples.files) {
                    if (exampleFile.indexOf(fNoNode) !== -1) {
                        check =true;
                    }
                }
                if (!check) {
                    examples.files.push(f);
                }
                ilString += `  1. [${f.split('&node=')[0]}](${urlString}/flowchart?file=https://raw.githubusercontent.com/design-automation/` +
                            `mobius-parametric-modeller/master/src/assets/gallery/function_examples/${ex})  \n`;

            }
        }
        ilString += `  \n`;
    }
    fs.writeFile(`./src/assets/typedoc-json/docIL/_inline.md`, ilString, function(err) {
        if (err) {
            return console.log(err);
        }
        console.log(`successfully saved _inline.md`);
    });
}

// const doc = dc.default;
const doc = dc;
const moduleDocs = [];
const inlineDocs = [];

const inlineFuncs = varString.replace(/\n/g, '').split(';');
for (let i in inlineFuncs) {
    if (inlineFuncs[i] === '') {
        inlineFuncs[i] = undefined;
        continue;
    }
    inlineFuncs[i] = inlineFuncs[i].split(' = ');
}

for (const mod of doc.children) {
    let modName = mod.name.replace(/"/g, '').replace(/'/g, '').split('/');
    const coreIndex = modName.indexOf('core');
    if (modName.length < 3 || coreIndex === -1) {
        continue;
    }
    if (modName[coreIndex + 1] === 'inline') {
        addDoc(mod, modName, inlineDocs);

    } else if (modName[coreIndex + 1] === 'modules') {
        modName = modName[modName.length - 1];
        if (modName.substr(0, 1) === '_' || modName === 'index' || modName === 'categorization') {
            continue;
        }
        addDoc(mod, modName, moduleDocs);
    }
}
moduleDocs.sort(compare);

genModuleDocs(ModuleList, moduleDocs)
genInlineDocs(inlineFuncs, inlineDocs)

fs.writeFile(`./src/assets/gallery/__config__.json`, JSON.stringify(config, null, 4), function(err) {
    if (err) {
        return console.log(err);
    }
    console.log(`successfully saved __config__.json`);
});
