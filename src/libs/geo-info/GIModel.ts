import { IModelData, IGeomData, IAttribsData, TPoint } from './GIJson';
import { GIGeom } from './GIGeom';
import { GIAttribs } from './GIAttribs';
import { IThreeJS } from './ThreejsJSON';
/**
 * Geo-info model class.
 */
export class GIModel {
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
     * @param model_data The JSON data
     */
    public addData (model_data: IModelData): void {
        this._geom.addData(model_data.geometry);
        this._attribs.addData(model_data.attributes);
    }
    /**
     * Adds data to this model from JSON data.
     * The existing data in the model is not deleted.
     * @param model_data The JSON data
     */
    public merge(model: GIModel): void {
        this._attribs.addData(model.getAttribsData()); // must be before addGeomData()
        this._geom.addData(model.getGeomData());
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
     * Returns arrays for visualization in Threejs.
     */
    public get3jsData(): IThreeJS {
        const [coords_keys, coords_values]: [number[], number[]] = this._attribs.get3jsSeqCoords();
        const tris: number[] = this._geom.get3jsTris().map( vert_i => coords_keys[vert_i] );
        const lines: number[] = this._geom.get3jsLines().map( vert_i => coords_keys[vert_i] );
        const points: number[] = this._geom.get3jsPoints().map( vert_i => coords_keys[vert_i] );
        const normals: number[] = this._attribs.get3jsSeqTrisNormals();
        return {
            positions: coords_values,
            points: points,
            lines: lines,
            triangles: tris,
            normals: normals
        };
    }
}
