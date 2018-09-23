import { Component, Input } from '@angular/core';
import { PortTypesAware } from '@shared/decorators';

@PortTypesAware
@Component({
  selector: 'port',
  template: `
            <div class='container--port' [class.invert]='data.type'>
                <div class='port'></div>
                <input autocomplete=off [(ngModel)]='data.name' placeholder='port_name'>
            </div>
            `,
  styles:   [
      `
        .container--port{
            display: flex; 
            flex-direction: row;
            margin: 5px 0px 5px -12.5px;
        }

        input{
            padding: 0px;
            max-width: 70px;
            font-size: 12px;
            line-height: 20px;
            background: transparent;
            border-style: solid;
            border: 0px;
            border-bottom: 1px dashed gray;

            height: 20px;
        }
        
        .port {
                width: 5px; 
                height: 5px;
                border: 2px solid #222;
                background-color: #222;
                border-radius: 50%; 
                margin-top: 6.5px;
        }

        input{
                margin: 0px 5px;
        }
        
        .invert{ 
                flex-direction: row-reverse; 
                margin: 5px -12.5px 5px 0px; 
        }

        .invert > input{
            text-align: right;
        }
       
       `]
})
export class PortComponent{
    @Input() data: any;
}