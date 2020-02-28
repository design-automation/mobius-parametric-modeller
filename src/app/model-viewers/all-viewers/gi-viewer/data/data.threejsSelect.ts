import * as THREE from 'three';
import { DataService } from '@services';
import { ISettings } from './data.threejsSettings';
import { DataThreejsBase } from './data.threejsBase';

enum objType {
    point = 'point',
    line = 'line',
    face = 'face'
}

/**
 * ThreejsScene Select
 */
export class DataThreejsSelect extends DataThreejsBase {
    /**
     * Constructor
     */
    constructor(settings: ISettings, dataService: DataService) {
        super(settings, dataService);
    }
    /**
     *
     * @param ent_id
     * @param triangle_i
     * @param positions
     * @param container
     * @param label
     */
    public selectObjFace(ent_id: string,
        tris_i: number[],
        positions: number[],
        container,
        labelText = null) {

        if (this.selected_geoms.has(ent_id)) {
            return;
        }
        const geom = new THREE.BufferGeometry();
        geom.setIndex(tris_i);
        geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geom.setAttribute('normal', new THREE.Float32BufferAttribute(Array(positions.length).fill(0), 3));
        geom.setAttribute('color', new THREE.Float32BufferAttribute(Array(positions.length).fill(0), 3));
        geom.clearGroups();
        geom.addGroup(0, tris_i.length, 0);
        geom.addGroup(0, tris_i.length, 1);
        const colorf = new THREE.Color(parseInt(this.settings.colors.face_f_s.replace('#', '0x'), 16));
        const colorb = new THREE.Color(parseInt(this.settings.colors.face_b_s.replace('#', '0x'), 16));
        const matf = new THREE.MeshPhongMaterial({
            specular: 0x000000,
            emissive: 0x000000,
            color: colorf,
            shininess: 0,
            side: THREE.FrontSide
        });
        const matb = new THREE.MeshPhongMaterial({
            specular: 0x000000,
            emissive: 0x000000,
            color: colorb,
            shininess: 0,
            side: THREE.BackSide
        });
        const mesh = new THREE.Mesh(geom, [matf, matb]);
        mesh.geometry.computeBoundingSphere();
        mesh.geometry.computeVertexNormals();
        this.scene.add(mesh);
        this.selected_geoms.set(ent_id, mesh.id);
        this.scene_objs_selected.set(ent_id, mesh);
        if (labelText) {
            const obj: { entity: THREE.Mesh, type: string, text: string } = { entity: mesh, type: objType.face, text: labelText };
            this.createLabelforObj(container, obj.entity, obj.type, labelText, ent_id);
            this.ObjLabelMap.set(ent_id, obj);
        }
    }
    /**
     *
     * @param ent_id
     * @param indices
     * @param positions
     * @param container
     * @param labelText
     */
    public selectObjLine(ent_id: string, indices, positions, container, labelText = null) {
        if (this.selected_geoms.has(ent_id)) {
            return;
        }
        const bg = this.initBufferLine(positions, indices, [255, 0, 0]);
        const line = new THREE.LineSegments(bg.geom, bg.mat);
        this.scene.add(line);
        this.selected_geoms.set(ent_id, line.id);
        this.scene_objs_selected.set(ent_id, line);

        if (labelText) {
            const obj: { entity: THREE.LineSegments, type: string, text: string } = { entity: line, type: objType.line, text: labelText };
            this.createLabelforObj(container, obj.entity, obj.type, labelText, ent_id);
            this.ObjLabelMap.set(ent_id, obj);
        }
    }
    /**
     *
     * @param parent_ent_id
     * @param ent_id
     * @param indices
     * @param positions
     * @param container
     * @param labelText
     */
    public selectEdgeByFace(parent_ent_id: string, ent_id: string, indices, positions, container, labelText = null) {
        const bg = this.initBufferLine(positions, indices, [255, 0, 0]);
        if (this.selected_face_edges.get(parent_ent_id) === undefined) {
            this.selected_face_edges.set(parent_ent_id, new Map());
        }

        const check_exist: string[] = [];
        this.selected_face_edges.forEach(v => {
            v.forEach((vv, k) => {
                check_exist.push(k);
            });
        });

        this.selected_geoms.forEach((v, k) => {
            check_exist.push(k);
        });

        if (!check_exist.includes(ent_id)) {
            const line = new THREE.LineSegments(bg.geom, bg.mat);
            this.scene.add(line);
            this.selected_face_edges.get(parent_ent_id).set(ent_id, line.id);
            this.selected_geoms.set(ent_id, line.id);
            this.scene_objs_selected.set(ent_id, line);
            if (labelText) {
                const obj: {
                    entity: THREE.LineSegments,
                    type: string,
                    text: string
                } = {
                    entity: line,
                    type: objType.line,
                    text: labelText
                };
                this.createLabelforObj(container, obj.entity, obj.type, labelText, ent_id);
                this.ObjLabelMap.set(ent_id, obj);
            }
        }
    }
    /**
     *
     * @param parent_ent_id
     * @param ent_id
     * @param indices
     * @param positions
     * @param container
     * @param labelText
     */
    public selectWireByFace(parent_ent_id: string, ent_id: string, indices, positions, container, labelText = null) {
        const bg = this.initBufferLine(positions, indices, [255, 0, 0]);
        if (this.selected_face_wires.get(parent_ent_id) === undefined) {
            this.selected_face_wires.set(parent_ent_id, new Map());
        }

        const check_exist: string[] = [];
        this.selected_face_wires.forEach(v => {
            v.forEach((vv, k) => {
                check_exist.push(k);
            });
        });

        this.selected_geoms.forEach((v, k) => {
            check_exist.push(k);
        });

        if (!check_exist.includes(ent_id)) {
            const line = new THREE.LineSegments(bg.geom, bg.mat);
            this.scene.add(line);
            this.selected_face_wires.get(parent_ent_id).set(ent_id, line.id);
            this.selected_geoms.set(ent_id, line.id);
            this.scene_objs_selected.set(ent_id, line);
            if (labelText) {
                const obj: {
                    entity: THREE.LineSegments,
                    type: string,
                    text: string
                } = {
                    entity: line,
                    type: objType.line,
                    text: labelText
                };
                this.createLabelforObj(container, obj.entity, obj.type, labelText, ent_id);
                this.ObjLabelMap.set(ent_id, obj);
            }
        }
    }
    /**
     *
     * @param ent_id
     * @param point_indices
     * @param positions
     * @param container
     * @param labelText
     */
    public selectObjPoint(ent_id: string = null, point_indices, positions, container, labelText = null) {
        if (this.selected_geoms.has(ent_id)) {
            return;
        }
        const bg = this.initBufferPoint(positions, point_indices, null, '#ff0000');
        const point = new THREE.Points(bg.geom, bg.mat);
        this.scene.add(point);
        this.selected_geoms.set(ent_id, point.id);
        this.scene_objs_selected.set(ent_id, point);
        if (labelText) {
            const obj: { entity: THREE.Points, type: string, text: string } = { entity: point, type: objType.point, text: labelText };
            this.createLabelforObj(container, obj.entity, obj.type, labelText, ent_id);
            this.ObjLabelMap.set(ent_id, obj);
        }
    }
    /**
     *
     * @param parent_ent_id
     * @param ent_id
     * @param positions
     * @param container
     * @param labelText
     */
    public selectObjPosition(parent_ent_id: string, ent_id: string, positions, container, labelText = null) {
        const bg = this.initBufferPoint(positions, null, null, this.settings.colors.position_s, this.settings.positions.size + 0.1);
        if (parent_ent_id === null) {
            const point = new THREE.Points(bg.geom, bg.mat);
            this.scene.add(point);
            this.selected_geoms.set(ent_id, point.id);
            this.scene_objs_selected.set(ent_id, point);
            if (labelText) {
                const obj: {
                    entity: THREE.Points,
                    type: string,
                    text: string
                } = {
                    entity: point,
                    type: objType.point,
                    text: labelText
                };
                this.createLabelforObj(container, obj.entity, obj.type, labelText, ent_id);
                this.ObjLabelMap.set(ent_id, obj);
            }
        } else {
            if (this.selected_positions.get(parent_ent_id) === undefined) {
                this.selected_positions.set(parent_ent_id, new Map());
            }

            const check_exist: string[] = [];
            this.selected_positions.forEach(v => {
                v.forEach((vv, k) => {
                    check_exist.push(k);
                });
            });

            if (!check_exist.includes(ent_id)) {
                const point = new THREE.Points(bg.geom, bg.mat);
                this.scene.add(point);
                this.selected_positions.get(parent_ent_id).set(ent_id, point.id);
                this.selected_geoms.set(ent_id, point.id);
                this.scene_objs_selected.set(ent_id, point);
                if (labelText) {
                    const obj: {
                        entity: THREE.Points,
                        type: string,
                        text: string
                    } = {
                        entity: point,
                        type: objType.point,
                        text: labelText
                    };
                    this.createLabelforObj(container, obj.entity, obj.type, labelText, ent_id);
                    this.ObjLabelMap.set(ent_id, obj);
                }
            }
        }
    }
    /**
     *
     * @param parent_ent_id
     * @param ent_id
     * @param positions
     * @param container
     * @param labelText
     */
    public selectObjvertex(parent_ent_id: string, ent_id: string, positions, container, labelText = null) {
        const bg = this.initBufferPoint(positions, null, null, this.settings.colors.vertex_s, this.settings.positions.size + 0.1);
        if (parent_ent_id === null) {
            const point = new THREE.Points(bg.geom, bg.mat);
            this.scene.add(point);
            this.scene_objs_selected.set(ent_id, point);
            this.selected_geoms.set(ent_id, point.id);
            if (labelText) {
                const obj: {
                    entity: THREE.Points,
                    type: string,
                    text: string
                } = {
                    entity: point,
                    type: objType.point,
                    text: labelText
                };
                this.createLabelforObj(container, obj.entity, obj.type, labelText, ent_id);
                this.ObjLabelMap.set(ent_id, obj);
            }
        } else {
            if (this.selected_vertex.get(parent_ent_id) === undefined) {
                this.selected_vertex.set(parent_ent_id, new Map());
            }

            const check_exist: string[] = [];
            this.selected_vertex.forEach(v => {
                v.forEach((vv, k) => {
                    check_exist.push(k);
                });
            });

            if (!check_exist.includes(ent_id)) {
                const point = new THREE.Points(bg.geom, bg.mat);
                this.scene.add(point);
                this.selected_vertex.get(parent_ent_id).set(ent_id, point.id);
                this.scene_objs_selected.set(ent_id, point);
                this.selected_geoms.set(ent_id, point.id);
                if (labelText) {
                    const obj: {
                        entity: THREE.Points,
                        type: string,
                        text: string
                    } = {
                        entity: point,
                        type: objType.point,
                        text: labelText
                    };
                    this.createLabelforObj(container, obj.entity, obj.type, labelText, ent_id);
                    this.ObjLabelMap.set(ent_id, obj);
                }
            }
        }
    }
    /**
     *
     * @param container
     * @param obj
     * @param type
     * @param labelText
     * @param ent_id
     */
    public createLabelforObj(container, obj, type: string, labelText: string, ent_id: string) {
        const label = this._createTextLabel(container, type, labelText, ent_id);
        label.setHTML(labelText);
        label.setParent(obj);
        this.textLabels.set(label.element.id, label);
        container.appendChild(label.element);
        label.updatePosition();
    }
    /**
     *
     * @param ent_id
     * @param container
     */
    public unselectObj(ent_id, container) {
        const removing = this.scene.getObjectById(this.selected_geoms.get(ent_id)) ;
        // remove Geom from scene
        if (removing && removing.hasOwnProperty('dispose')) { removing['dispose'](); }
        this.scene.remove(removing);
        this.selected_geoms.delete(ent_id);
        // remove Geom from selected Objs Map
        this.scene_objs_selected.delete(ent_id);

        this.ObjLabelMap.delete(ent_id);
        if (document.getElementById(`textLabel_${ent_id}`)) {
            container.removeChild(document.getElementById(`textLabel_${ent_id}`));
        }
    }
    /**
     *
     * @param parent_ent_id
     * @param container
     * @param group
     */
    public unselectObjGroup(parent_ent_id, container, group) {
        let removing;
        if (group === 'positions') {
            removing = this.selected_positions.get(parent_ent_id);
        } else if (group === 'vertex') {
            removing = this.selected_vertex.get(parent_ent_id);
        } else if (group === 'face_edges') {
            // get the removing first
            removing = this.selected_face_edges.get(parent_ent_id);
        } else if (group === 'face_wires') {
            removing = this.selected_face_wires.get(parent_ent_id);
        }
        // remove positions from scene
        removing.forEach((v, k) => {
            this.scene.remove(this.scene.getObjectById(v));
            this.ObjLabelMap.delete(k);
            if (document.getElementById(`textLabel_${k}`)) {
                container.removeChild(document.getElementById(`textLabel_${k}`));
            }
        });
        if (group === 'positions') {
            // then delete
            this.selected_positions.delete(parent_ent_id);
        } else if (group === 'vertex') {
            this.selected_vertex.delete(parent_ent_id);
        } else if (group === 'face_edges') {
            this.selected_face_edges.delete(parent_ent_id);
        } else if (group === 'face_wires') {
            this.selected_face_wires.delete(parent_ent_id);
        }
    }

    // ============================================================================
    // ============================================================================
    // Private methods
    // ============================================================================
    // ============================================================================
    /**
     *
     * @param positions
     * @param indices
     * @param colors
     */
    private initBufferLine(positions, indices: number[], colors: [number, number, number]) {
        const geom = new THREE.BufferGeometry();
        if (indices.length > 2) {
            geom.setIndex(indices);
        } else {
            geom.setIndex([0, 1]);
        }
        // geom.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        // geom.addAttribute('normal', new THREE.Float32BufferAttribute(Array(positions.length).fill(0), 3));
        geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geom.setAttribute('normal', new THREE.Float32BufferAttribute(Array(positions.length).fill(0), 3));
        const rgb = `rgb(${colors.toString()})`;
        const mat = new THREE.LineBasicMaterial({
            color: new THREE.Color(rgb),
            linewidth: 5,
            linecap: 'round', // ignored by WebGLRenderer
            linejoin: 'round' // ignored by WebGLRenderer
        });
        const bg = { geom, mat };
        return bg;
    }
    /**
     *
     * @param positions
     * @param point_indices
     * @param colors
     * @param color
     * @param size
     */
    private initBufferPoint(positions: number[],
        point_indices = null,
        colors: number[] = null,
        color: string,
        size: number = 1) {
        // TODO check color and colors
        const geom = new THREE.BufferGeometry();
        if (point_indices) {
            geom.setIndex(point_indices);
        }
        // geom.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        const color_rgb = new THREE.Color(parseInt(color.replace('#', '0x'), 16));
        if (colors) {
            // geom.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
            geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        } else {
            let color_data;
            if (positions) {
                if (positions && positions.length < 3) {
                    color_data = [color_rgb.r, color_rgb.g, color_rgb.b];
                } else {
                    // @ts-ignore
                    color_data = Array(positions.length / 3).fill([color_rgb.r, color_rgb.g, color_rgb.b]).flat(1);
                }
            }
            const color_buffer = new Uint8Array(color_data);
            // geom.addAttribute('color', new THREE.BufferAttribute(color_buffer, 3, true));
            geom.setAttribute('color', new THREE.BufferAttribute(color_buffer, 3, true));
        }
        geom.computeBoundingSphere();
        const mat = new THREE.PointsMaterial({
            color: color_rgb,
            size: size,
            sizeAttenuation: false
            // vertexColors: THREE.VertexColors
        });
        const bg = { geom, mat };
        return bg;
    }

    /**
     * Text labels
     * @param container
     * @param type
     * @param labelText
     * @param ent_id
     */
    private _createTextLabel(container, type: string, labelText: string, ent_id: string) {
        const div = document.createElement('div');
        div.id = `textLabel_${ent_id}`;
        div.title = ent_id;
        div.setAttribute('data-index', ent_id.substr(2));
        div.className = `text-label${ent_id.substr(0, 2)}`;
        div.style.position = 'absolute';
        div.style.background = 'rgba(255, 255, 255, 0.3)';
        div.style.padding = '1px';
        div.style.pointerEvents = 'none';
        div.innerHTML = labelText;
        div.style.top = '-1000';
        div.style.left = '-1000';
        div.style.whiteSpace = 'pre-line';
        const _this = this;
        return {
            element: div,
            parent: false,
            position: new THREE.Vector3(0, 0, 0),
            setHTML: function (html) {
                this.element.innerHTML = html;
            },
            setParent: function (threejsobj) {
                this.parent = threejsobj;
            },
            updatePosition: function () {
                if (this.parent) {
                    if (type === objType.point || type === objType.face) {
                        const center = this.parent.geometry.boundingSphere.center;
                        this.position.copy(center);
                    } else if (type === objType.line) {
                        const p = this.parent.geometry.getAttribute('position').array;
                        const x = (p[0] + p[3]) / 2, y = (p[1] + p[4]) / 2, z = (p[2] + p[5]) / 2;
                        const center = new THREE.Vector3(x, y, z);
                        this.position.copy(center);
                    }
                }
                const coords2d = this.get2DCoords(this.position, _this.camera);
                this.element.style.left = coords2d.x - div.clientWidth * 0.5 + 'px';
                this.element.style.top = coords2d.y + 'px';
            },
            get2DCoords: function (position, camera) {
                const vector = position.project(camera);
                vector.x = (vector.x + 1) / 2 * container.offsetWidth;
                vector.y = -(vector.y - 1) / 2 * container.offsetHeight;
                return vector;
            }
        };
    }
}

