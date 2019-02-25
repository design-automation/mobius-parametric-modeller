import * as THREE from 'three';
import { GIModel } from '@libs/geo-info/GIModel';
import { CesiumSettings } from '../gi-cesium-viewer.settings';
import { EEntType } from '@assets/libs/geo-info/common';

/**
 * Cesium data
 */
export class DataCesium {
    public _viewer: any;
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
        console.log('=====CREATING CESIUM SCENE=====');
        this._viewer = new Cesium.Viewer(document.getElementById('cesium-container'));

        // renderer
        // camera settings
        // orbit controls
        // mouse
        // selecting
        // add grid
        // add lights
    }
    // matrix points from xyz to long lat

    /**
     *
     * @param model
     * @param container
     */
    public addGeometry(model: GIModel, container: any): void { // TODO why is container any?
        const xform_mat: any = Cesium.Matrix4.multiplyByTranslation(
            Cesium.Transforms.eastNorthUpToFixedFrame(origin),
            new Cesium.Cartesian3(0, 0, 1),
            new Cesium.Matrix4()
        );

        // Add geometry
        if (!model) {

            const pgons_i: number[] = model.geom.query.getEnts(EEntType.PGON, false);
            const tris_i: number[] = [];
            for (const pgon_i of pgons_i) {
                const pgon_tris_i: number[] = model.geom.query.navAnyToTri(EEntType.PGON, pgon_i);
                for (const pgon_tri_i of pgon_tris_i) { pgon_tris_i.push(pgon_tri_i); }
            }
            for (const tri_i of tris_i) {

            }

            // this._scene.primitives.add(new Cesium.Primitive({
            //     allowPicking: true,
            //     geometryInstances : srfs,
            //     shadows : Cesium.ShadowMode.ENABLED,
            //     appearance : new Cesium.PerInstanceColorAppearance({
            //         translucent : false
            //     })
            // }));
            return;
        }

        // TODO INSERT CODE TO ADD GEOMETRY
        // Loop through the triangles in the GI Model and add them to Cesium
        console.log('=====ADD GEOMETRY TO CESIUM SCENE=====');

        // update model onto viewer

        // this._scene.add(data);

    }
}

