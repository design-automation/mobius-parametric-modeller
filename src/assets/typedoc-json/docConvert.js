// import * as dc from './doc.json';
// import * as fs from 'fs';
const dc = require('./doc.json');
const fs = require('fs');
const config = require('../gallery/__config__.json');

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

// const doc = dc.default;
const doc = dc;
const docs = [];

for (const mod of doc.children) {
    let modName = mod.name.split('/');
    modName = modName[modName.length - 1];
    if (modName.substr(0, 1) === '"' || modName.substr(0, 1) === '\'') {
        modName = modName.substr(1, modName.length - 2);
    } else {
        modName = modName.substr(0, modName.length - 1);
    }
    if (modName.substr(0, 1) === '_' || modName === 'index') {
        continue;
    }
    const moduleDoc = {};
    moduleDoc['id'] = mod.id;
    moduleDoc['name'] = modName;
    moduleDoc['func'] = [];
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
    if (moduleDoc.func.length === 0) {continue; }
    moduleDoc.func.sort(compare);
    docs.push(moduleDoc);
}
docs.sort(compare);

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

fs.writeFile(`./src/assets/gallery/__config__.json`, JSON.stringify(config, null, 4), function(err) {
    if (err) {
        return console.log(err);
    }
    console.log(`successfully saved __config__.json`);
});
