import { Component, Injector, Input,
    ViewChild, ViewContainerRef, ComponentFactoryResolver, OnDestroy, OnInit, OnChanges } from '@angular/core';
import { IView } from './view.interface';
import { Viewers } from './model-viewers.config';
import { INode } from '@models/node';
import { EventEmitter } from 'events';
import { DataService } from '@services';

/**
 * A component that contains all the viewers.
 * This component is used in /app/appmodule/app.component.html
 */
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'model-viewers-container',
    templateUrl: 'model-viewers-container.component.html',
    styleUrls: ['model-viewers-container.component.scss']
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
    constructor(private injector: Injector, private r: ComponentFactoryResolver, private dataService: DataService) {
        // do nothing
    }
    /**
     * ngOnInit
     */
    ngOnInit() {
        this.activeView = this.Viewers[0];
        if (this.dataService.activeView) {
            for (const view of this.Viewers) {
                if (view.name === this.dataService.activeView) {
                    this.activeView = view;
                }
            }
        }
        this.updateView( this.activeView );
    }
    /**
     * ngOnDestroy
     */
    ngOnDestroy() {
        this.dataService.activeView = this.activeView.name;
        this.vc.clear();
        for (const view in this.views) {
            if (this.views[view]) {
                this.views[view].destroy();
            }
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
