import { GIModel } from '@libs/geo-info/GIModel';
import { CesiumSettings } from '../gi-cesium-viewer.settings';
import { EEntType, Txyz } from '@assets/libs/geo-info/common';

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

    public createCesiumViewer() {
        // create the viewer
        // https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html
        // https://cesium.com/docs/tutorials/getting-started/
        // https://cesium.com/blog/2018/03/12/cesium-and-angular/
        console.log('=====CREATING CESIUM VIEWER=====');
        const view_models = this._getImageryViewModels();
        this._viewer = new Cesium.Viewer(
            document.getElementById('cesium-container'),
            {
                scene3DOnly: false,
                sceneModePicker: false,
                homeButton: false,
                navigationHelpButton: false,
                fullscreenButton: false,
                animation: false,
                timeline: false,
                imageryProviderViewModels : view_models,
                selectedImageryProviderViewModel : view_models[0],
                // terrainProviderViewModels : terrainViewModels
                // selectedTerrainProviderViewModel : terrainViewModels[1]
            }
        );
    }

    private _getImageryViewModels(): any[] {
        const view_models: any[] = [];
        view_models.push(new Cesium.ProviderViewModel({
            name: "Open\u00adStreet\u00adMap",
            iconUrl: Cesium.buildModuleUrl("Widgets/Images/ImageryProviders/openStreetMap.png"),
            tooltip: "OpenStreetMap (OSM) is a collaborative project to create a free editable \
                 map of the world.\nhttp://www.openstreetmap.org",
            creationFunction: function () {
                return Cesium.createOpenStreetMapImageryProvider({
                    url: "https://a.tile.openstreetmap.org/",
                });
            },
        }));
        view_models.push(new Cesium.ProviderViewModel({
            name: "Stamen Toner",
            iconUrl: Cesium.buildModuleUrl("Widgets/Images/ImageryProviders/stamenToner.png"),
            tooltip: "A high contrast black and white map.\nhttp://www.maps.stamen.com/",
            creationFunction: function () {
                return Cesium.createOpenStreetMapImageryProvider({
                    url: "https://stamen-tiles.a.ssl.fastly.net/toner/",
                });
            },
        }));
        view_models.push(new Cesium.ProviderViewModel({
            name: "Stamen Toner(Lite)",
            iconUrl: Cesium.buildModuleUrl("Widgets/Images/ImageryProviders/stamenToner.png"),
            tooltip: "A high contrast black and white map(Lite).\nhttp://www.maps.stamen.com/",
            creationFunction: function () {
                return Cesium.createOpenStreetMapImageryProvider({
                    url: "https://stamen-tiles.a.ssl.fastly.net/toner-lite/",
                });
            },
        }));
        view_models.push(new Cesium.ProviderViewModel({
            name: "Terrain(Standard)",
            iconUrl: Cesium.buildModuleUrl("Widgets/Images/TerrainProviders/CesiumWorldTerrain.png"),
            tooltip: "A high contrast black and white map(Standard).\nhttp://www.maps.stamen.com/",
            creationFunction: function () {
                return Cesium.createOpenStreetMapImageryProvider({
                    url: "https://stamen-tiles.a.ssl.fastly.net/terrain/",
                });
            },
        }));
        view_models.push(new Cesium.ProviderViewModel({
            name: "Terrain(Background)",
            iconUrl: Cesium.buildModuleUrl("Widgets/Images/TerrainProviders/CesiumWorldTerrain.png"),
            tooltip: "A high contrast black and white map(Background).\nhttp://www.maps.stamen.com/",
            creationFunction: function () {
                return Cesium.createOpenStreetMapImageryProvider({
                    url: "https://stamen-tiles.a.ssl.fastly.net/terrain-background/",
                });
            },
        }));
        // view_models.push(new Cesium.ProviderViewModel({
        //     name: "Earth at Night",
        //     iconUrl: Cesium.buildModuleUrl("Widgets/Images/ImageryProviders/earthAtNight.png"),
        //     tooltip: "The lights of cities and villages trace the outlines of civilization \
        //              in this global view of the Earth at night as seen by NASA/NOAA\'s Suomi NPP satellite.",
        //     creationFunction: function () {
        //         return new Cesium.IonImageryProvider({ assetId: 3812 });
        //     },
        // }));
        // view_models.push(new Cesium.ProviderViewModel({
        //     name: "Natural Earth\u00a0II",
        //     iconUrl: Cesium.buildModuleUrl("Widgets/Images/ImageryProviders/naturalEarthII.png"),
        //     tooltip: "Natural Earth II, darkened for contrast.\nhttp://www.naturalearthdata.com/",
        //     creationFunction: function () {
        //         return Cesium.createTileMapServiceImageryProvider({
        //             url: Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII"),
        //         });
        //     },
        // }));
        // view_models.push(new Cesium.ProviderViewModel({
        //     name: "Blue Marble",
        //     iconUrl: Cesium.buildModuleUrl("Widgets/Images/ImageryProviders/blueMarble.png"),
        //     tooltip: "Blue Marble Next Generation July, 2004 imagery from NASA.",
        //     creationFunction: function () {
        //         return new Cesium.IonImageryProvider({ assetId: 3845 });
        //     },
        // }));
        return view_models;
    }

    /**
     *
     * @param model
     * @param container
     */
    public addGeometry(model: GIModel, container: any): void { // TODO why is container any?
        // set up the view
        this.createCesiumViewer();
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

