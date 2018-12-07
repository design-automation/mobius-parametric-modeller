import { Component, OnInit, Input } from "@angular/core";
import {DataService} from "./data/data.service";
import { trigger, state, style, transition, animate, keyframes } from "@angular/animations";
import { INode } from "@models/node";

const defaultText = `{
  "type": "FeatureCollection",
  "name": "default",
  "crs": { "type": "name", "properties": { "name": "0" } },
  "features": [
  { "type": "Feature", "properties": { "OBJECTID": 1, "OID_1": 0, "INC_CRC": "593E775CE158CC1F", "FMEL_UPD_D": "2014\/06\/23", "X_ADDR": 26044.8109, "Y_ADDR": 48171.43, "SHAPE_Leng": 298.85929234299999, "SHAPE_Area": 1070.8993405900001 }, "geometry": { "type": "MultiPolygon", "coordinates": [] } }
  ]
  }`;

@Component({
  selector: "mobius-cesium",
  templateUrl: "./mobius-cesium.component.html",
  styleUrls: ["./mobius-cesium.component.scss"],
  animations: [
    trigger("slide_in_out", [
      state("slide_in", style({
        width: "280px",
        // css styles when the element is in slide_in
      })),
      state("slide_out", style({
        width: "0px"
        // css styles when the element is in slide_out
      })),
      // animation effect when transitioning from one state to another
      transition("slide_in <=> slide_out", animate(300))
    ]),
  ],
})
export class MobiuscesiumComponent {
  @Input() node: INode;
  @Input() mode: string;
  data: JSON;
  text: string;
  private showFiller:boolean;

  constructor(private dataService: DataService) {

  	};
  //pass data to dataService
  public setModel(data: JSON): void {
  	try {
  		this.dataService.setGsModel(data);
  	}
  	catch(ex) {
			this.text = '';
  		this.data = undefined;

  	}
  }
  //pass data to dataService
  public ngOnInit() {
		this.text = this.node.output.value;
		this.data = JSON.parse(this.text||defaultText);
  	this.setModel(this.data);
    this.dataService.setMode(this.mode);
    // console.log(this.data);

  }
  public ngDoCheck() {
  	if(this.text !== this.node.output.value) {
			this.text = this.node.output.value;
      this.data = JSON.parse(this.text||defaultText);
  		this.setModel(this.data);
      // console.log("data changed");
      // console.log("mode:", this.mode);
  	}
  }

  //create slider to switch setting
  private slider_state:string = "slide_out";
  public toggleSlider(): void {
    // do something to change the animation_state variable
  	this.slider_state = this.slider_state === "slide_out" ? "slide_in" : "slide_out";
  	let toggle=document.getElementById("Toggle");
  	if(this.slider_state === "slide_out") {
  	  toggle.style.left="0px";
      toggle.innerHTML="▹";
  	} else if(this.slider_state === "slide_in") {
  	  toggle.style.left="280px";
      toggle.innerHTML="◃";

  	}
	}
}
