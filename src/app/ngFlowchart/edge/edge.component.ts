import { Component, OnInit, Input, ViewChild, ElementRef, DoCheck } from '@angular/core';
import { IEdge } from '@models/edge';
import { INode } from '@models/node';
@Component({
  selector: 'edge',
  templateUrl: './edge.component.html',
  styles: [`
    .container--edge{
        border: 1px solid black;
        height: 30px; 
        width: 30px;
    }  
  `]
})
export class EdgeComponent implements OnInit, DoCheck{

    _buffer: number = 50;

    @Input() edge: IEdge;
    @Input() nodeSourcePosition: {x: number, y: number};
    @Input() nodeTargetPosition: {x: number, y: number};

    inputPosition;
    outputPosition;

    ngOnInit(){
        console.log(this.edge, this.nodeSourcePosition, this.nodeTargetPosition);
        //console.log(document.getElementById('flw_node_index_' + this.edge.source[0]))
        //this.inputPosition = this.getPortPosition(this.nodeSourcePosition, this.edge.source[1], "pi");
        //this.outputPosition = this.getPortPosition(this.nodeTarget, this.edge.target[1], "po");
    }

    ngDoCheck(){
        //console.log(this.edge, this.nodeSourcePosition, this.nodeTargetPosition);
        //this.drawEdge();
    }
    
    private getPortPosition(node: INode, portIndex: number, type: string): {x: number, y: number}{
        let x: number;
        let y: number;
        let port_size: number = 15;

        let node_pos: number[] = node.position;
        console.log(node_pos);

        // let port_pos_x = el.offsetLeft;
        // let port_pos_y = el.offsetTop;
        // let node_width = el.offsetParent.offsetWidth;

        // if(type == "pi"){
        //     x = node_pos[0];
        //     y = node_pos[1] + (port_pos_y + port_size/2);
        // } 
        // else if(type == "po"){
        //     x = node_pos[0] + node_width;
        //     y = node_pos[1] + (port_pos_y + port_size/2);
        // }
        // else{
        //     throw Error("Unknown port type");
        // }

        return {x: x, y: y};
    }

    getWidth(): number{
        if(!this.inputPosition) return 0;

        return Math.max(10, Math.abs(this.inputPosition.x - this.outputPosition.x));  //this.outputPosition[0];
    }

    getHeight(): number{
        if(!this.inputPosition) return 0;

        return 2*this._buffer + Math.max(10, Math.abs(this.inputPosition.y - this.outputPosition.y));
    }

    @ViewChild('canvas') canvas: ElementRef;
    drawEdge(): void{
        let canvas: HTMLCanvasElement = this.canvas.nativeElement;
        let context  = canvas.getContext('2d');

        canvas.width = this.getWidth();
        canvas.height = this.getHeight();

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.lineWidth = 2;

        context.strokeStyle = '#395D73';

        let left_point = this.outputPosition.x <= this.inputPosition.x ? this.outputPosition : this.inputPosition;
        let right_point = this.outputPosition.x > this.inputPosition.x ? this.outputPosition : this.inputPosition;

        let startPoint: number[];
        let endPoint:  number[];

        if(left_point.y < right_point.y){

            //
            //    sp---
            //    |   |
            //    |__ep
            //

            startPoint = [ 0, this._buffer ];
            endPoint = [ this.getWidth(), this.getHeight() - this._buffer ];
        }
        else{
            //    __ep
            //   |    |
            //   |    |
            //    sp---
            //    

            startPoint = [0, this.getHeight() - this._buffer ];
            endPoint = [this.getWidth(), this._buffer ];
            
        }

        // move downwards/upwards in straight line
        let translate: number = 10; 
        let shifted_startPoint: number[] = [ startPoint[0]  + translate, startPoint[1] ];
        let shifted_endPoint: number[] = [ endPoint[0]  - translate, endPoint[1] ];

        context.beginPath();
        context.moveTo( startPoint[0], startPoint[1] );
        context.lineTo( shifted_startPoint[0], shifted_startPoint[1] );

        if( Math.abs(startPoint[0] - endPoint[0]) < 50 ||  Math.abs(startPoint[1] - endPoint[1]) < 50 ){
            context.lineTo( shifted_endPoint[0], shifted_endPoint[1] );
        }
        else{

            // compute curvy line
            var x0 = shifted_startPoint[0];
            var y0 = startPoint[1] ;
            var x3 =  shifted_endPoint[0];
            var y3 = endPoint[1] ;
        
            let seg1 = 0.75; 
            let seg2 = 0.25;

            var mx1=seg1*x0+seg2*x3;
            var mx2=seg2*x0+seg1*x3;

            var my1=seg1*y0+seg2*y3;
            var my2=seg2*y0+seg1*y3;
            let distance_factor: number = 0.25;

            var distance = distance_factor*Math.round(Math.sqrt(Math.pow((x3-x0),2)+Math.pow((y3-y0),2)));
            var pSlope =(x0-x3)/(y3-y0);
            var multi = Math.round(Math.sqrt(distance*distance/(1+(pSlope*pSlope))));
        
            var x1,y1,x2,y2=0;

            x1 =mx1+multi;
            x2 =mx2-multi;

            if(y0==y3){
            y1=y0+distance;
            y2=y0-distance;
            }
            else{
            y1 =my1+(pSlope*multi);
            y2 =my2-(pSlope*multi);
            }

            context.bezierCurveTo(x1, y1, x2, y2, shifted_endPoint[0], shifted_endPoint[1]);
            
        }
        
        context.lineTo( endPoint[0], endPoint[1] );
        context.stroke();
    }


}