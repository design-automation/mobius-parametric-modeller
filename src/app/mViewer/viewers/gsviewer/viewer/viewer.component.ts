import { Component, OnInit, Injector, ElementRef } from '@angular/core';
import * as THREE from 'three';
import { AngularSplitModule } from 'angular-split';
import * as gs from "gs-json";
import {DataSubscriber} from "../data/DataSubscriber";
import {NgxPaginationModule} from 'ngx-pagination';
import * as bm from '../../../../../libs/geo-info/bi-map';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent extends DataSubscriber implements OnInit {
  
  _model: any;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  controls: THREE.OrbitControls;
  width: number;
  height: number;
  raycaster:THREE.Raycaster;
  mouse:THREE.Vector2;
  // check what needs to be global and refactor  
  selecting:Array<any>;
  basicMat:THREE.MeshPhongMaterial;
  selectwireMat:THREE.LineBasicMaterial;
  scene_and_maps: {
          scene: gs.IThreeScene, 
          faces_map: Map<number, gs.ITopoPathData>, 
          wires_map: Map<number, gs.ITopoPathData>, 
          edges_map: Map<number, gs.ITopoPathData>,
          vertices_map: Map<number, gs.ITopoPathData>,
          points_map: Map<number, gs.ITopoPathData>} ;
  myElement;
  scenechildren:Array<any>;
  textlabels: Array<any>=[];
  starsGeometry:THREE.Geometry = new THREE.Geometry();
  mDownTime: number;
  mUpTime: number;
  sphere:THREE.Mesh;
  center:THREE.Vector3;
  seVisible:boolean=false;
  imVisible:boolean=false;
  SelectVisible:string='Objs';
  settingVisible:boolean=false;
  LineNo:number=0;
  clickatt:Array<any>;
  _updatemodel:boolean=true;
  text:string;
  _modelshow:boolean=true;

  constructor(injector: Injector, myElement: ElementRef) { 
    super(injector);
    this.myElement = myElement;
  }

  ngOnInit() {

    let container = this.myElement.nativeElement.children.namedItem("container");
    /// check for container
    if(!container){
      console.error("No container in Three Viewer");
      return;
    }

    ///
    let width: number = container.offsetWidth;//container.clientWidth;
    let height: number = container.offsetHeight;//container.clientHeight;

    let scene: THREE.Scene = this.dataService.getScene(width, height);
    let renderer: THREE.WebGLRenderer = this.dataService.getRenderer();
    let camera: THREE.PerspectiveCamera = this.dataService.getCamera();
    let controls: THREE.OrbitControls = this.dataService.getControls();
    container.appendChild( renderer.domElement );

    this.scene = scene;
    this.renderer = renderer;
    this.camera = camera;
    this.controls = controls;
    this.width = width;
    this.height = height;
    this.updateModel();

    // todo: check and refactor what is required?
    this.selecting = this.dataService.getselecting();  // todo: should this be in the data service??
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.raycaster.linePrecision=0.05;
    this.scenechildren=this.dataService.getscenechild();
    this.dataService.SelectVisible=this.SelectVisible;

    var geometry = new THREE.SphereGeometry( 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00,transparent:true,opacity:0.5 } );
    this.sphere = new THREE.Mesh( geometry, material );
    this.sphere.visible = false;
    this.sphere.name="sphereInter";
    this.sphere.scale.set(0.1,0.1,0.1);
    this.scene.add( this.sphere );

    let self = this;
    controls.addEventListener( 'change', function(){self.render( self);});
    
    for(var i=0;i<this.getchildren().length;i++){
      this.getchildren()[i]["material"].transparent=false;
    }
    this.dataService.addraycaster(this.raycaster);
    this.addgrid();
    self.renderer.render( self.scene, self.camera );
  }
  //
  //  checks if the data service has a data and calls update function for the viewer
  //
  notify(message: string): void{
    if(message == "model_update" && this.scene){

      this.updateModel();
    }
  }

  animate(self) {
    self.raycaster.setFromCamera(self.mouse,self.camera);
    self.scenechildren=self.dataService.getscenechild();
    var intersects = self.raycaster.intersectObjects(self.scenechildren);
    for (var i = 0; i < self.scenechildren.length; i++) {
      var currObj=self.scenechildren[i];
      if(self.dataService.getSelectingIndex(currObj.uuid)<0) {
        if ( intersects[ 0 ]!=undefined&&intersects[ 0 ].object.uuid==currObj.uuid) {
          self.sphere.visible = true;
          self.sphere.position.copy( intersects[ 0 ].point );
        } else {
          self.sphere.visible = false;
        }
      }
    }
    for(var i=0; i<self.textlabels.length; i++) {
      self.textlabels[i].updatePosition();
    }
    if(self.dataService.clickshow!==undefined&&self.clickatt!==self.dataService.clickshow){
      self.clickatt=self.dataService.clickshow;
      self.clickshow();
    }
    self.renderer.render( self.scene, self.camera );
  }

  render(self){
    for(var i=0; i<self.textlabels.length; i++) {
      self.textlabels[i].updatePosition();
    }
    if(self.dataService.clickshow!==undefined&&self.clickatt!==self.dataService.clickshow){
      self.clickatt=self.dataService.clickshow;
      self.clickshow();
    }
    //self.onDocumentMouseDown();
    self.renderer.render( self.scene, self.camera );
  }

  /// clears all children from the scene
  clearScene(): void{
    /// remove children from scene
    for(var i=0; i < this.scene.children.length; i++){
      if( this.scene.children[i].type === "Scene" ){
        this.scene.remove(this.scene.children[i]);
        i=i-1;
      }
      if(this.scene.children[i].name=="selects"){
        this.scene.remove(this.scene.children[i]);
        i=i-1;
      }
    }
    for(var i=0;i<this.scene.children.length;i++){
      if(this.scene.children[i].name=="selects"){
        this.scene.remove(this.scene.children[i]);
        i=i-1;
      }
    }
    for(var i=0;i<this.textlabels.length;i++){
      this.removeTextLabel(this.textlabels[i]["id"]);
      i=i-1;
    }
  }

  private lastChanged = undefined;
  ngDoCheck(){
    let container = this.myElement.nativeElement.children.namedItem("container");
    let width: number = container.offsetWidth;
    let height: number = container.offsetHeight;
    // this is when dimensions change
    if(width!==this.width||height!==this.height){    
      // compute time difference from last changed
      let nowTime = Date.now();
      let difference = this.lastChanged - nowTime;
      if( Math.abs(difference) < 400 ){
        // do nothing
        // dimensions still changing
        //console.log("Threshold too low: " + Math.abs(difference) + "ms");
      }
      else{
        //console.log("Threshold matched: " + Math.abs(difference) + "ms");
        this.onResize();
      }
      // add dimension change script
      this.lastChanged = Date.now();
    }
    
  }

  // TODO Refactor
  onResize() :void{
    let container = this.myElement.nativeElement.children.namedItem("container");
    /// check for container
    if(!container){
      console.error("No container in Three Viewer");
      return;
    }
    ///
    let width: number = container.offsetWidth;
    let height: number = container.offsetHeight;
    this.width = width;
    this.height = height;
    this.renderer.setSize(this.width,this.height);
    this.camera.aspect=this.width/this.height;
    this.camera.updateProjectionMatrix();
  }
  //
  // update mode
  // todo: optimize
  // 
  updateModel(): void{
    this._model = this.dataService.getModel(); 
    if( !this._model || !this.scene ){
      console.warn("Model or Scene not defined.");
      this._modelshow=false;
      return;
    }
    try{
      this._updatemodel=true;
      this._modelshow=true;
      console.log("MODEL LOADED")
      console.debug(this._model)

      var geometry = new THREE.BufferGeometry();
    var normals = [];
    var colors = [];
    
    // Convert the attribute data to a bi-map, then use it to get the position values
    const positions_data = new bm.BiMapManyToOne<any>(this._model.attributes.positions[0].data);
    let positions_ = [];
    positions_data.keys().forEach(key => {
        positions_.push(positions_data.getValue(key));
    });
    const positions_flat = [].concat(...positions_);


    const coordinates =this._model.attributes.positions.filter(attr=>attr.name==='coordinates');

    const triangles=this._model.topology.triangles;
    const triangles_flat = [].concat(...triangles);


    const triangles_flat_values=coordinates.values;
    const triangles_flat_keys=coordinates.keys;
    let triangles_flat_ = []
    triangles_flat_keys.forEach((v,k)=>{
      triangles_flat_.push(triangles_flat_values[v])
    });
    const triangles_flat_coords = [].concat(...triangles_flat_);


    const vertices = this._model.topology.vertices;
    let edges = this._model.topology.edges

    // remove duplicated edges
    let edges_sorted = edges.map(x => x.sort()).sort();

    var edges_unique = [];

    for (var i = 1; i < edges_sorted.length; i++){
      if (JSON.stringify(edges_sorted[i]) != JSON.stringify(edges_sorted[i-1])){
        edges_unique.push(edges_sorted[i]);
        }
    }


    const edges_flat = [].concat(...edges);
    let edges_flat_coords = []
    edges_flat.forEach((v,k)=>{
      edges_flat_coords.push(coordinates[vertices[v]])
    });


    let attr_normal = this._model.attributes.vertices.filter(attr=>attr.name==='normal')

    const normal_values=attr_normal[0].values;
    const normal_keys=attr_normal[0].keys;
    let normals_ = []
    normal_keys.forEach((v,k)=>{
      normals_.push(normal_values[v])
    });
    const normals_flat = [].concat(...normals_);

    let attr_color = this._model.attributes.vertices.filter(attr=>attr.name==='color')

    const color_values=attr_color[0].values;
    const color_keys=attr_color[0].keys;
    let colors_ = []
    color_keys.forEach((v,k)=>{
      colors_.push(color_values[v])
    });
    const colors_flat = [].concat(...colors_);
    

    colors = [0,0,1,1,0,1,0,1,0,1,1,1]
    
    for (let i = 0; i < coordinates.length; i++ ){
      normals.push(0,0,0)
      colors.push(0,0,1)
    }

    
    // console.log(colors)
    
  
    // tri
    geometry.setIndex( triangles_flat_coords );
    geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions_flat, 3 ) );
    geometry.addAttribute( 'normal', new THREE.Float32BufferAttribute( normals_flat, 3 ) );
    geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors_flat, 3 ) );
    var material = new THREE.MeshPhongMaterial( {
      specular: 0xffffff, shininess: 0,
      side: THREE.DoubleSide, vertexColors: THREE.VertexColors,
      // wireframe:true
    } );
    let mesh = new THREE.Mesh( geometry, material );
    this.scene.add( mesh );

   // lines
   var geometry3 = new THREE.BufferGeometry();
   geometry3.setIndex( edges_flat_coords );
   geometry3.addAttribute( 'position', new THREE.Float32BufferAttribute( positions_flat, 3 ) );
   geometry3.addAttribute( 'normal', new THREE.Float32BufferAttribute( normals_flat, 3 ) );
   geometry3.addAttribute( 'color', new THREE.Float32BufferAttribute( colors_flat, 3 ) );
   var material3 = new THREE.LineBasicMaterial( {
    color: 0xffffff,
    linewidth: 1,
    linecap: 'round', //ignored by WebGLRenderer
    linejoin:  'round' //ignored by WebGLRenderer
  } );
   let lines = new THREE.LineSegments( geometry3, material3 );
   this.scene.add( lines );

    // points
    var geometry2 = new THREE.BufferGeometry();
    geometry2.addAttribute( 'position', new THREE.Float32BufferAttribute( positions_flat, 3 ) );
    geometry2.addAttribute( 'color', new THREE.Float32BufferAttribute( colors_flat, 3 ) );
    geometry2.computeBoundingSphere();
    //
    var material2 = new THREE.PointsMaterial( { size: 0.1, vertexColors: THREE.VertexColors } );
    let mesh2 = new THREE.Points( geometry2, material2 );
    this.scene.add( mesh2 );
      //todo: Change to new viewer
      // const scene_data = this._model.scene;
      // this.clearScene();
      // let loader = new THREE.ObjectLoader();
      // // loading data
      // let objectData = loader.parse( scene_data );
      // this.seVisible=false;
      // this.imVisible=false;
      // this.LineNo=0;
      // // preprocessing
      // if( objectData.children!==undefined){
      //   var radius=0;
      //   for(var i=0;i< objectData.children.length;i++){
      //     let chd = objectData.children[i];
      //     //chd["material"].needsUpdate=true;
      //     chd["material"].transparent=true;
      //     chd["material"].blending=1;
      //     if( chd.name==="All faces"||chd.name==="All wires"||chd.name==="All edges"||chd.name==="All vertices"||
      //       chd.name==="Other lines"||chd.name==="All points"){
      //         chd["material"].transparent=false;
      //         chd["geometry"].computeVertexNormals();
      //         chd["geometry"].computeBoundingBox();
      //         chd["geometry"].computeBoundingSphere();
      //         if(chd.name==="All points"){
      //           this.center=chd["geometry"].boundingSphere.center;
      //         }
      //         if(chd.name==="All edges"){
      //           this.basicMat=chd["material"].color;
      //         }else if(chd.name==="Other lines"){
      //           this.basicMat=chd["material"].color;
      //         }
      //         if(chd.type==="LineSegments"&&chd["geometry"].index.count!==undefined){
      //           this.LineNo=this.LineNo+chd["geometry"].index.count;
      //         }
      //     }
      //     if(chd["geometry"]!=undefined&&chd["geometry"].boundingSphere.radius!==null){
      //       if(chd["geometry"].boundingSphere.radius>radius){
      //         radius=chd["geometry"].boundingSphere.radius;
      //         this.center=chd["geometry"].boundingSphere.center;
      //       }
      //     }
      //   }
      // }
      // // setting controls
      // this.controls.target.set(this.center.x,this.center.y,this.center.z);
      this.controls.update();
      // // adding the object to the scene
      // this.scene.add(objectData);  
      this.render(this);
      this.dataService.getpoints=[];
    }
    catch(ex){
      console.error("Error displaying model:", ex);
      this._updatemodel=false;
      this.text=ex;
    }
  }

  getMaterial(name: string): THREE.SpriteMaterial{
    var canvas = document.createElement('canvas');
    canvas.width = 256; 
    canvas.height = 256;
    var context = canvas.getContext('2d');
    context.textAlign = "center";
    context.fillText( name , canvas.width/2, canvas.height/2);
    context.font ="Bold  100px sans-serif";
    var texture = new THREE.Texture(canvas) 
    //texture.needsUpdate = true;
    var spriteMaterial = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
    return spriteMaterial;
  }

  getchildren():Array<any>{
    var children;
      for (var i = 0; i<this.scene.children.length; i++) {
        if(this.scene.children[i].name=="Scene") {
          children=this.scene.children[i].children;
          break;
        }
        if(i==this.scene.children.length-1) {
          return [];
        }
      }
    return children;
  }
  clickshow(){
    var label=this.clickatt["label"];
    var id=this.clickatt["id"];
    var label_xyz=this.clickatt["label_xyz"];
    var path=this.clickatt["path"];
    this.addTextLabel(label,label_xyz,id,path, "All points");
  }

  select(seVisible){
    event.stopPropagation();
    this.seVisible=!this.seVisible;
    if(this.seVisible) {
      if(this.SelectVisible==="Objs") this.objectselect(this.SelectVisible); 
      if(this.SelectVisible==="Faces") this.faceselect(this.SelectVisible); 
      if(this.SelectVisible==="Edges") this.edgeselect(this.SelectVisible); 
      if(this.SelectVisible==="Vertices") this.verticeselect(this.SelectVisible); 
      if(this.SelectVisible==="Points") this.pointselect(this.SelectVisible); 
      for(var i=0;i<this.getchildren().length;i++){
        this.getchildren()[i]["material"].transparent=true;
      }
    }else{
      for(var i=0;i<this.getchildren().length;i++){
        this.getchildren()[i]["material"].transparent=false;
        if(this.getchildren()[i].name=="All edges"){
          this.getchildren()[i]["material"].color=this.basicMat;
        }else if(this.getchildren()[i].name=="Other lines"){
          this.getchildren()[i]["material"].color=this.basicMat;
        }
      }
    }
    
  }

  objectselect(SelectVisible){
    event.stopPropagation();
    this.SelectVisible="Objs";
    this.dataService.visible="Objs";
    document.getElementById("gsv-object").style.color=null;
    document.getElementById("gsv-face").style.color=null;
    document.getElementById("gsv-wire").style.color=null;
    document.getElementById("gsv-edge").style.color=null;
    document.getElementById("gsv-vertice").style.color=null;
    var scenechildren=[];
    var children=this.getchildren();
    var objsvisibel:boolean=true;
    for(var i=0;i<children.length;i++){
      if(children[i].name==="All objs"||children[i].name==="All faces"){
        if(children[i]["geometry"].attributes.position.array.length!==0){
        children[i]["material"].opacity=0.3;
        children[i].name="All objs";
        scenechildren.push(children[i]);
        }else{
          objsvisibel=false;
        }
      }
      if(children[i].name==="All wires") {
        if(objsvisibel===true){
        children[i]["material"].opacity=0;
        }else{
          children[i]["material"].opacity=0.6;
          scenechildren.push(children[i]);
        }
      }
      if(children[i].name==="All edges"||children[i].name==="Other lines") {children[i]["material"].opacity=0.1;children[i]["material"].color=this.basicMat;}
      if(children[i].name==="All vertices") children[i]["material"].opacity=0;
    }
    this.dataService.addscenechild(scenechildren);
    this.dataService.SelectVisible=this.SelectVisible;
  }

  faceselect(SelectVisible){
    event.stopPropagation();
    this.SelectVisible="Faces";
    this.dataService.visible="Faces";
    document.getElementById("gsv-object").style.color="grey";
    document.getElementById("gsv-face").style.color=null;
    document.getElementById("gsv-wire").style.color=null;
    document.getElementById("gsv-edge").style.color=null;
    document.getElementById("gsv-vertice").style.color=null;
    var scenechildren=[];
    var children=this.getchildren();
    for(var i=0;i<children.length;i++){
      if(children[i].name==="All wires") children[i]["material"].opacity=0.1;
      if(children[i].name==="All edges"||children[i].name==="Other lines") {children[i]["material"].opacity=0.1;children[i]["material"].color=this.basicMat;}
      if(children[i].name==="All vertices") children[i]["material"].opacity=0.1;
      if(children[i].name==="All objs"||children[i].name==="All faces"){
        children[i]["material"].opacity=0.3;
        children[i].name="All faces";
        scenechildren.push(children[i]);
      }
    }
    this.dataService.addscenechild(scenechildren);
    this.dataService.SelectVisible=this.SelectVisible;
  }

  wireselect(SelectVisible){
    event.stopPropagation();
    this.SelectVisible="Wires";
    var lineprecision=this.raycaster.linePrecision;
    for(var i=0;i<this.scene.children.length;i++){
      if(this.scene.children[i].name==="sphereInter"){
        var geometry = new THREE.SphereGeometry( lineprecision*2);
        this.scene.children[i]["geometry"]=geometry;
        this.renderer.render(this.scene, this.camera);
      }
    }
    document.getElementById("gsv-object").style.color="grey";
    document.getElementById("gsv-face").style.color="grey";
    document.getElementById("gsv-wire").style.color=null;
    document.getElementById("gsv-edge").style.color=null;
    document.getElementById("gsv-vertice").style.color=null;
    var scenechildren=[];
    var children=this.getchildren();
    for(var i=0;i<children.length;i++){
      if(children[i].name==="All objs"||children[i].name==="All faces") children[i]["material"].opacity=0.1;
      if(children[i].name==="All edges"||children[i].name==="Other lines") {children[i]["material"].opacity=0.1;children[i]["material"].color=this.basicMat;}
      if(children[i].name==="All vertices") children[i]["material"].opacity=0.1;
      if(children[i].name==="All wires"){
        children[i]["material"].opacity=0.6;
        scenechildren.push(children[i]);
      }
    }
    this.dataService.addscenechild(scenechildren);
    this.dataService.SelectVisible=this.SelectVisible;
  }

  edgeselect(SelectVisible){
    event.stopPropagation();
    this.SelectVisible="Edges";
    var lineprecision=this.raycaster.linePrecision;
    for(var i=0;i<this.scene.children.length;i++){
      if(this.scene.children[i].name==="sphereInter"){
        var geometry = new THREE.SphereGeometry( lineprecision*15);
        this.scene.children[i]["geometry"]=geometry;
        this.renderer.render(this.scene, this.camera);
      }
    }
    document.getElementById("gsv-object").style.color="grey";
    document.getElementById("gsv-face").style.color="grey";
    document.getElementById("gsv-wire").style.color="grey";
    document.getElementById("gsv-edge").style.color=null;
    document.getElementById("gsv-vertice").style.color=null;
    var scenechildren=[];
    var children=this.getchildren();
    var edgevisible:boolean=true;
    for(var i=0;i<children.length;i++){
      children[i]["material"].transparent=true;
      if(children[i].name==="All edges"||children[i].name==="Other lines"){
        if(children[i].name==="All edges"){
          if(children[i]["geometry"].attributes.position.array.length!==0){
            children[i]["material"].opacity=0.3;
            children[i]["material"].color=new THREE.Color(255,255,0);
            scenechildren.push(children[i]);
          }else{
            edgevisible=false;
          }
        }else{
          if(children[i]["geometry"].attributes.position.array.length!==0){
            children[i]["material"].opacity=0.3;
            children[i]["material"].color=new THREE.Color(255,255,0);
            scenechildren.push(children[i]);
          }
        }
      }
      if(children[i].name==="All objs"||children[i].name==="All faces") children[i]["material"].opacity=0.1;
      if(children[i].name==="All wires") children[i]["material"].opacity=0.1;
      if(children[i].name==="All vertices") children[i]["material"].opacity=0.1;
    }
    this.dataService.addscenechild(scenechildren);
    this.dataService.SelectVisible=this.SelectVisible;
  }

  verticeselect(SelectVisible){
    event.stopPropagation();
    this.SelectVisible="Vertices";
    var pointradius=this.dataService.pointradius;;
    for(var i=0;i<this.scene.children.length;i++){
      if(this.scene.children[i].name==="sphereInter"){
        var geometry = new THREE.SphereGeometry( pointradius*10);
        this.scene.children[i]["geometry"]=geometry;
        this.renderer.render(this.scene, this.camera);
      }
    }
    document.getElementById("gsv-object").style.color="grey";
    document.getElementById("gsv-face").style.color="grey";
    document.getElementById("gsv-wire").style.color="grey";
    document.getElementById("gsv-edge").style.color="grey";
    document.getElementById("gsv-vertice").style.color=null;
    var scenechildren=[];
    var children=this.getchildren();
    for(var i=0;i<children.length;i++){
      if(children[i].name==="All objs"||children[i].name==="All faces") children[i]["material"].opacity=0.1;
      if(children[i].name==="All wires") children[i]["material"].opacity=0.1;
      if(children[i].name==="All edges"||children[i].name==="Other lines") {children[i]["material"].opacity=0.1;children[i]["material"].color=this.basicMat;}
      /*if(children[i].name==="All vertices"){
        scenechildren.push(children[i]);
      }*/
      if(children[i].name==="All points"){
        scenechildren.push(children[i]);
        children[i]["material"].opacity=1;
      }
    }
    this.dataService.addscenechild(scenechildren);
    this.dataService.SelectVisible=this.SelectVisible;
  }

  pointselect(SelectVisible){
    /*event.stopPropagation();
    this.verticeselect("Vertices");
    this.SelectVisible="Points";
    this.dataService.SelectVisible=this.SelectVisible;*/
    event.stopPropagation();
    this.SelectVisible="Points";
    var pointradius=this.dataService.pointradius;;
    for(var i=0;i<this.scene.children.length;i++){
      if(this.scene.children[i].name==="sphereInter"){
        var geometry = new THREE.SphereGeometry( pointradius*10);
        this.scene.children[i]["geometry"]=geometry;
        this.renderer.render(this.scene, this.camera);
      }
    }
    document.getElementById("gsv-object").style.color="grey";
    document.getElementById("gsv-face").style.color="grey";
    document.getElementById("gsv-wire").style.color="grey";
    document.getElementById("gsv-edge").style.color="grey";
    document.getElementById("gsv-vertice").style.color=null;
    var scenechildren=[];
    var children=this.getchildren();
    for(var i=0;i<children.length;i++){
      if(children[i].name==="All objs"||children[i].name==="All faces") children[i]["material"].opacity=0.1;
      if(children[i].name==="All wires") children[i]["material"].opacity=0.1;
      if(children[i].name==="All edges"||children[i].name==="Other lines") {children[i]["material"].opacity=0.1;children[i]["material"].color=this.basicMat;}
      if(children[i].name==="All vertices"){
        children[i]["material"].opacity=1;
      }
      if(children[i].name==="All points"){
        scenechildren.push(children[i]);
      }
    }
    this.dataService.addscenechild(scenechildren);
    this.dataService.SelectVisible=this.SelectVisible;
  }

  //
  //  events
  //
  
  mousedown($event): void{
    this.animate(this);
    this.mDownTime = (new Date()).getTime();
  }

  mouseup($event): void{
     this.mUpTime = (new Date()).getTime();
  }

  onDocumentMouseMove(event) {
    //this.onResize();
    if(this.seVisible===true){
      this.animate(this);
      this.mouse.x = ( event.offsetX / this.width) * 2 - 1;
      this.mouse.y =-( event.offsetY / this.height ) * 2 + 1;
    }else{
      this.render(this);
    }
  }



  addgrid(){
    for(var i=0;i<this.scene.children.length;i++){
      if(this.scene.children[i].name==="GridHelper") {
            this.scene.remove(this.scene.children[i]);
            i=i-1;
      }
    }
    // todo: change grid -> grid_value
    if(this.dataService.grid){
      var gridhelper=new THREE.GridHelper( 100, 10);
      gridhelper.name="GridHelper";
      var vector=new THREE.Vector3(0,1,0);
      gridhelper.lookAt(vector);
      gridhelper.position.set(0,0,0);
      this.scene.add( gridhelper);
      this.dataService.centerx=0;
      this.dataService.centery=0;
      this.dataService.centerz=0;
    }
  }


  /// selects object from three.js scene


  onDocumentMouseDown(event){
    var threshold: number;
    if(this.seVisible===true) {
      threshold= 100;
    }else{
      threshold= 0.1;
    }
    if( Math.abs(this.mDownTime - this.mUpTime) > threshold ){
        this.mDownTime = 0;
        this.mUpTime = 0;
        return;
    }
    var selectedObj, intersects;
    var select:boolean=false;
    this.scenechildren=this.dataService.getscenechild();
    this.raycaster.setFromCamera(this.mouse,this.camera);
    intersects = this.raycaster.intersectObjects(this.scenechildren);
    if ( intersects.length > 0 ) {
      selectedObj=intersects[ 0 ].object;
      if(this.scenechildren[0].name === "All objs"){
        const index:number=Math.floor(intersects[ 0 ].faceIndex);
        const path: gs.ITopoPathData = this.scene_and_maps.faces_map.get(index);
        const face: gs.IFace = this._model.getGeom().getTopo(path) as gs.IFace;
        var label: string ="";
        const id: string = "o"+path.id;
        var getpoints:Array<any>;
        var getpoints=this.dataService.getpoints;
        var pointname=this.dataService.pointname;
        if(getpoints!==undefined&&getpoints.length!==0){
          for(var i=0;i<getpoints.length;i++){
            if(id===getpoints[i].label){
              if(this.dataService.checkobj===true) label= id;
              for(var n=0;n<pointname.length;n++){
                if(this.dataService.checkname[n]===true){
                  label=label.concat('<br/>',pointname[n],":",getpoints[i][n]);
                }
              }
            }
          }
        }
        const label_xyz: gs.XYZ = face.getLabelCentroid();
        const faces: gs.IFace[]= face.getObj().getFaces();
        if(this.textlabels.length===0) {
          for(var n=0;n<faces.length;n++){
            var verts: gs.IVertex[] = faces[n].getVertices();
            var verts_xyz: gs.XYZ[] = verts.map((v) => v.getPoint().getPosition());
            var geometry=new THREE.Geometry();
            for(var i=0;i<verts_xyz.length;i++){
              geometry.vertices.push(new THREE.Vector3(verts_xyz[i][0],verts_xyz[i][1],verts_xyz[i][2]));
            }
            /*if(verts.length===4){
              geometry.faces.push(new THREE.Face3(0,2,1));
              geometry.faces.push(new THREE.Face3(0,3,2));
            }else if(verts.length===3){
              geometry.faces.push(new THREE.Face3(0,2,1));
            }
            var mesh=new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color:0x00ff00,side:THREE.DoubleSide} ));
            mesh["geometry"].computeVertexNormals();
            mesh.userData.id=label;
            mesh.name="selects";
            this.scene.add(mesh);*/
            var material=new THREE.LineBasicMaterial( { color:0x00ff00,side:THREE.DoubleSide} );
            const line = new THREE.Line( geometry, material);
            line.userData.id=id;
            //line["material"].needsUpdate=true;
            line.name="selects";
            this.scene.add(line);
           }
           this.addTextLabel(label,label_xyz, label,path,"All objs");
        }else{
          for(var j=0;j<this.scene.children.length;j++){
            if(id===this.scene.children[j].userData.id){
              select=true;
              this.scene.remove(this.scene.children[j]);
              j=j-1;
            }
          }
          for(var j=0;j<this.textlabels.length;j++){
            if(id===this.textlabels[j]["id"]){
              select=true;
              this.removeTextLabel(this.textlabels[j]["id"]);
              j=j-1;
            }
          }
          if(select==false){
            for(var n=0;n<faces.length;n++){
              var verts: gs.IVertex[] = faces[n].getVertices();
              var verts_xyz: gs.XYZ[] = verts.map((v) => v.getPoint().getPosition());
              var geometry=new THREE.Geometry();
              for(var i=0;i<verts_xyz.length;i++){
                geometry.vertices.push(new THREE.Vector3(verts_xyz[i][0],verts_xyz[i][1],verts_xyz[i][2]));
              }
              var material=new THREE.LineBasicMaterial( { color:0x00ff00,side:THREE.DoubleSide} );
              const line = new THREE.Line( geometry, material);
              line.userData.id=id;
              //line["material"].needsUpdate=true;
              line.name="selects";
              this.scene.add(line);
            }
            this.addTextLabel(label,label_xyz, id,path,"All objs");
          }
        }

      }

      if(this.scenechildren[0].name === "All faces"){
        const index:number=Math.floor(intersects[ 0 ].faceIndex);
        const path: gs.ITopoPathData = this.scene_and_maps.faces_map.get(index);
        const face: gs.IFace = this._model.getGeom().getTopo(path) as gs.IFace;
        var label: string="";
        var getpoints:Array<any>;
        var getpoints=this.dataService.getpoints;
        var pointname=this.dataService.pointname;
        if(getpoints!==undefined&&getpoints.length!==0){
          for(var i=0;i<getpoints.length;i++){
            if(face.getLabel()===getpoints[i].label){
              for(var n=0;n<pointname.length;n++){
                if(this.dataService.checkface===true) label= face.getLabel();
                if(this.dataService.checkname[n]===true){
                  label=label.concat('<br/>',pointname[n],":",getpoints[i][n]);
                }
              }
            }
          }
        }
        const label_xyz: gs.XYZ = face.getLabelCentroid();
        const verts: gs.IVertex[] = face.getVertices();
        const verts_xyz: gs.XYZ[] = verts.map((v) => v.getPoint().getPosition());
        if(this.textlabels.length===0) {
          var geometry=new THREE.Geometry();
          for(var i=0;i<verts_xyz.length;i++){
            geometry.vertices.push(new THREE.Vector3(verts_xyz[i][0],verts_xyz[i][1],verts_xyz[i][2]));
          }
          var material=new THREE.LineBasicMaterial( { color:0x00ff00,side:THREE.DoubleSide} );
          const line = new THREE.Line( geometry, material);
          line.userData.id=face.getLabel();
          //line["material"].needsUpdate=true;
          line.name="selects";
          this.scene.add(line);
          this.addTextLabel(label,label_xyz, face.getLabel(),path, "All faces");
        }else{
          for(var j=0;j<this.scene.children.length;j++){
            if(face.getLabel()===this.scene.children[j].userData.id){
              select=true;
              this.scene.remove(this.scene.children[j]);
            }
          }
          for(var j=0;j<this.textlabels.length;j++){
            if(face.getLabel()===this.textlabels[j]["id"]){
              select=true;
              this.removeTextLabel(this.textlabels[j]["id"]);
            }
          }
          if(select==false){
            var geometry=new THREE.Geometry();
            for(var i=0;i<verts_xyz.length;i++){
              geometry.vertices.push(new THREE.Vector3(verts_xyz[i][0],verts_xyz[i][1],verts_xyz[i][2]));
            }
            var material=new THREE.LineBasicMaterial( { color:0x00ff00,side:THREE.DoubleSide} );
            const line = new THREE.Line( geometry, material);
            line.userData.id=face.getLabel();
            //line["material"].needsUpdate=true;
            line.name="selects";
            this.scene.add(line);
            this.addTextLabel(label,label_xyz,face.getLabel(),path, "All faces");
          }
        }
      }
      if(this.scenechildren[0].name=="All wires"){
        const index:number=Math.floor(intersects[ 0 ].index/2);
        const path: gs.ITopoPathData = this.scene_and_maps.wires_map.get(index);
        const wire: gs.IWire = this._model.getGeom().getTopo(path) as gs.IWire;
        const label: string = wire.getLabel();
        const label_xyz: gs.XYZ = wire.getLabelCentroid();
        const verts: gs.IVertex[] = wire.getVertices();
        const verts_xyz: gs.XYZ[] = verts.map((v) => v.getPoint().getPosition());
        if (wire.isClosed()) {verts_xyz.push(verts_xyz[0]);}
        if(this.textlabels.length===0) {
          var geometry=new THREE.Geometry();
          for(var i=0;i<verts_xyz.length;i++){
            geometry.vertices.push(new THREE.Vector3(verts_xyz[i][0],verts_xyz[i][1],verts_xyz[i][2]));
          }
          var material=new THREE.LineBasicMaterial( { color:0x00ff00,side:THREE.DoubleSide} );
          const line = new THREE.Line( geometry, material);
          line.userData.id=label;
          //line["material"].needsUpdate=true;
          line.name="selects";
          this.scene.add(line);
          this.addTextLabel(label,label_xyz, label,path,"All wires");
        }else{
          for(var j=0;j<this.scene.children.length;j++){
            if(label===this.scene.children[j].userData.id){
              select=true;
              this.scene.remove(this.scene.children[j]);
            }
          }
          for(var j=0;j<this.textlabels.length;j++){
            if(label===this.textlabels[j]["id"]){
              select=true;
              this.removeTextLabel(this.textlabels[j]["id"]);
            }
          }
          if(select==false){
            var geometry=new THREE.Geometry();
            for(var i=0;i<verts_xyz.length;i++){
              geometry.vertices.push(new THREE.Vector3(verts_xyz[i][0],verts_xyz[i][1],verts_xyz[i][2]));
            }
            var material=new THREE.LineBasicMaterial( { color:0x00ff00,side:THREE.DoubleSide} );
            const line = new THREE.Line( geometry, material);
            line.userData.id=label;
            //line["material"].needsUpdate=true;
            line.name="selects";
            this.scene.add(line);
            this.addTextLabel(label,label_xyz, label,path,"All wires");
          }
        }
      }
      if(this.scenechildren[0].name=="All edges"){
        var label:string="";
        var index:number=Math.floor(intersects[ 0 ].index/2);
        if(this.scene_and_maps.edges_map!==null&&(index<this.scene_and_maps.edges_map.size||index===this.scene_and_maps.edges_map.size)) {
          var path: gs.ITopoPathData = this.scene_and_maps.edges_map.get(index);
          var edge: gs.IEdge = this._model.getGeom().getTopo(path) as gs.IEdge;
          var id: string = edge.getLabel();
          var label_show=id;
          for(var i=1;i<intersects.length;i++){
            if(intersects[0].distance===intersects[i].distance){
              index=Math.floor(intersects[ i ].index/2);
              path = this.scene_and_maps.edges_map.get(index);
              edge= this._model.getGeom().getTopo(path) as gs.IEdge;
              id=edge.getLabel();
              if(label_show!==id) label_show=label_show+"<br/>"+id;
            }
          }
          var getpoints:Array<any>;
          var getpoints=this.dataService.getpoints;
          var pointname=this.dataService.pointname;
          if(getpoints!==undefined&&getpoints.length!==0){
            for(var i=0;i<getpoints.length;i++){
              if(edge.getLabel()===getpoints[i].label){
                if(this.dataService.checkedgeid===true) {
                  label=label_show;
                }
                for(var n=0;n<pointname.length;n++){
                  if(this.dataService.checkname[n]===true){
                    label=label.concat('<br/>',pointname[n],":",getpoints[i][n]);
                  }
                }
              }
            }
          }
          const label_xyz: gs.XYZ = edge.getLabelCentroid();
          const verts: gs.IVertex[] = edge.getVertices();
          const verts_xyz: gs.XYZ[] = verts.map((v) => v.getPoint().getPosition());
          if(this.textlabels.length===0) {
            var geometry=new THREE.Geometry();
            for(var i=0;i<verts_xyz.length;i++){
              geometry.vertices.push(new THREE.Vector3(verts_xyz[i][0],verts_xyz[i][1],verts_xyz[i][2]));
            }
            var material=new THREE.LineBasicMaterial( { color:0x00ff00,side:THREE.DoubleSide} );
            const line = new THREE.Line( geometry, material);
            line.userData.id=edge.getLabel();
            //line["material"].needsUpdate=true;
            line.name="selects";
            this.scene.add(line);
            this.addTextLabel(label,label_xyz, edge.getLabel(),path,"All edges");
          }else{
            for(var j=0;j<this.scene.children.length;j++){
              if(edge.getLabel()===this.scene.children[j].userData.id){
                select=true;
                this.scene.remove(this.scene.children[j]);
              }
            }
            for(var j=0;j<this.textlabels.length;j++){
              if(edge.getLabel()===this.textlabels[j]["id"]){
                select=true;
                this.removeTextLabel(this.textlabels[j]["id"]);
              }
            }
            if(select==false){
              var geometry=new THREE.Geometry();
              for(var i=0;i<verts_xyz.length;i++){
                geometry.vertices.push(new THREE.Vector3(verts_xyz[i][0],verts_xyz[i][1],verts_xyz[i][2]));
              }
              var material= new THREE.LineBasicMaterial( { color:0x00ff00,side:THREE.DoubleSide} );
              const line = new THREE.Line( geometry, material );
              line.userData.id=edge.getLabel();
              line.name="selects";
              this.scene.add(line);
              this.addTextLabel(label,label_xyz, edge.getLabel(),path,"All edges");
            }
          }
        }
      }
      else if(this.scenechildren[0].name=="Other lines"){
        var label:string="";
        var index:number=Math.floor(intersects[ 0 ].index/2);
        if(this.scene_and_maps.edges_map!==null&&(index<this.scene_and_maps.edges_map.size||index===this.scene_and_maps.edges_map.size)){
          var path: gs.ITopoPathData = this.scene_and_maps.edges_map.get(index);
          var edge: gs.IEdge = this._model.getGeom().getTopo(path) as gs.IEdge;
          var id: string = edge.getLabel();
          label=id;
          for(var i=1;i<intersects.length;i++){
            if(intersects[0].distance===intersects[i].distance){
              index=Math.floor(intersects[ i ].index/2);
              path = this.scene_and_maps.edges_map.get(index);
              edge= this._model.getGeom().getTopo(path) as gs.IEdge;
              id=edge.getLabel();
              if(label!==id) label=label+"<br/>"+id;
            }
          }
          const label_xyz: gs.XYZ = edge.getLabelCentroid();
          const verts: gs.IVertex[] = edge.getVertices();
          const verts_xyz: gs.XYZ[] = verts.map((v) => v.getPoint().getPosition());
          if(this.textlabels.length===0) {
            var geometry=new THREE.Geometry();
            for(var i=0;i<verts_xyz.length;i++){
              geometry.vertices.push(new THREE.Vector3(verts_xyz[i][0],verts_xyz[i][1],verts_xyz[i][2]));
            }
            var material=new THREE.LineBasicMaterial( { color:0x00ff00,side:THREE.DoubleSide} );
            const line = new THREE.Line( geometry, material);
            line.userData.id=label;
            //line["material"].needsUpdate=true;
            line.name="selects";
            this.scene.add(line);
            this.addTextLabel(label,label_xyz, label,path,"Other lines");
          }else{
            for(var j=0;j<this.scene.children.length;j++){
              if(label===this.scene.children[j].userData.id){
                select=true;
                this.scene.remove(this.scene.children[j]);
              }
            }
            for(var j=0;j<this.textlabels.length;j++){
              if(label===this.textlabels[j]["id"]){
                select=true;
                this.removeTextLabel(this.textlabels[j]["id"]);
              }
            }
            if(select==false){
              var geometry=new THREE.Geometry();
              for(var i=0;i<verts_xyz.length;i++){
                geometry.vertices.push(new THREE.Vector3(verts_xyz[i][0],verts_xyz[i][1],verts_xyz[i][2]));
              }
              var material= new THREE.LineBasicMaterial( { color:0x00ff00,side:THREE.DoubleSide} );
              const line = new THREE.Line( geometry, material );
              line.userData.id=label;
              line.name="selects";
              this.scene.add(line);
              this.addTextLabel(label,label_xyz, label,path,"Other lines");
            }
          }
        }
      }
      if(this.scenechildren[0].name === "All points"){
        var distance:number=intersects[ 0 ].distanceToRay;
        var index:number=intersects[ 0 ].index;
        for(var i=1;i<intersects.length;i++){
          if(distance>intersects[ i ].distanceToRay){
            distance=intersects[ i ].distanceToRay;
            index=intersects[ i ].index;
          }
        }
        var attributevertix=this.dataService.getattrvertix();
        var id:string=this._model.getGeom().getAllPoints()[index].getLabel();
        var label:string="";
        var getpoints:Array<any>;
        var getpoints=this.dataService.getpoints;
        var pointname=this.dataService.pointname;
        if(this.SelectVisible==="Points"){
          if(getpoints!==undefined&&getpoints.length!==0){
            for(var i=0;i<getpoints.length;i++){
              if(id===getpoints[i].id){
                if(this.dataService.checkpointid===true) {
                  label=id;
                  for(var j=1;j<intersects.length;j++){
                    if(intersects[0].distance===intersects[j].distance){
                      var index:number=intersects[ j ].index;
                      var id:string=this._model.getGeom().getAllPoints()[index].getLabel();
                      if(label!==id) label=label+"<br/>"+id;
                    }
                  }
                }
                if(this.dataService.checkX===true) label=label.concat('<br/>',"X:",getpoints[i].x);
                if(this.dataService.checkY===true) label=label.concat('<br/>',"Y:",getpoints[i].y);
                if(this.dataService.checkZ===true) label=label.concat('<br/>',"Z:",getpoints[i].z);
                for(var n=0;n<pointname.length;n++){
                  if(this.dataService.checkname[n]===true){
                    label=label.concat('<br/>',pointname[n],":",getpoints[i][n]);
                  }
                }
              }
            }
          }
        }
        if(this.SelectVisible==="Vertices"){
          var pointid:string="";
          if(getpoints!==undefined&&getpoints.length!==0){
            for(var i=0;i<attributevertix.length;i++){
              if(id===attributevertix[i].pointid){
                pointid=id;
                if(this.dataService.checkvertixid===true) {
                  if(label==="") label=attributevertix[i].vertixlabel;
                  else {label=label+"<br/>"+attributevertix[i].vertixlabel;}
                }
              }
            }
            if(this.dataService.pointid===true) {
              if(pointid!==""){
                if(label==="") label=id;
                else {label=label+"<br/>"+id}
              }
            }
          }
        }
        const verts_xyz: gs.XYZ = this._model.getGeom().getAllPoints()[index].getPosition();//vertices.getPoint().getPosition();
        if(this.textlabels.length===0) {
          var geometry=new THREE.Geometry();
          geometry.vertices.push(new THREE.Vector3(verts_xyz[0],verts_xyz[1],verts_xyz[2]));
          var pointsmaterial=new THREE.PointsMaterial( { color:0x00ff00,size:1} );
          //pointsmaterial.sizeAttenuation=false;
          if(this.dataService.pointsize!==undefined){
              pointsmaterial.size=this.dataService.pointsize;
          }
          const points = new THREE.Points( geometry, pointsmaterial);
          points.userData.id=id;
          //points["material"].needsUpdate=true;
          points.name="selects";
          this.scene.add(points);
          this.addTextLabel(label,verts_xyz, id,id,"All points");
        }else{
          for(var j=0;j<this.scene.children.length;j++){
            if(id===this.scene.children[j].userData.id){
              select=true;
              this.scene.remove(this.scene.children[j]);
            }
          }
          for(var j=0;j<this.textlabels.length;j++){
              if(id===this.textlabels[j]["id"]){
                select=true;
                this.removeTextLabel(this.textlabels[j]["id"]);
              }
          }
          if(select==false){
            var geometry=new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(verts_xyz[0],verts_xyz[1],verts_xyz[2]));
            var pointsmaterial=new THREE.PointsMaterial( { color:0x00ff00,size:1} );
            if(this.dataService.pointsize!==undefined){
              pointsmaterial.size=this.dataService.pointsize;
            }
            const points = new THREE.Points( geometry, pointsmaterial);
            points.userData.id=id;
            //points["material"].needsUpdate=true;
            points.name="selects";
            this.scene.add(points);
            this.addTextLabel(label,verts_xyz, id,id,"All points");
          }
        }
      }

    } else {
      /*for(var i=0;i<this.dataService.sprite.length;i++){
        this.dataService.sprite[i].visible=false;
      }*/
      for(var i=0;i<this.scene.children.length;i++){
        if(this.scene.children[i].name=="selects"){
          this.scene.remove(this.scene.children[i]);
          i=i-1;
        }
      }
      for(var i=0;i<this.textlabels.length;i++){
        this.removeTextLabel(this.textlabels[i]["id"]);
        i=i-1;
      }
    }

  }

  //To add text labels just provide label text, label position[x,y,z] and its id
  addTextLabel(label, label_xyz, id,path,type) {
    let container = this.myElement.nativeElement.children.namedItem("container");
    let star = this.creatStarGeometry(label_xyz);
    let textLabel=this.createTextLabel(label, star, id,path,type);
    this.starsGeometry.vertices.push( star );
    this.textlabels.push(textLabel);
    this.dataService.pushselecting(textLabel);
    container.appendChild(textLabel.element);
  }

  //To remove text labels just provide its id
  removeTextLabel(id) {
    let i=0;
    for(i=0; i<this.textlabels.length; i++) {
      if(this.textlabels[i].id==id) {
        let container = this.myElement.nativeElement.children.namedItem("container");
        container.removeChild(this.textlabels[i].element);
        let index = this.starsGeometry.vertices.indexOf(this.textlabels[i].parent);
        if(index !== -1) {
          this.starsGeometry.vertices.splice(index, 1);
        }
        break;
      }
    }
    if(i<this.textlabels.length) {
      this.textlabels.splice(i, 1);
      this.dataService.spliceselecting(i, 1);
    }
  }

  creatStarGeometry(label_xyz) {
    let star = new THREE.Vector3();
    star.x = label_xyz[0];
    star.y = label_xyz[1];
    star.z = label_xyz[2];
    return star;
  }

  createTextLabel(label, star, id,path,type) {
    let div = this.createLabelDiv();
    var self=this;
    let textLabel= {
      id: id,
      path:path,
      element: div,
      parent: false,
      type:type,
      position: new THREE.Vector3(0,0,0),
      setHTML: function(html) {
        this.element.innerHTML = html;
      },
      setParent: function(threejsobj) {
        this.parent = threejsobj;
      },
      updatePosition: function() {
        if(parent) {
          //this.position.copy(this.parent);
          this.position.copy(this.parent);
        }
        
        var coords2d = this.get2DCoords(this.position, self.camera);

        this.element.style.left = coords2d.x + 'px';
        this.element.style.top = coords2d.y + 'px';
      },
      get2DCoords: function(position, camera) {
        var vector = position.project(camera);
        vector.x = (vector.x + 1)/2 * self.width;
        vector.y = -(vector.y - 1)/2 * self.height;
        return vector;
      }
    };
    textLabel.setHTML(label);
    textLabel.setParent(star);
    return textLabel;
  }

  createLabelDiv() {
    var div=document.createElement("div");
    div.style.color= '#00f';
    div.style.fontFamily= '"Fira Mono", Monaco, "Andale Mono", "Lucida Console", "Bitstream Vera Sans Mono", "Courier New", Courier, monospace';
    div.style.margin='-5px 0 0 15px';
    div.style.pointerEvents='none';
    div.style.position = 'absolute';
    div.style.width = '100';
    div.style.height = '100';
    div.style.top = '-1000';
    div.style.left = '-1000';
    div.style.textShadow="0px 0px 3px white";
    div.style.color="black";
    return div;
   }

  zoomfit(){
    event.stopPropagation();
    if(this.dataService.selecting.length===0){
      const obj=new THREE.Object3D();
      for(var i=0;i<this.getchildren().length;i++){
        obj.children.push(this.getchildren()[i]);
      }
      var boxHelper = new THREE.BoxHelper(obj);
      boxHelper["geometry"].computeBoundingBox();
      boxHelper["geometry"].computeBoundingSphere();
      var boundingSphere=boxHelper["geometry"].boundingSphere;
      var center = boundingSphere.center;
      var radius = boundingSphere.radius;
      var fov=this.camera.fov * ( Math.PI / 180 );
      var vec_centre_to_pos: THREE.Vector3 = new THREE.Vector3();
      vec_centre_to_pos.subVectors(this.camera.position, center);
      var tmp_vec=new THREE.Vector3( Math.abs( radius / Math.sin( fov / 2 )/2),
                                     Math.abs( radius / Math.sin( fov / 2 )/2 ),
                                     Math.abs( radius / Math.sin( fov / 2 )/2));
      vec_centre_to_pos.setLength(tmp_vec.length());
      var perspectiveNewPos: THREE.Vector3 = new THREE.Vector3();
      perspectiveNewPos.addVectors(center, vec_centre_to_pos);
      var newLookAt = new THREE.Vector3(center.x,center.y,center.z)
      this.camera.position.copy(perspectiveNewPos);
      this.camera.lookAt(newLookAt);
      this.camera.updateProjectionMatrix();
      this.controls.target.set(newLookAt.x, newLookAt.y,newLookAt.z);
      this.controls.update();
    }else{
      var box:THREE.BoxHelper=this.selectbox();
      var center = new THREE.Vector3(box["geometry"].boundingSphere.center.x,box["geometry"].boundingSphere.center.y,box["geometry"].boundingSphere.center.z);
      var radius=box["geometry"].boundingSphere.radius;
      if(radius===0) radius=1;
      var fov=this.camera.fov * ( Math.PI / 180 );
      var vec_centre_to_pos: THREE.Vector3 = new THREE.Vector3();
      vec_centre_to_pos.subVectors(this.camera.position, center);
      var tmp_vec=new THREE.Vector3(Math.abs( radius / Math.sin( fov / 2 )),
                                    Math.abs( radius / Math.sin( fov / 2 ) ),
                                    Math.abs( radius / Math.sin( fov / 2 )));
      vec_centre_to_pos.setLength(tmp_vec.length());
      var perspectiveNewPos: THREE.Vector3 = new THREE.Vector3();
      perspectiveNewPos.addVectors(center, vec_centre_to_pos);
      var newLookAt = new THREE.Vector3(center.x,center.y,center.z)
      this.camera.position.copy(perspectiveNewPos);
      this.camera.lookAt(newLookAt);
      this.camera.updateProjectionMatrix();
      this.controls.target.set(newLookAt.x, newLookAt.y,newLookAt.z);
      this.controls.update();
    }
  }

  selectbox():THREE.BoxHelper{
    if(this.dataService.selecting.length!==0){
      var select=new THREE.Object3D();
        for(var i=0;i<this.scene.children.length;i++){
          if(this.scene.children[i].name==="selects"){
            select.children.push(this.scene.children[i]);
          }
        }
      var box=new THREE.BoxHelper(select);
      box["geometry"].computeBoundingBox();
      box["geometry"].computeBoundingSphere();
      return box;
    }
  }

  setting(settingVisible){
    event.stopPropagation();
    this.settingVisible=!this.settingVisible;
   }

  leaflet(){
    event.stopPropagation();
    this.imVisible=!this.imVisible;
    this.dataService.imVisible=this.imVisible;
  }
}
