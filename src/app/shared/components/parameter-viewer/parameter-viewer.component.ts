import { Component, Input, AfterViewInit } from '@angular/core';
import { INode } from '@models/node';
import { IFlowchart } from '@models/flowchart';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
ctx.font = '12px sans-serif';

@Component({
  selector: 'parameter-viewer',
  templateUrl: './parameter-viewer.component.html',
  styleUrls: ['./parameter-viewer.component.scss']
})
export class ParameterViewerComponent implements AfterViewInit {
    @Input() flowchart: IFlowchart;
    @Input() startNode: INode;
    @Input() endNode: INode;

    ngAfterViewInit() {
        const textarea = document.getElementById('display-flowchart-desc');
        const desc = this.flowchart.description.split('\n');
        const textareaWidth = textarea.getBoundingClientRect().width;
        let lineCount = desc.length;
        for (const line of desc) {
            lineCount += Math.floor(ctx.measureText(line).width / textareaWidth) + 1;
        }

        textarea.style.height = lineCount * 7 + 'px';
    }

}


