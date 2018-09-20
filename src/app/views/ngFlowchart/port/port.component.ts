import { Component, Input } from '@angular/core';


@Component({
  selector: 'port',
  template: `<div class='container--port container--port-{{data.name}}'>
                <div class='port'></div>
                <input [(ngModel)]='data.name' placeholder='Name of Node'>
             </div>`,
  styles:   [
      `
      .container--port{
        display: flex; 
        flex-direction: row;
      }

      input{
          padding: 0px;
          max-width: 70px;
          font-size: 12px;
          line-height: 20px;
          border: none;
          border-bottom: 1px dashed gray;

          height: 20px;
      }
      
      .port {
            width: 15px; 
            height: 15px;
            border: 2px solid #222;
            background-color: #ddd;
            border-radius: 50%; 
            margin: 0px 0px;
       }`]
})
export class PortComponent{
    
    @Input() data: any;

    ngOnInit(){ }
}