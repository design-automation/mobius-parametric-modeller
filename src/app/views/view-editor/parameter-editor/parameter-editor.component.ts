import { Component, Input, AfterContentInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { INode, NodeUtils } from '@models/node';
import { PortType } from '@models/port';
import { IFlowchart } from '@models/flowchart';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

@Component({
  selector: 'parameter-editor',
  templateUrl: './parameter-editor.component.html',
  styleUrls: ['./parameter-editor.component.scss']
})
export class ParameterEditorComponent implements AfterViewInit {
    @Input() node: INode;
    @Input() flowchart: IFlowchart;

    ngAfterViewInit() {
        ctx.font = '12px sans-serif';

        const textarea = document.getElementById('flowchart-desc');
        if (!textarea) { return; }
        const desc = this.flowchart.description.split('\n');
        const textareaWidth = textarea.getBoundingClientRect().width - 20;
        let lineCount = 0;
        for (const line of desc) {
            lineCount += Math.floor(ctx.measureText(line).width / textareaWidth) + 1;
        }
        textarea.style.height = lineCount * 14 + 4 + 'px';
    }

    deleteProd(index: number) {
        this.node.procedure.splice(index, 1);
        NodeUtils.deselect_procedure(this.node);
    }

    inputSize(val) {
        ctx.font = 'bold 12px arial';
        return ctx.measureText(val).width + 2;
    }

}


