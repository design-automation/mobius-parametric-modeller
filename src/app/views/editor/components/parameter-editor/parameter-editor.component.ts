import { Component, Input } from '@angular/core';
import { INode } from '@models/node';
import { PortType } from '@models/port';

@Component({
  selector: 'parameter-editor',
  templateUrl: './parameter-editor.component.html',
  styleUrls: ['./parameter-editor.component.scss']
})
export class ParameterEditorComponent{
    @Input() node: INode;

    deletePort(port, index){
      const porttype = port.type;

      if(porttype == PortType.Input && this.node.inputs[index] !== undefined){
          this.node.inputs.splice(index, 1);
      }
      else if(porttype == PortType.Output && this.node.outputs[index] !== undefined){
          this.node.outputs.splice(index, 1);
      }

    }
}


