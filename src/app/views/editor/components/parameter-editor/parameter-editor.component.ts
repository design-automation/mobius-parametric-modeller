import { Component, Input } from '@angular/core';
import { INode } from '@models/node';

@Component({
  selector: 'parameter-editor',
  templateUrl: './parameter-editor.component.html',
  styleUrls: ['./parameter-editor.component.scss']
})
export class ParameterEditorComponent{
    @Input() node: INode;
}


