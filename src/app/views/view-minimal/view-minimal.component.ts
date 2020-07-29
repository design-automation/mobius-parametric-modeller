import { Component, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { IFlowchart } from '@models/flowchart';
import { INode } from '@models/node';
import { DataService } from '@services';
import { Router } from '@angular/router';
import { LoadUrlComponent } from '@shared/components/file/loadurl.component';
import { DataOutputService } from '@shared/services/dataOutput.service';


@Component({
  selector: 'view-minimal',
  templateUrl: './view-minimal.component.html',
  styleUrls: ['./view-minimal.component.scss']
})
export class ViewMinimalComponent implements AfterViewInit {


    constructor(private dataService: DataService,
                private dataOutputService: DataOutputService,
                private router: Router) {
        new LoadUrlComponent(this.dataService, this.router).loadStartUpURL(this.router.url.split(/\s*&*\s*node\s*=/)[0]);
    }

    ngAfterViewInit() {
        setTimeout(() => {
        }, 100);
    }

    viewerData() {
        return this.dataOutputService.getViewerData(this.dataService.node, true);
    }
}

