import { Component, Injector, ComponentFactoryResolver, ViewContainerRef, ViewChild, EventEmitter, HostListener } from '@angular/core';
import { ViewEditorComponent, ViewPublishComponent } from '@views';
import { IMobius } from '@models/mobius';
import { IFlowchart } from '@models/flowchart';
import { DataService } from '@services';
import * as circularJSON from 'circular-json';
import { IView } from '../mViewer/view.interface';
import { FlowchartComponent } from '../ngFlowchart-svg/flowchart.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html', 
  styleUrls: ['app.component.scss']
})
export class AppComponent{

  private file: IMobius;
  private flowchart: IFlowchart; 

  @ViewChild('vc', {read: ViewContainerRef}) vc: ViewContainerRef;
  private views = [];
  private Viewers = {
    "editor":ViewEditorComponent,
    "publish":ViewPublishComponent,
    "flowchart":FlowchartComponent
                    };
  private activeView: string;

  constructor(private dataService: DataService, private injector: Injector, private r: ComponentFactoryResolver){
    this.file = dataService.file;
    this.flowchart = dataService.flowchart;
  }

  ngOnInit(){
    this.activeView = "flowchart";
    this.updateView("flowchart");
     
  }


  updateFile(event: string){
    this.dataService.file = circularJSON.parse(event);
    this.file = this.dataService.file;
    this.flowchart = this.dataService.flowchart;
    this.updateValue();
  }

  createView(view: string){
    let component = this.Viewers[view];
    let factory = this.r.resolveComponentFactory(component);
    let componentRef = factory.create(this.injector);
    if (view == "flowchart"){
      componentRef.instance["data"] = this.flowchart;
      componentRef.instance["switch"].subscribe(data => this.updateView(data))
  } else if(view == "editor"){
      componentRef.instance["flowchart"] = this.flowchart;
      componentRef.instance["node"] = this.flowchart.nodes[this.flowchart.meta.selected_nodes[0]];
    } else if(view == "publish"){
      componentRef.instance["flowchart"] = this.flowchart;
    }
    return componentRef;
  }

  updateView(view: string): void{
    this.activeView = view;

    if( this.views[ view ] == undefined){
        this.views[ view ] = this.createView(view);
    } else this.updateValue();

    this.vc.detach();
    this.vc.insert( this.views[ view ].hostView );
  }

  updateValue(){
    for (let view in this.Viewers){
      if (!this.views[view]) continue;
      let componentRef =  this.views[ view ]; 
      if (view == "flowchart"){
        componentRef.instance["data"] = this.flowchart;
      } else if(view == "editor"){
        componentRef.instance["flowchart"] = this.flowchart;
        componentRef.instance["node"] = this.flowchart.nodes[this.flowchart.meta.selected_nodes[0]];
      } else if(view == "publish"){
        componentRef.instance["flowchart"] = this.flowchart;
      }

    }
  }

}
/*

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html', 
  styleUrls: ['app.component.scss']
})
export class AppComponent{

  private file: IMobius;
  private flowchart: IFlowchart; 

  private activeView: string;

  constructor(private dataService: DataService){
    this.file = dataService.file;
    this.flowchart = dataService.flowchart;
    this.activeView = "flowchart";
  }

  updateView(view:string){
    this.activeView = view;
  }



  updateFile(event: string){
    this.dataService.file = circularJSON.parse(event);
    this.file = this.dataService.file;
    this.flowchart = this.dataService.flowchart;
  }

  switchView(event){
    this.activeView = "editor"
  }

}
*/
