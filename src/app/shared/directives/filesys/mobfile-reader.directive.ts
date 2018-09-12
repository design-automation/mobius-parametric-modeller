/*
 *	Adding this to an HTML5 input element
 *	allows for the file being read to be converted into a Mobius 
 *	Flowchart
 * 
 */
import { Directive, ElementRef, Input, HostBinding, HostListener, Renderer } from '@angular/core';
import * as CircularJSON from 'circular-json';
import { DataService } from '@services';

@Directive({
	selector: "[mbFileReader]"
})
export class MbFileReaderDirective { 

	@Input() data: any = {};
	constructor(private el: ElementRef, private renderer: Renderer){ console.log(CircularJSON) }

	@HostListener("change")
	onFileChange() {
		let f = this.el.nativeElement.files[0];
		if (f) {
		    var reader = new FileReader();
				reader.readAsText(f, "UTF-8");
				let ins = this;
		    reader.onload = function (evt) {
						let fileString: string = evt.target["result"];
		        ins.load_flowchart_from_string(fileString);
		    }
		    reader.onerror = function (evt) {
		        console.log("Error reading file");
		    }
		}
	}


	//
	// Input: string
	// Output: MobiusFile DS
	//  
	//
	private load_flowchart_from_string(fileString: string): void{
	  let _this = this;
	  let jsonData: {language: string, flowchart: JSON, modules: JSON};
	  let flowchart: any;// IFlowchart;
	  
	  try{
			let data = CircularJSON.parse(fileString);
			//this.data.language = data.language;
			//this.data.flowchart = data.flowchart;
			this.data.flowchart = data.flowchart; 
			this.data.modules = data.modules;
			this.data.language = data.language;
			//this.output.file = data;
			//DataService.data = data;

	    // this.update_code_generator(CodeFactory.getCodeGenerator(data["language"]));
	    //TODO: this.update_modules();

	    //flowchart = FlowchartReader.read_flowchart_from_data(data["flowchart"]);
	    // TODO: select a node
	  }
	  catch(err){
	    console.error("Mob-file-reader error", err);
	  }

	}


}