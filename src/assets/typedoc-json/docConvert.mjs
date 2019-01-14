import * as dc from './doc.json';
import * as fs from 'fs';
const urlString = 'https://mobius.design-automation.net';

function analyzeParamType(fn, paramType) {
    if (paramType.type === 'array') {
        return `${analyzeParamType(fn, paramType.elementType)}[]`;
    } else if (paramType.type === 'intrinsic' || paramType.type === 'reference') {
        return paramType.name;
    } else if (paramType.type === 'union') {
        return paramType.types.map((tp) => analyzeParamType(fn, tp)).join(' || ');
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

const doc = dc.default;
const docs = {};
console.log(fs);
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
    for (const func of mod.children) {
        // console.log(func);
        if (func.name.substring(0, 1) === '_') { continue; }
        const fn = {};
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
        moduleDoc[func.name] = fn;
    }
    if (Object.keys(moduleDoc).length === 0) {continue; }
    docs[modName] = moduleDoc;
}

for (const modName in docs) {
    if (!docs[modName]) { continue; }
    const mod = docs[modName];
    // Module name
    let mdString = `# ${modName.toUpperCase()}    \n\n`;
    for (const funcName in mod) {
        if (!mod[funcName]) { continue; }

        const func = mod[funcName];

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
                mdString += `${func.example[i]}  \n`;
                if (func.example_info) {
                    mdString += `${func.example_info[i]}  \n`;
                }

            }
        }
        if (func.example_link) {
            mdString += `* **Example URLs:**  \n`;
            for (const ex of func.example_link) {
                mdString += `  1. [${ex.trim()}](${urlString}/flowchart?file=https://raw.githubusercontent.com/design-automation/` +
                            `mobius-parametric-modeller/master/src/assets/gallery/function_examples/${ex})  \n`;

            }
        }
        mdString += `  \n`;

    }

    fs.default.writeFile(`./src/assets/typedoc-json/docMD/${modName}.md`, mdString, function(err) {
        if (err) {
            return console.log(err);
        }

        console.log('The file was saved!');
    });
}
