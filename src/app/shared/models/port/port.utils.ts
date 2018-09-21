import { IPortOutput, IPortInput } from "./port.interface";
import { PortType, OutputType, InputType } from "./types";

export class PortUtils{

    static getNewInput(): IPortInput{
        let inp: IPortInput = <IPortInput>{
            name: '', 
            isConnected: false,
            type: PortType.Input,
            value: undefined,
            default: undefined,
            meta: {
                mode: InputType.SimpleInput,
                opts: {}
            }
        }
        return inp;
    };

    static getNewOutput(): IPortOutput{
        let oup: IPortOutput = <IPortOutput>{
            name: '', 
            isConnected: false,
            type: PortType.Output,
            meta: {
                mode: OutputType.Text, 
            }
        }
        return oup;
    };

}