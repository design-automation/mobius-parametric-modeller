import { Component, OnInit, Injector, ElementRef ,NgModule} from "@angular/core";
import {DataSubscriber} from "../data/DataSubscriber";
import { DataService } from "../data/data.service";
import {ViewerComponent} from "../viewer/viewer.component";
import * as chroma from "chroma-js";

@Component({
  selector: "app-setting",
  templateUrl: "./setting.component.html",
  styleUrls: ["./setting.component.css"],
})
export class SettingComponent extends DataSubscriber implements OnInit {
  private myElement;
  private data: JSON;
  private mode: string;
  private viewer: object;
  private dataArr: object;
  private propertyname: any[];
  private relation: any[];
  private text: any[];
  private _Filter: any[];
  private _HideNum: any[];

  constructor(injector: Injector, myElement: ElementRef) {
  super(injector);
  }
  public ngOnInit() {
    this.data = this.dataService.getGsModel();
    this.mode = this.dataService.getmode();
    this.viewer = this.dataService.getViewer();
    if(this.mode === "viewer") {
      this.changedata(2);
    } else if(this.mode==="editor") {
      this.changedata(0);
    }
  }

  public notify(message: string): void {
    if(message === "model_update" ) {
      this.data = this.dataService.getGsModel();
      this.mode = this.dataService.getmode();
      this.viewer = this.dataService.getViewer();
      try {
        if(this.data !== undefined&&this.data["features"] !== undefined) {
          if(this.mode === "viewer") {
            this.changedata(2);
          } else if(this.mode === "editor") {
            this.changedata(0);
          }
        }
      }
      catch(ex) {
        console.log(ex);
      }
    }
  }
  public changedata(id: number) {
    this.dataService.set_index(id);
    if(id === 0) {
      this.dataArr = this.dataService.get_ViData();
    } else if(id === 2) {
      this.dataArr = this.dataService.get_PuData();
    }
    if(this.dataArr !== undefined) {
      this.LoadViewer();
    }
  }

  public Reset() {
    this.dataArr = this.dataService.get_PuData();
  }

  public LoadViewer() {
    const promise = this.dataService.getcesiumpromise();
    const _ColorKey: string = this.dataArr["ColorKey"];
    const _ColorMax: number = this.dataArr["ColorMax"];
    const _ColorMin: number = this.dataArr["ColorMin"];
    const _ColorText: any[] = this.dataArr["ColorText"];
    const _ColorInvert: boolean = this.dataArr["ColorInvert"];
    const _ExtrudeKey: string = this.dataArr["ExtrudeKey"];
    const _ExtrudeMax: number = this.dataArr["ExtrudeMax"];
    const _ExtrudeMin: number = this.dataArr["ExtrudeMin"];
    const _HeightChart: boolean = this.dataArr["HeightChart"];
    const _Invert: boolean = this.dataArr["Invert"];
    const _Scale: number = this.dataArr["Scale"];
    let _Filter: any[];
    if(this.dataArr["Filter"] !== undefined&&this.dataArr["Filter"].length !== 0) {
      _Filter = this.dataArr["Filter"];
    } else {_Filter = [];}
    let _ChromaScale = chroma.scale("SPECTRAL");
    if(_ColorInvert === true) {_ChromaScale = chroma.scale("SPECTRAL").domain([1,0]);}
    const self = this;
    let i: number = 0;
    promise.then(function(dataSource) {
      const entities = dataSource.entities.values;
      for (const entity of entities) {
        i=i+1;
        let _CheckHide: boolean;
        if(_Filter.length !== 0) {
          _CheckHide = self.Hide(_Filter,entity,_HeightChart);
          if(_CheckHide === true) {
            if(entity.polygon !== undefined) {
              entity.polygon.extrudedHeight = 0;
              entity.polygon.material = Cesium.Color.LIGHTSLATEGRAY.withAlpha(1);
              if(_HeightChart === true) {
                if(entity.polyline !== undefined) {entity.polyline.show = false;}
              }
            }
            if(entity.polyline !== undefined)  {entity.polyline.material = Cesium.Color.LIGHTSLATEGRAY.withAlpha(1);}
          }
        }

        if(_Filter.length === 0||_CheckHide === false) {
          if(_ColorKey !== "None") {
            if(typeof(_ColorText[0]) === "number") {
              self.colorByNum(entity,_ColorMax,_ColorMin,_ColorKey,_ChromaScale);
            } else {self.colorByCat(entity,_ColorText,_ColorKey,_ChromaScale);}
          } else {entity.polygon.material = Cesium.Color.WHITE;}
          if(_ExtrudeKey !== "None") {
            if(_HeightChart === false) {
              entity.polyline = undefined;
              entity.polygon.extrudedHeight = self.ExtrudeHeight(entity.properties[_ExtrudeKey]._value,
                                                                _ExtrudeMax,_ExtrudeMin,_Invert)*_Scale;
            } else {
              entity.polygon.extrudedHeight =0;
              const center =  Cesium.BoundingSphere.fromPoints(entity.polygon.hierarchy.getValue().positions).center;
              const radius = Math.min(Math.round(Cesium.BoundingSphere.fromPoints
                                    (entity.polygon.hierarchy.getValue().positions).radius/100),10);
              const longitudeString = Cesium.Math.toDegrees(Cesium.Ellipsoid.WGS84.
                                      cartesianToCartographic(center).longitude).toFixed(10);
              const latitudeString = Cesium.Math.toDegrees(Cesium.Ellipsoid.WGS84.cartesianToCartographic(center).
                                      latitude).toFixed(10);
              entity.polyline = new Cesium.PolylineGraphics({
                positions:new Cesium.Cartesian3.fromDegreesArrayHeights([longitudeString,latitudeString,0,longitudeString,
                        latitudeString,self.ExtrudeHeight(entity.properties[_ExtrudeKey]._value,
                        _ExtrudeMax,_ExtrudeMin,_Invert)*_Scale]),
                width:radius,
                material:entity.polygon.material,
                show:true,
              });
            }
          } else {
            entity.polyline = undefined;
            entity.polygon.extrudedHeight = 0;
          }
        }
      }
    });
  }

  public Hide(_Filter: any[], entity, _HeightChart: boolean): boolean {
    let _CheckHide: boolean = false;
    for(const filter of _Filter) {
      const value = entity.properties[filter.HeightHide]._value;
      if(value !== undefined) {
        if(typeof(value) === "number") {
          if (this._compare(value, Number(filter.textHide), Number(filter.RelaHide))) {
            _CheckHide=true;
          }
        } else if(typeof(value) === "string") {
          if (this._compareCat(value,filter.textHide, Number(filter.RelaHide))) {
            _CheckHide=true;
          }
        }
      }
    }
    return _CheckHide;
  }

  public _compare(value: number, slider: number, relation: number): boolean {
    switch (relation) {
      case 0:
        return value < slider;
      case 1:
        return value > slider;
      case 2:
        return value === slider;
    }
  }

  public _compareCat(value: string, _Categary: string,relation: number): boolean {
    switch (relation) {
      case 0:
        return value ===  undefined;
      case 1:
        return value !== _Categary;
      case 2:
        return value === _Categary;
    }
  }

  public ExtrudeHeight(value: number, _ExtrudeMax: number, _ExtrudeMin: number, _Invert: boolean): number {
    let diff: number;
    if(_ExtrudeMin < 0) {diff = Math.abs(_ExtrudeMin);} else {diff = 0;}
    if(value > _ExtrudeMax) {value = _ExtrudeMax;}
    if(value < _ExtrudeMin) {value = _ExtrudeMin;}
    switch (_Invert) {
      case true:
        return _ExtrudeMax - value;
      case false:
        return value;
    }
  }

  public colorByNum(entity, max: number, min: number, _ColorKey: string, _ChromaScale: any) {
    if(entity.properties[_ColorKey] !== undefined) {
      const texts = entity.properties[_ColorKey]._value;
      const rgb = _ChromaScale(Number(((max - texts) / (max - min)).toFixed(2)))._rgb;
      if(entity.polygon !== undefined) {entity.polygon.material = Cesium.Color.fromBytes(rgb[0],rgb[1],rgb[2]);}
      if(entity.polyline !== undefined) {entity.polyline.material = Cesium.Color.fromBytes(rgb[0],rgb[1],rgb[2]);}
    }
  }

  public  colorByCat(entity, _ColorText: any[], _ColorKey: string, _ChromaScale: any) {
    if(entity.properties[_ColorKey] !== undefined) {
      let initial: boolean = false;
      for(let j = 0;j < _ColorText.length; j++) {
        if(entity.properties[_ColorKey]._value === _ColorText[j]) {
          const rgb = _ChromaScale(1 - (j / _ColorText.length));
          entity.polygon.material = Cesium.Color.fromBytes(rgb._rgb[0],rgb._rgb[1],rgb._rgb[2]);
          initial = true;
        }
      }
      if(initial === false) {
        entity.polygon.material = Cesium.Color.LIGHTSLATEGRAY.withAlpha(1);
      }
    }
  }
}
