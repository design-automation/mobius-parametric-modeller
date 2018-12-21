import { IModelData, IGeomData, IAttribsData, TPoint } from './GIJson';
import { GIGeom } from './GIGeom';
import { GIAttribs } from './GIAttribs';
import { EAttribNames } from './GICommon';
import { IThreeJS } from './ThreejsJSON';
/**
 * Geo-info model class.
 */
export class GIModel {
    [x: string]: any;
    private _geom: GIGeom;
    private _attribs: GIAttribs;
    /**
     * Creates a model.
     * @param model_data The JSON data
     */
    constructor(model_data?: IModelData) {
        this._geom = new GIGeom(this);
        this._attribs = new GIAttribs(this);
        if (model_data) {
            this.addData(model_data);
        }
    }
    // Getters and setters
    public geom() {return this._geom; }
    public attribs() {return this._attribs; }
    /**
     * Sets the data in this model from JSON data.
     * The existing data in the model is deleted.
     * @param model_data The JSON data.
     */
    public addData (model_data: IModelData): void {
        this._attribs.addData(model_data); // warning: must be before this._geom.addDat()
        this._geom.addData(model_data.geometry);
    }
    /**
     * Adds data to this model from a GI model.
     * The existing data in the model is not deleted.
     * @param model_data The GI model.
     */
    public merge(model: GIModel): void {
        this.addData(model.getData());
    }
    /**
     * Returns the JSON data for this model.
     */
    public getData(): IModelData {
        return {
            geometry: this._geom.getData(),
            attributes: this._attribs.getData()
        };
    }
    /**
     * Returns the JSON data for the geometry in this model.
     */
    public getGeomData(): IGeomData {
        return this._geom.getData();
    }
    /**
     * Returns the JSON data for the attributes in this model.
     */
    public getAttribsData(): IAttribsData {
        return this._attribs.getData();
    }
    /**
     * Generate a default color if none exists.
     */
    private _generateColors(): number[] {
        const colors = [];
        for (let index = 0; index < this._geom.numVerts(); index++) {
            colors.push(1, 1, 1);
        }
        return colors;
    }
    /**
     * Generate default normals if non exist.
     */
    private _generateNormals(): number[] {
        const normals = [];
        for (let index = 0; index < this._geom.numVerts(); index++) {
            normals.push(0, 0, 0);
        }
        return normals;
    }
    /**
     * Returns arrays for visualization in Threejs.
     */
    public get3jsData(): IThreeJS {
        // get the attrbs at the vertex level
        const coords_values: number[] = this._attribs.get3jsSeqVertsCoords(this._geom.get3jsVerts());
        let normals_values: number[] = this._attribs.get3jsSeqVertsAttrib(EAttribNames.NORMAL);
        let colors_values: number[] = this._attribs.get3jsSeqVertsAttrib(EAttribNames.COLOR);
        // add normals and colours
        if (!normals_values) {
            normals_values = this._generateNormals();
        }
        if (!colors_values) {
            colors_values = this._generateColors();
        }
        // get the indices of the vertices for edges, points and triangles
        const tris_verts_i: number[] = this._geom.get3jsTris();
        const edges_verts_i: number[] = this._geom.get3jsEdges();
        const points_verts_i: number[] = this._geom.get3jsPoints();
        // return an object containing all the data
        return {
            positions: coords_values,
            normals: normals_values,
            colors: colors_values,
            point_indices: points_verts_i,
            edge_indices: edges_verts_i,
            triangle_indices: tris_verts_i
        };
    }
}
