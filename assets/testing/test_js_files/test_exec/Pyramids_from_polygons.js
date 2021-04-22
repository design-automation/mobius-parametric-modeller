/**
 * to use this code: import Pyramids_from_polygons from this js file as well as the GI module
 * run Pyramids_from_polygons with the GI module as input along with other start node input
 * e.g.:
 * const Pyramids_from_polygons = require('./Pyramids_from_polygons.js').Pyramids_from_polygons
 * const module = require('gi-module')
 * const result = await Pyramids_from_polygons(module, start_input_1, start_input_2, ...);
 *
 * returns: a json object:
 *   _ result.model -> gi model of the flowchart
 *   _ result.result -> returned output of the flowchart, if the flowchart does not return any value, result.result is the model of the flowchart
 */



async function Pyramids_from_polygons(__modules__) {

var __debug__ = true;
var __model__ = null;
/** * **/
var PI = __modules__._constants.PI;
var XY = __modules__._constants.XY;
var YZ = __modules__._constants.YZ;
var ZX = __modules__._constants.ZX;
var YX = __modules__._constants.YX;
var ZY = __modules__._constants.ZY;
var XZ = __modules__._constants.XZ;
var isNum = __modules__._types.isNum;
var isInt = __modules__._types.isInt;
var isFlt = __modules__._types.isFlt;
var isBool = __modules__._types.isBool;
var isStr = __modules__._types.isStr;
var isList = __modules__._types.isList;
var isDict = __modules__._types.isDict;
var isVec2 = __modules__._types.isVec2;
var isVec3 = __modules__._types.isVec3;
var isCol = __modules__._types.isCol;
var isRay = __modules__._types.isRay;
var isPln = __modules__._types.isPln;
var isNaN = __modules__._types.isNaN;
var isNull = __modules__._types.isNull;
var isUndef = __modules__._types.isUndef;
var strRepl = __modules__._strs.strRepl;
var strUpp = __modules__._strs.strUpp;
var strLow = __modules__._strs.strLow;
var strTrim = __modules__._strs.strTrim;
var strTrimR = __modules__._strs.strTrimR;
var strTrimL = __modules__._strs.strTrimL;
var strSub = __modules__._strs.strSub;
var strStarts = __modules__._strs.strStarts;
var strEnds = __modules__._strs.strEnds;
var strPadL = __modules__._strs.strPadL;
var strPadR = __modules__._strs.strPadR;
var isApprox = __modules__._util.isApprox;
var isIn = __modules__._util.isIn;
var isWithin = __modules__._util.isWithin;
var min = __modules__._math.min;
var max = __modules__._math.max;
var pow = __modules__._math.pow;
var sqrt = __modules__._math.sqrt;
var exp = __modules__._math.exp;
var log = __modules__._math.log;
var round = __modules__._math.round;
var sigFig = __modules__._math.sigFig;
var ceil = __modules__._math.ceil;
var floor = __modules__._math.floor;
var abs = __modules__._math.abs;
var sin = __modules__._math.sin;
var asin = __modules__._math.asin;
var sinh = __modules__._math.sinh;
var asinh = __modules__._math.asinh;
var cos = __modules__._math.cos;
var acos = __modules__._math.acos;
var cosh = __modules__._math.cosh;
var acosh = __modules__._math.acosh;
var tan = __modules__._math.tan;
var atan = __modules__._math.atan;
var tanh = __modules__._math.tanh;
var atanh = __modules__._math.atanh;
var atan2 = __modules__._math.atan2;
var boolean = __modules__._mathjs.boolean;
var number = __modules__._mathjs.number;
var string = __modules__._mathjs.string;
var mad = __modules__._mathjs.mad;
var mean = __modules__._mathjs.mean;
var median = __modules__._mathjs.median;
var mode = __modules__._mathjs.mode;
var prod = __modules__._mathjs.prod;
var std = __modules__._mathjs.std;
var vari = __modules__._mathjs.vari;
var sum = __modules__._mathjs.sum;
var hypot = __modules__._mathjs.hypot;
var norm = __modules__._mathjs.norm;
var square = __modules__._mathjs.square;
var cube = __modules__._mathjs.cube;
var remap = __modules__._arithmetic.remap;
var distance = __modules__._geometry.distance;
var distanceM = __modules__._geometry.distanceM;
var distanceMS = __modules__._geometry.distanceMS;
var intersect = __modules__._geometry.intersect;
var project = __modules__._geometry.project;
var range = __modules__._list.range;
var len = __modules__._common.len;
var listCount = __modules__._list.listCount;
var listCopy = __modules__._list.listCopy;
var listRep = __modules__._list.listRep;
var listLast = __modules__._list.listLast;
var listGet = __modules__._list.listGet;
var listFind = __modules__._list.listFind;
var listHas = __modules__._list.listHas;
var listJoin = __modules__._list.listJoin;
var listFlat = __modules__._list.listFlat;
var listRot = __modules__._list.listRot;
var listSlice = __modules__._list.listSlice;
var listRev = __modules__._list.listRev;
var listCull = __modules__._list.listCull;
var listSort = __modules__._list.listSort;
var listZip = __modules__._list.listZip;
var listEq = __modules__._list.listEq;
var dictGet = __modules__._dict.dictGet;
var dictKeys = __modules__._dict.dictKeys;
var dictVals = __modules__._dict.dictVals;
var dictHasKey = __modules__._dict.dictHasKey;
var dictHasVal = __modules__._dict.dictHasVal;
var dictFind = __modules__._dict.dictFind;
var dictCopy = __modules__._dict.dictCopy;
var dictEq = __modules__._dict.dictEq;
var setMake = __modules__._set.setMake;
var setUni = __modules__._set.setUni;
var setInt = __modules__._set.setInt;
var setDif = __modules__._set.setDif;
var vecAdd = __modules__._vec.vecAdd;
var vecSub = __modules__._vec.vecSub;
var vecDiv = __modules__._vec.vecDiv;
var vecMult = __modules__._vec.vecMult;
var vecSum = __modules__._vec.vecSum;
var vecLen = __modules__._vec.vecLen;
var vecSetLen = __modules__._vec.vecSetLen;
var vecNorm = __modules__._vec.vecNorm;
var vecRev = __modules__._vec.vecRev;
var vecFromTo = __modules__._vec.vecFromTo;
var vecAng = __modules__._vec.vecAng;
var vecAng2 = __modules__._vec.vecAng2;
var vecDot = __modules__._vec.vecDot;
var vecCross = __modules__._vec.vecCross;
var vecEqual = __modules__._vec.vecEqual;
var vecLtoG = __modules__._vec.vecLtoG;
var vecGtoL = __modules__._vec.vecGtoL;
var plnMake = __modules__._plane.plnMake;
var plnCopy = __modules__._plane.plnCopy;
var plnMove = __modules__._plane.plnMove;
var plnRot = __modules__._plane.plnRot;
var plnLMove = __modules__._plane.plnLMove;
var plnLRotX = __modules__._plane.plnLRotX;
var plnLRotY = __modules__._plane.plnLRotY;
var plnLRotZ = __modules__._plane.plnLRotZ;
var rayMake = __modules__._ray.rayMake;
var rayCopy = __modules__._ray.rayCopy;
var rayMove = __modules__._ray.rayMove;
var rayRot = __modules__._ray.rayRot;
var rayLMove = __modules__._ray.rayLMove;
var rayFromPln = __modules__._ray.rayFromPln;
var rayLtoG = __modules__._ray.rayLtoG;
var rayGtoL = __modules__._ray.rayGtoL;
var colFalse = __modules__._colors.colFalse;
var colScale = __modules__._colors.colScale;
var radToDeg = __modules__._conversion.radToDeg;
var degToRad = __modules__._conversion.degToRad;
var numToStr = __modules__._conversion.numToStr;
var rand = __modules__._rand.rand;
var randInt = __modules__._rand.randInt;
var randPick = __modules__._rand.randPick;

async function exec_Pyramids_from_polygons_PyramidFromPolygon(__params__, PGONS_, HEIGHT_){

async function exec_Pyramids_from_polygons_PyramidFromPolygon_node_r5cg72yt36e(__params__, PGONS_, HEIGHT_){
__modules__._model.__preprocess__( __params__.model);

__modules__.attrib.Set(__params__.model, null, 'triangles',  [] );

let pgons_list_ = PGONS_;

if (!isList(__debug__, PGONS_)){

pgons_list_ = [PGONS_];
}

for (let  pgon_ of pgons_list_){

let ray_ = __modules__.calc.Ray( __params__.model, pgon_ );

let xyz_ = vecAdd(__debug__, ray_[pythonList(0, ray_.length)], vecMult(__debug__, ray_[pythonList(1, ray_.length)], HEIGHT_));

let cen_pos_ = __modules__.make.Position( __params__.model, xyz_ );

let edges_ = __modules__.query.Get( __params__.model, '_e', pgon_ );

for (let  edge_ of edges_){

let posis_ = __modules__.query.Get( __params__.model, 'ps', edge_ );

__modules__.list.Add( posis_, cen_pos_, 'to_end' );

let tri_ = __modules__.make.Polygon( __params__.model, posis_ );

__modules__.list.Add( __modules__.attrib.Get(__params__.model, null, 'triangles'), tri_, 'to_end' );
}
}
__modules__._model.__postprocess__( __params__.model);
}


async function exec_Pyramids_from_polygons_PyramidFromPolygon_node_2by9g05ksae(__params__, PGONS_, HEIGHT_){
__modules__._model.__preprocess__( __params__.model);

let __return_value__ = __modules__._Output.Return(__params__.model, __modules__.attrib.Get(__params__.model, null, 'triangles'));
return __return_value__;
}

var merged;
let ssid_exec_Pyramids_from_polygons_PyramidFromPolygon_node_gugxesewqp = __params__.model.getActiveSnapshot();

let ssid_exec_Pyramids_from_polygons_PyramidFromPolygon_node_r5cg72yt36e = ssid_exec_Pyramids_from_polygons_PyramidFromPolygon_node_gugxesewqp;

await exec_Pyramids_from_polygons_PyramidFromPolygon_node_r5cg72yt36e(__params__, PGONS_, HEIGHT_);

let ssid_exec_Pyramids_from_polygons_PyramidFromPolygon_node_2by9g05ksae = __params__.model.nextSnapshot([ssid_exec_Pyramids_from_polygons_PyramidFromPolygon_node_r5cg72yt36e]);

return await exec_Pyramids_from_polygons_PyramidFromPolygon_node_2by9g05ksae(__params__, PGONS_, HEIGHT_);
}

async function exec_Pyramids_from_polygons(__params__){

async function exec_Pyramids_from_polygons_node_myyemrof1ff(__params__){
__modules__._model.__preprocess__( __params__.model);

let grid_ = __modules__.pattern.Grid( __params__.model, JSON.parse(JSON.stringify(XY)), 300, 10, 'flat' );

for (let  pos_ of grid_){

let arc_ = __modules__.pattern.Arc( __params__.model, __modules__.attrib.Get(__params__.model, pos_, 'xyz'), 10, randInt(__debug__, 3, 15), null );

let pg_ = __modules__.make.Polygon( __params__.model, arc_ );

__params__.console.push('<div style="margin: 5px 0px 5px 10px; border: 1px solid #E6E6E6"><p><b> Global Function: PyramidFromPolygon</b></p>');
__params__.curr_ss.node_myyemrof1ff = __params__.model.prepGlobalFunc([pg_]);
let tris_ = await exec_Pyramids_from_polygons_PyramidFromPolygon(__params__, pg_, randInt(__debug__, 3, 15));
__params__.model.postGlobalFunc(__params__.curr_ss.node_myyemrof1ff)
__params__.console.push('</div>')

let verts_ = __modules__.query.Get( __params__.model, '_v', tris_ );

__modules__.attrib.Set(__params__.model, verts_, 'rgb',  [rand(__debug__, 0, 1), rand(__debug__, 0, 1), rand(__debug__, 0, 1)] );
}
__modules__._model.__postprocess__( __params__.model);
}


async function exec_Pyramids_from_polygons_node_aayr34ww0g(__params__){
__modules__._model.__preprocess__( __params__.model);

return null;
}

var merged;
let ssid_exec_Pyramids_from_polygons_node_an9sl39swoq = __params__.model.getActiveSnapshot();

let ssid_exec_Pyramids_from_polygons_node_myyemrof1ff = ssid_exec_Pyramids_from_polygons_node_an9sl39swoq;

await exec_Pyramids_from_polygons_node_myyemrof1ff(__params__);

let ssid_exec_Pyramids_from_polygons_node_aayr34ww0g = __params__.model.nextSnapshot([ssid_exec_Pyramids_from_polygons_node_myyemrof1ff]);

return await exec_Pyramids_from_polygons_node_aayr34ww0g(__params__);
}


function pythonList(x, l){
    if (x < 0) {
        return x + l;
    }
    return x;
}

function mergeInputs(models){
    let result = null;
    if (models.length === 0) {
        result = __modules__._model.__new__();
    } else if (models.length === 1) {
        result = models[0].clone();
    } else {
        result = models[0].clone();
        for (let i = 1; i < models.length; i++) {
            __modules__._model.__merge__(result, models[i]);
        }
    }
    try {
        result.debug = __debug__;
    } catch (ex) {}
    return result;
}
function duplicateModel(model){
    const result = model.clone();
    try {
        result.debug = __debug__;
    } catch (ex) {}
    return result;
}

function printFunc(_console, name, value){
    let val;
    let padding_style = 'padding: 2px 0px 2px 10px;';
    if (!value) {
        val = value;
    } else if (value === '__null__') {
        _console.push('<p style="' + padding_style + '"><b><i>_ ' + name + '</i></b></p>');
        return value;
    } else if (typeof value === 'number' || value === undefined) {
        val = value;
    } else if (typeof value === 'string') {
        val = '"' + value.replace(/\n/g, '<br>') + '"';
    } else if (value.constructor === [].constructor) {
        let __list_check__ = false;
        let __value_strings__ = [];
        for (const __item__ of value) {
            if (!__item__) {
                __value_strings__.push('' + __item__);
                continue;
            }
            if (__item__.constructor === [].constructor || __item__.constructor === {}.constructor) {
                __list_check__ = true;
            }
            __value_strings__.push(JSON.stringify(__item__).replace(/,/g, ', '));
        }
        if (__list_check__) {
            padding_style = 'padding: 2px 0px 0px 10px;';
            val = '[<p style="padding: 0px 0px 2px 40px;">' +
                  __value_strings__.join(',</p><p style="padding: 0px 0px 2px 40px;">') +
                  '</p><p style="padding: 0px 0px 2px 30px;">]</p>';
        } else {
            val = '[' + __value_strings__.join(', ') + ']';
        }
    } else if (value.constructor === {}.constructor) {
        let __list_check__ = false;
        let __value_strings__ = [];
        for (const __item__ in value) {
            const __value__ = value[__item__];
            if (!__value__) {
                __value_strings__.push('\<b>"' + __item__ + '\"</b>' + ': ' + __value__);
                continue;
            }
            if (__value__.constructor === [].constructor || __value__.constructor === {}.constructor) {
                __list_check__ = true;
            }
            __value_strings__.push('\<b>"' + __item__ + '\"</b>' + ': ' + JSON.stringify(__value__).replace(/,/g, ', '));
        }
        if (__list_check__) {
            padding_style = 'padding: 2px 0px 0px 10px;';
            val = '{<p style="padding: 0px 0px 2px 40px;">' +
                  __value_strings__.join(',</p><p style="padding: 0px 0px 2px 40px;">') +
                  '</p><p style="padding: 0px 0px 2px 30px;">}</p>';
        } else {
            val = '{' + __value_strings__.join(', ') + '}';
        }
    } else {
        val = value;
    }
    _console.push('<p style="' + padding_style + '"><b><i>_ ' + name+'</i></b>  = ' + val + '</p>');
    return val;
}


const __params__ = {};
__params__["model"] = __modules__._model.__new__();
if (__model__) {
__modules__.io._importGI(__params__["model"], __model__);
}
__params__["model"].debug = __debug__;
__params__["console"] = [];
__params__["modules"] = __modules__;
__params__["curr_ss"] = {};
const result = await exec_Pyramids_from_polygons(__params__);
if (result === __params__.model) { return { "model": __params__.model, "result": null };}
return {"model": __params__.model, "result": result};
/** * **/

}

module.exports = Pyramids_from_polygons;
