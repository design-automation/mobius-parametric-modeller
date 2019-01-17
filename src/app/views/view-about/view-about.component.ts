import { Component, Input } from '@angular/core';
import { IFlowchart } from '@models/flowchart';
import { INode } from '@models/node';
import { DataService } from '@services';
import { Router } from '@angular/router';
import { LoadUrlComponent } from '@shared/components/file/loadurl.component';

@Component({
  selector: 'view-about',
  templateUrl: './view-about.component.html',
  styleUrls: ['./view-about.component.scss']
})
export class ViewAboutComponent {

    constructor(private dataService: DataService, private router: Router) {
        new LoadUrlComponent(this.dataService, this.router).loadStartUpURL(this.router.url);
    }

    routeTo(url: string) { this.router.navigate([url]); }
    getFlowchart() { return this.dataService.flowchart; }
}

