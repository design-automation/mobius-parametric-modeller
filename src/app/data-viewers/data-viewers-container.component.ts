import { Component, Injector, Input,
    ViewChild, ViewContainerRef, ComponentFactoryResolver, OnDestroy, OnInit, OnChanges } from '@angular/core';
import { IView } from './view.interface';
import { Viewers } from './data-viewers.config';
import { INode } from '@models/node';
import { EventEmitter } from 'events';

/**
 * A component that contains all the viewers.
 */
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'data-viewers-container',
    templateUrl: 'data-viewers-container.component.html',
    styleUrls: ['data-viewers-container.component.scss']
})
export class DataViewersContainerComponent implements OnChanges, OnInit, OnDestroy {
    @ViewChild('vc', {read: ViewContainerRef}) vc: ViewContainerRef;
    @Input() data: any;
    @Input() helpView: any;
    currentHelpView: any;
    private views = [];
    private activeView: IView;
    Viewers = Viewers;
    /**
     * Construct the viewer container.
     * @param injector
     * @param r
     */
    constructor(private injector: Injector, private r: ComponentFactoryResolver) {
        // do nothing
    }
    /**
     * ngOnInit
     */
    ngOnInit() {
        this.activeView = this.Viewers[0];
        this.updateView( this.activeView );
    }
    /**
     * ngOnDestroy
     */
    ngOnDestroy() {
        console.log('onDestroy');
        for (const view of this.views) {
            view.destroy();
        }
    }
    /**
     * ngOnChanges
     */
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
    /**
     * createView
     * @param view
     */
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
    /**
     * updateView
     * @param view
     */
    updateView(view: IView): void {
        this.activeView = view;

        if ( this.views[ this.activeView.name ] === undefined) {
            this.views[ this.activeView.name ] = this.createView(view);
        }

        this.updateValue();

        this.vc.detach();
        this.vc.insert( this.views[ this.activeView.name ].hostView );
    }
    /**
     * updateValue
     */
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
