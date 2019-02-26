import { GIModel } from '@libs/geo-info/GIModel';
import { CesiumSettings } from '../gi-cesium-viewer.settings';
import { EEntType, Txyz } from '@assets/libs/geo-info/common';
import * as circularJSON from 'circular-json';
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
    // public _scene: THREE.Scene; // TODO switch with Cesium viewer
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
        // renderer
        // camera settings
        // orbit controls
        // mouse
        // selecting
        // add grid
        // add lights
    }
    // matrix points from xyz to long lat

    createCesiumViewer() {
        // create the viewer
        // https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html
        // https://cesium.com/docs/tutorials/getting-started/
        // https://cesium.com/blog/2018/03/12/cesium-and-angular/
        console.log('=====CREATING CESIUM VIEWER=====');
        this._viewer = new Cesium.Viewer(document.getElementById('cesium-container'));
        document.getElementsByClassName('cesium-viewer-bottom')[0].remove();
    }

    /**
     *
     * @param model
     * @param container
     */
    public addGeometry(model: GIModel, container: any): void { // TODO why is container any?
        // set up the view
        const viewer = this._viewer;
        // set up the view
        const scene = viewer.scene;
        const origin = Cesium.Cartesian3.fromDegrees(103.77575, 1.30298);
        // matrix points from xyz to long lat
        const mat = Cesium.Matrix4.multiplyByTranslation(
            Cesium.Transforms.eastNorthUpToFixedFrame(origin),
            new Cesium.Cartesian3(0, 0, 1),
            new Cesium.Matrix4()
        );
        // make surfaces
        const posis = [[0, 0, 0], [100, 0, 0], [100, 0, 100], [0, 0, 100]];
        const points = [];
        for (const pos of posis) {
            points.push(Cesium.Cartesian3.fromArray(pos));
        }
        // make instance
        const newPoints = [];
        for (const pt of points) {
            const newP = Cesium.Matrix4.multiplyByPoint(mat, pt, new Cesium.Cartesian3());
            newPoints.push(newP);
        }
        console.log(newPoints);
        const geom = new Cesium.PolygonGeometry({
            perPositionHeight : true,
            polygonHierarchy: new Cesium.PolygonHierarchy(newPoints),
            vertexFormat : Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
        });
        const instance = new Cesium.GeometryInstance({
            geometry : geom,
            attributes : {
            color : Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.WHITE)
            }
        });
        const a = circularJSON.stringify(scene.primitives);
        console.log(a);
        // add all instances to a single primitive
        scene.primitives.add(new Cesium.Primitive({
            allowPicking: true,
            geometryInstances : [instance],
            shadows : Cesium.ShadowMode.ENABLED,
            appearance : new Cesium.PerInstanceColorAppearance({
                translucent : false
            })
        }));
        // set up the camera
        const sphere = new Cesium.BoundingSphere(origin, 1e2);
        viewer.camera.viewBoundingSphere(sphere);
    }
    /**
     *
     * @param model
     * @param container
     */
    // public addGeometry2(model: GIModel, container: any): void { // TODO why is container any?
    //     this.createCesiumViewer();
    //     console.log('=====ADD CESIUM GEOMETRY=====', this._viewer);
    //     // the origin of the model
    //     const origin = Cesium.Cartesian3.fromDegrees(103.77575, 1.30298);
    //     // create a matrix to transform points
    //     const xform_matrix: any = Cesium.Matrix4.multiplyByTranslation(
    //         Cesium.Transforms.eastNorthUpToFixedFrame(origin),
    //         new Cesium.Cartesian3(0, 0, 1),
    //         new Cesium.Matrix4()
    //     );
    //     console.log("MODEL", model);
    //     // add geom
    //     if (model) {
    //         // get each polygon
    //         const pgons_i: number[] = model.geom.query.getEnts(EEntType.PGON, false);
    //         // get each triangle
    //         const tris_i: number[] = [];
    //         for (const pgon_i of pgons_i) {
    //             const pgon_tris_i: number[] = model.geom.query.navAnyToTri(EEntType.PGON, pgon_i);
    //             for (const pgon_tri_i of pgon_tris_i) {
    //                 tris_i.push(pgon_tri_i);
    //             }
    //         }
    //         // create an instance for each triangle
    //         const instances = [];
    //         for (const tri_i of tris_i) {
    //             const verts_i: number[] = model.geom.query.navTriToVert(tri_i);
    //             const xyzs: Txyz[] = verts_i.map(vert_i => model.attribs.query.getVertCoords(vert_i));
    //             console.log(xyzs);
    //             const new_pnts = [];
    //             for (const xyz of xyzs) {
    //                 const old_pnt: any = Cesium.Cartesian3.fromArray(xyz);
    //                 console.log("The old cesium point", old_pnt);
    //                 const new_pnt: any = new Cesium.Cartesian3();
    //                 Cesium.Matrix4.multiplyByPoint(xform_matrix, old_pnt, new_pnt);
    //                 console.log("The new cesium point", new_pnt);
    //                 new_pnts.push(new_pnt);
    //             }
    //             console.log("The array of new_pnts", new_pnts);
    //             const geom = new Cesium.PolygonGeometry({
    //                 perPositionHeight : true,
    //                 polygonHierarchy: new Cesium.PolygonHierarchy(new_pnts),
    //                 vertexFormat : Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
    //             });
    //             console.log("GEOM", geom);
    //             const instance = new Cesium.GeometryInstance({
    //                 geometry : geom,
    //                 attributes : {
    //                   color : Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.WHITE)
    //                 }
    //             });
    //             console.log("INSTANCE", instance);
    //             instances.push(instance);
    //         }
    //         console.log(instances);
    //         // add the instances to a primitive
    //         this._viewer.scene.primitives.add(new Cesium.Primitive({
    //             allowPicking: true,
    //             geometryInstances : instances,
    //             shadows : Cesium.ShadowMode.ENABLED,
    //             appearance : new Cesium.PerInstanceColorAppearance({
    //                 translucent : false
    //             })
    //         }));
    //         // set up the camera
    //         const sphere = new Cesium.BoundingSphere(origin, 1e2);
    //         this._viewer.camera.viewBoundingSphere(sphere);
    //         this._viewer.render();
    //     }
    // }
}

