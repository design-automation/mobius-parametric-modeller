import * as THREE from 'three';
import { Component, OnInit, Input } from '@angular/core';
import { AngularSplitModule } from 'angular-split';
import { ViewerComponent } from '../viewer/viewer.component';
import {DataService} from '../data/data.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

  scene:THREE.Scene;
  alight:THREE.HemisphereLight;
  gridVisible: boolean; 
  axisVisible: boolean; 
  shadowVisible: boolean; 
  hue:number;
  saturation:number;
  lightness:number;
  frameVisible:boolean;
  _centerx:number;
  _centery:number;
  _centerz:number;
  _centersize:number;
  raycaster:THREE.Raycaster;
  _linepre:number;
  _pointpre:number;
  _pointsize:number;
  nomalVisible:boolean;
  pointVisible:boolean;

  ngOnInit(){
    if(this.hue == undefined) {
        this.hue = 0;
    } else {
      this.hue=this.dataService.hue;
    }
    if(this.saturation == undefined) {
        this.saturation = 0.01;
    } else {
      this.saturation=this.dataService.saturation;
    }
    if(this.lightness == undefined) {
        this.lightness = 0.47;
    } else {
      this.lightness=this.dataService.lightness;
    }
    this.gridVisible=this.dataService.grid;
    this.axisVisible=this.dataService.axis;
    this.shadowVisible=this.dataService.shadow;
    this.frameVisible=this.dataService.frame;
    this.pointVisible=this.dataService.point;
    if(this._centerx==undefined){
      this._centerx=0;
    }else{
      this._centerx=this.dataService.centerx;
    }
     if(this._centery==undefined){
      this._centery=0;
    }else{
      this._centery=this.dataService.centery;
    }
    if(this._centerz==undefined){
      this._centerz=0;
    }else{
      this._centerz=this.dataService.centerz;
    }
    if(this._centersize==undefined){
      this._centersize=100;
    }else{
      this._centersize=this.dataService.centersize;
    }
    this.raycaster=this.dataService.getraycaster();
    if(this._linepre==undefined){
      this._linepre=0.05;
    }else{
      this._linepre=this.raycaster.linePrecision;
    }
    if(this._pointpre==undefined){
      this._pointpre=1;
    }else{
      this._pointpre=this.raycaster.params.Points.threshold;
    }
    if(this._pointsize==undefined){
      this._pointsize=1;
    }else{
      this._pointsize=this.dataService.pointsize;
    }
    
  }

  constructor(private dataService: DataService){

    // avoid manipulating the scene here
    // shift to dataservice
    this.scene = this.dataService.getScene();
    this.alight=this.dataService.getalight();
    this.hue=this.dataService.hue;
    this.saturation=this.dataService.saturation;
    this.lightness=this.dataService.lightness;
    this._centerx=this.dataService.centerx;
    this._centery=this.dataService.centery;
    this._centerz=this.dataService.centerz;
    this._centersize=this.dataService.centersize;
    this.raycaster=this.dataService.getraycaster();
    this._linepre=this.raycaster.linePrecision;
    this._pointpre=this.raycaster.params.Points.threshold;
    this._pointsize=this.dataService.pointsize;
  }

  changegrid(){
    this.gridVisible = !this.gridVisible;
    if(this.gridVisible){
      var gridhelper=new THREE.GridHelper( 100, 100);
      gridhelper.name="GridHelper";
      var vector=new THREE.Vector3(0,1,0);
      gridhelper.lookAt(vector);
      this.scene.add( gridhelper);

    }else{
      this.scene.remove(this.scene.getObjectByName("GridHelper"));
    }
    this.dataService.addgrid(this.gridVisible);
  }


  changecenter(centerx,centery,centerz,centersize){
    if(this.gridVisible){
      var gridhelper=this.scene.getObjectByName("GridHelper");
      gridhelper=new THREE.GridHelper(centersize,centersize);
      gridhelper.position.set(centerx,centery,centerz);
      console.log(gridhelper)
      this._centerx=centerx;
      this._centery=centery;
      this._centerz=centerz;
      this._centersize=centersize;
      this.dataService.getcenterx(centerx);
      this.dataService.getcentery(centery);
      this.dataService.getcenterz(centerz);
      this.dataService.getcentersize(centersize);
    }
  }

  changeline(lineprecision){
    this._linepre=lineprecision;
    this.raycaster.linePrecision=lineprecision;
    this.dataService.addraycaster(this.raycaster);
  }

  changepoint(){
    this.pointVisible = !this.pointVisible;
    var children:any=[];
    for(var i=0;i<this.scene.children.length;i++){
      if(this.scene.children[i].type==="Scene"){
        for(var j=0;j<this.scene.children[i].children.length;j++){
          if(this.scene.children[i].children[j].type==="Points"){
            children.push(this.scene.children[i].children[j]);
          }
        }
      }
    }
    if(this.pointVisible){
      for(var i=0;i<children.length;i++){
        children[i]["material"].transparent=false;
        children[i]["material"].opacity=1;
      }
    }else{
      for(var i=0;i<children.length;i++){
        children[i]["material"].transparent=true;
        children[i]["material"].opacity=0;
      }
    }
    this.dataService.addpoint(this.pointVisible);
  }

  changepointsize(pointsize){
    this._pointsize=pointsize;
    for(var i=0;i<this.scene.children.length;i++){
      if(this.scene.children[i].name==="sphereInter"){
        var geometry = new THREE.SphereGeometry( pointsize/3);
        this.scene.children[i]["geometry"]=geometry;
      }
      if(this.scene.children[i].name==="selects"&&this.scene.children[i].type==="Points"){
        this.scene.children[i]["material"].size=pointsize;
      }
    }
    this.dataService.getpointsize(pointsize);

  }

  changeaxis(){
    this.axisVisible = !this.axisVisible;
    if(this.axisVisible){
      var axishelper = new THREE.AxesHelper( 10 );
      axishelper.name="AxisHelper";
      this.scene.add( axishelper);
    }else{
      this.scene.remove(this.scene.getObjectByName("AxisHelper"));
    }
    this.dataService.addaxis(this.axisVisible);
  }

  changeshadow(){
    this.shadowVisible = !this.shadowVisible;
    for(var i=0;i<this.scene.children.length;i++){
      if(this.scene.children[i].type==="DirectionalLight")
      {
        if(this.shadowVisible){
          this.scene.children[i].castShadow=true;
        }
        else{
          this.scene.children[i].castShadow=false;
        }
      }
    }
    this.dataService.addshadow(this.shadowVisible);
  }

  changelight(_hue,_saturation,_lightness){
    this.hue=_hue;
    this.saturation=_saturation;
    this.lightness=_lightness;
    var alight=this.alight;
    this.dataService.gethue(_hue);
    this.dataService.getsaturation(_saturation);
    this.dataService.getlightness(_lightness);
    this.alight.color.setHSL( _hue, _saturation,_lightness );
  }
  
  changeframe(){
   this.frameVisible = !this.frameVisible;
   if(this.frameVisible){
    for(var i=0;i<this.scene.children.length;i++){
      if(this.scene.children[i].type==="Scene"){
        if(this.scene.children[i].children[0].type==="Mesh"){
          this.scene.children[i].children[0].visible=false;
        }
      }
    }
  }else{
    for(var i=0;i<this.scene.children.length;i++){
      if(this.scene.children[i].type==="Scene"){
        if(this.scene.children[i].children[0].type==="Mesh"){
          this.scene.children[i].children[0].visible=true;
        }
      }
    }
  }
   this.dataService.addframe(this.frameVisible);
  }

  changenormal(){
    this.nomalVisible=!this.nomalVisible;
    if(this.nomalVisible){
      /*for(var i=0;i<this.scene.children.length;i++){
        if(this.scene.children[i].type==="Scene"){
          for(var j=0;j<this.scene.children[i].children.length;j++){
            if(this.scene.children[i].children[j].type==="Mesh"){
              var mesh=this.scene.children[i].children[j];
              var faceNormalsHelper = new THREE.FaceNormalsHelper( mesh, 10 );
              mesh.add( faceNormalsHelper );
              var verticehelper = new THREE.VertexNormalsHelper( mesh, 10 );
              this.scene.add(verticehelper);
              console.log(this.scene);
              //facehelper.visible=false;
              //this.scene.add(verticehelper);
            }
          }
        }
      }*/
    }
  }

  setting(event){
    event.stopPropagation();
  }

}

