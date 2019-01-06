import { GIGeom } from './GIGeom';
import { GIAttribs } from './GIAttribs';
import { EAttribNames, IModelData, IGeomData, IAttribsData, EEntityTypeStr } from './common';
import { IThreeJS } from './ThreejsJSON';
/**
 * Geo-info model class.
 */
export class GIModel {
    [x: string]: any; // TODO: What is this???
    public  geom: GIGeom;
    public  attribs: GIAttribs;
    /**
     * Creates a model.
     * @param model_data The JSON data
     */
    constructor(model_data?: IModelData) {
        this.geom = new GIGeom(this);
        this.attribs = new GIAttribs(this);
        if (model_data) {
            this.addData(model_data);
        }
    }
    /**
     * Sets the data in this model from JSON data.
     * The existing data in the model is deleted.
     * @param model_data The JSON data.
     */
    public addData (model_data: IModelData): void {
        this.attribs.add.addData(model_data); // warning: must be before this.geom.add.addDat()
        this.geom.add.addData(model_data.geometry);
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
            geometry: this.geom.getData(),
            attributes: this.attribs.getData()
        };
    }
    /**
     * Returns the JSON data for the geometry in this model.
     */
    public getGeomData(): IGeomData {
        return this.geom.getData();
    }
    /**
     * Returns the JSON data for the attributes in this model.
     */
    public getAttribsData(): IAttribsData {
        return this.attribs.getData();
    }
    /**
     * Generate a default color if none exists.
     */
    private _generateColors(): number[] {
        const colors = [];
        for (let index = 0; index < this.geom.query.numEnts(EEntityTypeStr.VERT); index++) {
            colors.push(1, 1, 1);
        }
        return colors;
    }
    /**
     * Generate default normals if non exist.
     */
    private _generateNormals(): number[] {
        const normals = [];
        for (let index = 0; index < this.geom.query.numEnts(EEntityTypeStr.VERT); index++) {
            normals.push(0, 0, 0);
        }
        return normals;
    }
    /**
     * Returns arrays for visualization in Threejs.
     */
    public get3jsData(): IThreeJS {
        // get the attribs at the vertex level
        const coords_values: number[] = this.attribs.threejs.get3jsSeqVertsCoords();
        let normals_values: number[] = this.attribs.threejs.get3jsSeqVertsAttrib(EAttribNames.NORMAL);
        let colors_values: number[] = this.attribs.threejs.get3jsSeqVertsAttrib(EAttribNames.COLOR);
        // add normals and colours
        if (!normals_values) {
            normals_values = this._generateNormals();
        }
        if (!colors_values) {
            colors_values = this._generateColors();
        }
        // get the indices of the vertices for edges, points and triangles
        const tris_verts_i: number[] = this.geom.threejs.get3jsTris();
        const edges_verts_i: number[] = this.geom.threejs.get3jsEdges();
        const points_verts_i: number[] = this.geom.threejs.get3jsPoints();
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
