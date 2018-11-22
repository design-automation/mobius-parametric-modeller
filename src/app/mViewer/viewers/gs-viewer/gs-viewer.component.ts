import { Component, OnInit, Input, Injectable } from '@angular/core';
import {DataService} from './data/data.service';
import * as gs from "gs-json";
import { INode } from '@models/node';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'gs-viewer',
  templateUrl: './gs-viewer.component.html',
  styleUrls: ['./gs-viewer.component.scss']
})
export class GSViewerComponent {
	imVisible:boolean=false;

	// gs model data passed to the viewer
	@Input() data: any;
	modelData:gs.IModel;

	constructor(private dataService: DataService){
	};

	setModel(data: gs.IModel): void{
		try{
			this.dataService.setGsModel(data);
		}
		catch(ex){
			this.modelData = undefined;
			console.error("Error generating model");
		}
	}

	ngOnInit() {
		this.modelData = this.data
		this.setModel(this.modelData);
		
	}


	ngDoCheck(){
		if(this.modelData !== this.data){
			this.modelData = this.data;
			this.setModel(this.modelData);
		}
	}

	leaflet(){
		this.imVisible=this.dataService.imVisible;
	}

}