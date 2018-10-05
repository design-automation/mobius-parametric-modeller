import { Component, OnInit, Injector, ElementRef ,NgModule} from "@angular/core";
import {DataSubscriber} from "../data/DataSubscriber";
import { DataService } from "../data/data.service";
import {ViewerComponent} from "../viewer/viewer.component";
import * as chroma from "chroma-js";

@Component({
  selector: "app-display",
  templateUrl: "./display.copmponent.html",
  styleUrls: ["./display.copmponent.css"],
})
export class DisplayComponent extends DataSubscriber implements OnInit {
  private myElement;
  private data: JSON;
  private mode: string;
  private _ImageryList: any[];
  private _Imagery: string;
  private _Sun: boolean;
  private _Shadow: boolean;
  private _Date: string;
  private _UTC: number;

  constructor(injector: Injector, myElement: ElementRef) {
  super(injector);
  }

  public ngOnInit() {
    this.data = this.dataService.getGsModel();
    this._ImageryList = ["Disable","Stamen Toner","Stamen Toner(Lite)","Terrain(Standard)","Terrain(Background)",
                         "OpenStreetMap","Earth at Night","Natural Earth\u00a0II","Blue Marble"];
    
    if(this._Imagery === undefined){
      this._Imagery = this._ImageryList[3];
      this.onChangeImagery(this._Imagery);
    }else {this._Imagery =this.dataService.get_Imagery();}

    if(this._Sun === undefined){
      this._Sun = false;
      this.dataService.set_Sun(this._Sun);
    }else {this._Sun =this.dataService.get_Sun();}

    if(this._Shadow === undefined){
      this._Shadow = false;
      this.dataService.set_Shadow(this._Shadow);
    }else {this._Shadow =this.dataService.get_Shadow();}

    this._UTC = +8;
    this.dataService.set_UTC(this._UTC);
    if(this._Date ===undefined){
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth()+1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      this._Date = year+"-"+month+"-"+day;
    }else {
      this._Date = this.dataService.get_Date();
      this.changeDate(this._Date,this._UTC);
    }
        this.dataService.set_Date(this._Date);
  }
  public  notify(message: string): void {
  }
  
  //chanage imagery in Display tab
  public onChangeImagery(_Imagery): void{
    this._Imagery = _Imagery;
    this.dataService.set_Imagery(_Imagery);
    const layers = this.dataService.getViewer().scene.imageryLayers;
    if(_Imagery === this._ImageryList[0]) {
      layers.removeAll();
      this.dataService.getViewer().scene.globe.baseColor = Cesium.Color.GRAY;
    }else if(_Imagery === this._ImageryList[1]){
      layers.removeAll();
      var blackMarble = layers.addImageryProvider(Cesium.createOpenStreetMapImageryProvider({
        url : "https://stamen-tiles.a.ssl.fastly.net/toner/"
      }));
    }else if(_Imagery === this._ImageryList[2]){
      layers.removeAll();
      var blackMarble = layers.addImageryProvider(Cesium.createOpenStreetMapImageryProvider({
        url : "https://stamen-tiles.a.ssl.fastly.net/toner-lite/"
      }));
    }else if(_Imagery === this._ImageryList[3]){
      layers.removeAll();
      var blackMarble = layers.addImageryProvider(Cesium.createOpenStreetMapImageryProvider({
        url : "https://stamen-tiles.a.ssl.fastly.net/terrain/"
      }));
    }else if(_Imagery === this._ImageryList[4]){
      layers.removeAll();
      var blackMarble = layers.addImageryProvider(Cesium.createOpenStreetMapImageryProvider({
        url : "https://stamen-tiles.a.ssl.fastly.net/terrain-background/"
      }));
    }else if(_Imagery === this._ImageryList[5]){
      layers.removeAll();
      var blackMarble = layers.addImageryProvider(Cesium.createOpenStreetMapImageryProvider({
        url : "https://a.tile.openstreetmap.org/"
      }));
    }else if(_Imagery === this._ImageryList[6]){
      layers.removeAll();
      var blackMarble = layers.addImageryProvider(new Cesium.IonImageryProvider({ assetId: 3812 }));
    }else if(_Imagery === this._ImageryList[7]){
      layers.removeAll();
      var blackMarble = layers.addImageryProvider(Cesium.createTileMapServiceImageryProvider({
             url : Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII"),
      }));
    }else if(_Imagery === this._ImageryList[8]){
      layers.removeAll();
      var blackMarble = layers.addImageryProvider(new Cesium.IonImageryProvider({ assetId: 3845 }));
    }
  }
  //change sun
  public changeSun(){
    const viewer = this.dataService.getViewer();
    this._Sun = ! this._Sun;
    if(this._Sun === true){
      viewer.terrainShadows = Cesium.ShadowMode.ENABLED;
      viewer.scene.globe.enableLighting =  true;
      viewer.scene.sun.show = true;
    } else {
      viewer.terrainShadows = undefined;
      viewer.scene.globe.enableLighting =  false;
      viewer.scene.sun.show = false;
    }
    this.dataService.set_Sun(this._Sun);
  }
  //change shadow
  public changeShadow(){
    this._Shadow = ! this._Shadow;
    const promise = this.dataService.getcesiumpromise();
    if(this._Shadow === true){
      promise.then(function(dataSource) {
        const entities = dataSource.entities.values;
        for(const entity of entities) {
          entity.polygon.shadows = Cesium.ShadowMode.ENABLED;
        }
      });
    } else {
      promise.then(function(dataSource) {
        const entities = dataSource.entities.values;
        for(const entity of entities) {
          entity.polygon.shadows = undefined;
        }
      });
    }
    this.dataService.set_Shadow(this._Shadow);
  }
  //change date
  public changeDate(_Date,_UTC){
    this._Date = _Date;
    this._UTC = _UTC;
    const viewer = this.dataService.getViewer();
    const now = new Cesium.JulianDate.fromIso8601(this._Date);
    const tomorrow = now.clone();
    tomorrow.dayNumber = tomorrow.dayNumber + 1;
    viewer.clock.currentTime = Cesium.JulianDate.addHours(now,this._UTC,now);
    viewer.clock.startTime = now.clone();
    viewer.clock.stopTime = tomorrow.clone();
    viewer.timeline.zoomTo(viewer.clock.startTime, viewer.clock.stopTime);
    this.dataService.set_Date(this._Date);
    this.dataService.set_UTC(this._UTC);
    viewer.timeline.updateFromClock();

  }

}
