import { GIAttribsAdd } from './GIAttribsAdd';
import { GIAttribsThreejs } from './GIAttribsThreejs';
import { GIAttribsQuery } from './GIAttribsQuery';
import { GIAttribMap } from './GIAttribMap';
import { GIModel } from './GIModel';
import { TId, EEntityTypeStr, EAttribNames, IQueryComponent,  IAttribsData,
    EAttribDataTypeStrs, TAttribDataTypes, IAttribData, Txyz, IGeomData, IModelData, IAttribsMaps, EEntStrToAttribMap  } from './common';
import { idBreak  } from './id';
import { parse_query } from './query';

/**
 * Class for attributes.
 */
export class GIAttribs {
    private _model: GIModel;
    // maps, the key is the name, the value is the attrib map clas
    private _attribs_maps: IAttribsMaps = {
        posis: new Map(),
        verts: new Map(),
        edges: new Map(),
        wires: new Map(),
        faces: new Map(),
        points: new Map(),
        plines: new Map(),
        pgons: new Map(),
        colls: new Map()
    };
    // sub classes with methods
    public add: GIAttribsAdd;
    public query: GIAttribsQuery;
    public threejs: GIAttribsThreejs;
   /**
     * Creates an object to store the attribute data.
     * @param model The JSON data
     */
    constructor(model: GIModel) {
        this._model = model;
        this.add = new GIAttribsAdd(model, this._attribs_maps);
        this.query = new GIAttribsQuery(model, this._attribs_maps);
        this.threejs = new GIAttribsThreejs(model, this._attribs_maps);
        this.add.addAttrib(EEntityTypeStr.POSI, EAttribNames.COORDS, EAttribDataTypeStrs.FLOAT, 3);
    }
    /**
     * Returns the JSON data for this model.
     */
    public getData(): IAttribsData {
        return {
            positions: Array.from(this._attribs_maps.posis.values()).map(attrib => attrib.getData()),
            vertices: Array.from(this._attribs_maps.verts.values()).map(attrib => attrib.getData()),
            edges: Array.from(this._attribs_maps.edges.values()).map(attrib => attrib.getData()),
            wires: Array.from(this._attribs_maps.wires.values()).map(attrib => attrib.getData()),
            faces: Array.from(this._attribs_maps.faces.values()).map(attrib => attrib.getData()),
            points: Array.from(this._attribs_maps.points.values()).map(attrib => attrib.getData()),
            polylines: Array.from(this._attribs_maps.plines.values()).map(attrib => attrib.getData()),
            polygons: Array.from(this._attribs_maps.pgons.values()).map(attrib => attrib.getData()),
            collections: Array.from(this._attribs_maps.colls.values()).map(attrib => attrib.getData())
        };
    }
}
