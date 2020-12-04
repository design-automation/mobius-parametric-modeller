import { GIModel } from '@libs/geo-info/GIModel';
import { GeoSettings } from '../gi-geo-viewer.settings';
import { EEntType, Txyz, TAttribDataTypes, LONGLAT } from '@libs/geo-info/common';
import * as itowns from 'itowns/dist/itowns';
import { DataService } from '../../gi-viewer/data/data.service';
import * as THREE from 'three';
import { AmbientLight } from 'three';
import * as suncalc from 'suncalc';


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
export class DataGeo {
    public viewer: any;
    // the GI model to display
    public model: GIModel;

    // Geo Settings
    public settings: GeoSettings;
    public attribution: string;

    public container;
    public view;
    public camTarget;
    public viewColorLayers = [];
    public viewElevationLayers = [];

    private latitude;
    private longitude;
    private elevation;
    private scale;

    private lightingCamera;

    /**
     * Constructs a new data subscriber.
     */
    constructor(settings: GeoSettings) {
        this.settings = JSON.parse(JSON.stringify(settings));
        this._getLayers();
        this._getTerrains();
    }

    // matrix points from xyz to long lat
    /**
     *
     */
    public createGeoViewer(threejsScene) {
        this._getLayers();
        this._getTerrains();

        const placement = {
            coord: new itowns.Coordinates('EPSG:4326', LONGLAT[0], LONGLAT[1]),
            range: 1000,
            tilt: 50
        };

        this.lightingCamera = new THREE.Camera();

        this.container = document.getElementById('threejs-geo-container');
        this.view = new itowns.GlobeView(this.container, placement);
        this.view.mainLoop.gfxEngine.renderer.setPixelRatio( window.devicePixelRatio );
        this.view.mainLoop.gfxEngine.renderer.shadowMap.enabled = true;
        this.view.mainLoop.gfxEngine.renderer.shadowMap.type = itowns.THREE.PCFSoftShadowMap;

        this.camTarget = this.view.controls.getLookAtCoordinate();
        // this.viewControl = new itowns.GlobeControls(this.view, this.camTarget, 200);

        // default orbit control:
        // DOLLY: {mouseButton: 1, enable: true}
        // MOVE_GLOBE: {mouseButton: 0, enable: true, finger: 1}
        // NONE: {}
        // ORBIT: {mouseButton: 0, keyboard: 17, enable: true, finger: 2}
        // PAN: {mouseButton: 2, up: 38, bottom: 40, left: 37, right: 39, up: 38}
        // PANORAMIC: {mouseButton: 0, keyboard: 16, enable: true}
        this.view.controls.states.ORBIT = {mouseButton: 0, enable: true, finger: 2};
        // this.view.controls.states.PAN = {mouseButton: 2, bottom: 40, left: 37, right: 39, up: 38, enable: true};
        // this.view.controls.states.MOVE_GLOBE = {mouseButton: 0, keyboard: 17, enable: true, finger: 1};
        this.view.controls.states.PAN = {mouseButton: 0, keyboard: 17, enable: true, finger: 1};
        this.view.controls.states.MOVE_GLOBE = {mouseButton: 2, bottom: 40, left: 37, right: 39, up: 38, enable: true};

        let layerIndex = 0;
        if ( this.settings && this.settings.imagery && this.settings.imagery.layer ) {
            for (let i = 0; i < this.viewColorLayers.length; i++) {
                if (this.viewColorLayers[i].source.attribution.name === this.settings.imagery.layer) {
                    layerIndex = i;
                    break;
                }
            }
        }
        this.view.addLayer(this.viewColorLayers[layerIndex]);

        const attribution_div = document.getElementById('geo-attribution');
        attribution_div.innerHTML = this.viewColorLayers[layerIndex].source.attribution.html;

        let terrainIndex = 0;
        // if ( this.settings && this.settings.imagery && this.settings.imagery.terrain ) {
        //     for (let i = 0; i < this.viewElevationLayers.length; i++) {
        //         if (this.viewElevationLayers[i].source.attribution.name === this.settings.imagery.terrain) {
        //             terrainIndex = i;
        //             break;
        //         }
        //     }
        // }
        if (this.viewElevationLayers[terrainIndex]) {
            this.view.addLayer(this.viewElevationLayers[terrainIndex]);
        }
        // const atmosphere = this.view.getLayerById('atmosphere');
        // atmosphere.setRealisticOn(true);
        const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.15);
        this.view.scene.add(ambientLight);
        const hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFF, 0.15);
        this.view.scene.add(hemiLight);

        if (this.model && threejsScene.model && threejsScene.model === this.model) {
            this.refreshModel(threejsScene);
        }
        this.view.notifyChange();
    }

    onChanges(changes, threejsScene) {
        if (changes.data) {
            if (!threejsScene) { return; }
            if (!this.model) {
                this.removeMobiusObjs();
                return;
            }
            if (!threejsScene.model || threejsScene.model !== this.model) {
                threejsScene.model = this.model;
                threejsScene.populateScene(this.model, null);
            }
            this.refreshModel(threejsScene);
            this.view.notifyChange();
        }
    }

    public updateSettings(settings: GeoSettings = null) {
        let newSetting: GeoSettings;
        if (settings !== null) {
            newSetting = <GeoSettings> JSON.parse(JSON.stringify(settings));
        } else {
            newSetting = <GeoSettings> JSON.parse(localStorage.getItem('geo_settings'));
        }
        if (!newSetting) { return; }
        if (newSetting.imagery) {
            if (newSetting.imagery.layer && this.settings.imagery.layer !== newSetting.imagery.layer) {
                for (const colorLayer of this.viewColorLayers) {
                    if (colorLayer.source.attribution.name === newSetting.imagery.layer) {
                        this.view.removeLayer('ColorLayer');
                        this.view.addLayer(colorLayer);
                        const attribution_div = document.getElementById('geo-attribution');
                        attribution_div.innerHTML = colorLayer.source.attribution.html;
                        // const viewer_layers = this.viewer.imageryLayers;
                        // const newLayer = new Cesium.ImageryLayer(layerProvider.creationCommand(
                        //     this.settings.imagery.apiKey[API_MAPS_KEY_MAPPING[this.settings.imagery.layer]]));
                        // viewer_layers.removeAll();
                        // viewer_layers.add(newLayer);
                        this.settings.imagery.layer = newSetting.imagery.layer;
                    }
                }
            }
            // if (newSetting.imagery.apiKey) {
            //     if (!this.settings.imagery.apiKey) {
            //         this.settings.imagery.apiKey = {};
            //     }
            //     for (const i of Object.keys(newSetting.imagery.apiKey)) {
            //         this.settings.imagery.apiKey[i] = newSetting.imagery.apiKey[i];
            //     }
            // }
            // if (newSetting.imagery.terrain && this.settings.imagery.terrain !== newSetting.imagery.terrain) {
            //     for (const terrainProvider of this.viewElevationLayers) {
            //         if (terrainProvider.name === newSetting.imagery.terrain) {
            //             this.viewer.terrainProvider = terrainProvider.creationCommand();
            //             this.settings.imagery.terrain = newSetting.imagery.terrain;
            //         }
            //     }
            // }
        }
        // if (newSetting.camera) {
        //     if (newSetting.camera.pos) {
        //         this.settings.camera.pos.x = newSetting.camera.pos.x;
        //         this.settings.camera.pos.y = newSetting.camera.pos.y;
        //         this.settings.camera.pos.z = newSetting.camera.pos.z;
        //         this.settings.camera.direction.x = newSetting.camera.direction.x;
        //         this.settings.camera.direction.y = newSetting.camera.direction.y;
        //         this.settings.camera.direction.z = newSetting.camera.direction.z;
        //         this.settings.camera.up.x = newSetting.camera.up.x;
        //         this.settings.camera.up.y = newSetting.camera.up.y;
        //         this.settings.camera.up.z = newSetting.camera.up.z;
        //         this.settings.camera.right.x = newSetting.camera.right.x;
        //         this.settings.camera.right.y = newSetting.camera.right.y;
        //         this.settings.camera.right.z = newSetting.camera.right.z;
        //     }
        // }
        if (newSetting.time) {
            if (newSetting.time.date) {
                this.settings.time.date = newSetting.time.date;
                this.updateLightPos(newSetting.time.date);
            }
        }
        // if (newSetting.model) {
        //     if (newSetting.model.polygonEdge !== this.settings.model.polygonEdge) {
        //         this.settings.model.polygonEdge = newSetting.model.polygonEdge;
        //         setTimeout(() => {
        //             this.addGeometry(this.model, null, false);
        //         }, 0);
        //     }
        // }
        if (newSetting.updated) {
            this.settings.updated = newSetting.updated;
        }
        localStorage.setItem('geo_settings', JSON.stringify(this.settings));
    }

    removeMobiusObjs() {
        let i = 0;
        while (i < this.view.scene.children.length) {
            const scene_obj = this.view.scene.children[i];
            if (scene_obj.name.startsWith('mobius')) {
                this.view.scene.children.splice(i, 1);
            } else {
                i++;
            }
        }
    }

    refreshModel(threejsScene) {
        this.removeMobiusObjs();
        const threeJSGroup = new itowns.THREE.Group();
        threeJSGroup.name = 'mobius_geom';


        for (const i of threejsScene.scene.children) {
            if (i.name.startsWith('obj_')) {
                threeJSGroup.add(i.clone());
            }
        }

        this.longitude = LONGLAT[0];
        this.latitude = LONGLAT[1];
        this.elevation = 0;
        if (this.model.modeldata.attribs.query.hasModelAttrib('geolocation')) {
            const geoloc: any = this.model.modeldata.attribs.get.getModelAttribVal('geolocation');
            const long_value: TAttribDataTypes  = geoloc.longitude;
            if (typeof long_value !== 'number') {
                throw new Error('Longitude attribute must be a number.');
            }
            this.longitude = long_value as number;
            if (this.longitude < -180 || this.longitude > 180) {
                throw new Error('Longitude attribute must be between -180 and 180.');
            }
            const lat_value: TAttribDataTypes = geoloc.latitude;
            if (typeof lat_value !== 'number') {
                throw new Error('Latitude attribute must be a number');
            }
            this.latitude = lat_value as number;
            if (this.latitude < 0 || this.latitude > 90) {
                throw new Error('Latitude attribute must be between 0 and 90.');
            }
            if (geoloc.elevation) {
                const ele_value: TAttribDataTypes = geoloc.elevation;
                if (typeof ele_value !== 'number') {
                    throw new Error('Elevation attribute must be a number');
                }
                this.elevation = ele_value as number;
            }
        }

        this.camTarget = new itowns.Coordinates('EPSG:4326', this.longitude, this.latitude, this.elevation);

        const camTarget = this.camTarget.clone();
        camTarget.altitude += 2;
        const cameraTargetPosition = camTarget.as(this.view.referenceCrs);

        threeJSGroup.position.copy(cameraTargetPosition);
        threeJSGroup.position.z += 0.1;
        threeJSGroup.lookAt(new THREE.Vector3(0, 0, 0));
        threeJSGroup.rotateY(Math.PI);

        // if there's a north attribute
        if (this.model.modeldata.attribs.query.hasModelAttrib('north')) {

            // get north attribute
            const north_dir: any = this.model.modeldata.attribs.get.getModelAttribVal('north');

            if (north_dir.constructor === [].constructor && north_dir.length === 2) {
                // make the north vector and the default north vector
                const north_cartesian = new THREE.Vector3(north_dir[0], north_dir[1], 0);
                const model_cartesian = new THREE.Vector3(0, 1, 0);

                // const angle = north_cartesian.angleTo(model_cartesian);
                threeJSGroup.rotateZ(north_cartesian.angleTo(model_cartesian));
            }
        }


        threeJSGroup.updateMatrixWorld();
        this.view.scene.add(threeJSGroup);

        // this._addGround(threejsScene, cameraTargetPosition);

        this.scale = threejsScene._all_objs_sphere.radius;

        const lightTarget = new THREE.Object3D();
        lightTarget.name = 'mobius_lightTarget';
        lightTarget.position.copy(cameraTargetPosition);
        lightTarget.updateMatrixWorld();
        this.view.scene.add(lightTarget);

        this.updateLightPos(this.settings.time.date, lightTarget);

        // this.view.scene.add(lighting);
        this.lookAtObj(threejsScene);
    }

    public updateLightPos(time, lightTarget?) {
        if (!lightTarget) {
            for (const childObj of this.view.scene.children) {
                if (childObj.name === 'mobius_lightTarget') {
                    lightTarget = childObj;
                    break;
                }
            }
        }
        const lightingTime = new Date(time);
        const lightingPos = suncalc.getPosition(lightingTime, this.latitude, this.longitude);

        const lighting = this.view.scene.children[0].children[0]
        // const lighting = new itowns.THREE.DirectionalLight(0xFFFFFF, 1);
        // lighting.name = 'mobius_lighting';
        // this.getDLPosition(distance);
        lighting.castShadow = true;
        lighting.visible = true;
        lighting.shadow.mapSize.width = 2048;  // default
        lighting.shadow.mapSize.height = 2048; // default
        lighting.shadow.camera.near = 0.5;
        lighting.shadow.camera.far = this.scale * 20;
        lighting.shadow.bias = -0.0004;

        const tilt = lightingPos.altitude * 180 / Math.PI;

        const cam = <THREE.OrthographicCamera> lighting.shadow.camera;
        itowns.CameraUtils.transformCameraToLookAtTarget(this.view, cam, {
            coord: this.camTarget,
            tilt: tilt,
            heading: lightingPos.azimuth * 180 / Math.PI,
            // tilt: 45,
            // heading: -90,
            range: this.scale
        });
        if (tilt < 0) {
            lighting.intensity = 0;
        } else {
            lighting.intensity = 1;
        }
        console.log('tilt:', lightingPos.altitude * 180 / Math.PI, 'heading:', lightingPos.azimuth * 180 / Math.PI )

        // lighting.matrix.copy(this.lightingCamera.matrix);
        // lighting.matrixWorld.copy(this.lightingCamera.matrixWorld);
        lighting.position.copy(cam.position);
        lighting.target = lightTarget;
        // camTarget.altitude = scale * 1.5;
        // lighting.position.copy(camTarget.as(this.view.referenceCrs));
        cam.up.set(0, 0, 1);
        cam.left = -this.scale;
        cam.right = this.scale;
        cam.top = this.scale;
        cam.bottom = -this.scale;

        lighting.updateMatrixWorld();

    }
    private _addGround(threejsScene, groundPos) {
        console.log(threejsScene._all_objs_sphere)
        const geometry = new THREE.PlaneBufferGeometry( threejsScene._all_objs_sphere.radius * 5, threejsScene._all_objs_sphere.radius * 5, 32, 32);

        const material = new THREE.ShadowMaterial({
            opacity: 1
        });
        // const material = new THREE.MeshPhongMaterial({
        //     color: new THREE.Color(0xffffff),
        //     transparent: true,
        //     shininess: 0
        // });
        // material.opacity = 0.3;

        const plane = new THREE.Mesh( geometry, material );
        plane.name = 'mobius_ground';
        plane.position.copy(groundPos);
        plane.position.z += 0.1;
        plane.receiveShadow = true;
        plane.lookAt(new THREE.Vector3(0, 0, 0));
        plane.rotateY(Math.PI);

        plane.updateMatrixWorld();
        this.view.scene.add(plane);
    }


    // PRIVATE METHODS
    private _getLayers() {
        this.viewColorLayers = [];
        this.viewColorLayers.push(new itowns.ColorLayer('ColorLayer', {
            source: new itowns.TMSSource({
                name: 'OpenStreetMap',
                projection: 'EPSG:3857',
                format: 'image/png',
                url: 'https://a.tile.openstreetmap.org/${z}/${x}/${y}.png',
                attribution: {
                    name: 'Open Street Map',
                    html: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                },
                tileMatrixSet: 'PM',
                zoom: {
                    min: 0,
                    max: 19
                }
            })
        }));

        this.viewColorLayers.push(new itowns.ColorLayer('ColorLayer', {
            source: new itowns.TMSSource({
                name: 'OpenTopoMap',
                projection: 'EPSG:3857',
                format: 'image/png',
                url: 'https://a.tile.opentopomap.org/${z}/${x}/${y}.png',
                attribution: {
                    name: 'Open Topo Map',
                    html: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
                },
                tileMatrixSet: 'PM',
                zoom: {
                    min: 0,
                    max: 17
                }
            })
        }));

        this.viewColorLayers.push(new itowns.ColorLayer('ColorLayer', {
            source: new itowns.TMSSource({
                name: 'Stamen Toner',
                projection: 'EPSG:3857',
                format: 'image/png',
                url: 'https://stamen-tiles.a.ssl.fastly.net/toner/${z}/${x}/${y}.png',
                attribution: {
                    name: 'Stamen Toner',
                    html: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                },
                tileMatrixSet: 'PM'
            })
        }));
        this.viewColorLayers.push(new itowns.ColorLayer('ColorLayer', {
            source: new itowns.TMSSource({
                name: 'Stamen Terrain',
                projection: 'EPSG:3857',
                format: 'image/png',
                url: 'https://stamen-tiles.a.ssl.fastly.net/terrain/${z}/${x}/${y}.png',
                attribution: {
                    name: 'Stamen Terrain',
                    html: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                },
                tileMatrixSet: 'PM',
                zoom: {
                    min: 0,
                    max: 18
                }
            })
        }));
        this.viewColorLayers.push(new itowns.ColorLayer('ColorLayer', {
            source: new itowns.TMSSource({
                name: 'Stamen Watercolor',
                projection: 'EPSG:3857',
                format: 'image/png',
                url: 'https://stamen-tiles.a.ssl.fastly.net/watercolor/${z}/${x}/${y}.png',
                attribution: {
                    name: 'Stamen Watercolor',
                    html: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                },
                tileMatrixSet: 'PM',
                zoom: {
                    min: 1,
                    max: 16
                }
            })
        }));
        this.viewColorLayers.push(new itowns.ColorLayer('ColorLayer', {
            source: new itowns.WMTSSource({
                name: 'ArcGIS Terrain',
                projection: 'EPSG:3857',
                format: 'image/jpg',
                url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/',
                attribution: {
                    name: 'ArcGIS Terrain',
                    html: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                },
                tileMatrixSet: 'PM'
            })
        }));

        this.viewColorLayers.push(new itowns.ColorLayer('ColorLayer', {
            source: new itowns.TMSSource({
                name: 'Google Map - Roadmap',
                projection: 'EPSG:3857',
                format: 'image/jpg',
                url: 'https://mt1.google.com/vt/lyrs=m&x=${x}&y=${y}&z=${z}',
                attribution: {
                    name: 'Google Map - Roadmap',
                    html: 'Map data ©2019 <a href="https://www.google.com/">Google</a>',
                },
                tileMatrixSet: 'PM',
            })
        }));
        this.viewColorLayers.push(new itowns.ColorLayer('ColorLayer', {
            source: new itowns.TMSSource({
                name: 'Google Map - Altered Roadmap',
                projection: 'EPSG:3857',
                format: 'image/jpg',
                url: 'https://mt1.google.com/vt/lyrs=r&x=${x}&y=${y}&z=${z}',
                attribution: {
                    name: 'Google Map - Altered Roadmap',
                    html: 'Map data ©2019 <a href="https://www.google.com/">Google</a>',
                },
                tileMatrixSet: 'PM',
            })
        }));
        this.viewColorLayers.push(new itowns.ColorLayer('ColorLayer', {
            source: new itowns.TMSSource({
                name: 'Google Map - Satellite Only',
                projection: 'EPSG:3857',
                format: 'image/jpg',
                url: 'https://mt1.google.com/vt/lyrs=s&x=${x}&y=${y}&z=${z}',
                attribution: {
                    name: 'Google Map - Satellite Only',
                    html: 'Map data ©2019 <a href="https://www.google.com/">Google</a>',
                },
                tileMatrixSet: 'PM',
            })
        }));
        this.viewColorLayers.push(new itowns.ColorLayer('ColorLayer', {
            source: new itowns.TMSSource({
                name: 'Google Map - Hybrid',
                projection: 'EPSG:3857',
                format: 'image/jpg',
                url: 'https://mt1.google.com/vt/lyrs=y&x=${x}&y=${y}&z=${z}',
                attribution: {
                    name: 'Google Map - Hybrid',
                    html: 'Map data ©2019 <a href="https://www.google.com/">Google</a>',
                },
                tileMatrixSet: 'PM',
            })
        }));


        const here1 = 'https://1.';
        const here2 = '.maps.ls.hereapi.com/maptile/2.1/maptile/newest/';
        const here3 = '/{z}/{x}/{y}/{width}/png8?apiKey=';


    }

    private _getTerrains() {
        this.viewElevationLayers = [];
        this.viewElevationLayers.push(null);
        this.viewElevationLayers.push(new itowns.ElevationLayer('ElevationLayer', {
            source: new itowns.WMTSSource({
                projection: 'EPSG:3857',
                url: 'http://wxs.ign.fr/3ht7xcw6f7nciopo16etuqp2/geoportail/wmts',
                name: 'Elevation',
                tileMatrixSet: 'WGS84G',
                format: 'image/x-bil;bits=32',
                attribution: {
                    name: 'Elevation'
                }
            })
        }));
    }

    public lookAtObj(threejsScene) {
        let center = null;
        let radius = null;
        if (threejsScene._all_objs_sphere) {
            center = threejsScene._all_objs_sphere.center;
            radius = threejsScene._all_objs_sphere.radius;
            if (radius < 200) {
                radius = 200;
            }
        } else {
            center = threejsScene.scene.position;
            radius = 200;
        }

        this._cameraLookat(center, radius);
    }

    private _cameraLookat(center, radius = 100) {
        itowns.CameraUtils.transformCameraToLookAtTarget(this.view, this.view.camera.camera3D, {
            coord: this.camTarget,
            tilt: 50,
            heading: 0,
            range: radius * 5
        });
        this.view.notifyChange();
    }

}

