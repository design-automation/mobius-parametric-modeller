import { Component, Input, AfterViewInit, OnDestroy, HostListener, ViewChild } from '@angular/core';
import { IFlowchart } from '@models/flowchart';
import { INode } from '@models/node';
import { DataService } from '@services';
import { Router } from '@angular/router';
import { LoadUrlComponent } from '@shared/components/file/loadurl.component';
import { DataOutputService } from '@shared/services/dataOutput.service';
import { SplitComponent } from 'angular-split';

@Component({
  selector: 'view-dashboard',
  templateUrl: './view-dashboard.component.html',
  styleUrls: ['./view-dashboard.component.scss']
})
export class ViewDashboardComponent implements AfterViewInit, OnDestroy {

    private ctx = document.createElement('canvas').getContext('2d');
    @ViewChild('dashboardSplit', { static: true }) dashboardSplit: SplitComponent;

    constructor(private dataService: DataService,
                private dataOutputService: DataOutputService,
                private router: Router) {
        new LoadUrlComponent(this.dataService, this.router).loadStartUpURL(this.router.url);
        this.ctx.font = '400 12px arial';
    }

    ngAfterViewInit() {
        // setTimeout(() => {
        //     this.adjustTextArea();
        // }, 100);
    }

    ngOnDestroy() {
        this.ctx = null;
    }

    viewerData() {
        return this.dataOutputService.getViewerData(this.getNode(), this.dataService.flowchart.model, true);
    }

    // adjustTextArea() {
    //     if (!this.ctx) { return; }
    //     let textarea = document.getElementById('display-flowchart-desc');
    //     if (textarea) {
    //         const desc = this.dataService.flowchart.description.split('\n');
    //         const textareaWidth = textarea.getBoundingClientRect().width - 30;
    //         let lineCount = 0;
    //         for (const line of desc) {
    //             lineCount += Math.floor(this.ctx.measureText(line).width / textareaWidth) + 1;
    //         }
    //         textarea.style.height = lineCount * 14 + 4 + 'px';
    //     }
    //     for (const prod of this.dataService.flowchart.nodes[0].procedure) {
    //         if (!prod.enabled || prod.type !== 10 || prod.meta.inputMode === 5) { continue; }
    //         textarea = document.getElementById(prod.ID + '_desc');
    //         if (textarea && prod.meta.description) {
    //             const desc = prod.meta.description.split('\n');
    //             const textareaWidth = textarea.getBoundingClientRect().width - 30;
    //             let lineCount = 0;
    //             for (const line of desc) {
    //                 lineCount += Math.floor(this.ctx.measureText(line).width / textareaWidth) + 1;
    //             }
    //             textarea.style.height = lineCount * 14 + 4 + 'px';
    //         }
    //     }
    //     textarea = null;
    // }

    getEndNode(): INode {
      for (const node of this.dataService.flowchart.nodes) {
        if (node.type === 'end') { return node; }
      }
    }

    // viewerData(): any {
    //     const node = this.dataService.flowchart.nodes[this.dataService.flowchart.meta.selected_nodes[0]];
    //     if (!node || !node.enabled) { return ''; }
    //     // if (node.type === 'output') { return node.input.value; }
    //     return node.model;
    // }

    setSplit(event) {
        this.dataService.splitUpdate = true;
        this.dataService.splitVal = event.sizes[1];
        // this.adjustTextArea();
    }

    getSplit() { return this.dataService.splitVal; }
    getFlowchart() { return this.dataService.flowchart; }
    getNode() { return this.dataService.node; }
    getFlowchartName() { return this.dataService.file.name; }

    @HostListener('document:mouseleave', [])
    onmouseleave() {
        this.dashboardSplit.notify('end', this.dashboardSplit.gutterSize);
    }

}

