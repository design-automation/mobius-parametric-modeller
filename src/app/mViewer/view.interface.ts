import * as gs from 'gs-json';

export interface IView{
    name: string, 
    icon: string,
    component: any
}
export const gs_default = new gs.Model(JSON.parse(`{
    "metadata": {
        "filetype": "gs-json",
        "version": "0.1.8",
        "uuid": "277a2319-3488-4e73-916f-5434b09129bb"
    },
    "geom": {
        "points": [
            [],
            [
                null
            ]
        ],
        "objs": []
    },
    "attribs": {
        "points": [],
        "vertices": [],
        "edges": [],
        "wires": [],
        "faces": [],
        "objs": []
    },
    "groups": []
}
`));
export const cesium_default = JSON.parse(`{
    "type": "FeatureCollection",
    "name": "default",
    "crs": { "type": "name", "properties": { "name": "0" } },
    "features": [
    { "type": "Feature", "properties": { "OBJECTID": 1, "OID_1": 0, "INC_CRC": "593E775CE158CC1F", "FMEL_UPD_D": "2014\/06\/23", "X_ADDR": 26044.8109, "Y_ADDR": 48171.43, "SHAPE_Leng": 298.85929234299999, "SHAPE_Area": 1070.8993405900001 }, "geometry": { "type": "MultiPolygon", "coordinates": [] } }
    ]
    }`);
