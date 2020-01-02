import { DataThreejs } from '../data/data.threejs';
export class ThreeJSViewerService {
    DataThreejs: DataThreejs;
    initRaycaster(event) {
        const scene = this.DataThreejs;
        const rect = scene._renderer.domElement.getBoundingClientRect();
        scene._mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        scene._mouse.y = - ((event.clientY - rect.top) / rect.height) * 2 + 1;

        scene._raycaster.setFromCamera(scene._mouse, scene._camera);
        const precision = 0.01 * scene._controls.target.distanceTo( scene._controls.object.position );
        scene._raycaster.linePrecision = precision;
        scene._raycaster.params.Points.threshold = precision;
        return scene._raycaster.intersectObjects(scene.sceneObjs);
    }
}
