import { Component, Input } from '@angular/core';
import { INode } from '@models/node';
import { PortType } from '@models/port';
import { IFlowchart } from '@models/flowchart';

@Component({
  selector: 'parameter-editor',
  templateUrl: './parameter-editor.component.html',
  styleUrls: ['./parameter-editor.component.scss']
})
export class ParameterEditorComponent{
    @Input() node: INode;
    @Input() flowchart: IFlowchart;
    /*
    deletePort(port, index){
      const porttype = port.type;

      if(porttype == PortType.Input && this.node.input[index] !== undefined){
          this.node.input.splice(index, 1);
      }
      else if(porttype == PortType.Output && this.node.output[index] !== undefined){
          this.node.output.splice(index, 1);
      }

    }
    */
}


