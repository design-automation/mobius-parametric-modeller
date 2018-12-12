import { Component, Input, AfterContentInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { INode } from '@models/node';
import { PortType } from '@models/port';
import { IFlowchart } from '@models/flowchart';
import { MatTextareaAutosize } from '@angular/material';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
ctx.font = '12px sans-serif';

@Component({
  selector: 'parameter-editor',
  templateUrl: './parameter-editor.component.html',
  styleUrls: ['./parameter-editor.component.scss']
})
export class ParameterEditorComponent implements AfterViewInit {
    @Input() node: INode;
    @Input() flowchart: IFlowchart;

    ngAfterViewInit() {
        const textarea = document.getElementById('flowchart-desc');
        const desc = this.flowchart.description.split('\n');
        const textareaWidth = textarea.getBoundingClientRect().width;
        let lineCount = desc.length;
        for (const line of desc) {
            lineCount += Math.floor(ctx.measureText(line).width / textareaWidth) + 1;
        }

        textarea.style.height = lineCount * 7.2 + 'px';
    }

}


