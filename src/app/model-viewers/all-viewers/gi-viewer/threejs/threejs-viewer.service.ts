import { DataThreejs } from '../data/data.threejs';
export class ThreeJSViewerService {
    DataThreejs: DataThreejs;
    initRaycaster(event) {
        const scene = this.DataThreejs;
        scene._mouse.x = (event.offsetX / scene._renderer.domElement.clientWidth) * 2 - 1;
        scene._mouse.y = - (event.offsetY / scene._renderer.domElement.clientHeight) * 2 + 1;
        scene._raycaster.setFromCamera(scene._mouse, scene._camera);
        return scene._raycaster.intersectObjects(scene.sceneObjs);
    }
}
