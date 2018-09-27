import { Component, Injector, Input, 
    ViewChild, ViewContainerRef, ComponentFactoryResolver, OnDestroy } from '@angular/core';
import { INode } from '@models/node';
import { IView } from './view.interface';
import { Viewers } from './viewers.config';

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
            `.btn{
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