import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'edge',
  template:  `<div class="container--edge" 
                [style.top.px]="top"
                [style.left.px]="left"
                [style.width.px]="width"
                [style.height.px]="height"
                (click)="onSelect()">
                <canvas #canvas id='edge{{edge.id}}'></canvas>
              </div>`,
  styles: [
          `.container--edge{
            position: absolute;
          }`
        ],
})
export class EdgeComponent implements OnInit {

  @Input() edge;
  @Input() inputPosition;
  @Input() outputPosition;
  @Input() temporary;
  @ViewChild('canvas') canvas: ElementRef;

  _buffer: number = 50;
  
  top; 
  left;
  width; 
  height;

  constructor() {  }

  ngOnInit() {
      let canvas: HTMLCanvasElement = this.canvas.nativeElement;
      let context  = canvas.getContext('2d');
      
      this.drawEdge();
  }

  ngDoCheck(){
      this.drawEdge()
  }

  setDimensions(): void{
    this.top = this.getTop();
    this.left = this.getLeft();
    this.width = this.getWidth();
    this.height = this.getHeight();
  }

  getTop(): number{
    // return smallest y value
    return Math.min(this.edge.outputPosition.y, this.edge.inputPosition.y) - this._buffer;
  }	

  getLeft(): number{
    // return smallest x value
    return Math.min(this.edge.outputPosition.x, this.edge.inputPosition.x);//this.edge.outputPosition[0];
  }

  getWidth(): number{
  	return Math.max(10, Math.abs(this.edge.inputPosition.x - this.edge.outputPosition.x));//this.edge.outputPosition[0];
  }

  getHeight(): number{
    return 2*this._buffer + Math.max(10, Math.abs(this.edge.inputPosition.y - this.edge.outputPosition.y));
  }

  getPosition(edge): string{
  	return JSON.stringify(edge);
  }

  edgeClicked(): void{

  }

  isValid(): boolean{
      return Boolean(this.edge && this.edge.inputPosition && this.edge.outputPosition);
  }

  drawEdge(): void{
    try{
      if( this.isValid() ){

          this.setDimensions();

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

          let left_point = this.edge.outputPosition.x <= this.edge.inputPosition.x ? this.edge.outputPosition : this.edge.inputPosition;
          let right_point = this.edge.outputPosition.x > this.edge.inputPosition.x ? this.edge.outputPosition : this.edge.inputPosition;

          let startPoint: number[];
          let endPoint:  number[];

          if(left_point.y < right_point.y){

              //
              //    sp---
              //    |   |
              //    |__ep
              //

              startPoint = [ 0, this._buffer ];
              endPoint = [ this.width, this.height - this._buffer ];
          }
          else{
              //    __ep
              //   |    |
              //   |    |
              //    sp---
              //    

              startPoint = [0, this.height - this._buffer ];
              endPoint = [this.width, this._buffer ];
              
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
    }
    catch(ex){
      console.log(`Error drawing edge`);
    }

  }

  onSelect(): void{

  }



}
