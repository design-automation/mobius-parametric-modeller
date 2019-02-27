import { Component, OnInit, Injector, ElementRef } from "@angular/core";
import {DataSubscriber} from "../data/DataSubscriber";
import {SettingComponent} from "../setting/setting.component";
// import * as d3 from "d3-array";
import * as chroma from "chroma-js";

@Component({
  selector: "cesium-viewer",
  templateUrl: "./viewer.component.html",
  styleUrls: ["./viewer.component.css"],
})
export class ViewerComponent extends DataSubscriber {
  private data: JSON;
  private myElement;
  private dataArr: object;
  private viewer: any;
  private selectEntity: any=null;
  private material: object;
  private _Colorbar: any[];
  private texts: any[];
  private _Cattexts: any[];
  private _CatNumtexts: any[];
  private pickupArrs: any[];
  private mode: string;
  private _index: number;
  private _ShowColorBar: boolean;
  private _ColorKey: string;
  private _ExtrudeKey: string;

  constructor(injector: Injector, myElement: ElementRef) {
    super(injector);
    this.myElement = myElement;
    this.dataService.set_imageryViewModels();
  }

  public ngOnInit() {
    this.mode = this.dataService.getmode();
    if(this.mode === "editor") {
      this.dataService.getValue(this.data);
      this.dataService.LoadJSONData();
      this.dataArr = this.dataService.get_ViData();
      this._index = 0;
    }
    if(this.mode === "viewer") {
      this.dataService.LoadJSONData();
      this.dataArr = this.dataService.get_PuData();
      this._index = 2;
    }
  }

  public notify(message: string): void {
    if(message === "model_update" ) {
      this.data = this.dataService.getGsModel();
      try {
        this.LoadData(this.data);
      }
      catch(ex) {
        console.log(ex);
      }
    }
  }

  public LoadData(data: JSON) {
    if(document.getElementsByClassName("cesium-viewer").length !== 0) {
      document.getElementsByClassName("cesium-viewer")[0].remove();
    }

    const viewer = new Cesium.Viewer("cesiumContainer" , {
      infoBox:false,
      imageryProviderViewModels : this.dataService.get_imageryViewModels(),
      selectedImageryProviderViewModel : this.dataService.get_imageryViewModels()[0],
      timeline: false,
      fullscreenButton:false,
      automaticallyTrackDataSourceClocks:false,
      animation:false,
      shadows : false,
      // baseLayerPicker : false,
      // shouldAnimate : true,
    });
    // viewer.scene.globe.enableLighting = true;
    document.getElementsByClassName("cesium-viewer-bottom")[0].remove();

    if(this.data !== undefined) {
      this.viewer = viewer;
      this.dataService.setViewer(this.viewer);
      this.data = data;
      const promise = Cesium.GeoJsonDataSource.load(this.data);
      viewer.dataSources.add(promise);
      const _HeightKey: any[] = [];

      promise.then(function(dataSource) {
        const entities = dataSource.entities.values;
        const self = this;
        if(entities[0].polygon !== undefined) {self._ShowColorBar = true;} else {self._ShowColorBar = false;}
      });

      this.dataService.setcesiumpromise(promise);
      if(this.mode === "editor") {
        this.dataService.getValue(this.data);
        this.dataService.LoadJSONData();
        this.dataArr = this.dataService.get_ViData();
        this._index = 0;
      }
      if(this.mode === "viewer") {
        this.dataService.LoadJSONData();
        this.dataArr = this.dataService.get_PuData();
        this._index = 2;
      }
      viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function(e) {
        e.cancel = true;
        viewer.zoomTo(promise);
      });
      viewer.zoomTo(promise);
      this.Colortext();
    }
    /*this.viewer = viewer;
    var dataSource = Cesium.CzmlDataSource.load(this.data);
    viewer.dataSources.add(dataSource);
    dataSource.then(function(dataSource) {
      const entities = dataSource.entities.values;
    });
    viewer.zoomTo(dataSource);*/
    /*Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MGMxNGYwMS1jZjYyLTQyNjMtOGNkYy1hOTRiYTk4ZGEzZDUiLCJpZCI6MTY4MSwiaWF0IjoxNTI5NTY4OTc4fQ.lL2fzwOZ6EQuL5BqXG5qIwlBn-P_DTbClhVYCIyCgS0';

    var viewer = new Cesium.Viewer('cesiumContainer',{
    terrainProvider : new Cesium.CesiumTerrainProvider({
        url: Cesium.IonResource.fromAssetId(5118)
    })
    });
*/
    /*var viewer = new Cesium.Viewer('cesiumContainer', {
      // terrainProvider : Cesium.createWorldTerrain(),
      // baseLayerPicker : false,
      shouldAnimate : true,
      infoBox:false,
      imageryProviderViewModels : imageryViewModels,
      selectedImageryProviderViewModel : imageryViewModels[0],
      timeline: false,
      fullscreenButton:false,
      // automaticallyTrackDataSourceClocks:false,
      animation:false,
    });

    viewer.dataSources.add(Cesium.CzmlDataSource.load(this.data)).then(function(ds) {
      viewer.trackedEntity = ds.entities.getById('path');
    });*/
    
  }

  public Colortext() {
    if(this.dataArr !== undefined) {
      if(this._index !== this.dataService.get_index()) {
        this._index = this.dataService.get_index();
        if(this._index === 0) {this.dataArr = this.dataService.get_ViData();
        } else if(this._index === 2) {this.dataArr = this.dataService.get_PuData();}
      }
      const propertyname = this.dataArr["ColorKey"];
      const texts = this.dataArr["ColorText"].sort();
      const _Max: number = this.dataArr["ColorMax"];
      const _Min: number = this.dataArr["ColorMin"];
      if(this.mode === "viewer") {
        this._ColorKey = this.dataArr["ColorKey"];
        this._ExtrudeKey = this.dataArr["ExtrudeKey"];
      }
      this.texts = undefined;
      this._Cattexts = [];
      this._CatNumtexts = [];
      let _ColorKey: any;
      let _ChromaScale = chroma.scale("SPECTRAL");
      if(this.dataArr["ColorInvert"] === true) {_ChromaScale = chroma.scale("SPECTRAL").domain([1,0]);}
      this._Colorbar = [];
      for(let i = 79;i>-1;i--) {
        this._Colorbar.push(_ChromaScale(i/80));
      }
      if(typeof(texts[0]) === "number") {
        this.texts = [Number(_Min.toFixed(2))];
        for(let i = 1;i<10;i++) {
          this.texts.push(Number((_Min+(_Max-_Min)*(i/10)).toFixed(2)));
        }
        this.texts.push(Number(_Max.toFixed(2)));
        for(let i = 0;i<this.texts.length;i++) {
          if(this.texts[i]/1000000000>1) {
            this.texts[i] = String(Number((this.texts[i]/1000000000).toFixed(3))).concat("B");
          } else if(this.texts[i]/1000000>1) {
            this.texts[i] = String(Number((this.texts[i]/1000000).toFixed(3))).concat("M");
          } else if(this.texts[i]/1000>1) {
            this.texts[i] = String(Number(((this.texts[i]/1000)).toFixed(3))).concat("K");
          }
        }
      }
      if(typeof(texts[0]) === "string") {
        if(texts.length<=12) {
          for(let j = 0;j<texts.length;j++) {
            _ColorKey = [];
            _ColorKey.text = texts[j];
            _ColorKey.color = _ChromaScale (1 - (j / texts.length));//_ChromaScale(j/texts.length);
            this._Cattexts.push(_ColorKey);
          }
        } else {
          for(let j = 0;j<this._Colorbar.length;j++) {
            _ColorKey = [];
            if(j === 0) {_ColorKey.text = texts[j];} else if(j === this._Colorbar.length-1) {
              if(texts[texts.length-1] !== null) {_ColorKey.text = texts[texts.length-1];
              } else {_ColorKey.text = texts[texts.length-2];}
            } else { _ColorKey.text = null;}
            _ColorKey.color = this._Colorbar[j];
            this._CatNumtexts.push(_ColorKey);
          }
        }
      }
    }
    if(this._ShowColorBar === false) {
      this._Cattexts = undefined;
      this._Colorbar = undefined;
    }
  }

  public select() {
    event.stopPropagation();
    const viewer = this.viewer;
    if(this.dataArr !== undefined) {
      if(this.selectEntity !== undefined&&this.selectEntity !== null) {this.ColorSelect(this.selectEntity);}
      if(viewer.selectedEntity !== undefined&&viewer.selectedEntity.polygon !== null) {
        this.dataService.set_SelectedEntity(viewer.selectedEntity);
        let material;
        if(viewer.selectedEntity.polygon !== undefined) {
          material = viewer.selectedEntity.polygon.material;
          viewer.selectedEntity.polygon.material = Cesium.Color.WHITE;
        }
        if(viewer.selectedEntity.polyline !== undefined) {
          material = viewer.selectedEntity.polyline.material;
          viewer.selectedEntity.polyline.material = Cesium.Color.WHITE;
        }
        this.selectEntity = viewer.selectedEntity;
        this.material = material;
      } else {
        this.dataService.set_SelectedEntity(undefined);
        this.selectEntity = undefined;
        this.material = undefined;
      }
    }
  }

  public ColorSelect(entity) {
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
    const _Filter: any[] = this.dataArr["Filter"];
    let _ChromaScale = chroma.scale("SPECTRAL");
    if(_ColorInvert === true) {_ChromaScale = chroma.scale("SPECTRAL").domain([1,0]);}
    let _CheckHide: boolean;
    if(_Filter.length !== 0) {
      _CheckHide = this.Hide(_Filter,entity,_HeightChart);
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
      if(typeof(_ColorText[0]) === "number") {
        this.colorByNum(entity,_ColorMax,_ColorMin,_ColorKey,_ChromaScale);
      } else {this.colorByCat(entity,_ColorText,_ColorKey,_ChromaScale);}
    }
  }

  public Hide(_Filter: any[], entity, _HeightChart: boolean): boolean {
    let _CheckHide: boolean=false;
    for(const filter of _Filter) {
      const value = entity.properties[filter.HeightHide]._value;
      if(value !== undefined) {
        if(typeof(value) === "number") {
          if (this._compare(value, Number(filter.textHide), Number(filter.RelaHide))) {
            _CheckHide = true;
          }
        } else if(typeof(value) === "string") {
          if (this._compareCat(value,filter.textHide, Number(filter.RelaHide))) {
            _CheckHide = true;
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
  public colorByNum(entity, max: number, min: number, _ColorKey: string, _ChromaScale: any) {
    if(entity.properties[_ColorKey] !== undefined) {
      const texts = entity.properties[_ColorKey]._value;
      const rgb = _ChromaScale(Number(((max-texts)/(max-min)).toFixed(2)))._rgb;
      if(entity.polygon !== undefined) {entity.polygon.material = Cesium.Color.fromBytes(rgb[0],rgb[1],rgb[2]);}
      if(entity.polyline !== undefined) {entity.polyline.material = Cesium.Color.fromBytes(rgb[0],rgb[1],rgb[2]);}
    }
  }

  public  colorByCat(entity, _ColorText: any[], _ColorKey: string, _ChromaScale: any) {
    if(entity.properties[_ColorKey] !== undefined) {
      let initial: boolean = false;
      for(let j = 0;j<_ColorText.length; j++) {
        if(entity.properties[_ColorKey]._value === _ColorText[j]) {
          const rgb = _ChromaScale(1 - (j / _ColorText.length)); // _ChromaScale((j/_ColorText.length).toFixed(2));
          entity.polygon.material = Cesium.Color.fromBytes(rgb._rgb[0],rgb._rgb[1],rgb._rgb[2]);
          initial = true;
        }
      }
      if(initial === false) {
        entity.polygon.material = Cesium.Color.LIGHTSLATEGRAY.withAlpha(1);
      }
    }
  }

  public showAttribs(event) {
    if(this.data !== undefined && this.mode === "viewer") {
      if(this.data["cesium"] !== undefined) {
        if(this.data["cesium"].select !== undefined) {
          if(this.viewer.selectedEntity !== undefined) {
            const pickup = this.viewer.scene.pick(new Cesium.Cartesian2(event.clientX,event.clientY));
            this.pickupArrs = [];
            this.pickupArrs.push({name:"ID",data:pickup.id.id});
            for(const _propertyName of this.data["cesium"].select) {
              this.pickupArrs.push({name:_propertyName,data:
                                    this.dataService.get_SelectedEntity().properties[_propertyName]._value});
            }
            const nameOverlay = document.getElementById("cesium-infoBox-defaultTable");
            this.viewer.container.appendChild(nameOverlay);
            nameOverlay.style.bottom = this.viewer.canvas.clientHeight - event.clientY + "px";
            nameOverlay.style.left = event.clientX + "px";
            nameOverlay.style.display= "block";
          } else {
            document.getElementById("cesium-infoBox-defaultTable").style.display= "none";
          }
        }
      }
    }
  }
    // save the geojson
  save_geojson(): void{
    let fileString = JSON.stringify(this.data);
    let blob = new Blob([fileString], {type: 'application/json'});
    FileUtils.downloadContent(blob, "output.geojson");
  }
}


abstract class FileUtils{
  public static downloadContent(blob, filename) {
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
        const a = document.createElement('a');
        document.body.appendChild(a);
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        a.click();
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }, 0)
    }
  }
}
