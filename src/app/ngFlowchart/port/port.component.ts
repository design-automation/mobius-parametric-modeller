import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PortTypesAware } from '@shared/decorators';
import { PortType } from '@models/port';

@PortTypesAware
@Component({
  selector: 'port',
  template: `
            <div class='container--port' [class.invert]='data.type' 
                (drop)='portDrop($event)'
                (dragover)='portDragOver($event)'
                dropzone='link'>
                <div class='port' *ngIf="dragable; else hiddenPort"  
                    id={{data.id}}
                    draggable=true
                    (dragstart)='dragStartPort($event)'
                    (drag)='dragPort($event)'
                    (dragend)='dragEndPort($event)'></div>
                <ng-template #hiddenPort><div class='hiddenPort'></div></ng-template>
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
            z-index: 100;
        }
        
        .hiddenPort {
            margin: 0px 5px; 
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

    readonly dataTransferVar: string = 'connection';
    
    @Input() data: any;
    @Input() zoom: number;
    @Input() dragable: boolean;
    @Output() connected = new EventEmitter();

    private dragStart = { x: 0, y: 0 };
    private source: string;
    private mouse_pos = { 
        start: {x: 0, y: 0}, 
        current: {x: 0, y: 0}
    }

    portDragOver(event): void{
        event.preventDefault();
    }

    dragStartPort(event): void{
        event.stopPropagation();
        event.dataTransfer.setData(this.dataTransferVar, this.data.id );
        //event.dataTransfer.setDragImage( new Image(), 0, 0 );
    }

    dragPort(event): void{
        event.stopPropagation();
        //event.dataTransfer.setData(this.dataTransferVar, this.data.id );
        
        // todo: compute total offset of this div dynamically
        // urgent!
        let relX: number = event.clientX - this.dragStart.x; 
        let relY: number = event.clientY - this.dragStart.y;
        
        this.mouse_pos.current.x += relX; 
        this.mouse_pos.current.y += relY; 
        
        this.dragStart = {x: event.clientX, y: event.clientY}; 
        const nX = Number(event.clientX) / this.zoom;
        const nY = Number(event.clientY) / this.zoom;
        // TODO: Check if it is target or source based on porttype
        if(this.data.type == PortType.Input)
            this.connected.emit({target: this.data, dragging: true, mouse: {x: nX, y: nY} });
        else
            this.connected.emit({source: this.data, dragging: true, mouse: {x: nX, y: nY} });
    }

    dragEndPort(event): void{
        event.stopPropagation();

        let relX: number = event.clientX - this.dragStart.x; 
        let relY: number = event.clientY - this.dragStart.y;   
        this.mouse_pos.current.x += relX / this.zoom; 
        this.mouse_pos.current.y += relY / this.zoom; 
        
        this.dragStart = {x: 0, y: 0}; 

        if(this.data.type == PortType.Input)
            this.connected.emit({target: this.data, dragover: true});
        else
            this.connected.emit({source: this.data, dragover: true});

        
    }

    portDrop(event){
        event.preventDefault();
        // TODO: Check if it is target or source based on porttype
        if(this.data.type == PortType.Input)
            this.connected.emit({target: this.data});
        else
            this.connected.emit({source: this.data});
    }
}