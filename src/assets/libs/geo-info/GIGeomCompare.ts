import { GIModel } from './GIModel';
import { IGeomMaps, EEntType, TFace } from './common';
import { GIGeom } from './GIGeom';

/**
 * Class for comparing the geometry in two models.
 */
export class GIGeomCompare {
    private _geom: GIGeom;
    private _geom_maps: IGeomMaps;
    /**
     * Constructor
     */
    constructor(geom: GIGeom, geom_arrays: IGeomMaps) {
        this._geom = geom;
        this._geom_maps = geom_arrays;
    }

    /**
     * Compares this model and another model.
     * ~
     * The max total score for this method is equal to 5.
     * It assigns 1 mark for for each entity type:
     * points, pline, pgons, and colelctions.
     * In each case, if the number of entities is equal, 1 mark is given.
     * ~
     * @param other_model The model to compare with.
     */
    compare(other_model: GIModel, result: {score: number, total: number, comment: any[]}): void {
        result.comment.push('Comparing number of geometric entities.');
        const eny_types: EEntType[] = [
            EEntType.POINT,
            EEntType.PLINE,
            EEntType.PGON
        ];
        const ent_type_strs: Map<EEntType, string> = new Map([
            [EEntType.POINT, 'points'],
            [EEntType.PLINE, 'polylines'],
            [EEntType.PGON, 'polygons']
        ]);
        const geom_comments: string[] = [];
        for (const ent_type of eny_types) {
            // total marks is not updated, we deduct marks
            // get the number of entitoes in each model
            const this_num_ents: number = this._geom.query.numEnts(ent_type);
            const other_num_ents: number = other_model.modeldata.geom.query.numEnts(ent_type);
            if (this_num_ents > other_num_ents) {
                geom_comments.push([
                    'Mismatch: Model has too few entities of type:',
                    ent_type_strs.get(ent_type) + '.',
                    'There were ' + (this_num_ents - other_num_ents) + ' missing entities.',
                ].join(' '));
            } else if (this_num_ents < other_num_ents) {
                geom_comments.push([
                    'Mismatch: Model has too many entities of type:',
                    ent_type_strs.get(ent_type) + '.',
                    'There were ' + (other_num_ents - this_num_ents) + ' extra entities.',
                    'A penalty of one mark was deducted from the score.'
                ].join(' '));
                // update the score, deduct 1 mark
                result.score -= 1;
            } else {
                // correct
            }
        }
        if (geom_comments.length === 0) {
            geom_comments.push('Number of entities all match.');
        }
        // update the comments in the result
        result.comment.push(geom_comments);
    }
    /**
     * Set the holes in a face by specifying a list of wires.
     * ~
     * This is a low level method used by the compare function to normalize hole order.
     * For making holes in faces, it is safer to use the cutFaceHoles method.
     */
    public setPgonHoles(face_i: number, holes_i: number[]): void {
        const face: TFace = this._geom_maps.dn_faces_wires.get(face_i);
        const wires_i: number[] = [face[0]];
        for (let i = 0; i < holes_i.length; i++) {
            wires_i.push( holes_i[i] );
        }
        this._geom_maps.dn_faces_wires.set(face_i, wires_i);
    }
}
