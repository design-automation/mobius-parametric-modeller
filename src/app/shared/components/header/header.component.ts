import { Component, Input } from '@angular/core';
import { INode } from '@models/node';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

const menu = require('@assets/Icons/Three Lines Menu.svg');
const gallery = require('@assets/Icons/Home.svg');
const dashboard = require('@assets/Icons/Dashboard.svg');
const flowchart = require('@assets/Icons/Flowchart.svg');
const node = require('@assets/Icons/Node.svg');

@Component({
  selector: 'panel-header',
  templateUrl:  `header.component.html`,
  styleUrls: [`header.component.scss`]
})
export class HeaderComponent {

    @Input() node: INode;
    @Input() title: string;

    constructor(private router: Router, private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
        this.matIconRegistry.addSvgIcon('cMenu', this.domSanitizer.bypassSecurityTrustResourceUrl(menu));
        this.matIconRegistry.addSvgIcon('cGallery', this.domSanitizer.bypassSecurityTrustResourceUrl(gallery));
        this.matIconRegistry.addSvgIcon('cDashboard', this.domSanitizer.bypassSecurityTrustResourceUrl(dashboard));
        this.matIconRegistry.addSvgIcon('cFlowchart', this.domSanitizer.bypassSecurityTrustResourceUrl(flowchart));
        this.matIconRegistry.addSvgIcon('cEditor', this.domSanitizer.bypassSecurityTrustResourceUrl(node));
      }
}
