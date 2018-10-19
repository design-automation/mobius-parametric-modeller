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
	dragStart = {x: 0, y: 0};
	trend = {x: 1, y: 1};
	shakeCount: number = 0;

	/*
	@HostListener("mousedown", ['$event'])
	mdown($event): void{
		if(!$event.ctrlKey) return;
		event.preventDefault();
		event.stopPropagation();
	}

	@HostListener("mousemove", ['$event'])
	mmove($event): void{
		if(!$event.ctrlKey) return;
		event.preventDefault();
		event.stopPropagation();
	}
	*/
	
	@HostListener("dragstart", ['$event'])
	nodeDragStart($event): void{
		if($event.ctrlKey) return;
		event.stopPropagation();
		// todo : find more elegant solution
		this.dragStart = {x: $event.pageX, y: $event.pageY}; 

		if ($event.dataTransfer.setDragImage){
			$event.dataTransfer.setData('text', this.node.id);  
		}
		if (!!window['chrome']&& !!window['chrome']['webstore']){
			$event.dataTransfer.setDragImage( new Image(), 0, 0);
		}

		this.trend = {x: 1, y: 1};
		this.shakeCount = 0; 

		if(!this.node.position){
			console.warn("Setting nodde position in directive");
			this.node.position = {x: 0, y: 0};
		}
	}
	
	@HostListener("drag", ['$event'])
	nodeDragging($event): void{
		if($event.ctrlKey) return;

		let relX: number = $event.pageX - this.dragStart.x; 
		let relY: number = $event.pageY - this.dragStart.y;
		/*
		// if node is going beyond canvas, do nothing
		if( (this.node.position.x + relX/this.zoom) < 0 || (this.node.position.y + relY/this.zoom) < 0){
			return;
		}
		*/
		
		this.node.position.x += relX/this.zoom; 
		this.node.position.y += relY/this.zoom; 

		this.dragStart = {x: $event.pageX, y: $event.pageY};

		if(relX && relY){
			if( Math.sign(relX) !== this.trend.x || Math.sign(relY) !== this.trend.y ){
				this.trend = {x: Math.sign(relX), y: Math.sign(relY) };
				this.shakeCount++;

				if(this.shakeCount == 8){
					this.shaken.emit();
					// this.$log.log(`Disconnecting node ${this.node.name}`);
					// this.fc = FlowchartConnectionUtils.disconnect_node(this.fc, nodeIndex);
					// this.push_flowchart();
				}

			}
		}
	}

	@HostListener("dragend", ['$event'])
	nodeDragEnd($event: DragEvent): void{
		if($event.ctrlKey) return;

		let relX: number = $event.pageX - this.dragStart.x; 
		let relY: number = $event.pageY - this.dragStart.y;
		if( (this.node.position.x + relX/this.zoom) < 0 || (this.node.position.y + relY/this.zoom) < 0){
			return;
		}
		
		this.node.position.x += relX; 
		this.node.position.y += relY; 

		this.dragStart = {x:  0, y: 0};

		this.trend = {x: 1, y: 1};
		this.shakeCount = 0;
		this.dragged.emit({x: this.node.position.x, y: this.node.position.y});
	}

	
}