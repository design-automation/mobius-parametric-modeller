import { Port, OutputTypes } from "@models/port";

export class Output extends Port{

	constructor(name: string, type?: OutputTypes){
		super(name);

		if(type !== undefined){
			this._type = type;
		}
		else{
			this._type = OutputTypes.Text;
		}
	}

}