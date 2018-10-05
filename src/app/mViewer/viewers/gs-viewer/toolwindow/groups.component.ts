import * as THREE from 'three';
import { Component, OnInit, Injector, ElementRef ,NgModule} from '@angular/core';
import { AngularSplitModule } from 'angular-split';
import {DataSubscriber} from "../data/DataSubscriber";
import {MatExpansionModule} from '@angular/material/expansion';
import * as gs from "gs-json";
import {ViewerComponent} from "../viewer/viewer.component";
/*import {MatTabsModule} from '@angular/material/tabs';*/

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent extends DataSubscriber implements OnInit {
  myElement;
  model:gs.IModel;
  scene:THREE.Scene;
  scene_and_maps: {
          scene: gs.IThreeScene, 
          faces_map: Map<number, gs.ITopoPathData>, 
          wires_map: Map<number, gs.ITopoPathData>, 
          edges_map: Map<number, gs.ITopoPathData>,
          vertices_map: Map<number, gs.ITopoPathData>,
          points_map: Map<number, gs.ITopoPathData>} ;
  groups:Array<any>;
  //groups: gs.IGroup[]；
  gridVisible:boolean;
  axisVisible:boolean;
  shadowVisible:boolean;
  frameVisible:boolean;
  pointVisible:boolean;
  _centerx:number;
  _centery:number;
  _centerz:number;
  _centersize:number;
  raycaster:THREE.Raycaster;
  _linepre:number;
  _pointsize:number;
  _materialpoint:number;
  hue:number;
  saturation:number;
  lightness:number;
  alight:THREE.HemisphereLight;
  renderer: THREE.WebGLRenderer; 
  camera: THREE.PerspectiveCamera;
  parent:Array<any>;

  constructor(injector: Injector, myElement: ElementRef){
  	super(injector);
    this.scene=this.dataService.getScene();
    this.renderer= this.dataService.getRenderer();
    this.camera= this.dataService.getCamera();
    this.myElement = myElement;
    this._centerx=this.dataService.centerx;
    this._centery=this.dataService.centery;
    this._centerz=this.dataService.centerz;
    this._centersize=this.dataService.centersize;
    this.raycaster=this.dataService.getraycaster();
    this._pointsize=this.dataService.pointsize;
    this._materialpoint=this.dataService.pointradius;
    this.alight=this.dataService.getalight();
    this.hue=this.dataService.hue;
    this.saturation=this.dataService.saturation;
    this.lightness=this.dataService.lightness;
  }
  ngOnInit() {
    this.model= this.dataService.getGsModel(); 
    this.updateModel();
    this.gridVisible=this.dataService.grid;
    this.axisVisible=this.dataService.axis;
    this.shadowVisible=this.dataService.shadow;
    this.frameVisible=this.dataService.frame;
    this.pointVisible=this.dataService.point;
    if(this._centerx===undefined||this._centerx===0){
      this._centerx=0;
    }else{
      this._centerx=this.dataService.centerx;
    }
     if(this._centery===undefined||this._centery===0){
      this._centery=0;
    }else{
      this._centery=this.dataService.centery;
    }
    if(this._centerz===undefined||this._centerz===0){
      this._centerz=0;
    }else{
      this._centerz=this.dataService.centerz;
    }
    if(this._centersize===undefined||this._centersize===100){
      this._centersize=100;
    }else{
      this._centersize=this.dataService.centersize;
    }
    this.raycaster=this.dataService.getraycaster();
    if(this._linepre===undefined||this._linepre===0.05){
      this._linepre=0.05;
    }else{
      this._linepre=this.raycaster.linePrecision;
    }
    if(this._pointsize===undefined||this._pointsize===1){
      this._pointsize=1;
    }else{
      this._pointsize=this.dataService.pointsize;
    }
    if(this._materialpoint===undefined||this._materialpoint===0.1){
      this._materialpoint=0.1;
    }else{
      this._materialpoint=this.dataService.pointradius;
    }
    if(this.hue === undefined||this.hue===0) {
        this.hue = 0;
    } else {
      this.hue=this.dataService.hue;
    }
    if(this.saturation === undefined||this.saturation===0.01) {
        this.saturation = 0.01;
    } else {
      this.saturation=this.dataService.saturation;
    }
    if(this.lightness == undefined||this.lightness===0.47) {
        this.lightness = 0.47;
    } else {
      this.lightness=this.dataService.lightness;
    }
  }

  notify(message: string):void{ 
  	if(message == "model_update" && this.scene){
      this.ngOnInit();
    }
  }

  updateModel():void{
  	if(this.model!==undefined){
      try{
        this.scene_and_maps= this.dataService.getscememaps();
        this.getgroupname();
      }catch(ex){
        console.error("Error displaying model:", ex);
      }
    }
    
  }

   animate(self){

   }

  changegrid(){
    this.gridVisible = !this.gridVisible;
    if(this.gridVisible){
      let gridhelper:THREE.GridHelper =new THREE.GridHelper( this._centersize,10);
      gridhelper.name="GridHelper";
      let vector:THREE.Vector3=new THREE.Vector3(0,1,0);
      gridhelper.lookAt(vector);
      gridhelper.position.set(this._centerx,this._centery,this._centerz);
      this.scene.add( gridhelper);
    }else{
      this.scene.remove(this.scene.getObjectByName("GridHelper"));
    }
    this.renderer.render(this.scene, this.camera);
    this.dataService.addgrid(this.gridVisible);
  }

  changepoint(){
    this.pointVisible = !this.pointVisible;
    let children:Array<any>=[];
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
    this.renderer.render(this.scene, this.camera);
    this.dataService.addpoint(this.pointVisible);
  }

  changeaxis(){
    this.axisVisible = !this.axisVisible;
    if(this.axisVisible){
      let axishelper:THREE.AxisHelper = new THREE.AxisHelper( 10 );
      axishelper.name="AxisHelper";
      this.scene.add( axishelper);
    }else{
      this.scene.remove(this.scene.getObjectByName("AxisHelper"));
    }
    this.renderer.render(this.scene, this.camera);
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
    this.renderer.render(this.scene, this.camera);
    this.dataService.addshadow(this.shadowVisible);
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
  this.renderer.render(this.scene, this.camera);
   this.dataService.addframe(this.frameVisible);
  }

  changecenter(centerx,centery,centerz){
    if(this.gridVisible){
      let gridhelper:THREE.Object3D=this.scene.getObjectByName("GridHelper");
      gridhelper.position.set(centerx,centery,centerz);
      this._centerx=centerx;
      this._centery=centery;
      this._centerz=centerz;
      this.dataService.getcenterx(centerx);
      this.dataService.getcentery(centery);
      this.dataService.getcenterz(centerz);
    }
    this.renderer.render(this.scene, this.camera);
  }

  changecentersize(centersize){
    if(this.gridVisible){
      this._centersize=centersize;
      this.scene.remove(this.scene.getObjectByName("GridHelper"));
      let gridhelper:THREE.GridHelper=new THREE.GridHelper(centersize,centersize);
      gridhelper.name="GridHelper";
      let vector:THREE.Vector3=new THREE.Vector3(0,1,0);
      gridhelper.lookAt(vector);
      gridhelper.position.set(this._centerx,this._centery,this._centerz);
      this.scene.add(gridhelper);
      this.dataService.getcentersize(centersize);
    }
    this.renderer.render(this.scene, this.camera);
  }
  getcenter(){
    for(var i=0;i<this.scene.children.length;i++){
      if(this.scene.children[i].type==="Scene"){
        for(var j=0;j<this.scene.children[i].children.length;j++){
          if(this.scene.children[i].children[j].name==="All points"){
            let center:THREE.Vector3=this.scene.children[i].children[j]["geometry"].boundingSphere.center;
            let radius:number=this.scene.children[i].children[j]["geometry"].boundingSphere.radius;
            let max:number=Math.ceil(radius+Math.max(Math.abs(center.x),Math.abs(center.y),Math.abs(center.z)))*2;
            this._centerx=center.x;
            this._centery=center.y;
            this._centerz=center.z;
            this._centersize=max;
          }
        }
      }
    }
    this.scene.remove(this.scene.getObjectByName("GridHelper"));
    let gridhelper:THREE.GridHelper=new THREE.GridHelper(this._centersize,10);
    gridhelper.name="GridHelper";
    let vector:THREE.Vector3=new THREE.Vector3(0,1,0);
    gridhelper.lookAt(vector);
    gridhelper.position.set(this._centerx,this._centery,this._centerz);
    this.scene.add(gridhelper);
    this.dataService.getcenterx(this._centerx);
    this.dataService.getcentery(this._centery);
    this.dataService.getcenterz(this._centerz);
    this.dataService.getcentersize(this._centersize);
    this.renderer.render(this.scene, this.camera);
  }
  //chiange line precision
  changeline(lineprecision){
    this._linepre=lineprecision;
    this.raycaster=this.dataService.getraycaster();
    this.raycaster.linePrecision=lineprecision;
    this.dataService.addraycaster(this.raycaster);
    if(this.dataService.SelectVisible === 'Edges'||this.dataService.SelectVisible === 'Wires'){
      for(var i=0;i<this.scene.children.length;i++){
        if(this.scene.children[i].name==="sphereInter"){
          let geometry:THREE.SphereGeometry = new THREE.SphereGeometry( lineprecision*15);
          this.scene.children[i]["geometry"]=geometry;
        }
      }
    }
    this.renderer.render(this.scene, this.camera);
  }
  //change points size
  changepointsize(pointsize){
    this._pointsize=pointsize;
    for(var i=0;i<this.scene.children.length;i++){
      if(this.scene.children[i].name==="Scene"){
        for(var j=0;j<this.scene.children[i].children.length;j++){
          if(this.scene.children[i].children[j].name==="All points"){
            this.scene.children[i].children[j]["material"].size=pointsize*10;
          }
        }
      }
      if(this.scene.children[i].name==="selects"&&this.scene.children[i].type==="Points"){
        this.scene.children[i]["material"].size=pointsize;
      }
    }
    this.renderer.render(this.scene, this.camera);
    this.dataService.getpointsize(pointsize);
    //this.dataService.getmaterialpoint(pointsize);
  }

  //change radius
  changeradius(point){
    this._materialpoint=point;
    if(this.dataService.SelectVisible !== 'Edges'&&this.dataService.SelectVisible !== 'Wires'){
      for(var i=0;i<this.scene.children.length;i++){
        if(this.scene.children[i].name==="sphereInter"){
          let geometry:THREE.SphereGeometry = new THREE.SphereGeometry( point*10);
          this.scene.children[i]["geometry"]=geometry;
        }
      }
    }
    this.renderer.render(this.scene, this.camera);
    this.dataService.getradius(point);
  }

  changelight(_hue,_saturation,_lightness){
    this.hue=_hue;
    this.saturation=_saturation;
    this.lightness=_lightness;
    let alight:THREE.HemisphereLight=this.alight;
    this.dataService.gethue(_hue);
    this.dataService.getsaturation(_saturation);
    this.dataService.getlightness(_lightness);
    this.alight.color.setHSL( _hue, _saturation,_lightness );
    this.renderer.render(this.scene, this.camera);
  }

  getgroupname(){
    this.groups=[];
    const allgroup: gs.IGroup[] = this.model.getAllGroups();
    for(var i=0;i<allgroup.length;i++){
      let group:any={};
      group.parent=allgroup[i].getParentGroup().getName();
      group.props=allgroup[i].getProps();
      group.name=allgroup[i].getName();
      group.num_point=allgroup[i].getPoints().length;
      group.points=allgroup[i].getPoints();
      group.num_vertice=allgroup[i].getTopos(gs.EGeomType.vertices).length;
      group.vertices=allgroup[i].getTopos(gs.EGeomType.vertices);
      group.num_edge=allgroup[i].getTopos(gs.EGeomType.edges).length;
      group.edges=allgroup[i].getTopos(gs.EGeomType.edges);
      group.num_wire=allgroup[i].getTopos(gs.EGeomType.wires).length;
      group.wires=allgroup[i].getTopos(gs.EGeomType.wires);
      group.num_face=allgroup[i].getTopos(gs.EGeomType.faces).length;
      group.faces=allgroup[i].getTopos(gs.EGeomType.faces);
      group.num_object = allgroup[i].getObjs().length;
      group.objects = allgroup[i].getObjs();
      group.child=null;
      this.groups.push(group);
    }
    this.addchildren();
    //this.renderer.render(this.scene, this.camera);
  }

  addchildren(){
    for(var i=0;i<this.groups.length;i++){
      if(this.groups[i].parent!==null){
        for(var j=0;j<this.groups.length;j++){
          if(this.groups[i].parent===this.groups[j].name){
            this.groups[j].child=this.groups[i];
          }
        }
      }
    }
  }

  selectpoint(group){
    if(group.point!==0||group.child.num_point!==0){
      let pointinitial:boolean=false;
      let grouppoints:gs.IPoint[];;
      if(group.point!==0){
        grouppoints=group.points;
        for(var j=0;j<this.scene.children.length;j++){
          for(var i=0;i<grouppoints.length;i++){
            if(grouppoints[i].getLabel()===this.scene.children[j].userData.id){
              pointinitial=true;
              this.scene.remove(this.scene.children[j]);
            }
          }
        }
      }
      if(group.child.num_point!==0){
        grouppoints=group.child.points;
        for(var j=0;j<this.scene.children.length;j++){
          for(var i=0;i<grouppoints.length;i++){
            if(grouppoints[i].getLabel()===this.scene.children[j].userData.id){
              pointinitial=true;
              this.scene.remove(this.scene.children[j]);
            }
          }
        }
      }
      if(pointinitial===false){
        for(var i=0;i<grouppoints.length;i++){
          let point:any={};
          let label: string = grouppoints[i].getLabel();
          //let id:string=grouppoints[i]._id;
          let id:number=grouppoints[i].getID();
          let verts_xyz: gs.XYZ = grouppoints[i].getLabelCentroid();
          let geometry:THREE.Geometry=new THREE.Geometry();
          geometry.vertices.push(new THREE.Vector3(verts_xyz[0],verts_xyz[1],verts_xyz[2]));
          let pointsmaterial:THREE.PointsMaterial =new THREE.PointsMaterial( { color:0x00ff00,size:2} );
          if(this.dataService.pointsize!==undefined){
              pointsmaterial.size=this.dataService.pointsize;
          }
          let points:THREE.Points = new THREE.Points( geometry, pointsmaterial);
          points.userData.id=label;
          points["material"].needsUpdate=true;
          points.name="selects";
          this.scene.add(points);
          point.label=label;
          point.id=id;
          point.label_xyz=verts_xyz;
          point.path=id;
          point.type="All points";
        }
      }
    }
  }

  selectvertice(group){
    if(group.vertice!==0){
      let vertixinitial:boolean=false;
      let groupvertices:gs.IVertex[]=group.vertices;
      for(var j=0;j<this.scene.children.length;j++){
        for(var i=0;i<groupvertices.length;i++){
          if(groupvertices[i].getLabel()===this.scene.children[j].userData.id){
            vertixinitial=true;
            this.scene.remove(this.scene.children[j]);
          }
        }
      }
      if(vertixinitial===false){
        for(var i=0;i<groupvertices.length;i++){
          let point:any=[];
          let label: string = groupvertices[i].getLabel();
          let id:number=groupvertices[i].getPoint().getID();
          let verts_xyz: gs.XYZ = groupvertices[i].getLabelCentroid();
          let geometry=new THREE.Geometry();
          geometry.vertices.push(new THREE.Vector3(verts_xyz[0],verts_xyz[1],verts_xyz[2]));
          let pointsmaterial=new THREE.PointsMaterial( { color:0x00ff00,size:2} );
          if(this.dataService.pointsize!==undefined){
              pointsmaterial.size=this.dataService.pointsize;
          }
          let points = new THREE.Points( geometry, pointsmaterial);
          points.userData.id=label;
          points["material"].needsUpdate=true;
          points.name="selects";
          this.scene.add(points);
          point.label=label;
          point.id=id;
          point.label_xyz=verts_xyz;
          point.path=id;
          point.type="All points";
        }
      }
    }
  }

  selectedge(group){
    if(group.edge!==0){
      let edgeinitial:boolean=false;
      let groupedges:gs.IEdge[]=group.edges;
      for(var j=0;j<this.scene.children.length;j++){
        for(var i=0;i<groupedges.length;i++){
          if(groupedges[i].getLabel()===this.scene.children[j].userData.id){
            edgeinitial=true;
            this.scene.remove(this.scene.children[j]);
          }
        }
      }
      if(edgeinitial===false){
        for(var i=0;i<groupedges.length;i++){
          let edge:any=[];
          let label: string = groupedges[i].getLabel();
          let id:string=groupedges[i].getLabel();
          let label_xyz: gs.XYZ = groupedges[i].getLabelCentroid();
          let verts: gs.IVertex[] = groupedges[i].getVertices();
          let verts_xyz: gs.XYZ[] = verts.map((v) => v.getPoint().getPosition());
          let geometry:THREE.Geometry =new THREE.Geometry();
          for(var i=0;i<verts_xyz.length;i++){
            geometry.vertices.push(new THREE.Vector3(verts_xyz[i][0],verts_xyz[i][1],verts_xyz[i][2]));
          }
          let material:THREE.LineBasicMaterial=new THREE.LineBasicMaterial( { color:0x00ff00,side:THREE.DoubleSide} );
          let line:THREE.Line = new THREE.Line( geometry, material);
          line.userData.id=edge.getLabel();
          line["material"].needsUpdate=true;
          line.name="selects";
          this.scene.add(line);
        }
      }
    }
  }

  selectwire(group){
    if(group.wire!==0){
      let groupwires:gs.IWire[]=group.wires;
      let wireinitial:boolean=false;
      for(var j=0;j<this.scene.children.length;j++){
        for(var i=0;i<groupwires.length;i++){
          if(groupwires[i].getLabel()===this.scene.children[j].userData.id){
            wireinitial=true;
            this.scene.remove(this.scene.children[j]);
          }
        }
      }
      if(wireinitial===false){
        for(var i=0;i<groupwires.length;i++){
          let wire:any=[];
          let label: string = groupwires[i].getLabel();
          let label_xyz: gs.XYZ = groupwires[i].getLabelCentroid();
          let verts: gs.IVertex[] = groupwires[i].getVertices();
          let verts_xyz: gs.XYZ[] = verts.map((v) => v.getPoint().getPosition());
          if (groupwires[i].isClosed()) {verts_xyz.push(verts_xyz[0]);}
          let geometry:THREE.Geometry=new THREE.Geometry();
          for(var i=0;i<verts_xyz.length;i++){
            geometry.vertices.push(new THREE.Vector3(verts_xyz[i][0],verts_xyz[i][1],verts_xyz[i][2]));
          }
          let material:THREE.LineBasicMaterial=new THREE.LineBasicMaterial( { color:0x00ff00,side:THREE.DoubleSide} );
          let line:THREE.Line = new THREE.Line( geometry, material);
          line.userData.id=label;
          line["material"].needsUpdate=true;
          line.name="selects";
          this.scene.add(line);
        }
      }
    }
  }

  selectface(group){
    if(group.face!==0){
      let groupfaces:gs.IFace[]=group.faces;
      let faceinitial:boolean=false;
      for(var j=0;j<this.scene.children.length;j++){
        for(var i=0;i<groupfaces.length;i++){
          if(groupfaces[i].getLabel()===this.scene.children[j].userData.id){
            faceinitial=true;
            this.scene.remove(this.scene.children[j]);
          }
        }
      }
      if(faceinitial===false){
        for(var i=0;i<groupfaces.length;i++){
          let face:any=[];
          let label: string = groupfaces[i].getLabel();
          let label_xyz: gs.XYZ = face.getLabelCentroid();
          let verts: gs.IVertex[] = face.getVertices();
          let verts_xyz: gs.XYZ[] = verts.map((v) => v.getPoint().getPosition());
          let geometry:THREE.Geometry=new THREE.Geometry();
          for(var i=0;i<verts_xyz.length;i++){
            geometry.vertices.push(new THREE.Vector3(verts_xyz[i][0],verts_xyz[i][1],verts_xyz[i][2]));
          }
          let material:THREE.LineBasicMaterial=new THREE.LineBasicMaterial( { color:0x00ff00,side:THREE.DoubleSide} );
          let line:THREE.Line = new THREE.Line( geometry, material);
          line.userData.id=face.getLabel();
          line["material"].needsUpdate=true;
          line.name="selects";
          this.scene.add(line);
        }
      }
    }
  }

  
  selectobject(group){
    if(group.face!==0){
      this.selectface(group);
    }else if(group.wire!==0){
      this.selectwire(group);
    }else if(group.edge!==0){
      this.selectedge(group);
    }else if(group.point!==0){
      this.selectpoint(group);
    }
  }

}