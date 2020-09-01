import { Component, Injector, Input,
    ViewChild, ViewContainerRef, ComponentFactoryResolver, OnDestroy, OnInit, DoCheck } from '@angular/core';
import { IView } from './view.interface';
import { Viewers } from './model-viewers.config';
import { DataService } from '@services';
import { DataService as GIDataService } from './all-viewers/gi-viewer/data/data.service';
import { Router } from '@angular/router';

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
    @Input() data: any;
    private views = [];
    private activeView: IView;
    Viewers = Viewers;
    /**
     * Construct the viewer container.
     * @param injector
     * @param r
     */
    constructor(private injector: Injector, private r: ComponentFactoryResolver, private dataService: DataService,
                private giDataService: GIDataService, private router: Router) {
        let viewCheck: any;
        if (this.router.url.split('?')[0] === '/publish') {
            this.Viewers = [];
            viewCheck = this.router.url.split('showViewer=');

            if (viewCheck.length === 1) { viewCheck = '';
            } else { viewCheck = viewCheck[1].split('&')[0]; }

            for (const view of Viewers) {
                if (view.component.name === 'HelpViewerComponent') { continue; }
                if (view.component.name === 'ConsoleViewer') {
                    this.Viewers.push(view);
                    continue;
                }
                if (viewCheck === '0') { continue; }
                if (viewCheck === '1' && view.component.name === 'GICesiumViewerComponent') { continue; }
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
                    this.dataService.activeView = 'Geo Viewer';
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
                componentRef.instance['data'] = this.data;
            // } else {
            //     componentRef.instance['scrollcheck'] = true;
            }
        } catch (ex) {
            // console.log(`Active View not defined`);
        }
    }
}
