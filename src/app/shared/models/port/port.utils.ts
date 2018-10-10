import { IPortOutput, IPortInput } from "./port.interface";
import { PortType, OutputType, InputType } from "./types";
import { IdGenerator } from "@shared/utils";

export class PortUtils{

    static getNewInput(): IPortInput{
        let inp: IPortInput = <IPortInput>{
            id: IdGenerator.getId(),
            name: 'sample_input', 
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
    };

    static getNewOutput(): IPortOutput{
        let oup: IPortOutput = <IPortOutput>{
            id: IdGenerator.getId(),
            name: 'sample_output', 
            type: PortType.Output,
            edges: [],
            meta: {
                mode: OutputType.Text, 
            }
        }
        return oup;
    };

}