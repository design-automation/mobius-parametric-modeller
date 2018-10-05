import { Component, Injector, Input, 
    ViewChild, ViewContainerRef, ComponentFactoryResolver, OnDestroy, ComponentRef } from '@angular/core';
import { INode } from '@models/node';
import { IView , gs_default, cesium_default} from './view.interface';
import { Viewers } from './viewers.config';
import * as gs from 'gs-json';

@Component({
    selector: 'mviewer',
    template:   `<div class='viewer-container'>  
                    <div class= 'btn-group'>
                        <div class='btn btn--viewer' 
                            [class.selected]='view.name == activeView.name'
                            *ngFor='let view of Viewers;' 
                            (click)='updateView(view)'>
                            <span>{{view.name}}</span>
                        </div>
                    </div>
                    <ng-container #vc></ng-container>
                </div>`,    
    styles: [
            `
            .btn{
                display: inline-block;
            }
            
            .selected{
                background-color: black;
                color: yellow;
            }
            `
    ]
})
export class ViewerContainerComponent implements OnDestroy {

    @ViewChild('vc', {read: ViewContainerRef}) vc: ViewContainerRef;
    @Input() node: INode;

    constructor(private injector: Injector, private r: ComponentFactoryResolver) {}

    private views = [];
    private Viewers = Viewers;
    private activeView: IView;

    ngOnInit(){
        this.activeView = this.Viewers[0];
        this.updateView( this.activeView );
    }

    ngOnDestroy(){
        console.log('onDestroy')
        for (let view of this.views){
            view.destroy();
        }
    }

    ngOnChanges(){
        this.updateValue();
    }

    createView(view: IView){
        if (view.name == 'gs-viewer'){
            let component = view.component;
            let factory = this.r.resolveComponentFactory(component);
            let componentRef = factory.create(this.injector);
            componentRef.instance["node"] = this.node;
            return componentRef;
        } else if (view.name == 'mobius-cesium'){
            let component = view.component;
            let factory = this.r.resolveComponentFactory(component);
            let componentRef = factory.create(this.injector);
            try{
                let data = JSON.parse(this.node.outputs[0].value);
                componentRef.instance["data"] = data;
            }
            catch(ex){
                componentRef.instance["data"] = cesium_default;
            }
            componentRef.instance["mode"] = 'editor';
            return componentRef;
        } else{
            let component = view.component;
            let factory = this.r.resolveComponentFactory(component);
            let componentRef = factory.create(this.injector);
            componentRef.instance["node"] = this.node;
            return componentRef;
        }
    }

    updateView(view: IView): void{
        this.activeView = view;

        if( this.views[ this.activeView.name ] == undefined){
            this.views[ this.activeView.name ] = this.createView(view);
        } else{
            this.updateValue();
        }

        this.vc.detach();
        this.vc.insert( this.views[ this.activeView.name ].hostView );
    }

    updateValue(){
        try{
            let componentRef =  this.views[ this.activeView.name ]; 
            if (this.activeView.name == 'gs-viewer'){
                componentRef.instance["node"] = this.node;
            } else if (this.activeView.name == 'mobius-cesium'){
                try{
                    let data = JSON.parse(this.node.outputs[0].value);
                    componentRef.instance["data"] = data;
                }
                catch(ex){
                    componentRef.instance["data"] = cesium_default;
                }
            }
        }
        catch(ex){
            console.log(`Active View not defined`);
        }
    }
}