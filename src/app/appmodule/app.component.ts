import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '@services';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { GoogleAnalyticsService } from '@shared/services/google.analytics';


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

    constructor(private dataService: DataService, private injector: Injector,
        private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer,
        private googleAnalyticsService: GoogleAnalyticsService) {
        this.matIconRegistry.addSvgIcon('c3D Viewer', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/3D.svg'));
        this.matIconRegistry.addSvgIcon('cConsole', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/Console.svg'));
        this.matIconRegistry.addSvgIcon('cHelp', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/Help.svg'));
        this.matIconRegistry.addSvgIcon('cSummary', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/Summary.svg'));
        this.matIconRegistry.addSvgIcon('cZoom', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/Zoom.svg'));
        this.matIconRegistry.addSvgIcon('cfv', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/Mobius favicon.svg'));
        this.matIconRegistry.addSvgIcon('cMenu', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/Three Lines Menu.svg'));
        this.matIconRegistry.addSvgIcon('cGallery', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/Home.svg'));
        this.matIconRegistry.addSvgIcon('cDashboard', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/Dashboard.svg'));
        this.matIconRegistry.addSvgIcon('cFlowchart', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/Flowchart.svg'));
        this.matIconRegistry.addSvgIcon('cEditor', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/Node.svg'));
    }

    ngOnInit() {
        this.googleAnalyticsService.subscribe();
    }
    ngOnDestroy() {
        this.googleAnalyticsService.unsubscribe();
    }

}
