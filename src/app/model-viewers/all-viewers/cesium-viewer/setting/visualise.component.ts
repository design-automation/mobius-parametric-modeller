import { Component, OnInit, Injector, ElementRef ,NgModule} from "@angular/core";
import {DataSubscriber} from "../data/DataSubscriber";
import { DataService } from "../data/data.service";
import {ViewerComponent} from "../viewer/viewer.component";
import * as chroma from "chroma-js";

@Component({
  selector: "app-data",
  templateUrl: "./visualise.component.html",
  styleUrls: ["./visualise.component.css"],
})
export class DataComponent extends DataSubscriber implements OnInit {
  private myElement;
  private dataArr: object;
  private _ColorProperty: any[];
  private _ColorKey: string;
  private _ColorMax: number;
  private _ColorMin: number;
  private _ExtrudeProperty: any[];
  private _ExtrudeKey: string;
  private _ExtrudeMax: number;
  private _ExtrudeMin: number;
  private _HeightChart: boolean;
  private _Invert: boolean;
  private _ColorInvert: boolean;
  private _Scale: number;
  private _Filter: any[];
  private _HideNum: any[];
  private _HideValue: string;
  private _CheckDisable: boolean = true;

  constructor(injector: Injector, myElement: ElementRef) {
  super(injector);
  }
  public ngOnInit() {
    this.dataArr = this.dataService.get_ViData();
    if(this.dataArr !== undefined) {this.LoadData();}
  }
  public notify(message: string): void {
    if(message === "model_update" ) {
      try {
        this.dataArr = this.dataService.get_ViData();
        if(this.dataArr !== undefined) {this.LoadData();}
      }
      catch(ex) {
        console.log(ex);
      }
    }
  }
  //load data
  public LoadData() {
    this._ColorProperty = this.dataArr["ColorProperty"];
    this._ColorKey = this.dataArr["ColorKey"];
    this._ColorMax = this.dataArr["ColorMax"];
    this._ColorMin = this.dataArr["ColorMin"];
    this._ColorInvert = this.dataArr["ColorInvert"];
    this._ExtrudeProperty = this.dataArr["ExtrudeProperty"];
    this._ExtrudeKey = this.dataArr["ExtrudeKey"];
    this._ExtrudeMax = this.dataArr["ExtrudeMax"];
    this._ExtrudeMin = this.dataArr["ExtrudeMin"];
    this._HeightChart = this.dataArr["HeightChart"];
    this._Invert = this.dataArr["Invert"];
    this._Scale = this.dataArr["Scale"];
    this._Filter = this.dataArr["Filter"];
    this._HideNum = this.dataArr["HideNum"];
  }
  //change color property in editor version
  public onChangeColor(value) {
    this.dataArr["ColorKey"] = value;
    const promise = this.dataService.getcesiumpromise();
    const _Colortexts = [];
    const self = this;
    promise.then(function(dataSource) {
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
    this.dataArr["ColorMin"] = Math.min.apply(Math, _Colortexts);
    this.dataArr["ColorMax"] = Math.max.apply(Math, _Colortexts);
    this.dataArr["ColorText"] = _Colortexts.sort();
    this.dataService.set_ViData(this.dataArr);
    this.LoadData();
  }
  //change color min in editor version
  public changeColorMin(_Min: number) {
    this.dataArr["ColorMin"] = Number(_Min);
    this._ColorMin = this.dataArr["ColorMin"];
    this.dataService.set_ViData(this.dataArr);
  }
  //change color max in editor version
  public changeColorMax(_Max: number) {
    this.dataArr["ColorMax"] = Number(_Max);
    this._ColorMax = this.dataArr["ColorMax"];
    this.dataService.set_ViData(this.dataArr);

  }
  //change color invert in editor version
  public changeColorInvert() {
    this._ColorInvert =! this._ColorInvert;
    this.dataArr["ColorInvert"] = this._ColorInvert;
    this.dataService.set_ViData(this.dataArr);
  }
  //change extrudeheight property in editor version
  public onChangeHeight(value) {
    this.dataArr["ExtrudeKey"] = value;
    const promise = this.dataService.getcesiumpromise();
    const _Heighttexts = [];
    const self = this;
    promise.then(function(dataSource) {
      const entities = dataSource.entities.values;
      for (const entity of entities) {
        if(entity.properties[value] !== undefined) {
        if(entity.properties[value]._value !== " ") {
          if(_Heighttexts.length === 0) {_Heighttexts[0] = entity.properties[value]._value;
          } else  { if(_Heighttexts.indexOf(entity.properties[value]._value) === -1) {
            _Heighttexts.push(entity.properties[value]._value);}
            }
          }
        }
      }
    });
    this.dataArr["ExtrudeMin"] = Math.min.apply(Math, _Heighttexts);
    this.dataArr["ExtrudeMax"] = Math.max.apply(Math, _Heighttexts);
    this.dataArr["ExtrudeText"] = _Heighttexts.sort();
    this.dataService.set_ViData(this.dataArr);
    this.LoadData();
  }
  //change extrudeheight min in editor version
  public changeHeightMin(_Min: number) {
    this.dataArr["ExtrudeMin"] = Number(_Min);
    this._ExtrudeMin = this.dataArr["ExtrudeMin"];
    this.dataService.set_ViData(this.dataArr);
  }
  //change extrudeHeight max in editor version
  public changeHeightMax(_Max: number) {
    this.dataArr["ExtrudeMax"] = Number(_Max);
    this._ExtrudeMax = this.dataArr["ExtrudeMax"];
    this.dataService.set_ViData(this.dataArr);
  }
  //change scale in editor version
  public changescale(_ScaleValue: number) {
    this.dataArr["Scale"] = Number(_ScaleValue);
    this._Scale = this.dataArr["Scale"];
    this.dataService.set_ViData(this.dataArr);
  }
  //change extrudeheight invert in editor version
  public changeopp() {
    this._Invert =! this._Invert;
    this.dataArr["Invert"] = this._Invert;
    this.dataService.set_ViData(this.dataArr);
  }
  //change heightChart in editor version
  public changeExtrude() {
    this._HeightChart =! this._HeightChart;
    this.dataArr["HeightChart"] = this._HeightChart;
    this.dataService.set_ViData(this.dataArr);
  }
  //add filter in editor version
  public addHide() {
    let lastnumber: string;
    if(this.dataArr["HideNum"] !== undefined) {
      this._HideNum = this.dataArr["HideNum"];
      this._Filter = this.dataArr["Filter"];
    }
    if(this._HideNum === null||this._HideNum.length === 0) {this._HideNum[0] = "0";lastnumber = this._HideNum[0];
    } else {
      for(let i = 0;i<this._HideNum.length+1;i++) {
        if(this._HideNum.indexOf(String(i)) === -1) {
          this._HideNum.push(String(i));
          lastnumber = String(i);
          break;
        }
      }
    }
    if(this._HideValue === undefined) {this._HideValue = this._ColorProperty[0];}
    const texts = this.Initial(this._HideValue);
    let _HideType: string;
    if(typeof(texts[0]) === "number") { _HideType = "number";
    } else if(typeof(texts[0]) === "string") { _HideType = "category"; }
    this._Filter.push({divid:String("addHide".concat(String(lastnumber))),id: lastnumber,
                       HeightHide:this._HideValue,type:_HideType,Category:texts,CategaryHide:texts[0],
                       RelaHide:0,textHide: Math.round(Math.min.apply(Math, texts)*100)/100,
                       HideMax:Math.ceil(Math.max.apply(Math, texts)),
                       HideMin:Math.round(Math.min.apply(Math, texts)*100)/100,Disabletext:null});
    this.dataArr["Filter"] = this._Filter;
    this.dataArr["HideNum"] = this._HideNum;
    this.dataService.set_ViData(this.dataArr);
  }
  //delete filter in editor version
  public deleteHide(event) {
    const index = this._HideNum.indexOf(event);
    const divid = String("addHide".concat(String(event)));
    const addHide = document.getElementById(divid);
    const hidecontainer = document.getElementsByClassName("hide-container")[0];
    hidecontainer.removeChild(addHide);

    if(this._Filter[index].type === "number") {
      if(this._Filter[index].RelaHide === "0"||this._Filter[index].RelaHide === 0) {
        this._Filter[index].textHide = this._Filter[index].HideMin;
      }
      if(this._Filter[index].RelaHide === "1"||this._Filter[index].RelaHide === 1) {
        this._Filter[index].textHide = this._Filter[index].HideMax;
      }
    } else if(this._Filter[index].type === "category") {
      this._Filter[index].RelaHide = 0;
    }
    this._Filter.splice(index,1);
    this._HideNum.splice(index,1);
    this.dataArr["Filter"] = this._Filter;
    this.dataArr["HideNum"] = this._HideNum;
    this.dataService.set_ViData(this.dataArr);
  }
  //change disable button in filter
  public Disable(event) {
    const index = this._HideNum.indexOf(event);
    const divid = String("addHide".concat(String(event)));
    const addHide = document.getElementById(divid);
    if(this._Filter[index].Disabletext === null) {this._CheckDisable = false;} else {this._CheckDisable = true;}
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
    this.dataService.set_ViData(this.dataArr);
  }
  //change height slider in filter
  public ChangeHeight(_HeightHide: string) {
    this._HideValue = _HeightHide;
  }
  //change relation in filter
  public Changerelation(_RelaHide: any, id: number) {
    const index = this._HideNum.indexOf(id);
    const HeightHide = this._Filter[index].HeightHide;
    this._Filter[index].RelaHide = _RelaHide;
    const texts = [];
    const promise = this.dataService.getcesiumpromise();
    const self = this;
    promise.then(function(dataSource) {
      const entities = dataSource.entities.values;
      for (const entity of entities) {
      if(entity.properties[HeightHide] !== undefined) {
        if(entity.properties[HeightHide]._value !== " ") {
          if(texts.length === 0) {texts[0] = entity.properties[HeightHide]._value;
          } else { if(texts.indexOf(entity.properties[HeightHide]._value) === -1) {
            texts.push(entity.properties[HeightHide]._value);}
            }
          }
        }
      }
    });
    this._Filter[index].HideMax = Math.ceil(Math.max.apply(Math, texts));
    this._Filter[index].HideMin = Math.round(Math.min.apply(Math, texts)*100)/100;
    if(_RelaHide==="0"||_RelaHide === 0) {this._Filter[index].textHide = this._Filter[index].HideMin;}
    if(_RelaHide==="1"||_RelaHide === 1) {this._Filter[index].textHide = this._Filter[index].HideMax;}
  }
  //change category in filter
  public ChangeCategory(categary: string, id: number, type: number) {
    const index = this._HideNum.indexOf(id);
    if(type === 1) {
      this._Filter[index].CategaryHide = categary;
    }
    if(type === 0) {
      this._Filter[index].RelaHide = Number(categary);
    }
  }
  //change text in filter
  public Changetext(value: string, id: number) {
    const index = this._HideNum.indexOf(id);
    this._Filter[index].textHide = value;
  }
  //get text according to property
  public  Initial(_HideValue: string): any[] {
    const texts = [];
    const promise = this.dataService.getcesiumpromise();
    const self = this;
    promise.then(function(dataSource) {
      const entities = dataSource.entities.values;
      for (const entity of entities) {
        if(entity.properties[_HideValue] !== undefined) {
          if(entity.properties[_HideValue]._value !== " ") {
            if(texts.length === 0) {texts[0] = entity.properties[_HideValue]._value;
            } else { if(texts.indexOf(entity.properties[_HideValue]._value) === -1) {
              texts.push(entity.properties[_HideValue]._value);}
            }
          }
        }
      }
    });
    return texts;
  }
}
