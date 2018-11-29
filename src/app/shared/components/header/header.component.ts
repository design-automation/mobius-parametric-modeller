import { Component, Input } from '@angular/core';
import { INode } from '@models/node';

@Component({
  selector: 'panel-header',
  template:  `<div class='panel__header'>
                    <h3>{{node?.name}} // {{title}}</h3>
              </div>`,
  styles: [
            `.panel__header{
                font-weight: 600;
                border: 2px solid #222;
                border-radius: 4px;
                padding: 5px;
             }
             h3{
                margin: 0px;
             }`
          ]
})
export class HeaderComponent {

    @Input() node: INode;
    @Input() title: string;

    constructor() {}
}
