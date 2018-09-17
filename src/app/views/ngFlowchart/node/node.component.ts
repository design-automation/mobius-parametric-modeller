import { Component, Input } from '@angular/core';
import { INode } from '@models/node';


@Component({
  selector: 'node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent{
    
    @Input() node: INode;
    @Input() zoom: number;
    @Input() node_index: number;

    ngOnInit(){ }

    updatePosition(position){ 
        this.node.position = position; 
    };
}
