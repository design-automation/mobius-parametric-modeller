import { Component, Injector, Input, 
    ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef
    OnDestroy } from '@angular/core';
import { INode } from '@models/node';
import { IView } from './view.interface';
import { TextViewerComponent, JSONViewerComponent } from './viewers';

@Component({
    selector: 'mviewer',
    template:   `<div class="viewer-container">  
                <div class= "btn-group">
                    <div class='btn btn--viewer' 
                        *ngFor='let view of Viewers;' 
                        (click)='updateView(view)'>
                        <span>{{view.name}}</span>
                    </div>
                </div>
                <ng-container #vc></ng-container>
            </div>`,    
    styleUrls: [],
    entryComponents: [ TextViewerComponent, JSONViewerComponent ]
})
export class ViewerContainerComponent implements OnDestroy {

    @ViewChild('vc', {read: ViewContainerRef}) vc: ViewContainerRef;
    @Input() node: INode;

    constructor(private injector: Injector, private r: ComponentFactoryResolver) {}

    Viewers: IView[] = [
        {   name: 'text-viewer', icon: undefined, component: TextViewerComponent },
        {   name: 'json-viewer', icon: undefined, component: JSONViewerComponent }
    ];

    private views = [];
    private activeView: IView = {   name: 'text-viewer', icon: undefined, component: TextViewerComponent };

    ngOnInit(){
        this.updateView( this.activeView );
    }

    ngOnDestroy(){
        // TODO: Destroy all componentRefs to prevent memory leaks
    }

    ngOnChanges(){
        this.updateValue();
    }

    createView(view: IView){
        let component = view.component;
        let factory = this.r.resolveComponentFactory(component);
        let componentRef = factory.create(this.injector);
        componentRef.instance["node"] = this.node;
        return componentRef;
    }

    updateView(view: IView): void{
        this.activeView = view;

        if( this.views[ this.activeView.name ] == undefined){
            this.views[ this.activeView.name ] = this.createView(view);
        }

        this.updateValue();

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