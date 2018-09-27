import { Component, Injector, Input, 
         ViewChild, ViewContainerRef, 
         OnDestroy, NgModuleFactoryLoader, SystemJsNgModuleLoader  } from '@angular/core';
import { INode } from '@models/node';
import { TextViewerComponent } from '../../../mobius-viewer/viewers'

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
                    <ng-container #vc></ng-container>
                </div>`,    
    styleUrls: ['./viewer-container.component.scss'],
    providers: [
        {
            provide: NgModuleFactoryLoader,
            useClass: SystemJsNgModuleLoader
        }
    ]
})
export class ViewerContainerComponent implements OnDestroy {

    @ViewChild('vc', {read: ViewContainerRef}) vc: ViewContainerRef;
    @Input() node: INode;
    
    constructor(private injector: Injector,
                private loader: NgModuleFactoryLoader) {
    }

    ngAfterViewInit() {
        this.loader.load('../../../mobius-viewer/mobius-viewer.module#MobiusViewerModule').then((factory) => {
            const module = factory.create(this.injector);
            const r = module.componentFactoryResolver;
            const cmpFactory = r.resolveComponentFactory(TextViewerComponent);
            
            // create a component and attach it to the view
            const componentRef = cmpFactory.create(this.injector);
            this.vc.insert(componentRef.hostView);
        })
    }

    views = [];
    activeView = "text-viewer";

    Viewers = [
        {   name: 'text-viewer', icon: undefined },
        {   name: 'json-viewer', icon: undefined }
    ]

    static ComponentMap = {
        "text-viewer": TextViewerComponent, 
    }

    ngOnDestroy(){
        // TODO: Destroy all componentRefs to prevent memory leaks
    }

    createView(component_name: string){
        // let component = ViewerContainerComponent.ComponentMap[component_name];
        // let factory = this.r.resolveComponentFactory(component);
        // let componentRef = factory.create(this.injector);
        // componentRef.instance["node"] = this.node;
        // let view = componentRef.hostView;
        // return view;
    }

    updateView(view): void{
        // this.activeView = view.name;
        // console.log(this.activeView);

        // if( this.views[ this.activeView ] == undefined){
        //     this.views[ this.activeView ] = this.createView(view);
        // }   

        // this.vc.detach();
        // this.vc.insert(this.views[ this.activeView ]);
    }

}