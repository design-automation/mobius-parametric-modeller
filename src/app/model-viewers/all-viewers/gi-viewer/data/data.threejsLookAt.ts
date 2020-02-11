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
                radius = 10;
            }
        } else if (this._all_objs_sphere) {
            center = this._all_objs_sphere.center;
            radius = this._all_objs_sphere.radius;
            if (radius === 0) {
                radius = 10;
            }
        } else {
            center = this.scene.position;
            radius = 10;
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
        const fov = this.camera.fov * (Math.PI / 180);
        const perspectiveNewPos: THREE.Vector3 = new THREE.Vector3();
        // Find looking direction: current camera position - current control target
        // Scale looking direction to be of length: radius / sin(fov/2)
        // New camera position: scaled looking direction + center
        perspectiveNewPos.subVectors(this.camera.position, this.controls.target);
        perspectiveNewPos.setLength(radius / Math.sin(fov / 2));
        perspectiveNewPos.add(center);

        this.camera.position.copy(perspectiveNewPos);
        this.controls.target.set(center.x, center.y, center.z);
        this.camera.updateProjectionMatrix();
        this.controls.update();

        const textLabels = this.textLabels;
        if (textLabels.size !== 0) {
            textLabels.forEach((label) => {
                label.updatePosition();
            });
        }
    }
}

