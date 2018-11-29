import { IPortOutput, IPortInput } from './port.interface';
import { PortType, OutputType, InputType } from './types';
import { IdGenerator } from '@shared/utils';

export class PortUtils {

    static getNewInput(): IPortInput {
        const inp: IPortInput = <IPortInput>{
            id: IdGenerator.getId(),
            name: 'input',
            type: PortType.Input,
            value: undefined,
            default: undefined,
            edges: [],
            meta: {
                mode: InputType.SimpleInput,
                opts: {}
            }
        };

        return inp;
    }

    static getNewOutput(): IPortOutput {
        const oup: IPortOutput = <IPortOutput>{
            id: IdGenerator.getId(),
            name: 'output',
            type: PortType.Output,
            edges: [],
            meta: {
                mode: OutputType.Text,
            }
        };
        return oup;
    }

}
