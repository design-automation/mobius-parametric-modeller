import { Component, OnInit, Input, Injectable } from '@angular/core';
import {DataService} from './data/data.service';
import * as gs from "gs-json";
import { INode } from '@models/node';

@Component({
  selector: 'gs-viewer',
  templateUrl: './gs-viewer.component.html',
  styleUrls: ['./gs-viewer.component.scss']
})
export class GSViewerComponent {
	imVisible:boolean=false;

	// gs model data passed to the viewer
	@Input() node: INode;
	data:gs.IModel;
	text:string;

	constructor(private dataService: DataService){
	};

	setModel(data: gs.IModel): void{
		try{
			this.dataService.setGsModel(data);
		}
		catch(ex){
			this.text = '';
			this.data = undefined;
			console.error("Error generating model");
		}
	}

	ngOnInit() {
		this.data = this.node.outputs[0].value;
		this.setModel(this.data);
		
	}


	ngDoCheck(){
		if(this.data !== this.node.outputs[0].value){
			this.data = this.node.outputs[0].value;
			this.setModel(this.data);
		}
	}

	leaflet(){
		this.imVisible=this.dataService.imVisible;
	}

}