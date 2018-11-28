import { Component, Injector, Input,
    ViewChild, ViewContainerRef, ComponentFactoryResolver, OnDestroy, OnInit, OnChanges } from '@angular/core';
import { INode } from '@models/node';
import { IView } from './view.interface';
import { Viewers } from './viewers.config';
import { EventEmitter } from 'events';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'mviewer',
    templateUrl:  'mobius-viewer.component.html',
    styleUrls: ['mobius-viewer.component.scss']
})
export class ViewerContainerComponent implements OnChanges, OnInit, OnDestroy {

    @ViewChild('vc', {read: ViewContainerRef}) vc: ViewContainerRef;
    @Input() data: any;
    @Input() helpView: any;
    currentHelpView: any;

    constructor(private injector: Injector, private r: ComponentFactoryResolver) {

    }

    private views = [];
    private activeView: IView;
    Viewers = Viewers;

    ngOnInit() {
        this.activeView = this.Viewers[0];
        this.updateView( this.activeView );
    }

    ngOnDestroy() {
        console.log('onDestroy');
        for (const view of this.views) {
            view.destroy();
        }
    }

    ngOnChanges() {
        if (this.currentHelpView !== this.helpView) {
            let view;
            for (const v of this.Viewers) {
                if (v.name === 'Help') { view = v; }
            }
            this.currentHelpView = this.helpView;
            this.updateView(view);
        } else { this.updateValue(); }
    }

    createView(view: IView) {
        const component = view.component;
        const factory = this.r.resolveComponentFactory(component);
        const componentRef = factory.create(this.injector);
        /*
        if (view.name != 'Console'){
            componentRef.instance["data"] = this.data;
        }
        */
        return componentRef;
    }

    updateView(view: IView): void {
        this.activeView = view;

        if ( this.views[ this.activeView.name ] === undefined) {
            this.views[ this.activeView.name ] = this.createView(view);
        }

        this.updateValue();

        this.vc.detach();
        this.vc.insert( this.views[ this.activeView.name ].hostView );
    }

    updateValue() {
        try {
            const componentRef =  this.views[ this.activeView.name ];
            if (this.activeView.name === 'Help') {
                componentRef.instance['output'] = this.currentHelpView;
            } else if (this.activeView.name !== 'Console') {
                componentRef.instance['data'] = this.data;
            }
        } catch (ex) {
            // console.log(`Active View not defined`);
        }
    }
}
