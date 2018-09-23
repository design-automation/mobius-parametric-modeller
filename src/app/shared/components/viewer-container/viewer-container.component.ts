import { Component, OnInit, Injector, Input, 
         ViewChild, ViewContainerRef, 
         ComponentFactoryResolver } from '@angular/core';

import { INode } from '@models/node';
import { TextViewerComponent } from '../viewers/viewer-text.component';

@Component({
    selector: 'viewer-container',
    template:   `<div class="viewer-container">  
                    <div class= "btn-group">
                        <div class='btn btn--viewer' 
                            *ngFor='let view of Viewers;' 
                            (click)='updateView(view)'>
                            <span>{{view.name}}</span>
                        </div>
                    </div>
                    <text-viewer [node]='node' *ngIf='activeView == "text-viewer"'></text-viewer>
                </div>`,    
    styleUrls: ['./viewer-container.component.scss']
})
export class ViewerContainerComponent {

    @ViewChild('vc', {read: ViewContainerRef}) vc: ViewContainerRef;
    @Input() node: INode;

    views = [];
    activeView = "text-viewer";

    Viewers = [
        {   name: 'text-viewer', icon: undefined },
        {   name: 'json-viewer', icon: undefined }
    ]

    static ComponentMap = {
        "text-viewer": TextViewerComponent, 
    }

    constructor(private r: ComponentFactoryResolver, private injector: Injector){ }

    createView(component_name: string){
        let component = ViewerContainerComponent.ComponentMap[component_name];
        let factory = this.r.resolveComponentFactory(component);
        let componentRef = factory.create(this.injector);
        componentRef.instance["node"] = this.node;
        let view = componentRef.hostView;
        return view;
    }

    updateView(view): void{
        this.activeView = view.name;

        // if( this.views[ this.activeView ] == undefined){
        //     this.views[ this.activeView ] = this.createView(view);
        // }   

        // this.vc.detach();
        // this.vc.insert(this.views[ this.activeView ]);
    }

}