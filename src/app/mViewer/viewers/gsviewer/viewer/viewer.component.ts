import { Component, OnInit, Injector, ElementRef } from '@angular/core';
import * as THREE from 'three';

import * as gs from 'gs-json';
import {DataSubscriber} from '../data/DataSubscriber';
import {NgxPaginationModule} from 'ngx-pagination';
import * as bm from '../../../../../libs/geo-info/BiMap';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent extends DataSubscriber implements OnInit {

  constructor(injector: Injector, myElement: ElementRef) {
    super(injector);
    this.myElement = myElement;
  }

  _model: any;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  controls: THREE.OrbitControls;
  width: number;
  height: number;
  raycaster: THREE.Raycaster;
  mouse: THREE.Vector2;
  // check what needs to be global and refactor
  selecting: Array<any>;
  basicMat: THREE.MeshPhongMaterial;
  selectwireMat: THREE.LineBasicMaterial;
  scene_and_maps: {
          scene: gs.IThreeScene,
          faces_map: Map<number, gs.ITopoPathData>,
          wires_map: Map<number, gs.ITopoPathData>,
          edges_map: Map<number, gs.ITopoPathData>,
          vertices_map: Map<number, gs.ITopoPathData>,
          points_map: Map<number, gs.ITopoPathData>} ;
  myElement;
  scenechildren: Array<any>;
  textlabels: Array<any> = [];
  starsGeometry: THREE.Geometry = new THREE.Geometry();
  mDownTime: number;
  mUpTime: number;
  sphere: THREE.Mesh;
  center: THREE.Vector3;
  seVisible = false;
  imVisible = false;
  SelectVisible = 'Objs';
  settingVisible = false;
  LineNo = 0;
  clickatt: Array<any>;
  _updatemodel = true;
  text: string;
  _modelshow = true;

  private lastChanged = undefined;

  ngOnInit() {

    const container = this.myElement.nativeElement.children.namedItem('container');
    /// check for container
    if (!container) {
      console.error('No container in Three Viewer');
      return;
    }

    ///
    const width: number = container.offsetWidth; // container.clientWidth;
    const height: number = container.offsetHeight; // container.clientHeight;

    const scene: THREE.Scene = this.dataService.getScene(width, height);
    const renderer: THREE.WebGLRenderer = this.dataService.getRenderer();
    const camera: THREE.PerspectiveCamera = this.dataService.getCamera();
    const controls: THREE.OrbitControls = this.dataService.getControls();
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
    this.raycaster.linePrecision = 0.05;
    this.scenechildren = this.dataService.getscenechild();
    this.dataService.SelectVisible = this.SelectVisible;

    const geometry = new THREE.SphereGeometry( 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, transparent: true, opacity: 0.5 } );
    this.sphere = new THREE.Mesh( geometry, material );
    this.sphere.visible = false;
    this.sphere.name = 'sphereInter';
    this.sphere.scale.set(0.1, 0.1, 0.1);
    this.scene.add( this.sphere );

    const self = this;
    controls.addEventListener( 'change', function() {self.render( self); });

    this.dataService.addraycaster(this.raycaster);
    this.addgrid();
    self.renderer.render( self.scene, self.camera );
  }


  render(self) {
    for (let i = 0; i < self.textlabels.length; i++) {
      self.textlabels[i].updatePosition();
    }
    if (self.dataService.clickshow !== undefined && self.clickatt !== self.dataService.clickshow) {
      self.clickatt = self.dataService.clickshow;
      self.clickshow();
    }
    // self.onDocumentMouseDown();
    self.renderer.render( self.scene, self.camera );
  }

  // TODO Refactor
  onResize(): void {
    const container = this.myElement.nativeElement.children.namedItem('container');
    /// check for container
    if (!container) {
      console.error('No container in Three Viewer');
      return;
    }
    ///
    const width: number = container.offsetWidth;
    const height: number = container.offsetHeight;
    this.width = width;
    this.height = height;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }
  //
  // update mode
  // todo: optimize
  //
  updateModel(): void {
    this._model = this.dataService.getModel();
    if ( !this._model || !this.scene ) {
      console.warn('Model or Scene not defined.');
      this._modelshow = false;
      return;
    }
    try {
      this._updatemodel = true;
      this._modelshow = true;
      console.log('MODEL LOADED');

      const geometry = new THREE.BufferGeometry();
    const normals = [];
    let colors = [];


    console.log(this._model);
    // Convert the attribute data to a bi-map, then use it to get the position values
    const positions_data = new bm.BiMapManyToOne<any>(this._model._attribs.positions[0].data);
    const positions_ = [];
    positions_data.keys().forEach(key => {
        positions_.push(positions_data.getValue(key));
    });

    const positions_flat = [].concat(...positions_);

    console.log('Position is');
    console.log(positions_flat);

    const coordinates = this._model._attribs.positions.filter(attr => attr.name === 'coordinates');

    const triangles = this._model._geom.triangles;
    const triangles_flat = [].concat(...triangles);


    const triangles_flat_values = coordinates.values;
    const triangles_flat_keys = coordinates.keys;
    const triangles_flat_ = [];
    triangles_flat_keys.forEach((v, k) => {
      triangles_flat_.push(triangles_flat_values[v]);
    });
    const triangles_flat_coords = [].concat(...triangles_flat_);


    // const vertices = this._model._geom.vertices;
    const edges = this._model._geom.edges;

    // remove duplicated edges
    const edges_sorted = edges.map(x => x.sort()).sort();

    const edges_unique = [];

    for (let i = 1; i < edges_sorted.length; i++) {
      if (JSON.stringify(edges_sorted[i]) !== JSON.stringify(edges_sorted[i - 1])) {
        edges_unique.push(edges_sorted[i]);
        }
    }

    const vertices = this._model._geom.vertices;

    const edges_flat = [].concat(...edges);
    const edges_flat_coords = [];
    edges_flat.forEach((v, k) => {
      edges_flat_coords.push(coordinates[vertices[v]]);
    });


    const attr_normal = this._model._attribs.vertices.filter(attr => attr.name === 'normal');

    const normal_values = attr_normal[0].values;
    const normal_keys = attr_normal[0].keys;
    const normals_ = [];
    normal_keys.forEach((v, k) => {
      normals_.push(normal_values[v]);
    });
    const normals_flat = [].concat(...normals_);

    const attr_color = this._model._attribs.vertices.filter(attr => attr.name === 'color');

    const color_values = attr_color[0].values;
    const color_keys = attr_color[0].keys;
    const colors_ = [];
    color_keys.forEach((v, k) => {
      colors_.push(color_values[v]);
    });
    const colors_flat = [].concat(...colors_);


    colors = [0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1];

    for (let i = 0; i < coordinates.length; i++ ) {
      normals.push(0, 0, 0);
      colors.push(0, 0, 1);
    }


    // console.log(colors)


    // tri
    geometry.setIndex( triangles_flat_coords );
    geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions_flat, 3 ) );
    geometry.addAttribute( 'normal', new THREE.Float32BufferAttribute( normals_flat, 3 ) );
    geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors_flat, 3 ) );
    const material = new THREE.MeshPhongMaterial( {
      specular: 0xffffff, shininess: 0,
      side: THREE.DoubleSide, vertexColors: THREE.VertexColors,
      // wireframe:true
    } );
    const mesh = new THREE.Mesh( geometry, material );
    this.scene.add( mesh );

   // lines
   const geometry3 = new THREE.BufferGeometry();
   geometry3.setIndex( edges_flat_coords );
   geometry3.addAttribute( 'position', new THREE.Float32BufferAttribute( positions_flat, 3 ) );
   geometry3.addAttribute( 'normal', new THREE.Float32BufferAttribute( normals_flat, 3 ) );
   geometry3.addAttribute( 'color', new THREE.Float32BufferAttribute( colors_flat, 3 ) );
   const material3 = new THREE.LineBasicMaterial( {
    color: 0xffffff,
    linewidth: 1,
    linecap: 'round', // ignored by WebGLRenderer
    linejoin:  'round' // ignored by WebGLRenderer
  } );
   const lines = new THREE.LineSegments( geometry3, material3 );
   this.scene.add( lines );

    // points
    const geometry2 = new THREE.BufferGeometry();
    geometry2.addAttribute( 'position', new THREE.Float32BufferAttribute( positions_flat, 3 ) );
    geometry2.addAttribute( 'color', new THREE.Float32BufferAttribute( colors_flat, 3 ) );
    geometry2.computeBoundingSphere();
    //
    const material2 = new THREE.PointsMaterial( { size: 0.1, vertexColors: THREE.VertexColors } );
    const mesh2 = new THREE.Points( geometry2, material2 );
    this.scene.add( mesh2 );

      this.controls.update();

      this.render(this);
      this.dataService.getpoints = [];
    } catch (ex) {
      console.error('Error displaying model:', ex);
      this._updatemodel = false;
      this.text = ex;
    }
  }


  addgrid() {
    for (let i = 0; i < this.scene.children.length; i++) {
      if (this.scene.children[i].name === 'GridHelper') {
            this.scene.remove(this.scene.children[i]);
            i = i - 1;
      }
    }
    // todo: change grid -> grid_value
    if (this.dataService.grid) {
      const gridhelper = new THREE.GridHelper( 100, 10);
      gridhelper.name = 'GridHelper';
      const vector = new THREE.Vector3(0, 1, 0);
      gridhelper.lookAt(vector);
      gridhelper.position.set(0, 0, 0);
      this.scene.add( gridhelper);
      this.dataService.centerx = 0;
      this.dataService.centery = 0;
      this.dataService.centerz = 0;
    }
  }
}
