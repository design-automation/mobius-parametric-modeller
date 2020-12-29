import { Component, Injector, Input,
    ViewChild, ViewContainerRef, ComponentFactoryResolver, OnDestroy, OnInit, DoCheck } from '@angular/core';
import { IView } from './view.interface';
import { Viewers } from './model-viewers.config';
import { DataService } from '@services';
import { DataService as GIDataService } from './all-viewers/gi-viewer/data/data.service';
import { Router } from '@angular/router';
import { GIModel } from '@assets/libs/geo-info/GIModel';
import { _parameterTypes } from '@assets/core/modules';

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
export class DataViewersContainerComponent implements DoCheck, OnInit, OnDestroy {
    @ViewChild('vc', { read: ViewContainerRef, static: true }) vc: ViewContainerRef;
    // @Input() data: any;
    private views = [];
    private activeView: IView;
    private emptyModel: GIModel;
    Viewers = Viewers;
    /**
     * Construct the viewer container.
     * @param injector
     * @param r
     */
    constructor(private injector: Injector, private r: ComponentFactoryResolver, private dataService: DataService,
                private giDataService: GIDataService, private router: Router) {
        let viewCheck: any;
        this.emptyModel = _parameterTypes.newFn();
        // this.emptyModel.nextSnapshot([]);

        const page = this.router.url.split('?')[0]
        viewCheck = this.router.url.split('showViewer=');
        this.Viewers = [];
        if (viewCheck.length === 1) { viewCheck = '';
        } else { viewCheck = decodeURIComponent(viewCheck[1].split('&')[0]); }
        if (viewCheck.length > 0 && viewCheck[0] === '[') {
            viewCheck = JSON.parse(viewCheck.split('&')[0]).sort();
            for (const v of viewCheck) {
                for (const view of Viewers) {
                    if (v === 1 && view.component.name === 'GIViewerComponent') { this.Viewers.push(view); }
                    if (v === 2 && view.component.name === 'GIGeoViewerComponent') { this.Viewers.push(view); }
                    if (v === 3 && view.component.name === 'ConsoleViewerComponent') { this.Viewers.push(view); }
                    if (v === 4 && view.component.name === 'HelpViewerComponent') { this.Viewers.push(view); }
                }
            }
        } else {
            for (const view of Viewers) {
                if (view.component.name === 'HelpViewerComponent') {
                    if (page !== '/publish' && page !== '/minimal') {
                        this.Viewers.push(view);
                    }
                    continue; }
                if (view.component.name === 'ConsoleViewerComponent') {
                    this.Viewers.push(view);
                    continue;
                }
                if (viewCheck === '0') { continue; }
                if (viewCheck === '1' && view.component.name === 'GIGeoViewerComponent') { continue; }
                if (viewCheck === '2' && view.component.name === 'GIViewerComponent') { continue; }
                this.Viewers.push(view);
            }
        }
        viewCheck = this.router.url.split('defaultViewer=');
        if (viewCheck.length > 1) {
            viewCheck = viewCheck[1].split('&')[0];
            switch (viewCheck) {
                case '0':
                    this.dataService.activeView = 'Console';
                    break;
                case '1':
                    this.dataService.activeView = '3D Viewer';
                    break;
                case '2':
                    this.dataService.activeView = 'Three Geo Viewer';
                    break;
            }
        }

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
        if (this.activeView.name !== '3D Viewer') {
            this.giDataService.switch_page = false;
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
     * ngDoCheck
     */
    ngDoCheck() {
        if (this.dataService.helpView[0] === true) {
            let view;
            for (const v of this.Viewers) {
                if (v.name === 'Help') { view = v; }
            }
            this.dataService.toggleViewHelp(false);
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
        componentRef.instance['nodeIndex'] = 1;
        componentRef.instance['data'] = this.emptyModel;
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
                // componentRef.instance['output'] = this.dataService.helpView[1];
            } else if (this.activeView.name !== 'Console') {
                if (!this.dataService.node.enabled || !this.dataService.node.model) {
                    componentRef.instance['nodeIndex'] = 1;
                    componentRef.instance['data'] = this.emptyModel;
                } else {
                    componentRef.instance['data'] = this.dataService.flowchart.model;
                    componentRef.instance['nodeIndex'] = this.dataService.node.model;
                }
            // } else {
            //     componentRef.instance['scrollcheck'] = true;
            }
        } catch (ex) {
            // console.log(`Active View not defined`);
        }
    }
}
