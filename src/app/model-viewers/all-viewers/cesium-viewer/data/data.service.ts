import { Injectable } from "@angular/core";
import {Observable, Subject} from "rxjs";
import * as chroma from "chroma-js";

@Injectable()
export class DataService {
  private _jsonModel: JSON;
  private subject = new Subject<any>();
  private viewer: any;
  private _SelectedEntity: any;
  private cesiumpromise: any;
  private hideElementArr: any[];
  private _HideNum: any[];
  private mode: string;
  private _ViData: object;
  private _PuData: object;
  private _index: number;
  private _Filter: any[];
  private _Imagery: string;
  private _Sun: boolean;
  private _Shadow: boolean;
  private _Date: string;
  private _UTC: number;

  public sendMessage(message?: string) {
    this.subject.next({text: message});
  }
  public clearMessage() {
    this.subject.next();
  }

  public getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
  //get geojson
  public getGsModel(): any {
    return this._jsonModel;
  }
  //set mode 
  public setMode(mode: string) {
    this.mode = mode;
  }
  //set new json file
  public setGsModel(model: JSON) {
    delete this._jsonModel;
    const json = this._jsonModel;
    this._jsonModel = model;
    if(this._jsonModel !== undefined){this.clearAll();}
    this.sendMessage("model_update");
    
  }
  //before loading geojson, clear all for last geojson
  public clearAll(){
    delete this.hideElementArr;
    delete this._HideNum;
    delete this._ViData;
    delete this._PuData;
    delete this._index;
    delete this._Filter;

  }
  //get viewer
  public getViewer(): any {
    return this.viewer;
  }
  //set viewer
  public setViewer(_viewer): void {
    this.viewer = _viewer;
  }
  //get selected entity
  public get_SelectedEntity(): any {
    return this._SelectedEntity;
  }
  //set selected entity
  public set_SelectedEntity(_SelectedEntity): void {
    this._SelectedEntity = _SelectedEntity;
  }
  //get promise
  public getcesiumpromise(): any {
    return this.cesiumpromise;
  }
  //set promise
  public setcesiumpromise(cesiumpromise): void {
    delete this.cesiumpromise;
    this.cesiumpromise = cesiumpromise;
  }
  // get filter array
  public gethideElementArr(): any {
    return this.hideElementArr;
  }
  //get filter number
  public get_HideNum(): any[] {
    return this._HideNum;
  }
  //get mode
  public getmode(): string {
    return this.mode;
  }
  //get index after changing select, data, display, publish
  public get_index(): number {
    return this._index;
  }
  //set index after changing select, data, display, publish
  public set_index(_index): void {
    this._index = _index;
  }
  //set sun true/false in Display
  public set_Sun(_Sun): void{
    this._Sun = _Sun;
  }
  //get sun true/false in Display
  public get_Sun(): boolean{
    return this._Sun;
  }
  //set shadow true/false in Display
  public set_Shadow(_Shadow): void{
    this._Shadow = _Shadow;
  }
  //get shadow true/false in Display
  public get_Shadow(): boolean{
    return this._Shadow;
  }
  //set date in Display
  public set_Date(_Date): void{
    this._Date = _Date;
  }
  //get date in Display
  public get_Date(): string{
    return this._Date;
  }
  //set UTC in Display
  public set_UTC(_UTC): void{
    this._UTC = _UTC;
  }
  //get UTC in Display
  public get_UTC(): number{
    return this._UTC;
  }
  //set imagery in Display
  public set_Imagery(_Imagery): void {
    this._Imagery = _Imagery;
  }
  //get imagery in Display
  public get_Imagery(): string {
    return this._Imagery;
  }
  //convert json to ViData(editor version) to store every thing in setting
  public getValue(model: JSON) {
    if(model !== undefined) {
      let propertyName = Object.keys(model["features"][0].properties);
      let feature_instance = model["features"][0];
      let _HeightKeys = propertyName.filter(function(prop_name) {
        const value =  feature_instance.properties[prop_name];
        return (typeof(value) === "number");
      });
      if(model["features"].length > 1){
        for(let i = 1 ;i<model["features"].length;i++){
          for(let properties of Object.keys(model["features"][i].properties)){
            if(propertyName.indexOf(String(properties))<0){
              propertyName.push(properties);
              if(typeof(model["features"][i].properties[properties]) === "number"){
                _HeightKeys.push(properties);
              }
            }
          }
        }
      }
      
      propertyName.sort();
      propertyName.unshift("None");
      const propertyNames = propertyName.filter(function(value) { 
        return value != 'TYPE'&& value != 'COLOR'&& value != 'HEIGHT'&&value != 'EXTRUDEDHEIGHT'
      });
      const _ColorValue = propertyNames[0];
      const _HeightKey = _HeightKeys.filter(function(value) { 
        return value != 'TYPE'&& value != 'COLOR'&& value != 'HEIGHT'&&value != 'EXTRUDEDHEIGHT'
      });
      _HeightKey.sort();
      _HeightKey.unshift("None");
      const _HeightValue = _HeightKey[0];

      const promise = this.cesiumpromise;
      const _Heighttexts: any[] = [];
      const _Colortexts: any[] = [];
      const _indexArr: number[] = [];
      const self = this;
      promise.then(function(dataSource) {
        const entities = dataSource.entities.values;
        for (const entity of entities) {
          if(entity.properties["TYPE"] === undefined||entity.properties["TYPE"]._value !== "STATIC"){
            if(entity.properties[_HeightValue] !== undefined) {
              if(entity.properties[_HeightValue]._value !== " ") {
                if(_Heighttexts.length === 0) {_Heighttexts[0]=entity.properties[_HeightValue]._value;
                } else { if(_Heighttexts.indexOf(entity.properties[_HeightValue]._value) === -1) {
                 _Heighttexts.push(entity.properties[_HeightValue]._value);}
                }
              }
            }
            if(entity.properties[_ColorValue] !== undefined) {
              if(entity.properties[_ColorValue]._value !== " ") {
                if(_Colortexts.length === 0) {_Colortexts[0] = entity.properties[_ColorValue]._value;
                } else { if(_Colortexts.indexOf(entity.properties[_ColorValue]._value) === -1) {
                  _Colortexts.push(entity.properties[_ColorValue]._value);}
                }
              }
            }
            _indexArr.push(entities.indexOf(entity));
          } else {
            entity.polygon.height =  entity.properties["HEIGHT"];
            entity.polygon.extrudedHeight = entity.properties["EXTRUDEDHEIGHT"];
            const ColorValue = entity.properties["COLOR"]._value;
            entity.polygon.material = Cesium.Color.fromBytes(ColorValue[0], ColorValue[1], ColorValue[2], ColorValue[3]);
          }
          if(entity.polygon !== undefined) {
              entity.polygon.outlineColor = Cesium.Color.Black;
          }
          if(entity.billboard !== undefined) {
            entity.billboard = undefined;
            entity.point = new Cesium.PointGraphics({
              color: Cesium.Color.BLUE,
              pixelSize: 10,
            });
          }
        }
      });
      const _MinColor = Math.min.apply(Math, _Colortexts);
      const _MaxColor = Math.max.apply(Math, _Colortexts);
      const _MinHeight = Math.min.apply(Math, _Heighttexts);
      const _MaxHeight = Math.max.apply(Math, _Heighttexts);
      const _Filter: any[] = [];
      const _HideNum: any[] = [];
      this.getViData(propertyNames,_Colortexts.sort(),_ColorValue,_MinColor,_MaxColor,false,
                     _HeightKey,_Heighttexts.sort(),_HeightValue,_MinHeight,_MaxHeight,1,
                     false,false,_Filter,_HideNum,_indexArr);
    }
  }
  //get ViData(editor version)
  public get_ViData(): object {
    return this._ViData;
  }

  //convert geojson to PuData(publish version)
  public LoadJSONData() {
    if(this._jsonModel !== undefined&&this._jsonModel["cesium"] !== undefined) {
      const cesiumData = this._jsonModel["cesium"];
      let _ColorDescr: string;
      let _ColorValue: string;
      let _MinColor: number;
      let _MaxColor: number;
      let _ColorInvert: boolean;
      let _HeightDescr: string;
      const _HeightKey: any[] = [];
      let _HeightValue: string;
      let _MinHeight: number;
      let _MaxHeight: number;
      let _HeightInvert: boolean;
      let _HeightScale: number;
      let _HeightLine: boolean;
      let _filters: any[];
      const _ceisumData: any[] = [];
      const _propertyNames: any[] = [];
      const _HideNum: any[] = [];
      const _indexArr: number[] = [];
      if(cesiumData["colour"] !== undefined) {
        if(cesiumData["colour"]["descr"] !== undefined) {
          _ColorDescr = cesiumData["colour"]["descr"];
        }
        if(cesiumData["colour"]["attribs"] !== undefined) {
          for(const data of cesiumData["colour"]["attribs"]) {
            _propertyNames.push(data["name"]);
          }
          _ColorValue = _propertyNames[0];
          _MinColor = cesiumData["colour"]["attribs"][0]["min"];
          _MaxColor = cesiumData["colour"]["attribs"][0]["max"];
          if(cesiumData["colour"]["attribs"][0]["invert"] === true) {_ColorInvert = true;} else {_ColorInvert = false;}
        }

      }
      if(cesiumData["extrude"] !== undefined) {
        if(cesiumData["extrude"]["descr"] !== undefined) {
          _HeightDescr = cesiumData["extrude"]["descr"];
        }
        if(cesiumData["extrude"]["attribs"] !== undefined) {
          for(const data of cesiumData["extrude"]["attribs"]) {
            _HeightKey.push(data["name"]);
          }
          _HeightValue = _HeightKey[0];
          _MinHeight = cesiumData["extrude"]["attribs"][0]["min"];
          _MaxHeight = cesiumData["extrude"]["attribs"][0]["max"];
          if(cesiumData["extrude"]["attribs"][0]["invert"] === true) {
            _HeightInvert = true;} else {_HeightInvert = false;}
          if(cesiumData["extrude"]["attribs"][0]["line"] === true) {_HeightLine = true;} else {_HeightLine = false;}
          if(cesiumData["extrude"]["attribs"][0]["scale"] !== undefined) {
            _HeightScale = cesiumData["extrude"]["attribs"][0]["scale"];
          } else {_HeightScale = 1;}
        }
      }
      const promise = this.cesiumpromise;
      const _Heighttexts = [];
      const _Colortexts = [];
      const self = this;
      promise.then(function(dataSource) {
        const entities = dataSource.entities.values;
        for (const entity of entities) {
          if(entity.properties[_HeightValue] !== undefined) {
            if(entity.properties[_HeightValue]._value !== " ") {
              if(_Heighttexts.length === 0) {_Heighttexts[0] = entity.properties[_HeightValue]._value;
              } else { if(_Heighttexts.indexOf(entity.properties[_HeightValue]._value) === -1) {
                _Heighttexts.push(entity.properties[_HeightValue]._value);}
              }
            }
          }
          if(entity.properties[_ColorValue] !== undefined) {
            if(entity.properties[_ColorValue]._value !== " ") {
              if(_Colortexts.length === 0) {_Colortexts[0] = entity.properties[_ColorValue]._value;
              } else { if(_Colortexts.indexOf(entity.properties[_ColorValue]._value) === -1) {
                _Colortexts.push(entity.properties[_ColorValue]._value);}
              }
            }
          }
          if(entity.polygon !== undefined) {
            entity.polygon.outlineColor = Cesium.Color.Black;
          }
          if(entity.billboard !== undefined) {
            entity.billboard = undefined;
            entity.point = new Cesium.PointGraphics({
              color: Cesium.Color.BLUE,
              pixelSize: 10,
            });
          }
          _indexArr.push(entities.indexOf(entity));
        }
      });
      if(cesiumData["filters"] !== undefined) {
        _filters = cesiumData["filters"];
        let lastnumber: string;
        this._Filter = [];
        this._HideNum = [];
        if(_filters !== undefined&&_filters.length !== 0) {
          for(const _filter of _filters) {
            if(this._HideNum.length === 0) {
              this._HideNum[0] = "0";
              lastnumber = this._HideNum[0];
            } else {
              for(let j = 0;j < this._HideNum.length + 1;j++) {
                if(this._HideNum.indexOf(String(j)) === -1) {
                  this._HideNum.push(String(j));
                  lastnumber = String(j);
                  break;
                }
              }
            }
            if(_filter["name"] !== undefined) {
              const _propertyname = _filter["name"];
              const _relation = Number(_filter["relation"]);
              const _text = _filter["value"];
              const _descr = _filter["descr"];
              let _HideType: string;
              let _texts: any[];
              if(typeof(_text) === "number") {
                _HideType = "number";
                _texts = this.Initial(_propertyname);
              } else if(typeof(_text) === "string") {
                _HideType = "category";
                _texts = this.Initial(_propertyname);
                _texts = ["None"].concat(_texts);
              }
              this._Filter.push({ divid:String("addHide".concat(String(lastnumber))),id: lastnumber,
                                  HeightHide:_propertyname,type:_HideType,Category:_texts,
                                  CategaryHide:_text,descr:_descr,RelaHide:_relation,
                                  textHide: _text,HideMax:Math.ceil(Math.max.apply(Math, _texts)),
                                  HideMin:Math.floor(Math.min.apply(Math, _texts)*100)/100,Disabletext:null});
            }
          }
        }
      } else {this._Filter = [];this._HideNum = [];}
      this.getPuData(_ColorDescr,_propertyNames,_Colortexts.sort(),_ColorValue,_MinColor,_MaxColor,_ColorInvert,
                        _HeightDescr,_HeightKey,_Heighttexts.sort(),_HeightValue,_MinHeight,_MaxHeight,
                        _HeightScale,_HeightInvert,_HeightLine,this._Filter,this._HideNum,_indexArr);

    }

  }
  //get text for the certain property
  public  Initial(_HideValue: string): any[] {
    const texts=[];
    const promise = this.getcesiumpromise();
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
  //get PuData
  public get_PuData(): object {
    return this._PuData;
  }
 
  //// ------------------- Settings

  /*
   * to set visualize settings
   *
   */

  /*
   *  _PuData : Object with properties .... <todo>
   */
  public set_PuData(_PuData): void {
    this._PuData = _PuData;
  }

  /*
   *  _ViData : Object with properties .... <todo>
   */
  public set_ViData(_ViData): void {
    this._ViData = _ViData;
  }
  /*
  _ColorProperty: collect all property names,
  _ColorText: collect all values under _ColorKey,
  _ColorKey: Select color property name in Data tab,
  _ColorMin: minimum value of Color property in Data tab,
  _ColorMax: maximum value of Color property in Data tab,
  _ColorInvert: color invert is true or false,
  _ExtrudeProperty: collect all property names that whose values are number,
  _ExtrudeText: collect all values under _ExturdeValue,
  _ExturdeValue: Select Extrude property name in Data tab,
  _ExtrudeMin: minimum value of Extrude property in Data tab,
  _ExtrudeMax: maximum value of Extrude property in Data tab,
  _Scale: extrude height scale,
  _Invert: extrude height invert is true or false,
  _HeightChart: it will show height chart or not,
  _Filter: collect filters,
  _HideNum: collect filter id numbers,
  _indexArr: collect entity number whose "TYPE" is not static
  */

  public getViData(_ColorProperty: any[],_ColorText: any[],_ColorKey: string,
                   _ColorMin: number,_ColorMax: number,_ColorInvert: boolean,
                   _ExtrudeProperty: any[],_ExtrudeText: any[],_ExturdeValue: string,
                   _ExtrudeMin: number,_ExtrudeMax: number,_Scale: number,_Invert: boolean,
                   _HeightChart: boolean,_Filter: any[],_HideNum: number[],_indexArr: number[]) {
    this._ViData = {ColorProperty:_ColorProperty,ColorText:_ColorText,ColorKey:_ColorKey,
                    ColorMin:_ColorMin,ColorMax:_ColorMax,ColorInvert:_ColorInvert,
                    ExtrudeProperty:_ExtrudeProperty,ExtrudeText:_ExtrudeText,ExtrudeKey:_ExturdeValue,
                    ExtrudeMin:_ExtrudeMin,ExtrudeMax:_ExtrudeMax,Scale:_Scale,Invert:_Invert,
                    HeightChart:_HeightChart,Filter:_Filter,HideNum:_HideNum,indexArr:_indexArr};
  }

  /*
  _ColorDescr: description of Color property,
  _ColorProperty: collect all property names,
  _ColorText: collect all values under _ColorKey,
  _ColorKey: Select color property name in Data tab,
  _ColorMin: minimum value of Color property in Data tab,
  _ColorMax: maximum value of Color property in Data tab,
  _ColorInvert: color invert is true or false,
  _ExtrudeDescr: description of extrude height property,
  _ExtrudeProperty: collect all property names that whose values are number,
  _ExtrudeText: collect all values under _ExturdeValue,
  _ExturdeValue: Select Extrude property name in Data tab,
  _ExtrudeMin: minimum value of Extrude property in Data tab,
  _ExtrudeMax: maximum value of Extrude property in Data tab,
  _Scale: extrude height scale,
  _Invert: extrude height invert is true or false,
  _HeightChart: it will show height chart or not,
  _Filter: collect filters,
  _HideNum: collect filter id numbers,
  _indexArr: collect entity number whose "TYPE" is not static
   */
  public getPuData(_ColorDescr: string,_ColorProperty: any[],_ColorText: any[],_ColorKey: string,
                   _ColorMin: number,_ColorMax: number,_ColorInvert: boolean,
                   _ExtrudeDescr: string,_ExtrudeProperty: any[],_ExtrudeText: any[],
                   _ExturdeValue: string,_ExtrudeMin: number,_ExtrudeMax: number,_Scale: number,_Invert: boolean,
                   _HeightChart: boolean,_Filter: any[],_HideNum: number[],_indexArr: number[]) {
    this._PuData = {ColorDescr:_ColorDescr,ColorProperty:_ColorProperty,ColorText:_ColorText,
                    ColorKey:_ColorKey,ColorMin:_ColorMin,ColorMax:_ColorMax,ColorInvert:_ColorInvert,
                    ExtrudeDescr:_ExtrudeDescr,ExtrudeProperty:_ExtrudeProperty,ExtrudeText:_ExtrudeText,
                    ExtrudeKey:_ExturdeValue,ExtrudeMin:_ExtrudeMin,ExtrudeMax:_ExtrudeMax,
                    Scale:_Scale,Invert:_Invert,HeightChart:_HeightChart,Filter:_Filter,HideNum:_HideNum,indexArr:_indexArr};
  }

}