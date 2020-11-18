import { Component, Input, AfterViewInit } from '@angular/core';
import { INode } from '@models/node';
import { IFlowchart } from '@models/flowchart';
import { modifyArgument } from '@shared/parser';
import { IProcedure } from '@models/procedure';
import { DataService } from '@shared/services';


@Component({
  selector: 'parameter-viewer',
  templateUrl: './parameter-viewer.component.html',
  styleUrls: ['./parameter-viewer.component.scss']
})
export class ParameterViewerComponent {
    @Input() flowchart: IFlowchart;
    @Input() startNode: INode;
    @Input() endNode: INode;

    constructor(private dataService: DataService) {}

    displayName() {
        return this.flowchart.name.replace(/_/g, ' ');
    }


    getDesc(desc: string) {
        return desc.split('\n').join('<br>');
    }

    performAction(event: any, index: number) {
        switch (event.type) {
            case 'argMod':
                this.argMod(event.content);
                break;
        }
    }

    argMod(prod: IProcedure) {
        if (!prod.args[1].value) { return; }
        modifyArgument(prod, 1, this.startNode.procedure);
        if (prod.args[1].invalidVar) {
            this.dataService.notifyMessage(prod.args[1].invalidVar);
        }
    }

}


