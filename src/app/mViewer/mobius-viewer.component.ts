import { Component, Injector, Input, 
    ViewChild, ViewContainerRef, ComponentFactoryResolver, OnDestroy, ComponentRef } from '@angular/core';
import { INode } from '@models/node';
import { IView , gs_default, cesium_default} from './view.interface';
import { Viewers } from './viewers.config';
import * as gs from 'gs-json';

@Component({
    selector: 'mviewer',
    templateUrl:  'mobius-viewer.component.html',    
    styleUrls: ['mobius-viewer.component.scss']
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
        let component = view.component;
        let factory = this.r.resolveComponentFactory(component);
        let componentRef = factory.create(this.injector);
        componentRef.instance["node"] = this.node;
        if (view.name == 'mobius-cesium'){
            componentRef.instance["mode"] = 'editor';
        }
        return componentRef;
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
            componentRef.instance["node"] = this.node;
        }
        catch(ex){
            console.log(`Active View not defined`);
        }
    }
}