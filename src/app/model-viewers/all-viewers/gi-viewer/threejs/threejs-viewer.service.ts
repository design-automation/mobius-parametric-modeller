import { DataThreejs } from '../data/data.threejs';
export class ThreeJSViewerService {
    DataThreejs: DataThreejs;
    initRaycaster(event) {
        const scene = this.DataThreejs;
        const rect = scene._renderer.domElement.getBoundingClientRect();
        scene._mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        scene._mouse.y = - ((event.clientY - rect.top) / rect.height) * 2 + 1;
        scene._raycaster.setFromCamera(scene._mouse, scene._camera);
        return scene._raycaster.intersectObjects(scene.sceneObjs);
    }
}
