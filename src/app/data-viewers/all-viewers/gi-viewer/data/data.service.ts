import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { GIModel } from '@libs/geo-info/GIModel';
import * as THREE from 'three';
import * as OrbitControls from 'three-orbit-controls';
// import @angular stuff
import { Injectable, ElementRef } from '@angular/core';

/**
 * DataService
 * The data service for the Goe-Info viewer.
 * TODO: why does this data service contain all this threejs stuff?
 */
@Injectable()
export class DataService {
    private _OC: OrbitControls;
    // GI Model
    private _model: GIModel;
    // Threejs scene
    private _scene:  THREE.Scene;
    private _renderer: THREE.WebGLRenderer;
    private _camera: THREE.PerspectiveCamera;
    private _orbitControls: THREE.OrbitControls;
    // width and height
    // only set once the scene has been called
    private _width: number;
    private _height: number;
    // Others
    _saturation: any;
    _lightness: any;
    _light: any;
    _Geom: any;
    hue: number;
    saturation: number;
    lightness: number;
    scenechange: any;
    INTERSECTEDColor: any;
    selecting: any = [];
    axis: boolean;
    grid = true;
    shadow: boolean;
    frame: boolean;
    raycaster: THREE.Raycaster;
    visible: string;
    scenechildren: Array<any> = [];
    center: THREE.Vector3;
    textlabels: Array<any> = [];
    attributevertix: Array<any>;
    centerx: number;
    centery: number;
    centerz: number;
    centersize: number;
    pointsize: number;
    materialpoint: number;
    clickshow: Array<any>;
    point = true;
    click = false;
    SelectVisible: string;
    pointradius: number;
    label: Array<any>;
    checkX: boolean;
    checkY: boolean;
    checkZ: boolean;
    checkvertixid: boolean;
    pointid: boolean;
    checkface: boolean;
    checkpoint: boolean;
    checkobj: boolean;
    checkx: boolean;
    checky: boolean;
    checkz: boolean;
    checkpointid = false;
    checkedgeid = false;
    checkname: Array<any>;
    getpoints: Array<any>;
    pointname: Array<any>;
    imVisible = false;

    // Subscription Handling
    private subject = new Subject<any>();
    /**
     * Msg
     * @param message
     */
    sendMessage(message?: string) {
        this.subject.next({ text: message });
    }
    /**
     * Msg
     */
    clearMessage() {
        this.subject.next();
    }
    /**
     * Msg
     */
    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
    /**
     * Create a data service.
     */
    constructor() {

        // intializations
        // this only runs once

        const default_width = 1510, default_height = 720;

        // scene
        const scene: THREE.Scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xcccccc );

        // renderer
        const renderer: THREE.WebGLRenderer =  new THREE.WebGLRenderer( {antialias: true} );
        renderer.setPixelRatio( window.devicePixelRatio );


        // camera settings
        const aspect_ratio: number = this._width / this._height;
        const camera = new THREE.PerspectiveCamera( 50, aspect_ratio, 0.01, 1000 ); // 0.0001, 100000000 );
        camera.position.y = 10;
        camera.up.set(0, 0, 1);
        camera.lookAt( scene.position );
        camera.updateProjectionMatrix();

        // orbit controls
        const _OC = OrbitControls(THREE);
        const controls: THREE.OrbitControls = new _OC( camera, renderer.domElement );
        controls.enableKeys = false;

        // default directional lighting
        const directional_light: THREE.DirectionalLight = new THREE.DirectionalLight( 0xffffff, 0.5);
        directional_light.castShadow = false;
        directional_light.position.copy( camera.position );
        controls.addEventListener('change', function() {
            directional_light.position.copy(camera.position);
        });
        directional_light.target.position.set( 0, 0, 0 );

        scene.add( directional_light );

        // default ambient lighting
        const default_hue = 0;
        const default_saturation = 0.01;
        const default_lightness = 0.47;

        const hemi_light = new THREE.HemisphereLight( 0xffffff, 0.5 );
        hemi_light.color.setHSL( default_hue, default_saturation, default_lightness);
        scene.add( hemi_light );

        this._scene = scene;
        this._renderer = renderer;
        this._camera = camera;
        this._orbitControls = controls;

        // add it to alight - what does alight do?
        this._light = hemi_light;
        // this._alight.push(hemi_light);
        this.checkname = [];
        this.pointname = [];

    }

    /**
     * Get the GI Model
     */
    getModel(): GIModel {
        return this._model;
    }
    /**
     * Set the GI Model
     * @param model
     */
    setModel(model: GIModel) {
        this._model = model;
        if (model !== undefined) {
            // remove all children from the scene
            for (let i = 0; i < this._scene.children.length; i++) {
                if (this._scene.children[i].type === 'Scene') {
                    this._scene.remove(this._scene.children[i]);
                }
            }
        }
        this.sendMessage('model_update');
    }
    /**
     * Get the scene.
     * @param width
     * @param height
     */
    getScene(width?: number, height?: number): THREE.Scene {
        if (width && height) {
            this._width = width;
            this._height = height;
        }

        return this._scene;
    }
    /**
     * Get the renderer.
     */
    getRenderer(): THREE.WebGLRenderer {
        this._camera.aspect = this._width / this._height;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(this._width, this._height);
        return this._renderer;
    }
    /**
     * Get the camera.
     */
    getCamera(): THREE.PerspectiveCamera {
        return this._camera;
    }
    /**
     * Get the orbit controls.
     */
    getControls(): THREE.OrbitControls {
        return this._orbitControls;
    }
    /**
     * Get the lights.
     */
    getLight(): any {
        return this._light;
    }
    // ============================================================================
    // Getters
    // ============================================================================

    addraycaster(raycaster) {
        this.raycaster = raycaster;
    }
    getraycaster(): THREE.Raycaster {
        return this.raycaster;
    }
    gethue(_hue): any {
        this.hue = _hue;
    }
    getsaturation(_saturation): any {
        this.saturation = _saturation;
    }
    getlightness(_lightness): any {
        this.lightness = _lightness;
    }
    getpointsize(pointszie): void {
        this.pointsize = pointszie;
    }
    getmaterialpoint(materialpoint): void {
        this.materialpoint = materialpoint;
    }
    getradius(point): void {
        this.pointradius = point;
    }
    getcenterx(centerx): void {
        this.centerx = centerx;
    }
    getcentery(centery): void {
        this.centery = centery;
    }
    getcenterz(centerz): void {
        this.centerz = centerz;
    }
    getcentersize(centersize): void {
        this.centersize = centersize;
    }
    addGeom(Geom): void {
        this._Geom = Geom;
    }
    getGeom(): any {
        return this._Geom;
    }
    addscenechange(scenechange) {
        this.scenechange = scenechange;
    }
    getscenechange(): any {
        return this.scenechange;
    }
    addINTERSECTEDColor(INTERSECTEDColor): void {
        if (this.INTERSECTEDColor == null) {
            this.INTERSECTEDColor = INTERSECTEDColor;
        }
    }
    getINTERSECTEDColor(): any {
        return this.INTERSECTEDColor;
    }
    addselecting(selecting) {
        if (selecting[selecting.length - 1] === undefined) {
            this.selecting = [];
        }
        this.sendMessage();
    }
    pushselecting(selecting) {
        this.selecting.push(selecting);
        this.sendMessage();
    }
    spliceselecting(index, number) {
        this.selecting.splice(index, number);
        this.sendMessage();
    }
    getselecting() {
        return this.selecting;
    }
    addclickshow(clickshow) {
        this.clickshow = clickshow;
    }
    addattrvertix(attributevertix) {
        this.attributevertix = attributevertix;
    }
    getattrvertix() {
        return this.attributevertix;
    }
    addgrid(grid) {
        this.grid = grid;
    }
    addaxis(axis) {
        this.axis = axis;
    }
    addshadow(shadow) {
        this.shadow = shadow;
    }
    addframe(frame) {
        this.frame = frame;
    }
    addpoint(point) {
        this.point = point;
    }
    getSelectingIndex(uuid): number {
        for (let i = 0; i < this.selecting.length; i++) {
            if (this.selecting[i].uuid === uuid) {
                return i;
            }
        }
        return -1;
    }
    addscenechild(scenechildren) {
        this.scenechildren = scenechildren;
        this.sendMessage();
    }
    getscenechild() {
        this.sendMessage();
        return this.scenechildren;
    }
    addlabel(label) {
        this.label = label;
        this.sendMessage();
    }
    getlabel() {
        this.sendMessage();
        return this.label;
    }
    addgetpoints(getpoints) {
        this.getpoints = getpoints;
    }
    addpointname(pointname) {
        this.pointname = pointname;
    }
}
