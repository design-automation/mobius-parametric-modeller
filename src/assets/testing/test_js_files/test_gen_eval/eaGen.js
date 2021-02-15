/**
 * to use this code: import eaGen from this js file as well as the GI module
 * run eaGen with the GI module as input along with other start node input
 * e.g.:
 * const eaGen = require('./eaGen.js').eaGen
 * const module = require('gi-module')
 * const result = eaGen(module, start_input_1, start_input_2, ...);
 *
 * returns: a json object:
 *   _ result.model -> gi model of the flowchart
 *   _ result.result -> returned output of the flowchart, if the flowchart does not return any value, result.result is the model of the flowchart
 */

// Parameter: {"name":"rotate1","value":59,"type":1,"min":"0","max":"180","step":"1"}
// Parameter: {"name":"rotate2","value":31,"type":1,"min":"0","max":"180","step":"1"}
// Parameter: {"name":"height_ratio","value":0.42,"type":1,"min":"0","max":"1","step":"0.01"}


function eaGen(__modules__, rotate1, rotate2, height_ratio) {

__debug__ = true;
__model__ = null;
/** * **/
PI = Math.PI;
XY = __modules__._constants.XY;
YZ = __modules__._constants.YZ;
ZX = __modules__._constants.ZX;
YX = __modules__._constants.YX;
ZY = __modules__._constants.ZY;
XZ = __modules__._constants.XZ;
isNum = __modules__._types.isNum;
isInt = __modules__._types.isInt;
isFlt = __modules__._types.isFlt;
isBool = __modules__._types.isBool;
isStr = __modules__._types.isStr;
isList = __modules__._types.isList;
isDict = __modules__._types.isDict;
isVec2 = __modules__._types.isVec2;
isVec3 = __modules__._types.isVec3;
isCol = __modules__._types.isCol;
isRay = __modules__._types.isRay;
isPln = __modules__._types.isPln;
isNaN = __modules__._types.isNaN;
isNull = __modules__._types.isNull;
isUndef = __modules__._types.isUndef;
strRepl = __modules__._strs.strRepl;
strUpp = __modules__._strs.strUpp;
strLow = __modules__._strs.strLow;
strTrim = __modules__._strs.strTrim;
strTrimR = __modules__._strs.strTrimR;
strTrimL = __modules__._strs.strTrimL;
strSub = __modules__._strs.strSub;
strStarts = __modules__._strs.strStarts;
strEnds = __modules__._strs.strEnds;
strPadL = __modules__._strs.strPadL;
strPadR = __modules__._strs.strPadR;
isApprox = __modules__._util.isApprox;
isIn = __modules__._util.isIn;
isWithin = __modules__._util.isWithin;
min = __modules__._math.min;
max = __modules__._math.max;
pow = Math.pow;
sqrt = Math.sqrt;
exp = Math.exp;
log = Math.log;
round = __modules__._math.round;
sigFig = __modules__._math.sigFig;
ceil = Math.ceil;
floor = Math.floor;
abs = Math.abs;
sin = Math.sin;
asin = Math.asin;
sinh = Math.sinh;
asinh = Math.asinh;
cos = Math.cos;
acos = Math.acos;
cosh = Math.cosh;
acosh = Math.acosh;
tan = Math.tan;
atan = Math.atan;
tanh = Math.tanh;
atanh = Math.atanh;
atan2 = Math.atan2;
boolean = __modules__._mathjs.boolean;
number = __modules__._mathjs.number;
string = __modules__._mathjs.string;
mad = __modules__._mathjs.mad;
mean = __modules__._mathjs.mean;
median = __modules__._mathjs.median;
mode = __modules__._mathjs.mode;
prod = __modules__._mathjs.prod;
std = __modules__._mathjs.std;
vari = __modules__._mathjs.var;
sum = __modules__._mathjs.sum;
hypot = __modules__._mathjs.hypot;
norm = __modules__._mathjs.norm;
mod = __modules__._mathjs.mod;
square = __modules__._mathjs.square;
cube = __modules__._mathjs.cube;
remap = __modules__._arithmetic.remap;
distance = __modules__._geometry.distance;
distanceM = __modules__._geometry.distanceM;
distanceMS = __modules__._geometry.distanceMS;
intersect = __modules__._geometry.intersect;
project = __modules__._geometry.project;
range = __modules__._list.range;
isList = __modules__._list.isList;
len = __modules__._list.listLen;
listLen = __modules__._list.listLen;
listCount = __modules__._list.listCount;
listCopy = __modules__._list.listCopy;
listRep = __modules__._list.listRep;
listLast = __modules__._list.listLast;
listGet = __modules__._list.listGet;
listFind = __modules__._list.listFind;
listHas = __modules__._list.listHas;
listJoin = __modules__._list.listJoin;
listFlat = __modules__._list.listFlat;
listSlice = __modules__._list.listSlice;
listCull = __modules__._list.listCull;
listZip = __modules__._list.listZip;
listZip2 = __modules__._list.listZip2;
setMake = __modules__._set.setMake;
setUni = __modules__._set.setUni;
setInt = __modules__._set.setInt;
setDif = __modules__._set.setDif;
length = __modules__._list.length;
shuffle = __modules__._list.shuffle;
concat = __modules__._list.concat;
zip = __modules__._list.zip;
zip2 = __modules__._list.zip2;
vecAdd = __modules__._vec.vecAdd;
vecSub = __modules__._vec.vecSub;
vecDiv = __modules__._vec.vecDiv;
vecMult = __modules__._vec.vecMult;
vecSum = __modules__._vec.vecSum;
vecLen = __modules__._vec.vecLen;
vecSetLen = __modules__._vec.vecSetLen;
vecNorm = __modules__._vec.vecNorm;
vecRev = __modules__._vec.vecRev;
vecFromTo = __modules__._vec.vecFromTo;
vecAng = __modules__._vec.vecAng;
vecAng2 = __modules__._vec.vecAng2;
vecDot = __modules__._vec.vecDot;
vecCross = __modules__._vec.vecCross;
vecEqual = __modules__._vec.vecEqual;
vecLtoG = __modules__._vec.vecLtoG;
vecGtoL = __modules__._vec.vecGtoL;
plnMake = __modules__._plane.plnMake;
plnCopy = __modules__._plane.plnCopy;
plnMove = __modules__._plane.plnMove;
plnRot = __modules__._plane.plnRot;
plnLMove = __modules__._plane.plnLMove;
plnLRotX = __modules__._plane.plnLRotX;
plnLRotY = __modules__._plane.plnLRotY;
plnLRotZ = __modules__._plane.plnLRotZ;
rayMake = __modules__._ray.rayMake;
rayCopy = __modules__._ray.rayCopy;
rayMove = __modules__._ray.rayMove;
rayRot = __modules__._ray.rayRot;
rayLMove = __modules__._ray.rayLMove;
rayFromPln = __modules__._ray.rayFromPln;
rayLtoG = __modules__._ray.rayLtoG;
rayGtoL = __modules__._ray.rayGtoL;
colFalse = __modules__._colors.colFalse;
colScale = __modules__._colors.colScale;
radToDeg = __modules__._conversion.radToDeg;
degToRad = __modules__._conversion.degToRad;
numToStr = __modules__._conversion.numToStr;
rand = __modules__._rand.rand;
randInt = __modules__._rand.randInt;
randPick = __modules__._rand.randPick;
setattr = __modules__._model.__setAttrib__;
getattr = __modules__._model.__getAttrib__;


function exec_eaGen(__params__, rotate1_, rotate2_, height_ratio_){

function exec_eaGen_node_ksozm8bxl9(__params__, rotate1_, rotate2_, height_ratio_){
while (true) {
__modules__._model.__preprocess__( __params__.model);

let pln1_ = plnLRotZ(plnMake([0, -16, 0], [1, 0, 0], [0, 1, 0]), degToRad(rotate1_));

let pln2_ = plnLRotZ(plnMake([0, 16, 0], [1, 0, 0], [0, 1, 0]), degToRad(rotate2_));

let rec1_ = __modules__.pattern.Rectangle( __params__.model, pln1_, [28, 19] );

let rec2_ = __modules__.pattern.Rectangle( __params__.model, pln2_, [28, 19] );

let base1_ = __modules__.make.Polygon( __params__.model, rec1_ );

let base2_ = __modules__.make.Polygon( __params__.model, rec2_ );

__modules__.attrib.Set(__params__.model, base1_, 'num_floors',  round(28 * height_ratio_) );

__modules__.attrib.Set(__params__.model, base2_, 'num_floors',  28 -  __modules__.attrib.Get(__params__.model, base1_, 'num_floors') );
__modules__._model.__postprocess__( __params__.model);
break; }
return __params__.model;
}


function exec_eaGen_node_cqr8z92mi1c(__params__, rotate1_, rotate2_, height_ratio_){
while (true) {
__modules__._model.__preprocess__( __params__.model);

for (let  base_ of __modules__.query.Get(__params__.model, 'pg', null)){

let num_floors_ = __modules__.attrib.Get(__params__.model, base_, 'num_floors');

let edges_ = __modules__.query.Get(__params__.model, '_e', base_);

for (let  edge_ of [edges_[pythonList(0, edges_.length)], edges_[pythonList(2, edges_.length)]]){

let pline_ = __modules__.make.Polyline( __params__.model, edge_, 'open' );

let div_ = __modules__.make.Divide( __params__.model, pline_, 5, 'by_max_length' );

let facade_ = __modules__.make.Extrude( __params__.model, pline_, num_floors_ * 3, num_floors_, 'quads' );

__modules__.attrib.Set(__params__.model, facade_, 'type',  "facade" );
}

let wall_ = __modules__.make.Extrude( __params__.model, [edges_[pythonList(1, edges_.length)], edges_[pythonList(3, edges_.length)]], num_floors_ * 3, 1, 'quads' );

__modules__.attrib.Set(__params__.model, wall_, 'type',  "wall" );

let roof_ = __modules__.make.Copy( __params__.model, base_, [0, 0, num_floors_ * 3] );

let roof_ex_ = __modules__.make.Extrude( __params__.model, roof_, 2, 1, 'quads' );
}

let site_rec_ = __modules__.pattern.Rectangle( __params__.model, JSON.parse(JSON.stringify(XY)), [30, 70] );

let site_pgon_ = __modules__.make.Polygon( __params__.model, site_rec_ );

let coll_ = __modules__.collection.Create( __params__.model, __modules__.query.Get(__params__.model, 'pg', null), "buildings" );
__modules__._model.__postprocess__( __params__.model);
break; }
return __params__.model;
}


function exec_eaGen_node_xv6lk5nex8j(__params__, rotate1_, rotate2_, height_ratio_){
while (true) {
__modules__._model.__preprocess__( __params__.model);

let coll_buildings_ = __modules__.collection.Get( __params__.model, "buildings" );

let facade_pgons_ = __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'pg', coll_buildings_), ['type', null], '==', "facade");

for (let  pgon_ of facade_pgons_){

let nor_ = __modules__.calc.Normal( __params__.model, pgon_, 1 );

let cen_ = __modules__.calc.Centroid( __params__.model, pgon_, 'ps_average' );

let ray_ = rayMake(cen_, nor_);

let vis_ = __modules__.visualize.Ray( __params__.model, ray_, 0.1 );

__modules__.attrib.Set(__params__.model, pgon_, 'ray',  ray_ );
}
__modules__._model.__postprocess__( __params__.model);
break; }
return __params__.model;
}


function exec_eaGen_node_df03erlhiog(__params__, rotate1_, rotate2_, height_ratio_){
while (true) {
__modules__._model.__preprocess__( __params__.model);

for (let  base_ of __modules__.query.Get(__params__.model, 'pg', null)){

let ex_ = __modules__.make.Extrude( __params__.model, base_, 2 + ( __modules__.attrib.Get(__params__.model, base_, 'num_floors')* 3), 1, 'quads' );
}

let coll_ = __modules__.collection.Create( __params__.model, __modules__.query.Get(__params__.model, 'pg', null), "buildings_obstructions" );
__modules__._model.__postprocess__( __params__.model);
break; }
return __params__.model;
}


function exec_eaGen_node_6rzn66s3pic(__params__, rotate1_, rotate2_, height_ratio_){
while (true) {
__modules__._model.__preprocess__( __params__.model);

__modules__.io.Export( __params__.model, null, "ea_model1.gi", 'gi', 'Save to Local Storage' );

return null;
break; }
}

var merged;
let result_exec_eaGen_node_s9go9g7hal9 = __params__.model;

__params__.model = result_exec_eaGen_node_s9go9g7hal9;
let result_exec_eaGen_node_ksozm8bxl9 = exec_eaGen_node_ksozm8bxl9(__params__, rotate1_, rotate2_, height_ratio_);

__params__.model = duplicateModel(result_exec_eaGen_node_ksozm8bxl9);
let result_exec_eaGen_node_cqr8z92mi1c = exec_eaGen_node_cqr8z92mi1c(__params__, rotate1_, rotate2_, height_ratio_);

__params__.model = result_exec_eaGen_node_cqr8z92mi1c;
let result_exec_eaGen_node_xv6lk5nex8j = exec_eaGen_node_xv6lk5nex8j(__params__, rotate1_, rotate2_, height_ratio_);

__params__.model = result_exec_eaGen_node_ksozm8bxl9;
let result_exec_eaGen_node_df03erlhiog = exec_eaGen_node_df03erlhiog(__params__, rotate1_, rotate2_, height_ratio_);

__params__.model = mergeInputs([result_exec_eaGen_node_xv6lk5nex8j, result_exec_eaGen_node_df03erlhiog]);
let result_exec_eaGen_node_6rzn66s3pic = exec_eaGen_node_6rzn66s3pic(__params__, rotate1_, rotate2_, height_ratio_);

return result_exec_eaGen_node_6rzn66s3pic;
}


function pythonList(x, l){
    if (x < 0) {
        return x + l;
    }
    return x;
}

function mergeInputs(models){
    let result = __modules__._model.__new__();
    try {
        result.debug = __debug__;
    } catch (ex) {}
    for (let model of models){
        __modules__._model.__merge__(result, model);
    }
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
__params__["model"].setModelData(JSON.parse(__model__))
}
__params__["model"].debug = __debug__;
__params__["console"] = [];
__params__["modules"] = __modules__;
const result = exec_eaGen(__params__, rotate1, rotate2, height_ratio);
if (result === __params__.model) { return { "model": __params__.model, "result": null };}
return {"model": __params__.model, "result": result};
/** * **/

}

module.exports = eaGen;
