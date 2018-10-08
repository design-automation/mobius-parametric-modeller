import { Component, OnInit, Input, ViewChild, ElementRef, DoCheck, Output, EventEmitter } from '@angular/core';
import { IEdge } from '@models/edge';

@Component({
  selector: 'edge',
  templateUrl: './edge.component.html',
  styles: [`
    .container--edge{
        position: absolute;
        border: 1px solid black;
        height: 30px; 
        width: 30px;
    }  
    .selected{
        border: 1px solid gray;
    }
  `]
})
export class EdgeComponent implements OnInit, DoCheck{

    readonly topBarHeight: number = 50;
    readonly leftWidth: number = 10;

    private getOffset( el ) {
        var _x = 0;
        var _y = 0;
        while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
            _x += el.offsetLeft - el.scrollLeft;
            _y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }
        return { y: _y - this.topBarHeight, x: _x - this.leftWidth };
    }

    @ViewChild('canvas') canvas: ElementRef;
    @Input() edge: IEdge;
    @Input() temporary: boolean;
    @Input() mouse;
    @Output() delete = new EventEmitter();

    edgePos = { inputPosition: undefined, outputPosition: undefined}; 
    _buffer: number = 50;

    select(){
        if (this.temporary) return;

        this.edge.selected = !this.edge.selected;
    }

    deleteEdge(){ 
        this.delete.emit()
    }

    getTop(): number{
        // return smallest y value
        return Math.min(this.edgePos.outputPosition.y, this.edgePos.inputPosition.y) - this._buffer;
    }	

    getLeft(): number{
        // return smallest x value
        return Math.min(this.edgePos.outputPosition.x, this.edgePos.inputPosition.x);//this.edgePos.outputPosition[0];
    }

    getWidth(): number{
        return Math.max(10, Math.abs(this.edgePos.inputPosition.x - this.edgePos.outputPosition.x));//this.edgePos.outputPosition[0];
    }

    getHeight(): number{
        return 2*this._buffer + Math.max(10, Math.abs(this.edgePos.inputPosition.y - this.edgePos.outputPosition.y));
    }

    drawEdge(): void{

        this.updatePositions();

        if( !this.edgePos.inputPosition || !this.edgePos.outputPosition){
            return;
        }

        let canvas: HTMLCanvasElement = this.canvas.nativeElement;
        let context  = canvas.getContext('2d');

        canvas.width = this.getWidth();
        canvas.height = this.getHeight();

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.lineWidth = 2;

        context.strokeStyle = this.temporary ? '#8AA8C0' : '#395D73';

        // if temporary edge
        if(this.temporary){
            context.setLineDash([5, 10])
        };

        let left_point = this.edgePos.outputPosition.x <= this.edgePos.inputPosition.x ? this.edgePos.outputPosition : this.edgePos.inputPosition;
        let right_point = this.edgePos.outputPosition.x > this.edgePos.inputPosition.x ? this.edgePos.outputPosition : this.edgePos.inputPosition;

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

        if( Math.abs(startPoint[0] - endPoint[0]) < 550 ||  Math.abs(startPoint[1] - endPoint[1]) < 550 ){
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

            // should be between 0.25 - 0, mapping to width
            // [0, inf) --> [0.01, 0.3]
            // fn(x) = (0.3*2/Math.PI)*tanh(x) + (1/ln(x + e^100))
            //let x: number = this.getWidth();
            //let distance_factor: number = (0.3*2/Math.PI)*Math.tanh(x) + (1/Math.log(x + Math.exp(100)));
            let distance_factor: number = 0.25;//canvas.width < canvas.height ? (canvas.width/canvas.height) : (canvas.height/canvas.width);

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

    updatePositions(): void{
        if (this.edge.source) this.edgePos.outputPosition = this.getOffset(document.getElementById(this.edge.source.id));
        if (this.edge.target) this.edgePos.inputPosition = this.getOffset(document.getElementById(this.edge.target.id));

        if(this.temporary){
            // get corrected mouse position
            let mouse_position = { y: this.mouse.y - this.topBarHeight, x: this.mouse.x - 2*this.leftWidth };
            
            if(this.edge.source == undefined) this.edgePos.outputPosition = mouse_position;
            if(this.edge.target == undefined) this.edgePos.inputPosition = mouse_position;
        }

    }
    
    ngOnInit() {
        this.drawEdge();
    }

    ngOnChanges(){
        this.drawEdge();
    }

    ngDoCheck(){
        if(this.edge != undefined && this.temporary == false){
            this.drawEdge();
        }   
    }

}
