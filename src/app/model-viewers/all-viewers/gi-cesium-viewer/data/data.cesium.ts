import * as THREE from 'three';
import { GIModel } from '@libs/geo-info/GIModel';
import { CesiumSettings } from '../gi-cesium-viewer.settings';

/**
 * Cesium data
 */
export class DataCesium {
    // the GI model to display
    public _model: GIModel;
    // Cesium Settings
    public settings: CesiumSettings;
    // Cesium scene
    public _scene: THREE.Scene; // TODO switch with Cesium viewer
    // text to display
    public _text: string;
    // interaction and selection
    // text labels
    // number of cesium points, lines, triangles
    // grid
    // axes

    /**
     * Constructs a new data subscriber.
     */
    constructor(settings: CesiumSettings) {
        this.settings = settings;

        // scene
        this._scene = new THREE.Scene();

        // TODO INSERT CODE HERE TO CREATE A CESIUM VIEWER
        // const viewer = new Cesium.Viewer(document.createElement("div"));
        // https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html
        // https://cesium.com/docs/tutorials/getting-started/
        // https://cesium.com/blog/2018/03/12/cesium-and-angular/
        console.log("=====CREATING CESIUM SCENE=====");

        // renderer
        // camera settings
        // orbit controls
        // mouse
        // selecting
        // add grid
        // add lights
    }
    /**
     *
     * @param model
     * @param container
     */
    public addGeometry(model: GIModel, container: any): void { // TODO why is container any?

        // Add geometry
        if (!model) {
            return;
        }

        // TODO INSERT CODE TO ADD GEOMETRY
        // Loop through the triangles in the GI Model and add them to Cesium
        console.log("=====ADD GEOMETRY TO CESIUM SCENE=====");

        // this._scene.add(data);

    }
}

