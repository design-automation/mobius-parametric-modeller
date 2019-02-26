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
    /**
     * 
     */
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
        document.getElementsByClassName('cesium-viewer-bottom')[0].remove();
    }
    /**
     *
     * @param model
     * @param container
     */
    public addGeometry(model: GIModel, container: any): void { // TODO delete container
        console.log('=====ADD CESIUM GEOMETRY=====', this._viewer);
        // the origin of the model
        const origin = Cesium.Cartesian3.fromDegrees(103.77575, 1.30298);
        // create a matrix to transform points
        const xform_matrix: any = Cesium.Matrix4.multiplyByTranslation(
            Cesium.Transforms.eastNorthUpToFixedFrame(origin),
            new Cesium.Cartesian3(0, 0, 1),
            new Cesium.Matrix4()
        );
        // add geom
        if (model) {
            // get each polygon
            const pgons_i: number[] = model.geom.query.getEnts(EEntType.PGON, false);
            // get each triangle
            const posi_to_point_map: Map<number, any> = new Map();
            const lines_instances: any[] = [];
            const tris_instances: any[] = [];
            for (const pgon_i of pgons_i) {
                // create the points
                const posis_i: number[] = model.geom.query.navAnyToPosi(EEntType.PGON, pgon_i);
                const pgon_points: any[] = [];
                for (const posi_i of posis_i) {
                    if (!posi_to_point_map.has(posi_i)) {
                        const xyz: Txyz = model.attribs.query.getPosiCoords(posi_i);
                        const pnt: any = Cesium.Cartesian3.fromArray(xyz);
                        const xform_pnt: any = new Cesium.Cartesian3();
                        Cesium.Matrix4.multiplyByPoint(xform_matrix, pnt, xform_pnt);
                        posi_to_point_map.set(posi_i, xform_pnt);
                    }
                    pgon_points.push(posi_to_point_map.get(posi_i));
                }
                // create the edge
                const line_geom = new Cesium.PolygonOutlineGeometry({
                    polygonHierarchy: new Cesium.PolygonHierarchy(pgon_points),
                    vertexFormat : Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
                    perPositionHeight: true
                });
                const line_instance = new Cesium.GeometryInstance({
                    geometry : line_geom,
                    attributes : {
                        color : Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.BLACK)
                    }
                });
                lines_instances.push(line_instance);
                // create the triangles
                const pgon_tris_i: number[] = model.geom.query.navAnyToTri(EEntType.PGON, pgon_i);
                for (const pgon_tri_i of pgon_tris_i) {
                    // tris_i.push(pgon_tri_i);
                    const tri_posis_i: number[] = model.geom.query.navAnyToPosi(EEntType.TRI, pgon_tri_i);
                    const tri_points: any[] = tri_posis_i.map( posi_i => posi_to_point_map.get(posi_i) );
                    const tri_geom = new Cesium.PolygonGeometry({
                        perPositionHeight : true,
                        polygonHierarchy: new Cesium.PolygonHierarchy(tri_points),
                        vertexFormat : Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
                    });
                    const instance = new Cesium.GeometryInstance({
                        geometry : tri_geom,
                        attributes : {
                            color : Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.WHITE)
                        }
                    });
                    tris_instances.push(instance);
                }
            }
            // add the lines instances to a primitive
            this._viewer.scene.primitives.add(new Cesium.Primitive({
                allowPicking: false,
                geometryInstances : lines_instances,
                shadows : Cesium.ShadowMode.ENABLED,
                appearance : new Cesium.PerInstanceColorAppearance({
                    flat: true,
                    translucent : false
                })
            }));
            // add the triangle instances to a primitive
            this._viewer.scene.primitives.add(new Cesium.Primitive({
                allowPicking: true,
                geometryInstances : tris_instances,
                shadows : Cesium.ShadowMode.ENABLED,
                appearance : new Cesium.PerInstanceColorAppearance({
                    translucent : false
                })
            }));
            // set up the camera
            const sphere = new Cesium.BoundingSphere(origin, 1e2);
            this._viewer.camera.viewBoundingSphere(sphere);
            this._viewer.render();
        }
    }
    // PRIVATE METHODS
    /**
     * Get a set of image layers
     */
    private _getImageryViewModels(): any[] {
        const view_models: any[] = [];
        view_models.push(new Cesium.ProviderViewModel({
            name: 'Open\u00adStreet\u00adMap',
            iconUrl: Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/openStreetMap.png'),
            tooltip: 'OpenStreetMap (OSM) is a collaborative project to create a free editable \
                 map of the world.\nhttp://www.openstreetmap.org',
            creationFunction: function () {
                return Cesium.createOpenStreetMapImageryProvider({
                    url: 'https://a.tile.openstreetmap.org/',
                });
            },
        }));
        view_models.push(new Cesium.ProviderViewModel({
            name: 'Stamen Toner',
            iconUrl: Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/stamenToner.png'),
            tooltip: 'A high contrast black and white map.\nhttp://www.maps.stamen.com/',
            creationFunction: function () {
                return Cesium.createOpenStreetMapImageryProvider({
                    url: 'https://stamen-tiles.a.ssl.fastly.net/toner/',
                });
            },
        }));
        view_models.push(new Cesium.ProviderViewModel({
            name: 'Stamen Toner(Lite)',
            iconUrl: Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/stamenToner.png'),
            tooltip: 'A high contrast black and white map(Lite).\nhttp://www.maps.stamen.com/',
            creationFunction: function () {
                return Cesium.createOpenStreetMapImageryProvider({
                    url: 'https://stamen-tiles.a.ssl.fastly.net/toner-lite/',
                });
            },
        }));
        view_models.push(new Cesium.ProviderViewModel({
            name: 'Terrain(Standard)',
            iconUrl: Cesium.buildModuleUrl('Widgets/Images/TerrainProviders/CesiumWorldTerrain.png'),
            tooltip: 'A high contrast black and white map(Standard).\nhttp://www.maps.stamen.com/',
            creationFunction: function () {
                return Cesium.createOpenStreetMapImageryProvider({
                    url: 'https://stamen-tiles.a.ssl.fastly.net/terrain/',
                });
            },
        }));
        view_models.push(new Cesium.ProviderViewModel({
            name: 'Terrain(Background)',
            iconUrl: Cesium.buildModuleUrl('Widgets/Images/TerrainProviders/CesiumWorldTerrain.png'),
            tooltip: 'A high contrast black and white map(Background).\nhttp://www.maps.stamen.com/',
            creationFunction: function () {
                return Cesium.createOpenStreetMapImageryProvider({
                    url: 'https://stamen-tiles.a.ssl.fastly.net/terrain-background/',
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
}

