import { Component, OnInit, Injector, ElementRef ,NgModule} from "@angular/core";
import {DataSubscriber} from "../data/DataSubscriber";
import { DataService } from "../data/data.service";
import {ViewerComponent} from "../viewer/viewer.component";
import * as chroma from "chroma-js";

@Component({
  selector:  "app-publish",
  templateUrl:  "./publish.component.html",
  styleUrls: [ "./publish.component.css" ],
})
export class PublishComponent extends DataSubscriber implements OnInit {
  private myElement ;
  private dataArr: object;
  private mode: string;
  private _ColorDescr: string;
  private _ColorProperty: any[];
  private _ColorKey: string;
  private _ColorMax: number;
  private _ColorMin: number;
  private _ColorInvert: boolean;
  private _ExtrudeDescr: string;
  private _ExtrudeProperty: any[];
  private _ExtrudeKey: string;
  private _ExtrudeMax: number;
  private _ExtrudeMin: number;
  private _HeightChart: boolean;
  private _Invert: boolean;
  private _Scale: number;
  private _Filter: any[];
  private _HideNum: any[];
  private _CheckDisable: boolean = false;

  constructor(injector: Injector, myElement: ElementRef) {
  super(injector);
  }
  public ngOnInit() {
    this.mode = this.dataService.getmode();
    this.dataArr = this.dataService.get_PuData();
    if(this.dataArr !== undefined) {
      this.LoadData();
    }
  }
  public notify(message: string): void {
    if(message === "model_update" ) {
      try {
        this.dataArr = this.dataService.get_PuData();
        if(this.dataArr !== undefined) {this.LoadData();}
      }
      catch (ex) {
        console.log(ex);
      }
    }
  }
  //load data in publish version
  public LoadData() {
    this._ColorDescr = this.dataArr["ColorDescr"];
    this._ColorProperty = this.dataArr[ "ColorProperty"];
    this._ColorKey = this.dataArr[ "ColorKey"];
    this._ColorMax = this.dataArr[ "ColorMax"];
    this._ColorMin = this.dataArr[ "ColorMin"];
    this._ColorInvert = this.dataArr[ "ColorInvert"];
    this._ExtrudeDescr = this.dataArr[ "ExtrudeDescr"];
    this._ExtrudeProperty = this.dataArr[ "ExtrudeProperty"];
    this._ExtrudeKey = this.dataArr[ "ExtrudeKey"];
    this._ExtrudeMax = this.dataArr[ "ExtrudeMax"];
    this._ExtrudeMin = this.dataArr[ "ExtrudeMin"];
    this._HeightChart = this.dataArr[ "HeightChart"];
    this._Invert = this.dataArr[ "Invert"];
    this._Scale = this.dataArr[ "Scale"];
    this._HideNum = this.dataArr[ "HideNum"];
    this._Filter = this.dataArr[ "Filter"];
  }
  //disable button in publish version
  public Disable(event) {
    const index = this._HideNum.indexOf(event);
    const divid = String("addHide".concat(String(event)));
    const addHide = document.getElementById(divid);
    if(this._Filter[index].Disabletext === null) {
      this._CheckDisable = false;
    } else {this._CheckDisable = true;}
    if(this._CheckDisable === false) {
      if(this._Filter[index].type === "number") {
        const textHide = this._Filter[index].textHide;
        this._Filter[index].Disabletext = Number(textHide);
        if(this._Filter[index].RelaHide === "0"||this._Filter[index].RelaHide === 0) {
          this._Filter[index].textHide = this._Filter[index].HideMin;
        }
        if(this._Filter[index].RelaHide === "1"||this._Filter[index].RelaHide === 1) {
          this._Filter[index].textHide = this._Filter[index].HideMax;
        }
      } else if(this._Filter[index].type === "category") {
        const textHide = this._Filter[index].RelaHide;
        this._Filter[index].Disabletext = Number(textHide);
        this._Filter[index].RelaHide = 0;
      }
    } else {
      if(this._Filter[index].type === "number") {
        this._Filter[index].textHide = this._Filter[index].Disabletext;
        this._Filter[index].Disabletext = null;
      } else if(this._Filter[index].type === "category") {
        this._Filter[index].RelaHide = this._Filter[index].Disabletext;
        this._Filter[index].Disabletext = null;
      }
    }
    this.dataArr["Filter"] = this._Filter;
    this.dataArr["HideNum"] = this._HideNum;
    this.dataService.set_PuData(this.dataArr);
  }
  //change category in filter
  public ChangeCategory(categary,id,type) {
    const _index = this._HideNum.indexOf(id);
    if(type === 1) {
      this._Filter[_index].CategaryHide = categary;
    }
    if(type === 0) {
      this._Filter[_index].RelaHide = Number(categary);
    }
  }
  //change text in filter
  public Changetext(value,id) {
    const _index = this._HideNum.indexOf(id);
    this._Filter[_index].textHide = value;
  }
  //change color property in publish version
  public onChangeColor(value) {
    const data = this.dataService.getGsModel()["cesium"]["colour"]["attribs"];
    this.dataArr["ColorKey"] = value;
    for(const _data of data) {
      if(_data["name"] === value) {
        this.dataArr["ColorMin"] = _data["min"];
        this.dataArr["ColorMax"] = _data["max"];
        this.dataArr["ColorInvert"] = _data["invert"];
      }
    }
    const promise = this.dataService.getcesiumpromise();
    const _Colortexts: any[] = [];
    const self = this;
    promise.then( function(dataSource) {
      const entities = dataSource.entities.values;
      for (const entity of entities) {
        if(entity.properties[value] !== undefined) {
        if(entity.properties[value]._value !== " ") {
          if(_Colortexts.length === 0) {_Colortexts[0] = entity.properties[value]._value;
          } else { if(_Colortexts.indexOf(entity.properties[value]._value) === -1) {
            _Colortexts.push(entity.properties[value]._value);}
            }
          }
        }
      }
    });
    this.dataArr["ColorText"] = _Colortexts.sort();
    this.dataService.set_PuData(this.dataArr);
    this.LoadData();
  }
  //change extrudeheight property in publish version
  public onChangeHeight(value) {
    const data = this.dataService.getGsModel()["cesium"]["extrude"]["attribs"];
    this.dataArr["ExtrudeKey"] = value;
    for(const _data of data) {
      if(_data["name"] === value) {
        this.dataArr["ExtrudeMin"] = _data["min"];
        this.dataArr["ExtrudeMax"] = _data["max"];
        this.dataArr["HeightChart"] = _data["line"];
        this.dataArr["Invert"] = _data["invert"];
        this.dataArr["Scale"] = _data["scale"];
      }
    }
    const promise = this.dataService.getcesiumpromise();
    const _Heighttexts = [];
    const self = this;
    promise.then(function(dataSource) {
      const entities = dataSource.entities.values;
      for (const entity of entities) {
        if(entity.properties[value] !== undefined) {
        if(entity.properties[value]._value !== " ") {
          if(_Heighttexts.length === 0) {_Heighttexts[0] = entity.properties[value]._value;
          } else { if(_Heighttexts.indexOf(entity.properties[value]._value) === -1) {
            _Heighttexts.push(entity.properties[value]._value);}
            }
          }
        }
      }
    });
    this.dataArr["ExtrudeText"] = _Heighttexts.sort();
    this.dataService.set_PuData(this.dataArr);
    this.LoadData();
  }
  //reset button to load again
  public reset() {
    this.dataService.LoadJSONData();
    this.dataArr = this.dataService.get_PuData();
    if(this.dataArr !== undefined) {this.LoadData();}
  }
}
