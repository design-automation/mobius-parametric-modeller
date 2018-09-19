import { Component, Input, Output, EventEmitter } from '@angular/core';
import { INode } from '@models/node';


@Component({
  selector: 'node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent{
    
    @Input() node: INode;
    @Input() zoom: number;
    @Input() selected: boolean;
    
    @Input() node_index: number;

    @Output() select = new EventEmitter();

    ngOnInit(){ }

    updatePosition(position){ 
        this.node.position = position; 
    };

    nodeClicked($event){
        this.select.emit(this.node_index);
    }

}
