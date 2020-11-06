import { Component, Injector, OnInit, OnDestroy, Injectable } from '@angular/core';
import { DataService } from '@services';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { GoogleAnalyticsService } from '@shared/services/google.analytics';
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    subscribe: any;
    // notificationMessage = 'Saving Flowchart...';
    // notificationTrigger = true;

    constructor(private dataService: DataService, private injector: Injector,
        private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer,
        private googleAnalyticsService: GoogleAnalyticsService) {
        this.matIconRegistry.addSvgIcon('printDis', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/Print_disabled.svg'));
        this.matIconRegistry.addSvgIcon('print', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/iconPrint.svg'));
        this.matIconRegistry.addSvgIcon('disabled', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/iconDisabled.svg'));
        this.matIconRegistry.addSvgIcon('settings', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/Settings.svg'));
        this.matIconRegistry.addSvgIcon('select', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/Select.svg'));
        this.matIconRegistry.addSvgIcon('terminate', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/Terminate.svg'));
        this.matIconRegistry.addSvgIcon('c3D Viewer', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/3D2.svg'));
        this.matIconRegistry.addSvgIcon('cGeo Viewer', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/Geo.svg'));
        this.matIconRegistry.addSvgIcon('cThree Geo Viewer', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/Geo.svg'));
        this.matIconRegistry.addSvgIcon('cCytoscape Viewer', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/cyto.svg'));
        this.matIconRegistry.addSvgIcon('cMobius Cesium', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/Geo2.svg'));
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
        this.matIconRegistry.addSvgIcon('cAdd', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/add.svg'));
        this.matIconRegistry.addSvgIcon('cRemove', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/remove.svg'));
        this.matIconRegistry.addSvgIcon('cCredits', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/Credits.svg'));
        this.matIconRegistry.addSvgIcon('cUpArrow', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/arrowup.svg'));
        this.matIconRegistry.addSvgIcon('cDnArrow', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/arrowdown.svg'));
        this.matIconRegistry.addSvgIcon('cControlCam', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/ControlCam.svg'));

        // const source = timer(600000, 600000);
        // this.subscribe = source.subscribe(val => {
        //     try {
        //         SaveFileComponent.saveFileToLocal(this.dataService.file);
        //         this.dataService.notifyMessage(`Auto-saving Flowchart as ${this.dataService.flowchart.name}...`);
        //     } catch (ex) {
        //         this.dataService.notifyMessage('ERROR: Unable to save Flowchart');
        //     }
        // });
    }

    ngOnInit() {
        this.googleAnalyticsService.subscribe();
    }
    ngOnDestroy() {
        this.googleAnalyticsService.unsubscribe();
        this.subscribe.unsubscribe();
    }

    notificationMsg() {
        return this.dataService.notificationMessage;
    }

    notificationTrig() {
        return this.dataService.notificationTrigger;
    }

}

@Injectable()
export class NoCacheHeadersInterceptor implements HttpInterceptor {
intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authReq = req.clone({
      // Prevent caching in IE, in particular IE11.
      // See: https://support.microsoft.com/en-us/help/234067/how-to-prevent-caching-in-internet-explorer
      setHeaders: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache'
      }
    });
    return next.handle(authReq);
  }
}
