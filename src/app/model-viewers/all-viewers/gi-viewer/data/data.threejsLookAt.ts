import * as THREE from 'three';
import { DataService } from '@services';
import { ISettings } from './data.threejsSettings';
import { DataThreejsSelect } from './data.threejsSelect';

/**
 * ThreejsScene Look At
 */
export class DataThreejsLookAt extends DataThreejsSelect {

    /**
     * Constructor
     */
    constructor(settings: ISettings, dataService: DataService) {
        super(settings, dataService);
    }
    /**
     *
     */
    public lookAtObj() {
        const selectedObjs = this._getSelectedObjs();
        let center = null;
        let radius = null;
        if (selectedObjs) {
            center = selectedObjs.center;
            radius = selectedObjs.radius;
            if (radius === 0) {
                radius = 50;
            }
        } else if (this._all_objs_sphere) {
            center = this._all_objs_sphere.center;
            radius = this._all_objs_sphere.radius;
            if (radius === 0) {
                radius = 50;
            }
        } else {
            center = this.scene.position;
            radius = 50;
        }

        this._cameraLookat(center, radius);
    }
    // ============================================================================
    // Private methods
    // ============================================================================
    /**
     *
     */
    private _getSelectedObjs() {
        if (this.scene_objs_selected.size !== 0) {
            const objs = new THREE.Object3D();
            this.scene_objs_selected.forEach(obj => objs.children.push(obj));
            const boxHelper = new THREE.BoxHelper(objs);
            boxHelper.geometry.computeBoundingSphere();
            const boundingSphere = boxHelper.geometry.boundingSphere;
            return boundingSphere;
        } else {
            return null;
        }
    }
    /**
     *
     * @param center
     * @param radius
     */
    private _cameraLookat(center, radius = 100) {
        const fov = this.perspCam.fov * (Math.PI / 180);
        const perspectiveNewPos: THREE.Vector3 = new THREE.Vector3();
        // Find looking direction: current camera position - current control target
        // Scale looking direction to be of length: radius / sin(fov/2)
        // New camera position: scaled looking direction + center
        perspectiveNewPos.subVectors(this.perspCam.position, this.perspControls.target);
        perspectiveNewPos.setLength(radius / Math.sin(fov / 2));
        perspectiveNewPos.add(center);

        this.perspCam.position.copy(perspectiveNewPos);
        this.perspControls.target.set(center.x, center.y, center.z);
        this.perspCam.updateProjectionMatrix();
        this.perspControls.update();

        const textLabels = this.textLabels;
        if (textLabels.size !== 0) {
            textLabels.forEach((label) => {
                label.updatePosition();
            });
        }
    }

    public orthoLookatObj() {
        if (this.currentCamera === 'Top') {
            this._orthoLookat(0, 0, 1);
        } else if (this.currentCamera === 'Left') {
            this._orthoLookat(-1, 0, 0);
        } else if (this.currentCamera === 'Front') {
            this._orthoLookat(0, -1, 0);
        }
    }

    private _orthoLookat(dirX: number, dirY: number, dirZ: number) {
        const selectedObjs = this._getSelectedObjs();
        let center = null;
        let radius = null;
        if (selectedObjs) {
            center = selectedObjs.center;
            radius = selectedObjs.radius;
            if (radius === 0) {
                radius = 50;
            }
        } else if (this._all_objs_sphere) {
            center = this._all_objs_sphere.center;
            radius = this._all_objs_sphere.radius;
            if (radius === 0) {
                radius = 50;
            }
        } else {
            center = new THREE.Vector3();
            radius = 50;
        }

        const posVec = new THREE.Vector3(center.x + 1.5 * dirX * radius,
                                         center.y + 1.5 * dirY * radius,
                                         center.z + 1.5 * dirZ * radius);
        this.orthoCam.left = - radius * this.orthoCam.right / this.orthoCam.top;
        this.orthoCam.right = radius * this.orthoCam.right / this.orthoCam.top;
        this.orthoCam.top = radius;
        this.orthoCam.bottom = -radius;
        this.orthoCam.zoom = 1;

        this.orthoCam.position.copy(posVec);
        this.orthoControls.target.copy(new THREE.Vector3(posVec.x * (1 - Math.abs(dirX)),
                                    posVec.y * (1 - Math.abs(dirY)),
                                    posVec.z * (1 - Math.abs(dirZ))));
        this.orthoCam.updateProjectionMatrix();
        this.orthoControls.update();
    }

    updateCameraFOV() {
        const selectedObjs = this._getSelectedObjs();
        let center = null;
        let radius = null;
        if (selectedObjs) {
            center = selectedObjs.center;
            radius = selectedObjs.radius;
            if (radius === 0) {
                radius = 50;
            }
        } else if (this._all_objs_sphere) {
            center = this._all_objs_sphere.center;
            radius = this._all_objs_sphere.radius;
            if (radius === 0) {
                radius = 50;
            }
        } else {
            center = new THREE.Vector3();
            radius = 50;
        }
        this.orthoCam.left = - radius * this.orthoCam.right / this.orthoCam.top;
        this.orthoCam.right = radius * this.orthoCam.right / this.orthoCam.top;
        this.orthoCam.top = radius;
        this.orthoCam.bottom = -radius;

        if (this.currentCamera === 'Top') {
            this.orthoCam.position.z = center.z + 1.5 * radius;
        } else if (this.currentCamera === 'Left') {
            this.orthoCam.position.x =  center.x - 1.5 * radius;
        } else if (this.currentCamera === 'Front') {
            this.orthoCam.position.y =  center.y - 1.5 * radius;
        }

    }

    switchCamera(switchCam = true) {
        if (switchCam) {
            if (this.currentCamera !== 'Persp') {
                this.orthoCamPos[this.currentCamera] = {
                    position: new THREE.Vector3().copy(this.orthoCam.position),
                    target: new THREE.Vector3().copy(this.orthoControls.target),
                    zoom: this.orthoCam.zoom,
                };
            }
            if (this.currentCamera === 'Persp') {
                this.currentCamera = 'Top';
            } else if (this.currentCamera === 'Top') {
                this.currentCamera = 'Left';
            } else if (this.currentCamera === 'Left') {
                this.currentCamera = 'Front';
            } else if (this.currentCamera === 'Front') {
                this.currentCamera = 'Persp';
            }
            if (this.cameraBackgrounds) {
                this.scene.background = this.cameraBackgrounds[this.currentCamera];
            }
        }
        if (this.currentCamera === 'Persp') {
            this.orthoControls.enabled = false;
            this.perspControls.enabled = true;
            this.camera = this.perspCam;
            this.controls = this.perspControls;
            this.perspControls.update();
            this.orthoControls.update();
        } else {
            this.perspControls.enabled = false;
            this.orthoControls.enabled = true;
            this.camera = this.orthoCam;
            this.controls = this.orthoControls;
            if (this.orthoCamPos[this.currentCamera]) {
                const camPos = this.orthoCamPos[this.currentCamera];
                this.orthoCam.position.copy(camPos.position);
                this.orthoCam.zoom = camPos.zoom;
                this.orthoControls.target.copy(camPos.target);
                this.updateCameraFOV();
                this.orthoCam.updateProjectionMatrix();
            } else {
                if (this.currentCamera === 'Top') {
                    this._orthoLookat(0, 0, 1);
                } else if (this.currentCamera === 'Left') {
                    this._orthoLookat(-1, 0, 0);
                } else if (this.currentCamera === 'Front') {
                    this._orthoLookat(0, -1, 0);
                }
            }
            this.perspControls.update();
            this.orthoControls.update();
        }
    }
}

