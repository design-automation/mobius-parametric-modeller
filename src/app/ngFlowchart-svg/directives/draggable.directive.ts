/*
 *	Adding this to an HTML5 input element
 *	allows for the file being read to be converted into a Mobius 
 *	Flowchart
 * 
 */
import { Directive, ElementRef, 
         Input, Output,  
		 HostListener, EventEmitter } from '@angular/core';

@Directive({
	selector: "[ngDraggable]"
})
export class DraggableDirective { 

	@Input() node: any;
	@Input() zoom: number;
	@Output() dragged = new EventEmitter();
	@Output() shaken = new EventEmitter();

	constructor(private el: ElementRef){}

	//
	//  Node Draggin
	//
	coords = [0,0];
	
	@HostListener("mousedown", ['$event'])
	handleMouseDown(e:MouseEvent){
		console.log('.......')
		this.coords = [e.pageX, e.pageY]
		
	}
	
	@HostListener("mousemove", ['$event'])
	handleMouseMove(e:MouseEvent){
		const xDiff = this.coords[0] - e.pageX;
		const yDiff = this.coords[1] - e.pageY;
	
		this.coords[0] = e.pageX;
		this.coords[1] = e.pageY;
	
		this.node.position.x -= xDiff;
		this.node.position.y -= yDiff;
	};
		
	@HostListener("mouseup", ['$event'])
	handleMouseUp(){
		this.coords = [];
	}
	
	
}