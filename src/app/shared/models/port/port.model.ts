import { IdGenerator } from '@shared/utils';
import { IPort, InputTypes, OutputTypes } from '@models/port';

export abstract class Port implements IPort{ 

	private _id: string;
	protected _type: InputTypes|OutputTypes;
	protected _opts;

	private _selected: boolean = false;
	private _disabled: boolean = false;

	private _name: string;

	private _connected: boolean = false; 

	// values
	private _default: any = undefined;  
	private _computed: any = undefined;

	public _hasDefault: boolean;
	public _hasComputed: boolean;

	constructor(name: string){ 
		this._id =  IdGenerator.getId();
		this._name = name;
		this._opts = {};
	}

	// ----- Update function for Port from Data 
	update(portData: IPort, type?: string): void{
		this._id = portData["_id"];

		this._type = portData["_type"];
		if( typeof(this._type) == "number" && type == "inp"){
			//this._type = (InputTypes)this._type; 
			this._type = <InputTypes>Object.keys(InputTypes)[this._type]
		}
		else if( typeof(this._type) == "number" && type == "out"){
			//this._type = <OutputTypes>Object.keys(OutputTypes)[this._type]
		}

		// will be programmatically selected later 
		this._selected = false;

		// will be programmatically connected later
		this._connected = false;
		
		this._disabled = portData["_disabled"];
		this._default = portData["_default"];
		this._opts = portData["_opts"];


		// todo: assign computed also??
		//this._computed = portData["_computed"];
	}	

	get id(): string{
		return this._id;
	}

	set id(value: string){
		this._id = value;
	}

	get name(): string{
		return this._name;
	}

	set name(value: string){
		this._name = value;
	}

	get type(){
		return this._type;
	}

	set type(value){
		this._type = value;
	
		if(value == InputTypes.Slider){
          this.opts = {min: 0, max: 100, step: 1};
          this.setDefaultValue(50);
        }
	}

	get value(): any{
		return this.getValue();
	}

	set value(value: any){
		console.log(`Setting value of Port: ${this.name} as ${value}`);
		this.setComputedValue(value);
	}

	get opts(): any{
		return this._opts;
	}

	set opts(value: any){
		this._opts = value;
	}


	// ------------ Port Values Functions 
	_executionAddr: string = undefined;
	getValue(): any{

		let final;  

		if(this._executionAddr !== undefined){
			return this._executionAddr;
		}
		else{
			if (this._computed !== undefined){
				final = this._computed;
			}
			else{
				final = this._default;
			}
		}
		
		return final;
	}

	private setComputedValue(value: any): void{

		if (value == undefined)	return;

		switch(this._type){
			case InputTypes.FilePicker:
			case InputTypes.URL:
				this._computed = FileUtils.add_file_to_memory(value, this._id);
				break;

			default:
				this._computed = value;
		}

		this._hasComputed = true;

	}

	reset(): void{
		this.value = " ";
	}


	//--- Default Values
	getDefaultValue(): any{
		//console.log(`Get default`);
		return this._default;
	}

	// Todo: Is this redundant?	
	setDefaultValue(value: any): void{
		//console.log(`Set default called with ${value}`);
		this._default = value;

		if(value !== undefined){
			this._hasDefault = true;
		}
	}



	// ---- Getters and Settings
	// TODO: Convert to get/set methods

	isSelected(): boolean{
		return this._selected; 
	}

	isDisabled(): boolean{
		return this._disabled;
	}

	disable(): void{
		this._disabled = true;
	}

	enable(): void{
		this._disabled = false;
	}	

	get enabled(): boolean{
		return !this._disabled;
	}

	set enabled(value: boolean){
		this._disabled = !value;
	}

	get isConnected(): boolean{
		return this._connected;
	}

	set isConnected(value: boolean){
		this._connected = value;
	}

}


abstract class FileUtils{

	private static PREFIX: string = "MOBIUS_FILES_";

	public static add_file_to_memory(value: any, id: string): string{
		let file_name: string = FileUtils.PREFIX + id;
		window[file_name] = value;

		// TODO: Convert this to a decorator
		return  "(new Function('value', 'return value'))( window[ '" + file_name + "' ])"; 
	}
}
