import { Port, IPort, InputTypes } from "@models/port";

export class Input extends Port{ 

	constructor(name: string, type?: {name: InputTypes, value: any}){ 
		super(name);

		if(type !== undefined){
			this._type = type.name;
			this.setDefaultValue(type.value || "undefined");
		}
		else{
			this._type = InputTypes.Input;
		}
	}

	update(portData: IPort, type?: string): void{
		super.update(portData, type);

		// if( !(this._type === InputTypes.FilePicker || this._type === InputTypes.URL) && !portData['_connected'] ){
		// 	this.value = portData["_computed"];
		// }
	}

}
