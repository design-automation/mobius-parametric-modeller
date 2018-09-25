import { Component, Input } from '@angular/core';
import { PortTypesAware } from '@shared/decorators';

@PortTypesAware
@Component({
  selector: 'port',
  template: `
            <div class='container--port' [class.invert]='data.type'>
                <div class='port' 
                    draggable=true
                    (dragstart)='dragStartPort($event)'
                    (drag)='dragPort($event)'
                    (dragend)='dragEndPort($event)'></div>
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
    @Input() zoom: number;

    private dragStart = { x: 0, y: 0 };
    private mouse_pos = { 
        start: {x: 0, y: 0}, 
        current: {x: 0, y: 0}
    }

    // dragStartPort($event): void{
    //     $event.stopPropagation();

    //     $event.dataTransfer.setDragImage( new Image(), 0, 0);
    //     this._startPort = port; 
    //     this._startPort['address'] = address;
    //     this._linkMode = true;
  
    //     let type: string;
    //     if(port instanceof InputPort){
    //       type = "pi";
    //     }
    //     if(port instanceof OutputPort){
    //       type = "po";
    //     }
        
  
    //     let port_position =  this.getPortPosition(address[0], address[1], type);
  
    //     this.mouse_pos.start = {x: port_position.x, y: port_position.y };
    //     this.mouse_pos.current = {x: port_position.x, y: port_position.y };
        
    //     this.dragStart = {x: $event.clientX, y: $event.clientY};
    // }

    // dragPort($event): void{
    //     $event.stopPropagation();

    //     // todo: compute total offset of this div dynamically
    //     // urgent!
    //     let relX: number = $event.clientX - this.dragStart.x; 
    //     let relY: number = $event.clientY - this.dragStart.y;
  
    //     this.mouse_pos.current.x += relX/this.zoom; 
    //     this.mouse_pos.current.y += relY/this.zoom; 
  
    //     this.dragStart = {x: $event.clientX, y: $event.clientY}; 
    // }

    // dragEndPort(): void{
    //     $event.stopPropagation();

    //     let relX: number = $event.clientX - this.dragStart.x; 
    //     let relY: number = $event.clientY - this.dragStart.y;
    //     this.mouse_pos.current.x += relX; 
    //     this.mouse_pos.current.y += relY; 
        
    //     this.dragStart = {x: 0, y: 0}; 
  
    //     this._startPort = undefined; 
    //     this._endPort = undefined;
    //     this._linkMode = false;
    // }

    // portDrop($event, port: InputPort|OutputPort, address: number[]){
      
    //     this._endPort = port; 
    //     this._endPort["address"] = address;
  
    //     if(this._startPort !== undefined && this._endPort !== undefined){
  
  
    //       let inputPort: number[]; 
    //       let outputPort: number[];
  
    //       if( this._startPort instanceof InputPort ){
    //         inputPort = this._startPort["address"];
    //       }
  
    //       if( this._startPort instanceof OutputPort ){
    //         outputPort = this._startPort["address"];
    //       }
  
    //       if( this._endPort instanceof InputPort ){
    //         inputPort = this._endPort["address"];
    //       }
  
    //       if( this._endPort instanceof OutputPort ){
    //         outputPort = this._startPort["address"];
    //       }
  
    //       if( inputPort !== undefined && outputPort !== undefined){
    //           this.addEdge(outputPort, inputPort);
    //       }
    //       else{
    //           alert("Invalid connection")
    //       }
  
    //       // clear the variables
    //       this._startPort = undefined; 
    //       this._endPort = undefined;
    //     }
    // }
}