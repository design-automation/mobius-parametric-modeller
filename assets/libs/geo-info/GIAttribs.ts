import { GIAttribsAdd } from './GIAttribsAdd';
import { GIAttribsThreejs } from './GIAttribsThreejs';
import { GIAttribsQuery } from './GIAttribsQuery';
import { GIModel } from './GIModel';
import { EEntType, EAttribNames,  IAttribsData, EAttribDataTypeStrs, IAttribsMaps } from './common';
import { GIAttribsIO } from './GIAttribsIO';

/**
 * Class for attributes.
 */
export class GIAttribs {
    private _model: GIModel;
    // maps, the key is the name, the value is the attrib map clas
    public _attribs_maps: IAttribsMaps = { // TODO this should not be public
        ps: new Map(),
        _v: new Map(),
        _e: new Map(),
        _w: new Map(),
        _f: new Map(),
        pt: new Map(),
        pl: new Map(),
        pg: new Map(),
        co: new Map()
    };
    // sub classes with methods
    public io: GIAttribsIO;
    public add: GIAttribsAdd;
    public query: GIAttribsQuery;
    public threejs: GIAttribsThreejs;
   /**
     * Creates an object to store the attribute data.
     * @param model The JSON data
     */
    constructor(model: GIModel) {
        this._model = model;
        this.io = new GIAttribsIO(model, this._attribs_maps);
        this.add = new GIAttribsAdd(model, this._attribs_maps);
        this.query = new GIAttribsQuery(model, this._attribs_maps);
        this.threejs = new GIAttribsThreejs(model, this._attribs_maps);
        this.add.addAttrib(EEntType.POSI, EAttribNames.COORDS, EAttribDataTypeStrs.FLOAT, 3);
    }
    /**
     * Returns the JSON data for this model.
     */
    public getData(): IAttribsData {
        return {
            positions: Array.from(this._attribs_maps.ps.values()).map(attrib => attrib.getData()),
            vertices: Array.from(this._attribs_maps._v.values()).map(attrib => attrib.getData()),
            edges: Array.from(this._attribs_maps._e.values()).map(attrib => attrib.getData()),
            wires: Array.from(this._attribs_maps._w.values()).map(attrib => attrib.getData()),
            faces: Array.from(this._attribs_maps._f.values()).map(attrib => attrib.getData()),
            points: Array.from(this._attribs_maps.pt.values()).map(attrib => attrib.getData()),
            polylines: Array.from(this._attribs_maps.pl.values()).map(attrib => attrib.getData()),
            polygons: Array.from(this._attribs_maps.pg.values()).map(attrib => attrib.getData()),
            collections: Array.from(this._attribs_maps.co.values()).map(attrib => attrib.getData())
        };
    }
}
