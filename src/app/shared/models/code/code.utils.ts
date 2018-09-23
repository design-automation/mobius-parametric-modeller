import { INode } from '@models/node';
import { IProcedure, ProcedureTypes } from '@models/procedure';

export class CodeUtils {

    static getProcedureCode(prod: IProcedure, existingVars: string[]): string {
        const codeStr: string[] = [];
        const args = prod.args;
        const prefix = existingVars.indexOf(args[0].value) === -1 ? 'let ' : '';

        switch ( prod.type ) {

            case ProcedureTypes.VARIABLE:
                codeStr.push(`${prefix} ${args[0].value} = ${args[1].value};`);
                break;

            case ProcedureTypes.FUNCTION:
                const argValues = args.slice(1).map((arg)=>arg.value).join(',');
                const fnCall: string = `__MODULES__.${prod.meta.module}.${prod.meta.name}( ${argValues} )`
                codeStr.push(`${prefix} ${args[0].value} = ${fnCall};`);
                break;

        }

        return codeStr.join('\n');
    }

    //
    //
    //
    //
    public static getNodeCode(node: INode): string {

        const codeStr = [];
        const varsDefined: string[] = [];

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

        console.log( `{
            ${codeStr.join('\n')}
            return { ${outStatements.join(',') } };
        }`);

        return `{
            ${codeStr.join('\n')}
            return { ${outStatements.join(',') } };
        }`;

    }

}