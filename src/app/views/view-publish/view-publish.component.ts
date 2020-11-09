import { Component, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { IFlowchart } from '@models/flowchart';
import { INode } from '@models/node';
import { DataService } from '@services';
import { Router } from '@angular/router';
import { LoadUrlComponent } from '@shared/components/file/loadurl.component';
import { DataOutputService } from '@shared/services/dataOutput.service';


@Component({
  selector: 'view-publish',
  templateUrl: './view-publish.component.html',
  styleUrls: ['./view-publish.component.scss']
})
export class ViewPublishComponent implements AfterViewInit, OnDestroy {

    private ctx = document.createElement('canvas').getContext('2d');
    expando_href: string;

    constructor(private dataService: DataService,
                private dataOutputService: DataOutputService,
                private router: Router) {
        new LoadUrlComponent(this.dataService, this.router).loadStartUpURL(this.router.url.split(/\s*&*\s*node\s*=/)[0]);
        this.ctx.font = '400 12px arial';
        this.dataService.splitVal = 100;
        this.dataService.attribVal = -1;
        this.attribTogglePos();
        const url = window.location.href.replace(/:/g, '%3A').replace(/\//g, '%2F');
        this.expando_href = `http://expando.github.io/add/?u=${url}&t=M%C3%B6bius%20Modeller%20Publish`;
    }

    ngAfterViewInit() {
        setTimeout(() => {
            // this.adjustTextArea();
            this.dataService.attribVal = 0;
        }, 1000);
    }

    ngOnDestroy() {
        this.ctx = null;
    }

    viewerData() {
        return this.dataOutputService.getViewerData(this.getNode(), this.dataService.flowchart.model, true);
    }

    adjustTextArea() {
        // if (!this.ctx) { return; }
        // let textarea = document.getElementById('display-flowchart-desc');
        // if (textarea) {
        //     const desc = this.dataService.flowchart.description.split('\n');
        //     const textareaWidth = textarea.getBoundingClientRect().width - 30;
        //     let lineCount = 0;
        //     for (const line of desc) {
        //         lineCount += Math.floor(this.ctx.measureText(line).width / textareaWidth) + 1;
        //     }
        //     textarea.style.height = lineCount * 14 + 4 + 'px';
        // }
        // for (const prod of this.dataService.flowchart.nodes[0].procedure) {
        //     if (!prod.enabled || prod.type !== 10 || prod.meta.inputMode === 5) { continue; }
        //     textarea = document.getElementById(prod.ID + '_desc');
        //     if (textarea) {
        //         const desc = prod.meta.description.split('\n');
        //         const textareaWidth = textarea.getBoundingClientRect().width - 30;
        //         let lineCount = 0;
        //         for (const line of desc) {
        //             lineCount += Math.floor(this.ctx.measureText(line).width / textareaWidth) + 1;
        //         }
        //         textarea.style.height = lineCount * 14 + 4 + 'px';
        //     }
        // }
        // textarea = null;
    }

    getEndNode(): INode {
      for (const node of this.dataService.flowchart.nodes) {
        if (node.type === 'end') { return node; }
      }
    }

    checkShareBtn() {
        return true;
    }

    setSplit(event) {
        this.dataService.splitUpdate = true;
        this.dataService.splitVal = event.sizes[1];
        this.adjustTextArea();
    }
    toggleSlider() {
        this.dataService.splitUpdate = true;
        if (this.dataService.splitVal < 100) {
            this.dataService.splitVal = 100;
            return;
        }
        this.dataService.splitVal = 100 - (25000 / document.body.clientWidth);
    }

    getSplit() { return this.dataService.splitVal; }
    getFlowchart() { return this.dataService.flowchart; }
    getNode() { return this.dataService.node; }

    toggleAttrib() {
        this.dataService.attribUpdate = true;
        if (this.dataService.attribVal > 0) {
            this.dataService.attribVal = 0;
            setTimeout(() => {
                const btn = document.getElementById('attribToggle');
                btn.style.bottom = 0 + 'px';
            }, 0);
            return;
        }
        this.dataService.attribVal = 25000 / document.body.clientHeight;
        setTimeout(() => {
            // this.attribTogglePos();
            const btn = document.getElementById('attribToggle');
            btn.style.bottom = 255 + 'px';
    }, 0);
    }
    getAttribSplit() { return this.dataService.attribVal; }
    attribTogglePos() {
        const attrib = document.getElementById('attrib');
        if (attrib) {
            const btn = document.getElementById('attribToggle');
            btn.style.bottom = attrib.clientHeight + 5 + 'px';
        } else {
            const btn = document.getElementById('attribToggle');
            if (btn) {
                btn.style.display = 'none';
            }
        }
    }
}

