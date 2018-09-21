import { Component, Input } from '@angular/core';
import { INode } from '@models/node';

@Component({
  selector: 'parameter-viewer',
  templateUrl: './parameter-viewer.component.html',
  styleUrls: ['./parameter-viewer.component.scss']
})
export class ParameterViewerComponent{
    @Input() node: INode;
}


