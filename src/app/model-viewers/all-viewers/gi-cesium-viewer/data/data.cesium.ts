import { GIModel } from '@libs/geo-info/GIModel';
import { CesiumSettings } from '../gi-cesium-viewer.settings';
import { EEntType, Txyz, TAttribDataTypes } from '@assets/libs/geo-info/common';
import { vecSum } from '@assets/libs/geom/vectors';
// import { HereMapsImageryProvider } from './HereMapsImageryProvider.js';
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
        // add Cesium Access Token
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
                                        '.eyJqdGkiOiI2MGMxNGYwMS1jZjYyLTQyNjM' +
                                        'tOGNkYy1hOTRiYTk4ZGEzZDUiLCJpZCI6MTY' +
                                        '4MSwiaWF0IjoxNTI5NTY4OTc4fQ.lL2fzwOZ' +
                                        '6EQuL5BqXG5qIwlBn-P_DTbClhVYCIyCgS0';

        // create the viewer
        // https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html
        // https://cesium.com/docs/tutorials/getting-started/
        // https://cesium.com/blog/2018/03/12/cesium-and-angular/
        const view_models = this._getImageryViewModels();
        this._viewer = new Cesium.Viewer(
            document.getElementById('cesium-container'),
            {
                shadows : true,
                terrainShadows: Cesium.ShadowMode.ENABLED,
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
        this._viewer.scene.globe.depthTestAgainstTerrain = true;
        this._viewer.clock.currentTime.secondsOfDay = 50000;
        this._viewer.shadowMap.maxmimumDistance = 10000.0;
        this._viewer.shadowMap.size = 2048;
        this._viewer.shadowMap.softShadows = false; // if true, causes some strange effects
        // document.getElementsByClassName('cesium-viewer-bottom')[0].remove();
    }
    /**
     *
     * @param model
     * @param container
     */
    public addGeometry(model: GIModel, container: any): void { // TODO delete container
        this._viewer.scene.primitives.removeAll();
        // the origin of the model
        let longitude = 103.77575;
        let latitude = 1.30298;
        if (model.attribs.query.hasModelAttrib('longitude')) {
            const long_value: TAttribDataTypes  = model.attribs.query.getModelAttribValue('longitude');
            if (typeof long_value !== 'number') {
                throw new Error('Longitude attribute must be a number.');
            }
            longitude = long_value as number;
            if (longitude < -180 || longitude > 180) {
                throw new Error('Longitude attribute must be between -180 and 180.');
            }
        }
        if (model.attribs.query.hasModelAttrib('latitude')) {
            const lat_value: TAttribDataTypes = model.attribs.query.getModelAttribValue('latitude');
            if (typeof lat_value !== 'number') {
                throw new Error('Latitude attribute must be a number');
            }
            latitude = lat_value as number;
            if (latitude < 0 || latitude > 90) {
                throw new Error('Latitude attribute must be between 0 and 90.');
            }
        }
        const origin = Cesium.Cartesian3.fromDegrees(longitude, latitude);
        // create a matrix to transform points
        const xform_matrix: any = Cesium.Matrix4.multiplyByTranslation(
            Cesium.Transforms.eastNorthUpToFixedFrame(origin),
            new Cesium.Cartesian3(0, 0, 1),
            new Cesium.Matrix4()
        );
        // create all positions
        const posis_i: number[] = model.geom.query.getEnts(EEntType.POSI, false);
        const posi_to_point_map: Map<number, any> = new Map();
        for (const posi_i of posis_i) {
            if (!posi_to_point_map.has(posi_i)) {
                const xyz: Txyz = model.attribs.query.getPosiCoords(posi_i);
                const pnt: any = Cesium.Cartesian3.fromArray(xyz);
                const xform_pnt: any = new Cesium.Cartesian3();
                Cesium.Matrix4.multiplyByPoint(xform_matrix, pnt, xform_pnt);
                posi_to_point_map.set(posi_i, xform_pnt);
            }
        }
        // add geom
        if (model) {
            // get each polygon
            const pgons_i: number[] = model.geom.query.getEnts(EEntType.PGON, false);
            // get each triangle
            const lines_instances: any[] = [];
            const tris_instances: any[] = [];
            for (const pgon_i of pgons_i) {
                // get the colour of the vertices
                let pgon_colour = Cesium.Color.WHITE;
                if (model.attribs.query.hasAttrib(EEntType.VERT, 'rgb')) {
                    const verts_i: number[] = model.geom.query.navAnyToVert(EEntType.PGON, pgon_i);
                    const rgb_sum: Txyz = [0, 0, 0];
                    for (const vert_i of verts_i) {
                        let vert_rgb: Txyz = model.attribs.query.getAttribValue(EEntType.VERT, 'rgb', vert_i) as Txyz;
                        if (!vert_rgb) { vert_rgb = [1, 1, 1]; }
                        rgb_sum[0] = rgb_sum[0] + vert_rgb[0];
                        rgb_sum[1] = rgb_sum[1] + vert_rgb[1];
                        rgb_sum[2] = rgb_sum[2] + vert_rgb[2];
                    }
                    const num_verts: number = verts_i.length;
                    pgon_colour = new Cesium.Color(rgb_sum[0] / num_verts, rgb_sum[1] / num_verts, rgb_sum[2] / num_verts, 1.0);
                }
                // create the edges
                const wires_i: number[] = model.geom.query.navAnyToWire(EEntType.PGON, pgon_i);
                for (const wire_i of wires_i) {
                    const wire_posis_i: number[] = model.geom.query.navAnyToPosi(EEntType.WIRE, wire_i);
                    if (wire_posis_i.length > 2) {
                        // const wire_verts_i: number[] = model.geom.query.navAnyToVert(EEntType.WIRE, wire_i);
                        // const wire_posis_i: number[] = wire_verts_i.map( wire_vert_i => model.geom.query.navVertToPosi(wire_vert_i) );
                        const wire_points: any[] = wire_posis_i.map( wire_posi_i => posi_to_point_map.get(wire_posi_i) );
                        if (model.geom.query.istWireClosed(wire_i)) {
                            wire_points.push(wire_points[0]);
                        }
                        const line_geom = new Cesium.SimplePolylineGeometry({
                            positions: wire_points,
                            vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
                            perPositionHeight: true,
                            // arcType: Cesium.ArcType.NONE,
                            width: 1.0
                        });
                        const line_instance = new Cesium.GeometryInstance({
                            geometry : line_geom,
                            attributes : {
                                color : Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.BLACK)
                            }
                        });
                        lines_instances.push(line_instance);
                    }
                }
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
                            color : Cesium.ColorGeometryInstanceAttribute.fromColor(pgon_colour)
                        }
                    });
                    tris_instances.push(instance);
                }
            }
            // get each polygon
            const plines_i: number[] = model.geom.query.getEnts(EEntType.PLINE, false);
            // get each pline
            for (const pline_i of plines_i) {
                let pline_colour = Cesium.Color.BLACK;
                if (model.attribs.query.hasAttrib(EEntType.VERT, 'rgb')) {
                    const verts_i: number[] = model.geom.query.navAnyToVert(EEntType.PLINE, pline_i);
                    const rgb_sum: Txyz = [0, 0, 0];
                    for (const vert_i of verts_i) {
                        let vert_rgb: Txyz = model.attribs.query.getAttribValue(EEntType.VERT, 'rgb', vert_i) as Txyz;
                        if (!vert_rgb) { vert_rgb = [0, 0, 0]; }
                        rgb_sum[0] = rgb_sum[0] + vert_rgb[0];
                        rgb_sum[1] = rgb_sum[1] + vert_rgb[1];
                        rgb_sum[2] = rgb_sum[2] + vert_rgb[2];
                    }
                    const num_verts: number = verts_i.length;
                    pline_colour = new Cesium.Color(rgb_sum[0] / num_verts, rgb_sum[1] / num_verts, rgb_sum[2] / num_verts, 1.0);
                }
                // create the edges
                const wire_i: number = model.geom.query.navPlineToWire(pline_i);
                const wire_posis_i: number[] = model.geom.query.navAnyToPosi(EEntType.WIRE, wire_i);
                if (wire_posis_i.length > 1) {
                    const wire_points: any[] = wire_posis_i.map( wire_posi_i => posi_to_point_map.get(wire_posi_i) );
                    if (model.geom.query.istWireClosed(wire_i)) {
                        wire_points.push(wire_points[0]);
                    }
                    const line_geom = new Cesium.SimplePolylineGeometry({
                        positions: wire_points,
                        vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
                        perPositionHeight: true,
                        // arcType: Cesium.ArcType.NONE,
                        width: 1.0
                    });
                    const line_instance = new Cesium.GeometryInstance({
                        geometry : line_geom,
                        attributes : {
                            color : Cesium.ColorGeometryInstanceAttribute.fromColor(pline_colour)
                        }
                    });
                    lines_instances.push(line_instance);
                }
            }
            // add the lines instances to a primitive
            this._viewer.scene.primitives.add(new Cesium.Primitive({
                allowPicking: false,
                geometryInstances : lines_instances,
                shadows : Cesium.ShadowMode.DISABLED,
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
        // view_models.push(new Cesium.ProviderViewModel({
        //     name: 'Here Map',
        //     iconUrl: Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/openStreetMap.png'),
        //     tooltip: 'OpenStreetMap (OSM) is a collaborative project to create a free editable \
        //          map of the world.\nhttp://www.openstreetmap.org',
        //     creationFunction: function () {
        //         return new Cesium.HereMapsImageryProvider({
        //             appId: 'r4wDXkIdwoefnLKzNBmn',
        //             appCode: 'VknnhofMzg10PmECHFXHaw'
        //         });
        //     },
        // }));
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

