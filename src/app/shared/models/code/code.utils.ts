import { INode } from '@models/node';
import { IProcedure, ProcedureTypes } from '@models/procedure';

export class CodeUtils {

    static getProcedureCode(prod: IProcedure, existingVars: string[]): string {
        prod.hasError = false;

        const codeStr: string[] = [];
        const args = prod.args;
        const prefix = args.hasOwnProperty('0') && existingVars.indexOf(args[0].value) === -1 ? 'let ' : '';

        if (prod.type != ProcedureTypes.ELSE && prod.type != ProcedureTypes.ELSEIF){
            codeStr.push(`__PRODARR__[0] = "${prod.ID}";`);
        }

        switch ( prod.type ) {
            case ProcedureTypes.VARIABLE:
                codeStr.push(`${prefix}${args[0].value} = ${args[1].value};`);
                if (prefix === 'let '){
                    existingVars.push(args[0].value)
                }
                break;

            case ProcedureTypes.FUNCTION:
                const argValues = args.slice(1).map((arg)=>arg.value).join(',');
                const fnCall: string = `__MODULES__.${prod.meta.module}.${prod.meta.name}( ${argValues} )`
                codeStr.push(`${prefix}${args[0].value} = ${fnCall};`);
                if (prefix === 'let '){
                    existingVars.push(args[0].value)
                }
                break;

            case ProcedureTypes.IF:
                codeStr.push(`if (${args[0].value}){`);
                for (let p of prod.children){
                    codeStr.push(CodeUtils.getProcedureCode(p, existingVars));
                }
                codeStr.push(`}`)
                break;

            case ProcedureTypes.ELSE:
                codeStr.push(`else {`);
                for (let p of prod.children){
                    codeStr.push(CodeUtils.getProcedureCode(p, existingVars));
                }
                codeStr.push(`}`)
                break;

            case ProcedureTypes.ELSEIF:
                codeStr.push(`else if(${args[0].value}){`);
                for (let p of prod.children){
                    codeStr.push(CodeUtils.getProcedureCode(p, existingVars));
                }
                codeStr.push(`}`)
                break;

            case ProcedureTypes.FOREACH:
                //codeStr.push(`for (${prefix} ${args[0].value} of [...Array(${args[1].value}).keys()]){`);
                codeStr.push(`for (${prefix} ${args[0].value} of ${args[1].value}){`);
                for (let p of prod.children){
                    codeStr.push(CodeUtils.getProcedureCode(p, existingVars));
                }
                codeStr.push(`}`)
                break;

            case ProcedureTypes.WHILE:
                codeStr.push(`while (${args[0].value}){`);
                for (let p of prod.children){
                    codeStr.push(CodeUtils.getProcedureCode(p, existingVars));
                }
                codeStr.push(`}`)
                break;

            case ProcedureTypes.BREAK:
                codeStr.push(`break;`);
                break;
                
            case ProcedureTypes.CONTINUE:
                codeStr.push(`continue;`);
                break;

        }

        return codeStr.join('\n');
    }

    //
    //
    //
    //
    public static getNodeCode(node: INode): string {
        node.hasError = false;
        const codeStr = [];
        const varsDefined: string[] = [];

        // TODO [think later]: How to handle defaults / values for FileInputs and WebURLs?
        // IDEA-1: Load and add as parameter; Will need to the synchronous

        // input initializations
        node.inputs.map( (inp)=> {
            const line = `let ${inp.name} = ${inp.value || inp.default};`;
            codeStr.push(line);
            varsDefined.push(inp.name);
        });

        node.outputs.map( (oup)=>{
            const line = `let ${oup.name} = ${oup.value || oup.default};`;
            codeStr.push(line);
            varsDefined.push(oup.name);
        });

        // procedure
        node.procedure.map((prod: IProcedure) => {
            codeStr.push( CodeUtils.getProcedureCode(prod, varsDefined) );
        });


        // output intializations
        const outStatements = [];
        node.outputs.map( (oup) => {
            outStatements.push( `${oup.name} : ${oup.name}` );
        });

        console.log( `{\n${codeStr.join('\n')}\nreturn { ${outStatements.join(',') } };\n}`);

        return `{
            ${codeStr.join('\n')}
            return { ${outStatements.join(',') } };
        }`;

    }

}