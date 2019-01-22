import { GIModel } from './GIModel';
import { TNormal, TTexture, EAttribNames, Txyz, EEntType } from './common';
/**
 * Import to obj
 */
export function importObj(obj_str: string): GIModel {
    const model: GIModel = new GIModel();
    enum EObjLine {
        OBJ_COMMENT = '#',
        OBJ_COORD = 'v ',
        OBJ_TEXTURE = 'vt ',
        OBJ_NORMAL = 'vn ',
        OBJ_FACE = 'f ',
        OBJ_LINE = 'l '
    }
    const obj_lines: string[] = obj_str.split(/\r?\n/);
    const coords: Txyz[] = [];
    const normals: TNormal[] = [];
    const textures: TTexture[] = [];
    const faces: number[][][] = [];
    const plines: number[][] = [];
    for (const obj_line of obj_lines) {
        if (obj_line.startsWith( EObjLine.OBJ_COMMENT )) {
            // Do not do anything
        } else if (obj_line.startsWith( EObjLine.OBJ_COORD )) {
            const coord: Txyz = obj_line.split(' ').slice(1, 4).map( v => parseFloat(v) ) as Txyz;
            coords.push(coord);
        } else if (obj_line.startsWith( EObjLine.OBJ_TEXTURE )) {
            const normal: TNormal = obj_line.split(' ').slice(1, 4).map( v => parseFloat(v) ) as TNormal;
            normals.push(normal);
        } else if (obj_line.startsWith( EObjLine.OBJ_NORMAL )) {
            const texture: TTexture = obj_line.split(' ').slice(1, 3).map( v => parseFloat(v) ) as TTexture;
            textures.push(texture);
        } else if (obj_line.startsWith( EObjLine.OBJ_FACE )) {
            const face_strs: string[] = obj_line.split(' ').slice(1);
            const v_indexes: number[] = [];
            const t_indexes: number[] = [];
            const n_indexes: number[] = [];
            face_strs.forEach( face_str => {
                const face_sub_indexes: number[] = face_str.split('/').map( str => parseInt(str, 10) - 1 );
                v_indexes.push(face_sub_indexes[0]);
                t_indexes.push(face_sub_indexes[1]);
                n_indexes.push(face_sub_indexes[2]);
            });
            faces.push([v_indexes, t_indexes, n_indexes]);
        } else if (obj_line.startsWith( EObjLine.OBJ_LINE )) {
            const pline: number[] = obj_line.split(' ').slice(1).map( v => parseInt(v, 10) - 1 ) as TTexture;
            plines.push(pline);
        } else {
            console.log('Found unrecognised line of data in OBJ file');
        }
    }
    for (const coord of coords) {
        const posi_i: number = model.geom.add.addPosi();
        model.attribs.add.setAttribValue(EEntType.POSI, posi_i, EAttribNames.COORDS, coord);
    }
    for (const face of faces) {
        console.log(face[0]);
        const face_i: number = model.geom.add.addPgon(face[0]);
        // TODO: texture uv
        // TODO: normals
    }
    return model;
}
