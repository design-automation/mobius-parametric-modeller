import { GIModel } from '@libs/geo-info/GIModel';
import { CesiumSettings } from '../gi-cesium-viewer.settings';
import { EEntType, Txyz, TAttribDataTypes, LONGLAT } from '@libs/geo-info/common';


export const API_MAPS = [
                            'Here map normal',
                            'Here map normal grey',
                            'Here map normal traffic',
                            'Here map normal reduced',
                            'Here map normal pedestrian',
                            'Here map aerial terrain',
                            'Here map aerial satellite',
                            'Here map aerial hybrid',
                            'Bing Map'
                        ];
export const API_MAPS_KEY_MAPPING = {
    'Here map normal': 'here',
    'Here map normal grey': 'here',
    'Here map normal traffic': 'here',
    'Here map normal reduced': 'here',
    'Here map normal pedestrian': 'here',
    'Here map aerial terrain': 'here',
    'Here map aerial satellite': 'here',
    'Here map aerial hybrid': 'here',
    'Bing Map': 'bing'
};

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
    public _primitives: any[];
    public _camera: any[];
    public _viewLayerProviders = [];
    public _viewTerrainProviders = [];
    // interaction and selection
    // text labels
    // number of cesium points, lines, triangles
    // grid
    // axes
    /**
     * Constructs a new data subscriber.
     */
    constructor(settings: CesiumSettings) {
        this.settings = JSON.parse(JSON.stringify(settings));
        this._getLayers();
        this._getTerrains();
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
        if (this.settings.cesium.ion !== Cesium.Ion.defaultAccessToken && this.settings.cesium.ion !== '') {
            Cesium.Ion.defaultAccessToken = this.settings.cesium.ion;
        }

        // Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
        //                                 '.eyJqdGkiOiI2MGMxNGYwMS1jZjYyLTQyNjM' +
        //                                 'tOGNkYy1hOTRiYTk4ZGEzZDUiLCJpZCI6MTY' +
        //                                 '4MSwiaWF0IjoxNTI5NTY4OTc4fQ.lL2fzwOZ' +
        //                                 '6EQuL5BqXG5qIwlBn-P_DTbClhVYCIyCgS0';
        // create the viewer
        // https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html
        // https://cesium.com/docs/tutorials/getting-started/
        // https://cesium.com/blog/2018/03/12/cesium-and-angular/
        // const view_models = this._getImageryViewModels();
        this._viewer = new Cesium.Viewer(
            document.getElementById('cesium-container'),
            {
                shadows : true,
                terrainShadows: Cesium.ShadowMode.ENABLED,
                scene3DOnly: false,
                baseLayerPicker: false,
                sceneModePicker: false,
                homeButton: false,
                navigationHelpButton: false,
                fullscreenButton: false,
                animation: false,
                timeline: true,
                geocoder: false,
                // imageryProviderViewModels : view_models,
                // selectedImageryProviderViewModel : view_models[0],
                // terrainProviderViewModels : terrainViewModels
                // selectedTerrainProviderViewModel : terrainViewModels[1]
            }
        );
        this._viewer.scene.postProcessStages.fxaa.enabled = true;
        this._viewer.scene.globe.depthTestAgainstTerrain = false;
        this._viewer.clock.currentTime.secondsOfDay = 50000;
        this._viewer.shadowMap.maxmimumDistance = 500;
        this._viewer.shadowMap.size = 6144;
        this._viewer.shadowMap.cascadesEnabled = false;
        this._viewer.shadowMap.softShadows = false; // if true, causes some strange effects
        // document.getElementsByClassName('cesium-viewer-bottom')[0].remove();

        if (this.settings.imagery) {
            if (this.settings.imagery.layer) {
                for (const layerProvider of this._viewLayerProviders) {
                    if (layerProvider.name === this.settings.imagery.layer) {
                        const viewer_layers = this._viewer.imageryLayers;
                        const newLayer = new Cesium.ImageryLayer(layerProvider.creationCommand(
                            this.settings.imagery.apiKey[API_MAPS_KEY_MAPPING[this.settings.imagery.layer]]));
                        viewer_layers.removeAll();
                        viewer_layers.add(newLayer);
                    }
                }
            }
            if (this.settings.imagery.terrain) {
                for (const terrainProvider of this._viewTerrainProviders) {
                    if (terrainProvider.name === this.settings.imagery.terrain) {
                        this._viewer.terrainProvider = terrainProvider.creationCommand();
                    }
                }
            }
        }

        // prevent camera goes underground #375
        const handler = this._viewer.screenSpaceEventHandler;
        handler.setInputAction(() => {
            this._viewer.camera._suspendTerrainAdjustment = false;
            this._viewer.camera._adjustHeightForTerrain();
        }, Cesium.ScreenSpaceEventType.MIDDLE_DOWN);
        // change camera controlling action: left mouse drag for rotating, right mouse drag for panning, wheel for zooming
        const cameraController = this._viewer.scene.screenSpaceCameraController;

        cameraController.rotateEventTypes = Cesium.CameraEventType.RIGHT_DRAG;
        cameraController.tiltEventTypes  = Cesium.CameraEventType.LEFT_DRAG;
        cameraController.translateEventTypes = Cesium.CameraEventType.LEFT_DRAG;
        // cameraController.lookEventTypes = [Cesium.CameraEventType.RIGHT_DRAG,
        //                                     {'eventType': Cesium.CameraEventType.LEFT_DRAG,
        //                                      'modifier': Cesium.KeyboardEventModifier.SHIFT}];
        cameraController.lookEventTypes = undefined;
        cameraController.zoomEventTypes  = [  Cesium.CameraEventType.MIDDLE_DRAG,
                                                Cesium.CameraEventType.WHEEL,
                                                Cesium.CameraEventType.PINCH];

        Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;

        if (this._primitives) {
            this._viewer.scene.primitives.removeAll();
            for (const primitive of this._primitives) {
                this._viewer.scene.primitives.add(Cesium.clone(primitive));
            }
            this._viewer.camera.flyToBoundingSphere(this._camera[0], {
                duration: 0,
                endTransform: Cesium.Matrix4.IDENTITY
            });
            // this._viewer.camera.direction = this._camera[1].direction;
            // this._viewer.camera.position = this._camera[1].position;
            // this._viewer.camera.right = this._camera[1].right;
            // this._viewer.camera.up = this._camera[1].up;
            this._viewer.render();
        }
        // const homeBtn = <HTMLButtonElement> document.getElementsByClassName('cesium-home-button')[0];
        // tslint:disable-next-line
        // homeBtn.getElementsByTagName('path')[0].setAttribute('d', 'M15 3l2.3 2.3-2.89 2.87 1.42 1.42L18.7 6.7 21 9V3zM3 9l2.3-2.3 2.87 2.89 1.42-1.42L6.7 5.3 9 3H3zm6 12l-2.3-2.3 2.89-2.87-1.42-1.42L5.3 17.3 3 15v6zm12-6l-2.3 2.3-2.87-2.89-1.42 1.42 2.89 2.87L15 21h6z');
        // homeBtn.title = 'Zoom to Fit Model';
        // homeBtn.style.fontSize = '24px';
        // homeBtn.style.top = '26px';
        // homeBtn.style.right = '-1px';
        // settings button
        // const settingsBtn = homeBtn.nextElementSibling as HTMLElement;
        // settingsBtn.getElementsByTagName('img')[0].remove();
        // const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        // const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        // tslint:disable-next-line
        // path.setAttribute('d', 'M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z')
        // tslint:disable-next-line
        // path.setAttribute('d', 'M19.43 12.98c.04-.32.07-.64.07-.98 0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.09-.16-.26-.25-.44-.25-.06 0-.12.01-.17.03l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.06-.02-.12-.03-.18-.03-.17 0-.34.09-.43.25l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.09.16.26.25.44.25.06 0 .12-.01.17-.03l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.06.02.12.03.18.03.17 0 .34-.09.43-.25l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zm-1.98-1.71c.04.31.05.52.05.73 0 .21-.02.43-.05.73l-.14 1.13.89.7 1.08.84-.7 1.21-1.27-.51-1.04-.42-.9.68c-.43.32-.84.56-1.25.73l-1.06.43-.16 1.13-.2 1.35h-1.4l-.19-1.35-.16-1.13-1.06-.43c-.43-.18-.83-.41-1.23-.71l-.91-.7-1.06.43-1.27.51-.7-1.21 1.08-.84.89-.7-.14-1.13c-.03-.31-.05-.54-.05-.74s.02-.43.05-.73l.14-1.13-.89-.7-1.08-.84.7-1.21 1.27.51 1.04.42.9-.68c.43-.32.84-.56 1.25-.73l1.06-.43.16-1.13.2-1.35h1.39l.19 1.35.16 1.13 1.06.43c.43.18.83.41 1.23.71l.91.7 1.06-.43 1.27-.51.7 1.21-1.07.85-.89.7.14 1.13zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z')
        // svg.append(path);
        // settingsBtn.append(svg);
        // settingsBtn.style.top = '58px';
        // const btn = document.getElementById('attribToggle');
        // if (btn) {
        //     btn.style.display = 'none';
        // }
    }
    /**
     *
     * @param model
     * @param container
     */
    public addGeometry(model: GIModel, container: any): void { // TODO delete container
        this.updateSettings();
        this._viewer.scene.primitives.removeAll();
        // the origin of the model
        let longitude = LONGLAT[0];
        let latitude = LONGLAT[1];
        let elevation = 0;
        if (model.modeldata.attribs.query.hasModelAttrib('geolocation')) {
            const geoloc: any = model.modeldata.attribs.query.getModelAttribVal('geolocation');
            const long_value: TAttribDataTypes  = geoloc.longitude;
            if (typeof long_value !== 'number') {
                throw new Error('Longitude attribute must be a number.');
            }
            longitude = long_value as number;
            if (longitude < -180 || longitude > 180) {
                throw new Error('Longitude attribute must be between -180 and 180.');
            }
            const lat_value: TAttribDataTypes = geoloc.latitude;
            if (typeof lat_value !== 'number') {
                throw new Error('Latitude attribute must be a number');
            }
            latitude = lat_value as number;
            if (latitude < 0 || latitude > 90) {
                throw new Error('Latitude attribute must be between 0 and 90.');
            }
            if (geoloc.elevation) {
                const ele_value: TAttribDataTypes = geoloc.elevation;
                if (typeof ele_value !== 'number') {
                    throw new Error('Elevation attribute must be a number');
                }
                elevation = ele_value as number;
            }
        }
        // if (model.modeldata.attribs.query.hasModelAttrib('longitude')) {
        //     const long_value: TAttribDataTypes  = model.modeldata.attribs.query.getModelAttribVal('longitude');
        //     if (typeof long_value !== 'number') {
        //         throw new Error('Longitude attribute must be a number.');
        //     }
        //     longitude = long_value as number;
        //     if (longitude < -180 || longitude > 180) {
        //         throw new Error('Longitude attribute must be between -180 and 180.');
        //     }
        // }
        // if (model.modeldata.attribs.query.hasModelAttrib('latitude')) {
        //     const lat_value: TAttribDataTypes = model.modeldata.attribs.query.getModelAttribVal('latitude');
        //     if (typeof lat_value !== 'number') {
        //         throw new Error('Latitude attribute must be a number');
        //     }
        //     latitude = lat_value as number;
        //     if (latitude < 0 || latitude > 90) {
        //         throw new Error('Latitude attribute must be between 0 and 90.');
        //     }
        // }
        const origin = Cesium.Cartesian3.fromDegrees(longitude, latitude, elevation);
        // create a matrix to transform points

        // if there's a north attribute
        const east_north_up = Cesium.Transforms.eastNorthUpToFixedFrame(origin);
        if (model.modeldata.attribs.query.hasModelAttrib('north')) {

            // get north attribute
            const north_dir: any = model.modeldata.attribs.query.getModelAttribVal('north');

            if (north_dir.constructor === [].constructor && north_dir.length === 2) {
                // make the north vector and the default north vector
                const north_cartesian = new Cesium.Cartesian3(north_dir[0], north_dir[1], 0);
                const model_cartesian = new Cesium.Cartesian3(0, 1, 0);

                // find the angle between them and its sign
                const angle = Cesium.Cartesian3.angleBetween(north_cartesian, model_cartesian);
                const angle_sign = north_cartesian.x < 0 ? -1 : 1;

                // make rotation matrix
                const m = Cesium.Matrix3.fromRotationZ(angle_sign * angle);
                Cesium.Matrix4.multiplyByMatrix3(east_north_up, m, east_north_up);
            }

        }

        const xform_matrix: any = Cesium.Matrix4.multiplyByTranslation(
            east_north_up,
            new Cesium.Cartesian3(0, 0, 0),
            new Cesium.Matrix4()
        );
        xform_matrix[12] = 0;
        xform_matrix[13] = 0;
        xform_matrix[14] = 0;
        // create all positions
        const posis_i: number[] = model.modeldata.geom.query.getEnts(EEntType.POSI);
        const vert_n = model.modeldata.attribs.query.getAttrib(EEntType.VERT, 'normal');

        const allPosis = [];
        const posi_to_point_map: Map<number, any> = new Map();
        const vert_to_normal_map: Map<number, any> = new Map();
        for (const posi_i of posis_i) {
            if (!posi_to_point_map.has(posi_i)) {
                const xyz: Txyz = model.modeldata.attribs.query.getPosiCoords(posi_i);
                const xform_pnt: any = Cesium.Cartesian3.fromArray(xyz);
                Cesium.Matrix4.multiplyByPoint(east_north_up, xform_pnt, xform_pnt);
                posi_to_point_map.set(posi_i, xform_pnt);
                allPosis.push(xform_pnt);
            }
        }
        if (vert_n) {
            for (const vert_i of model.modeldata.geom.query.getEnts(EEntType.VERT)) {
                // const pos = model.modeldata.geom.nav.navVertToPosi(vert_i);
                const normal_attr = vert_n.getEntVal(vert_i) as Txyz;
                if (normal_attr && normal_attr.constructor === [].constructor && normal_attr.length === 3) {
                    const normal_val = Cesium.Cartesian3.fromArray(normal_attr);
                    Cesium.Matrix4.multiplyByPoint(xform_matrix, normal_val, normal_val);
                    vert_to_normal_map.set(vert_i, normal_val);
                }
            }
        }
        // add geom
        if (model) {
            // get each polygon
            const pgons_i: number[] = model.modeldata.geom.query.getEnts(EEntType.PGON);
            if (pgons_i.length > 100000) {
                const notify = <HTMLInputElement> document.getElementById('hidden_notify_button');
                notify.value = 'Model too big to be rendered by Cesium';
                notify.click();
                return;
            }
            // get each triangle
            const lines_instances: any[] = [];
            const tris_instances: any[] = [];
            const transparent_instances: any[] = [];
            // get each polygon
            for (const pgon_i of pgons_i) {
                // get the colour of the vertices
                let pgon_colour = Cesium.Color.WHITE;
                let transparentCheck = false;
                let normalCheck = !!vert_n;
                if (model.modeldata.attribs.query.hasAttrib(EEntType.VERT, 'rgb')) {
                    const verts_i: number[] = model.modeldata.geom.nav.navAnyToVert(EEntType.PGON, pgon_i);
                    const rgb_sum: Txyz = [0, 0, 0];
                    for (const vert_i of verts_i) {
                        let vert_rgb: Txyz = model.modeldata.attribs.query.getAttribVal(EEntType.VERT, 'rgb', vert_i) as Txyz;
                        if (!vert_rgb) { vert_rgb = [1, 1, 1]; }
                        rgb_sum[0] = rgb_sum[0] + vert_rgb[0];
                        rgb_sum[1] = rgb_sum[1] + vert_rgb[1];
                        rgb_sum[2] = rgb_sum[2] + vert_rgb[2];
                    }
                    const num_verts: number = verts_i.length;
                    pgon_colour = new Cesium.Color(rgb_sum[0] / num_verts, rgb_sum[1] / num_verts, rgb_sum[2] / num_verts, 1.0);
                }

                if (model.modeldata.attribs.query.hasAttrib(EEntType.PGON, 'material')) {
                    let mat_name: any = model.modeldata.attribs.query.getAttribVal(EEntType.PGON, 'material', pgon_i);
                    if (mat_name) {
                        if (mat_name.constructor === [].constructor) { mat_name = mat_name[0]; }
                        const pgon_mat: any = model.modeldata.attribs.query.getModelAttribVal(mat_name);
                        if (pgon_mat.color && pgon_mat.color !== 16777215) {
                            let cString = pgon_mat.color.toString(16);
                            while (cString.length < 6) { cString = '0' + cString; }
                            pgon_colour = Cesium.Color.fromCssColorString('#' + cString);
                        }
                        if (pgon_mat.opacity && pgon_mat.opacity !== 1) {
                            pgon_colour.alpha = pgon_mat.opacity;
                            transparentCheck = true;
                        }
                    }
                }

                const pgon_tris_i: number[] = model.modeldata.geom.nav.navAnyToTri(EEntType.PGON, pgon_i);
                for (const pgon_tri_i of pgon_tris_i) {
                    // tris_i.push(pgon_tri_i);
                    const vert_posis_i: number[] = model.modeldata.geom.nav.navTriToVert(pgon_tri_i);
                    // const tri_posis_i: number[] = model.modeldata.geom.nav.navAnyToPosi(EEntType.TRI, pgon_tri_i);
                    // const tri_points = tri_posis_i.map( posi_i => posi_to_point_map.get(posi_i) );
                    // const norm_vecs = tri_posis_i.map( posi_i => posi_to_normal_map.get(posi_i) );
                    // const tri_geom = new Cesium.PolygonGeometry({
                    //     perPositionHeight : true,
                    //     polygonHierarchy: new Cesium.PolygonHierarchy(tri_points),
                    //     vertexFormat : Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
                    // });
                    let posis: any = [];
                    let normal: any = [];
                    // tslint:disable-next-line: forin
                    for (const v_i of vert_posis_i) {
                        if (vert_n) {
                            const norm_vec = vert_to_normal_map.get(v_i);
                            if (norm_vec) {
                                normal.push(norm_vec.x);
                                normal.push(norm_vec.y);
                                normal.push(norm_vec.z);
                            } else {
                                normalCheck = false;
                            }
                        }
                        const p_i = model.modeldata.geom.nav.navVertToPosi(v_i);
                        const tri_point = posi_to_point_map.get(p_i);
                        posis.push(tri_point.x);
                        posis.push(tri_point.y);
                        posis.push(tri_point.z);
                    }
                    posis = new Float64Array(posis);
                    normal = new Float32Array(normal);
                    let tri_geom = new Cesium.Geometry({
                        attributes : new Cesium.GeometryAttributes({
                            position : new Cesium.GeometryAttribute({
                                componentDatatype : Cesium.ComponentDatatype.DOUBLE,
                                componentsPerAttribute : 3,
                                values : posis
                            })
                        }),
                        primitiveType: Cesium.PrimitiveType.TRIANGLES,
                        indices: [0, 1, 2],
                        boundingSphere: Cesium.BoundingSphere.fromVertices(posis)
                    });
                    if (normalCheck) {
                        tri_geom.attributes.normal = new Cesium.GeometryAttribute({
                            componentDatatype : Cesium.ComponentDatatype.FLOAT,
                            componentsPerAttribute : 3,
                            values : normal
                        });
                    } else {
                        tri_geom = Cesium.GeometryPipeline.computeNormal(tri_geom);
                    }
                    const instance = new Cesium.GeometryInstance({
                        geometry : tri_geom,
                        attributes : {
                            color : Cesium.ColorGeometryInstanceAttribute.fromColor(pgon_colour)
                        }
                    });
                    if (transparentCheck) {
                        transparent_instances.push(instance);
                    } else {
                        tris_instances.push(instance);
                    }
                }
            }
            const plines_i: number[] = model.modeldata.geom.query.getEnts(EEntType.PLINE);
            // get each pline
            for (const pline_i of plines_i) {
                let pline_colour = Cesium.Color.BLACK;
                if (model.modeldata.attribs.query.hasAttrib(EEntType.VERT, 'rgb')) {
                    const verts_i: number[] = model.modeldata.geom.nav.navAnyToVert(EEntType.PLINE, pline_i);
                    const rgb_sum: Txyz = [0, 0, 0];
                    for (const vert_i of verts_i) {
                        let vert_rgb: Txyz = model.modeldata.attribs.query.getAttribVal(EEntType.VERT, 'rgb', vert_i) as Txyz;
                        if (!vert_rgb) { vert_rgb = [0, 0, 0]; }
                        rgb_sum[0] = rgb_sum[0] + vert_rgb[0];
                        rgb_sum[1] = rgb_sum[1] + vert_rgb[1];
                        rgb_sum[2] = rgb_sum[2] + vert_rgb[2];
                    }
                    const num_verts: number = verts_i.length;
                    pline_colour = new Cesium.Color(rgb_sum[0] / num_verts, rgb_sum[1] / num_verts, rgb_sum[2] / num_verts, 1.0);
                }
                // create the edges
                const wire_i: number = model.modeldata.geom.nav.navPlineToWire(pline_i);
                const wire_posis_i: number[] = model.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, wire_i);
                if (wire_posis_i.length > 1) {
                    const wire_points: any[] = wire_posis_i.map( wire_posi_i => posi_to_point_map.get(wire_posi_i) );
                    if (model.modeldata.geom.query.isWireClosed(wire_i)) {
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
            const lines_primitive = new Cesium.Primitive({
                                        allowPicking: false,
                                        geometryInstances : lines_instances,
                                        shadows : Cesium.ShadowMode.DISABLED,
                                        appearance : new Cesium.PerInstanceColorAppearance({
                                            translucent : false
                                        })
                                    });
            const tris_primitive =  new Cesium.Primitive({
                                        allowPicking: true,
                                        geometryInstances : tris_instances,
                                        shadows : Cesium.ShadowMode.ENABLED,
                                        appearance : new Cesium.PerInstanceColorAppearance({
                                            translucent : false
                                        })
                                    });
            const transparent_primitive =  new Cesium.Primitive({
                                        allowPicking: true,
                                        geometryInstances : transparent_instances,
                                        shadows : Cesium.ShadowMode.ENABLED,
                                        appearance : new Cesium.PerInstanceColorAppearance({
                                            translucent : true
                                        })
                                    });

            // this._primitives = [tris_primitive];
            this._primitives = [lines_primitive, tris_primitive, transparent_primitive];
            for (const primitive of this._primitives) {
                this._viewer.scene.primitives.add(Cesium.clone(primitive));
            }
            if (Cesium.Ion.defaultAccessToken && this.settings.cesium && this.settings.cesium.assetid) {
                this._addAssets(this.settings.cesium.assetid);
            }

            // set up the camera
            const sphere = new Cesium.BoundingSphere(origin, 1e2);
            if (allPosis.length > 0) {
                Cesium.BoundingSphere.fromPoints(allPosis, sphere);
            }
            const dist = this._viewer.camera.distanceToBoundingSphere(sphere);
            // if (!document.getElementById('minimal') || this._starting) {
            if (dist > 8000) {
                this._viewer.camera.flyToBoundingSphere(sphere, {
                    duration: 0,
                    endTransform: Cesium.Matrix4.IDENTITY
                });
            }
            this._camera = [sphere, this._viewer.camera];
            if (this.settings.camera && this.settings.updated) {
                const pos = this.settings.camera.pos;
                if (pos && (pos.x || pos.y || pos.z)) {
                    const dir = this.settings.camera.direction;
                    const up = this.settings.camera.up;
                    const right = this.settings.camera.right;
                    this._viewer.camera.position = new Cesium.Cartesian3(pos.x, pos.y, pos.z);
                    this._viewer.camera.direction = new Cesium.Cartesian3(dir.x, dir.y, dir.z);
                    this._viewer.camera.up = new Cesium.Cartesian3(up.x, up.y, up.z);
                    this._viewer.camera.right = new Cesium.Cartesian3(right.x, right.y, right.z);
                }
            }
            if (lines_instances.length > 0 || tris_instances.length > 0 || transparent_instances.length > 0) {
                this.settings.updated = false;
                localStorage.setItem('cesium_settings', JSON.stringify(this.settings));
            }
            const extent = Cesium.Rectangle.fromDegrees(
                longitude - 0.01, latitude - 0.01,
                longitude + 0.01, latitude + 0.01); // 100.3, 5.4, 100.4, 5.5);

            Cesium.Camera.DEFAULT_VIEW_RECTANGLE = extent;
            // Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;

            this._viewer.render();

            setTimeout(() => {
                // model: GIModel, container: any
                if (container === null) {
                    container = document.getElementById('cesium-container');
                }
                let old = document.getElementById('hud');
                if (old) {
                    container.removeChild(old);
                }
                if (!model.modeldata.attribs.query.hasAttrib(EEntType.MOD, 'hud')) { return; }
                const hud = model.modeldata.attribs.query.getModelAttribVal('hud') as string;
                const element = this._createHud(hud).element;
                container.appendChild(element);
                old = null;
            }, 0);
        }
    }

    private _addAssets(assetIDString) {
        const assets = assetIDString.split(/[\s\,\;]/g);
        for (const asset of assets) {
            const assetid =  asset.replace(/[\'\"]/g, '');
            this._viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
                url: Cesium.IonResource.fromAssetId(assetid)
            }));
        }
    }

    public updateSettings(settings: CesiumSettings = null) {
        let newSetting: CesiumSettings;
        if (settings !== null) {
            newSetting = <CesiumSettings> JSON.parse(JSON.stringify(settings));
        } else {
            newSetting = <CesiumSettings> JSON.parse(localStorage.getItem('cesium_settings'));
        }
        if (!newSetting) { return; }
        let ionChange = false;
        if (newSetting.cesium) {
            if (newSetting.cesium.ion) { newSetting.cesium.ion = newSetting.cesium.ion.trim(); }
            if (newSetting.cesium.ion !== Cesium.Ion.defaultAccessToken && newSetting.cesium.ion !== '') {
                Cesium.Ion.defaultAccessToken = newSetting.cesium.ion;
                ionChange = true;
            }
            if (newSetting.cesium.hasOwnProperty('save')) {
                this.settings.cesium.save = newSetting.cesium.save;
                if (this.settings.cesium.save) {
                    this.settings.cesium.ion = newSetting.cesium.ion;
                    this.settings.cesium.assetid = newSetting.cesium.assetid;
                }
            }
        }
        if (newSetting.imagery) {
            if (newSetting.imagery.layer && this.settings.imagery.layer !== newSetting.imagery.layer) {
                for (const layerProvider of this._viewLayerProviders) {
                    if (layerProvider.name === newSetting.imagery.layer) {
                        const viewer_layers = this._viewer.imageryLayers;
                        const newLayer = new Cesium.ImageryLayer(layerProvider.creationCommand(
                            this.settings.imagery.apiKey[API_MAPS_KEY_MAPPING[this.settings.imagery.layer]]));
                        viewer_layers.removeAll();
                        viewer_layers.add(newLayer);
                        this.settings.imagery.layer = newSetting.imagery.layer;
                    }
                }
            }
            if (newSetting.imagery.apiKey) {
                if (!this.settings.imagery.apiKey) {
                    this.settings.imagery.apiKey = {};
                }
                for (const i of Object.keys(newSetting.imagery.apiKey)) {
                    this.settings.imagery.apiKey[i] = newSetting.imagery.apiKey[i];
                }
            }
            if (newSetting.imagery.terrain && (this.settings.imagery.terrain !== newSetting.imagery.terrain || ionChange)) {
                for (const terrainProvider of this._viewTerrainProviders) {
                    if (terrainProvider.name === newSetting.imagery.terrain) {
                        this._viewer.terrainProvider = terrainProvider.creationCommand();
                        this.settings.imagery.terrain = newSetting.imagery.terrain;
                    }
                }
            }
        }
        if (newSetting.camera) {
            if (newSetting.camera.pos) {
                this.settings.camera.pos.x = newSetting.camera.pos.x;
                this.settings.camera.pos.y = newSetting.camera.pos.y;
                this.settings.camera.pos.z = newSetting.camera.pos.z;
                this.settings.camera.direction.x = newSetting.camera.direction.x;
                this.settings.camera.direction.y = newSetting.camera.direction.y;
                this.settings.camera.direction.z = newSetting.camera.direction.z;
                this.settings.camera.up.x = newSetting.camera.up.x;
                this.settings.camera.up.y = newSetting.camera.up.y;
                this.settings.camera.up.z = newSetting.camera.up.z;
                this.settings.camera.right.x = newSetting.camera.right.x;
                this.settings.camera.right.y = newSetting.camera.right.y;
                this.settings.camera.right.z = newSetting.camera.right.z;
            }
        }
        if (newSetting.time) {
            if (newSetting.time.date) {
                this.settings.time.date = newSetting.time.date;
                if (this.settings.time.date.indexOf('T') === -1) {
                    Cesium.JulianDate.fromIso8601(this.settings.time.date, this._viewer.clock.currentTime);
                    Cesium.JulianDate.addDays(this._viewer.clock.currentTime, -1, this._viewer.clock.startTime);
                    Cesium.JulianDate.addDays(this._viewer.clock.currentTime, 1, this._viewer.clock.stopTime);
                    this._viewer.timeline.zoomTo(this._viewer.clock.startTime, this._viewer.clock.stopTime);
                } else {
                    Cesium.JulianDate.fromIso8601(this.settings.time.date.split('T')[0], this._viewer.clock.currentTime);
                    Cesium.JulianDate.addDays(this._viewer.clock.currentTime, -1, this._viewer.clock.startTime);
                    Cesium.JulianDate.addDays(this._viewer.clock.currentTime, 1, this._viewer.clock.stopTime);
                    Cesium.JulianDate.fromIso8601(this.settings.time.date + ':00Z', this._viewer.clock.currentTime);
                    this._viewer.timeline.zoomTo(this._viewer.clock.startTime, this._viewer.clock.stopTime);
                }
            }
        }
        if (newSetting.updated) {
            this.settings.updated = newSetting.updated;
        }
        if (Cesium.Ion.defaultAccessToken && newSetting.cesium && newSetting.cesium.assetid) {
            this._addAssets(newSetting.cesium.assetid);
        }
        localStorage.setItem('cesium_settings', JSON.stringify(this.settings));
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
                return new Cesium.OpenStreetMapImageryProvider({
                    url: 'https://a.tile.openstreetmap.org/',
                });
            },
        }));
        view_models.push(new Cesium.ProviderViewModel({
            name: 'Stamen Toner',
            iconUrl: Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/stamenToner.png'),
            tooltip: 'Stamen high contrast black and white map.\nhttp://www.maps.stamen.com/',
            creationFunction: function () {
                return new Cesium.OpenStreetMapImageryProvider({
                    url: 'https://stamen-tiles.a.ssl.fastly.net/toner/',
                });
            },
        }));
        view_models.push(new Cesium.ProviderViewModel({
            name: 'Stamen Toner(Lite)',
            iconUrl: Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/stamenToner.png'),
            tooltip: 'Stamen high contrast black and white map(Lite).\nhttp://www.maps.stamen.com/',
            creationFunction: function () {
                return new Cesium.OpenStreetMapImageryProvider({
                    url: 'https://stamen-tiles.a.ssl.fastly.net/toner-lite/',
                });
            },
        }));
        view_models.push(new Cesium.ProviderViewModel({
            name: 'Terrain(Standard)',
            iconUrl: Cesium.buildModuleUrl('Widgets/Images/TerrainProviders/CesiumWorldTerrain.png'),
            tooltip: 'Stamen World terrain.\nhttp://www.maps.stamen.com/',
            creationFunction: function () {
                return new Cesium.OpenStreetMapImageryProvider({
                    url: 'https://stamen-tiles.a.ssl.fastly.net/terrain/',
                });
            },
        }));
        view_models.push(new Cesium.ProviderViewModel({
            name: 'Terrain(Background)',
            iconUrl: Cesium.buildModuleUrl('Widgets/Images/TerrainProviders/CesiumWorldTerrain.png'),
            tooltip: 'Stamen World terrain (Background).\nhttp://www.maps.stamen.com/',
            creationFunction: function () {
                return new Cesium.OpenStreetMapImageryProvider({
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

    private _getLayers() {
        this._viewLayerProviders = [];
        this._viewLayerProviders.push(new Cesium.ProviderViewModel({
            name: 'Open Street Map',
            iconUrl: Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/openStreetMap.png'),
            tooltip: 'OpenStreetMap (OSM) is a collaborative project to create a free editable \
                 map of the world.\nhttp://www.openstreetmap.org',
            creationFunction: function () {
                return new Cesium.OpenStreetMapImageryProvider({
                    url: 'https://a.tile.openstreetmap.org/',
                });
            },
        }));
        this._viewLayerProviders.push(new Cesium.ProviderViewModel({
            name: 'Stamen Toner',
            iconUrl: Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/stamenToner.png'),
            tooltip: 'Stamen high contrast black and white map.\nhttp://www.maps.stamen.com/',
            creationFunction: function () {
                return new Cesium.OpenStreetMapImageryProvider({
                    url: 'https://stamen-tiles.a.ssl.fastly.net/toner/',
                });
            },
        }));
        this._viewLayerProviders.push(new Cesium.ProviderViewModel({
            name: 'Stamen Toner(Lite)',
            iconUrl: Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/stamenToner.png'),
            tooltip: 'Stamen high contrast black and white map(Lite).\nhttp://www.maps.stamen.com/',
            creationFunction: function () {
                return new Cesium.OpenStreetMapImageryProvider({
                    url: 'https://stamen-tiles.a.ssl.fastly.net/toner-lite/',
                });
            },
        }));
        this._viewLayerProviders.push(new Cesium.ProviderViewModel({
            name: 'Terrain(Standard)',
            iconUrl: Cesium.buildModuleUrl('Widgets/Images/TerrainProviders/CesiumWorldTerrain.png'),
            tooltip: 'Stamen World terrain.\nhttp://www.maps.stamen.com/',
            creationFunction: function () {
                return new Cesium.OpenStreetMapImageryProvider({
                    url: 'https://stamen-tiles.a.ssl.fastly.net/terrain/',
                });
            },
        }));
        this._viewLayerProviders.push(new Cesium.ProviderViewModel({
            name: 'Terrain(Background)',
            iconUrl: Cesium.buildModuleUrl('Widgets/Images/TerrainProviders/CesiumWorldTerrain.png'),
            tooltip: 'Stamen World terrain (Background).\nhttp://www.maps.stamen.com/',
            creationFunction: function () {
                return new Cesium.OpenStreetMapImageryProvider({
                    url: 'https://stamen-tiles.a.ssl.fastly.net/terrain-background/',
                });
            },
        }));


        this._viewLayerProviders.push(new Cesium.ProviderViewModel({
            name: 'Google map roadmap',
            iconUrl: Cesium.buildModuleUrl('Widgets/Images/TerrainProviders/CesiumWorldTerrain.png'),
            tooltip: '',
            creationFunction: function () {
                return new Cesium.UrlTemplateImageryProvider({
                    url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
                });
            },
        }));


        this._viewLayerProviders.push(new Cesium.ProviderViewModel({
            name: 'Google map terrain',
            iconUrl: Cesium.buildModuleUrl('Widgets/Images/TerrainProviders/CesiumWorldTerrain.png'),
            tooltip: '',
            creationFunction: function () {
                return new Cesium.UrlTemplateImageryProvider({
                    url: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
                });
            },
        }));


        this._viewLayerProviders.push(new Cesium.ProviderViewModel({
            name: 'Google map altered roadmap',
            iconUrl: Cesium.buildModuleUrl('Widgets/Images/TerrainProviders/CesiumWorldTerrain.png'),
            tooltip: '',
            creationFunction: function () {
                return new Cesium.UrlTemplateImageryProvider({
                    url: 'https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}',
                });
            },
        }));


        this._viewLayerProviders.push(new Cesium.ProviderViewModel({
            name: 'Google map satellite only',
            iconUrl: Cesium.buildModuleUrl('Widgets/Images/TerrainProviders/CesiumWorldTerrain.png'),
            tooltip: '',
            creationFunction: function () {
                return new Cesium.UrlTemplateImageryProvider({
                    url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
                });
            },
        }));


        this._viewLayerProviders.push(new Cesium.ProviderViewModel({
            name: 'Google map terrain only',
            iconUrl: Cesium.buildModuleUrl('Widgets/Images/TerrainProviders/CesiumWorldTerrain.png'),
            tooltip: '',
            creationFunction: function () {
                return new Cesium.UrlTemplateImageryProvider({
                    url: 'https://mt1.google.com/vt/lyrs=t&x={x}&y={y}&z={z}',
                });
            },
        }));


        this._viewLayerProviders.push(new Cesium.ProviderViewModel({
            name: 'Google map hybrid',
            iconUrl: Cesium.buildModuleUrl('Widgets/Images/TerrainProviders/CesiumWorldTerrain.png'),
            tooltip: '',
            creationFunction: function () {
                return new Cesium.UrlTemplateImageryProvider({
                    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
                });
            },
        }));

        this._viewLayerProviders.push(new Cesium.ProviderViewModel({
            name: 'ArcGis map',
            iconUrl: Cesium.buildModuleUrl('Widgets/Images/TerrainProviders/CesiumWorldTerrain.png'),
            tooltip: 'Stamen World terrain (Background).\nhttp://www.maps.stamen.com/',
            creationFunction: function () {
                return new Cesium.ArcGisMapServerImageryProvider({
                    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
                });
            },
        }));

        // https://2.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/normal.day/11/525/761/256/png8?apiKey=
        // https://3.aerial.maps.ls.hereapi.com/maptile/2.1/maptile/newest/terrain.day/7/66/45/256/png8?apiKey=

        // https://2.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/{width}/png8?apiKey=
        // 7vMRjLNCpcOAUQXU61eUp6EFbWCy7WLNmy9qLHO-1Bw
        const here1 = 'https://1.';
        const here2 = '.maps.ls.hereapi.com/maptile/2.1/maptile/newest/';
        const here3 = '/{z}/{x}/{y}/{width}/png8?apiKey=';

        this._viewLayerProviders.push(new Cesium.ProviderViewModel({
            name: 'Here map normal',
            iconUrl: Cesium.buildModuleUrl('Widgets/Images/TerrainProviders/CesiumWorldTerrain.png'),
            tooltip: 'Here',
            creationFunction: function (apiKey) {
                return new Cesium.UrlTemplateImageryProvider({
                    url: here1 + 'base' + here2 + 'normal.day' + here3 + apiKey,
                });
            },
        }));

        this._viewLayerProviders.push(new Cesium.ProviderViewModel({
            name: 'Here map normal grey',
            iconUrl: Cesium.buildModuleUrl('Widgets/Images/TerrainProviders/CesiumWorldTerrain.png'),
            tooltip: 'Here',
            creationFunction: function (apiKey) {
                return new Cesium.UrlTemplateImageryProvider({
                    url: here1 + 'base' + here2 + 'normal.day.grey' + here3 + apiKey,
                });
            },
        }));

        this._viewLayerProviders.push(new Cesium.ProviderViewModel({
            name: 'Here map normal traffic',
            iconUrl: Cesium.buildModuleUrl('Widgets/Images/TerrainProviders/CesiumWorldTerrain.png'),
            tooltip: 'Here',
            creationFunction: function (apiKey) {
                return new Cesium.UrlTemplateImageryProvider({
                    url: here1 + 'base' + here2 + 'normal.day.transit' + here3 + apiKey,
                });
            },
        }));

        this._viewLayerProviders.push(new Cesium.ProviderViewModel({
            name: 'Here map normal reduced',
            iconUrl: Cesium.buildModuleUrl('Widgets/Images/TerrainProviders/CesiumWorldTerrain.png'),
            tooltip: 'Here',
            creationFunction: function (apiKey) {
                return new Cesium.UrlTemplateImageryProvider({
                    url: here1 + 'base' + here2 + 'reduced.day' + here3 + apiKey,
                });
            },
        }));

        this._viewLayerProviders.push(new Cesium.ProviderViewModel({
            name: 'Here map normal pedestrian',
            iconUrl: Cesium.buildModuleUrl('Widgets/Images/TerrainProviders/CesiumWorldTerrain.png'),
            tooltip: 'Here',
            creationFunction: function (apiKey) {
                return new Cesium.UrlTemplateImageryProvider({
                    url: here1 + 'base' + here2 + 'pedestrian.day' + here3 + apiKey,
                });
            },
        }));

        this._viewLayerProviders.push(new Cesium.ProviderViewModel({
            name: 'Here map aerial terrain',
            iconUrl: Cesium.buildModuleUrl('Widgets/Images/TerrainProviders/CesiumWorldTerrain.png'),
            tooltip: 'Here',
            creationFunction: function (apiKey) {
                return new Cesium.UrlTemplateImageryProvider({
                    url: here1 + 'aerial' + here2 + 'terrain.day' + here3 + apiKey,
                });
            },
        }));

        this._viewLayerProviders.push(new Cesium.ProviderViewModel({
            name: 'Here map aerial satellite',
            iconUrl: Cesium.buildModuleUrl('Widgets/Images/TerrainProviders/CesiumWorldTerrain.png'),
            tooltip: 'Here',
            creationFunction: function (apiKey) {
                return new Cesium.UrlTemplateImageryProvider({
                    url: here1 + 'aerial' + here2 + 'satellite.day' + here3 + apiKey,
                });
            },
        }));

        this._viewLayerProviders.push(new Cesium.ProviderViewModel({
            name: 'Here map aerial hybrid',
            iconUrl: Cesium.buildModuleUrl('Widgets/Images/TerrainProviders/CesiumWorldTerrain.png'),
            tooltip: 'Here',
            creationFunction: function (apiKey) {
                return new Cesium.UrlTemplateImageryProvider({
                    url: here1 + 'aerial' + here2 + 'hybrid.day' + here3 + apiKey,
                });
            },
        }));

        this._viewLayerProviders.push(new Cesium.ProviderViewModel({
            name: 'Bing Map',
            iconUrl: Cesium.buildModuleUrl('Widgets/Images/TerrainProviders/CesiumWorldTerrain.png'),
            tooltip: 'Bing',
            creationFunction: function (apiKey) {
                return new Cesium.BingMapsImageryProvider({
                    url: 'https://dev.virtualearth.net',
                    key : apiKey,
                    mapStyle : Cesium.BingMapsStyle.AERIAL
                });
            },
        }));
    }

    private _getTerrains() {
        this._viewTerrainProviders.push(new Cesium.ProviderViewModel({
            name: 'Ellipsoid',
            iconUrl: Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/openStreetMap.png'),
            tooltip: 'Ellipsoid Terrain',
            creationFunction: function () {
                return new Cesium.EllipsoidTerrainProvider({});
            },
        }));
        this._viewTerrainProviders.push(new Cesium.ProviderViewModel({
            name: 'Cesium World Terrain',
            iconUrl: Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/stamenToner.png'),
            tooltip: 'Cesium World Terrain',
            creationFunction: Cesium.createWorldTerrain,
        }));
        this._viewTerrainProviders.push(new Cesium.ProviderViewModel({
            name: 'ArcGIS Terrain',
            iconUrl: Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/stamenToner.png'),
            tooltip: 'Cesium World Terrain',
            creationFunction: function () {
                return new Cesium.ArcGISTiledElevationTerrainProvider({
                    url : 'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer'
                });
            },
        }));
    }


    private _createHud(text: string) {
        const div = document.createElement('div');
        div.id = `hud`;
        div.style.position = 'absolute';
        div.style.background = 'rgba(255, 255, 255, 0.3)';
        div.style.padding = '5px';
        div.innerHTML = text;
        div.style.top = '40px';
        div.style.left = '5px';
        div.style.maxWidth = '200px';
        div.style.whiteSpace = 'pre-wrap';
        div.style.fontSize = '14px';
        return {
            element: div
        };
    }

}

