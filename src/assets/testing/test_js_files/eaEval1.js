/**
 * to use this code: import eaEval from this js file as well as the GI module
 * run eaEval with the GI module as input along with other start node input
 * e.g.:
 * const eaEval = require('./eaEval.js').eaEval
 * const module = require('gi-module')
 * const result = eaEval(module, start_input_1, start_input_2, ...);
 *
 * returns: a json object:
 *   _ result.model -> gi model of the flowchart
 *   _ result.result -> returned output of the flowchart, if the flowchart does not return any value, result.result is the model of the flowchart
 */



function eaEval(__modules__) {

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


function exec_eaEval(__params__){

function exec_eaEval_node_kociohlzb0k(__params__){
while (true) {
__modules__._model.__preprocess__( __params__.model);

__modules__.modify.Delete( __params__.model, null, 'delete_selected' );

let posis_ = __modules__.pattern.Line( __params__.model, [[30, 0, 0], [0, 1, 0], [1, 0, 0]], 150, 30 );

let street_pline_ = __modules__.make.Polyline( __params__.model, posis_, 'open' );

let street_pgon_ = __modules__.poly2d.OffsetMitre( __params__.model, street_pline_, 7, 5, 'square_end' );

__modules__.visualize.Color( __params__.model, street_pgon_, [0.7, 0.7, 1] );

let coll_ = __modules__.collection.Create( __params__.model, [street_pline_, street_pgon_[pythonList(0, street_pgon_.length)]], "street" );
__modules__._model.__postprocess__( __params__.model);
break; }
return __params__.model;
}


function exec_eaEval_node_rj519f8s6gk(__params__){
while (true) {
__modules__._model.__preprocess__( __params__.model);

__modules__.modify.Delete( __params__.model, null, 'delete_selected' );

let grid_ = __modules__.pattern.Grid( __params__.model, JSON.parse(JSON.stringify(XY)), 120, 3, 'flat' );

__modules__.list.Remove( grid_, 4, 'index' );

for (let  posi_ of grid_){

let xyz_ = __modules__.attrib.Get(__params__.model, posi_, 'xyz');

let rand_seed_ = xyz_[pythonList(0, xyz_.length)] + (xyz_[pythonList(1, xyz_.length)] * 0.12);

let rec_ = __modules__.pattern.Rectangle( __params__.model, __modules__.attrib.Get(__params__.model, posi_, 'xyz'), [30, 50] );

let pgon_ = __modules__.make.Polygon( __params__.model, rec_ );

let ex_ = __modules__.make.Extrude( __params__.model, pgon_, 3 * randInt(3, 5, rand_seed_) * 3, 1, 'quads' );
}

let coll_ = __modules__.collection.Create( __params__.model, __modules__.query.Get(__params__.model, 'pg', null), "context" );
__modules__._model.__postprocess__( __params__.model);
break; }
return __params__.model;
}


function exec_eaEval_node_jlerhmfoswa(__params__){
while (true) {
__modules__._model.__preprocess__( __params__.model);

let coll_ = __modules__.collection.Get( __params__.model, "buildings_obstructions" );

__modules__.modify.Delete( __params__.model, coll_, 'keep_selected' );
__modules__._model.__postprocess__( __params__.model);
break; }
return __params__.model;
}


function exec_eaEval_node_776hci9slfu(__params__){
while (true) {
__modules__._model.__preprocess__( __params__.model);

let coll_ = __modules__.collection.Create( __params__.model, __modules__.query.Get(__params__.model, 'pg', null), "obstructions" );
__modules__._model.__postprocess__( __params__.model);
break; }
return __params__.model;
}


function exec_eaEval_node_ld2d02szfkf(__params__){
while (true) {
__modules__._model.__preprocess__( __params__.model);

let coll_ = __modules__.collection.Get( __params__.model, "buildings" );

__modules__.modify.Delete( __params__.model, coll_, 'keep_selected' );
__modules__._model.__postprocess__( __params__.model);
break; }
return __params__.model;
}



function exec_eaEval_node_1i6abp0v46m_sigmoid_(__params__, values_, minmax_) {

let new_values_ = [];

for (let  value_ of values_){

let mapped_value_ = remap(value_, minmax_, [-6, 6]);

let e_pow_ = exp(mapped_value_);

__modules__.list.Add( new_values_, e_pow_ / (e_pow_ + 1), 'to_end' );
}

return new_values_;
}

function exec_eaEval_node_1i6abp0v46m(__params__){
while (true) {
__modules__._model.__preprocess__( __params__.model);

let coll_buildings_ = __modules__.collection.Get( __params__.model, "buildings" );

let coll_obstructions_ = __modules__.collection.Get( __params__.model, "obstructions" );

let coll_buildings_obstructions_ = __modules__.collection.Get( __params__.model, "buildings_obstructions" );

let coll_street_ = __modules__.collection.Get( __params__.model, "street" );

let facade_pgons_ = __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'pg', coll_buildings_), ['type', null], '==', "facade");

let street_xyzs_ = __modules__.attrib.Get(__params__.model,  __modules__.query.Get(__params__.model, 'ps',  __modules__.query.Get(__params__.model, 'pl', coll_street_)), 'xyz');

let street_pgon_ = __modules__.query.Get(__params__.model, 'pg', coll_street_);

let obstructions_ = __modules__.query.Get(__params__.model, 'pg', coll_obstructions_);

__modules__.list.Add( obstructions_, street_pgon_, 'to_end' );

let all_rays_ = [];

for (let  pgon_ of facade_pgons_){

let ray_ = __modules__.attrib.Get(__params__.model, pgon_, 'ray');

let origin_ = vecAdd(ray_[pythonList(0, ray_.length)], vecSetLen(ray_[pythonList(1, ray_.length)], 0.1));

let normal_ = vecNorm(ray_[pythonList(1, ray_.length)]);

let dirs_ = vecFromTo(origin_, street_xyzs_);

let rays_ = rayMake(origin_, dirs_);

__modules__.list.Add( all_rays_, rays_, 'to_end' );
}

let result_ = __modules__.analyze.Raytrace( __params__.model, all_rays_, obstructions_, 200, 'all' );

for (let  i_ of range(len(result_))){

let all_intensity_ = [0];

for (let  j_ of range(len(result_[pythonList(i_, result_.length)]['hit_pgons']))){

let hit_pgon_ = result_[pythonList(i_, result_.length)]['hit_pgons'][pythonList(j_, result_[pythonList(i_, result_.length)]['hit_pgons'].length)];

if (hit_pgon_ == street_pgon_){

let dist_ = result_[pythonList(i_, result_.length)]['distances'][pythonList(j_, result_[pythonList(i_, result_.length)]['distances'].length)];

let intensity_ = 1 / (dist_ * dist_);

__modules__.list.Add( all_intensity_, intensity_, 'to_end' );
}
}

__modules__.attrib.Set(__params__.model, facade_pgons_[pythonList(i_, facade_pgons_.length)], 'noise',  sum(all_intensity_) );
}

__modules__.modify.Delete( __params__.model, coll_buildings_, 'keep_selected' );

__modules__.modify.Move( __params__.model, __modules__.query.Get(__params__.model, 'pg', null), [0, 100, 0] );

let noise_list_ = __modules__.attrib.Get(__params__.model, facade_pgons_, 'noise');

let noise_score_values_ = exec_eaEval_node_1i6abp0v46m_sigmoid_(__params__, noise_list_, [0, 0.02]);
if (__params__.terminated) { return __params__.model;}

__modules__.attrib.Set(__params__.model, coll_buildings_, 'score',  mean(noise_score_values_) );

__modules__.attrib.Set( __params__.model, facade_pgons_, "noise_score", noise_score_values_, 'many_values' );

__modules__.visualize.Gradient( __params__.model, facade_pgons_, "noise_score", null, 'false_color' );

__modules__.attrib.Set(__params__.model, coll_buildings_, 'analysis_type',  "noise" );
__modules__._model.__postprocess__( __params__.model);
break; }
return __params__.model;
}



function exec_eaEval_node_b5rb851zbfb_sigmoid_(__params__, values_, minmax_) {

let new_values_ = [];

for (let  value_ of values_){

let mapped_value_ = remap(value_, minmax_, [-6, 6]);

let e_pow_ = exp(mapped_value_);

__modules__.list.Add( new_values_, e_pow_ / (e_pow_ + 1), 'to_end' );
}

return new_values_;
}

function exec_eaEval_node_b5rb851zbfb(__params__){
while (true) {
__modules__._model.__preprocess__( __params__.model);

__modules__.attrib.Set(__params__.model, null, 'geolocation',  {"latitude": 20,"longitude": 100,"elevation": 0.5} );

let coll_buildings_ = __modules__.collection.Get( __params__.model, "buildings" );

let coll_obstructions_ = __modules__.collection.Get( __params__.model, "obstructions" );

let coll_buildings_obstructions_ = __modules__.collection.Get( __params__.model, "buildings_obstructions" );

let facade_pgons_ = __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'pg', coll_buildings_), ['type', null], '==', "facade");

let results_ = __modules__.analyze.Sun( __params__.model, __modules__.attrib.Get(__params__.model, facade_pgons_, 'ray'), 1, coll_obstructions_, 500, 'direct_weighted' );

__modules__.attrib.Set( __params__.model, facade_pgons_, "sun_exposure", results_['direct'], 'many_values' );

__modules__.visualize.Gradient( __params__.model, facade_pgons_, "sun_exposure", [0, 0.5], 'false_color' );

__modules__.modify.Delete( __params__.model, coll_buildings_, 'keep_selected' );

__modules__.modify.Move( __params__.model, __modules__.query.Get(__params__.model, 'pg', null), [0, 200, 0] );

let sun_exposure_list_ = __modules__.attrib.Get(__params__.model, facade_pgons_, 'sun_exposure');

let sun_exposure_score_values_ = exec_eaEval_node_b5rb851zbfb_sigmoid_(__params__, sun_exposure_list_, [0, 0.7]);
if (__params__.terminated) { return __params__.model;}

__modules__.attrib.Set(__params__.model, coll_buildings_, 'score',  mean(sun_exposure_score_values_) );

__modules__.attrib.Set( __params__.model, facade_pgons_, "sun_exposure_score", sun_exposure_score_values_, 'many_values' );

__modules__.visualize.Gradient( __params__.model, facade_pgons_, "sun_exposure_score", null, 'false_color' );

__modules__.attrib.Set(__params__.model, coll_buildings_, 'analysis_type',  "sun" );
__modules__._model.__postprocess__( __params__.model);
break; }
return __params__.model;
}



function exec_eaEval_node_hs2ugutprhf_sigmoid_(__params__, values_, minmax_) {

let new_values_ = [];

for (let  value_ of values_){

let mapped_value_ = remap(value_, minmax_, [-6, 6]);

let e_pow_ = exp(mapped_value_);

__modules__.list.Add( new_values_, e_pow_ / (e_pow_ + 1), 'to_end' );
}

return new_values_;
}

function exec_eaEval_node_hs2ugutprhf(__params__){
while (true) {
__modules__._model.__preprocess__( __params__.model);

let coll_buildings_ = __modules__.collection.Get( __params__.model, "buildings" );

let coll_obstructions_ = __modules__.collection.Get( __params__.model, "obstructions" );

let coll_buildings_obstructions_ = __modules__.collection.Get( __params__.model, "buildings_obstructions" );

let facade_pgons_ = __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'pg', coll_buildings_), ['type', null], '==', "facade");

let max_view_angle_ = degToRad(100);

let num_rays_ = round(max_view_angle_ / 0.15);

let arc_ = __modules__.pattern.Arc( __params__.model, plnRot(JSON.parse(JSON.stringify(XZ)), [[0, 0, 0], [0, 1, 0]], -(JSON.parse(JSON.stringify(PI)) - max_view_angle_) / 2), 2, num_rays_, max_view_angle_ );

let fan_rays_ = rayMake([0, 0, 0],  __modules__.attrib.Get(__params__.model, arc_, 'xyz'));

let all_rays_ = [];

for (let  pgon_ of facade_pgons_){

let pln_ = __modules__.calc.Plane( __params__.model, pgon_ );

pln_ = plnLMove(pln_, [0, 0, 0.1]);

let rays_ = rayGtoL(fan_rays_, pln_);

__modules__.list.Add( all_rays_, rays_, 'to_end' );
}

let max_view_dist_ = 50;

let result_ = __modules__.analyze.Raytrace( __params__.model, all_rays_, coll_obstructions_, max_view_dist_, 'all' );

let max_total_dist_ = num_rays_ * max_view_dist_;

for (let  i_ of range(len(facade_pgons_))){

__modules__.attrib.Set(__params__.model, facade_pgons_[pythonList(i_, facade_pgons_.length)], 'unob_view',  result_[pythonList(i_, result_.length)]['total_dist'] / max_total_dist_ );
}

__modules__.visualize.Gradient( __params__.model, facade_pgons_, "unob_view", null, 'false_color' );

__modules__.modify.Delete( __params__.model, coll_buildings_, 'keep_selected' );

__modules__.modify.Move( __params__.model, __modules__.query.Get(__params__.model, 'pg', null), [0, 400, 0] );

let unob_view_list_ = __modules__.attrib.Get(__params__.model, facade_pgons_, 'unob_view');

let unob_view_score_values_ = exec_eaEval_node_hs2ugutprhf_sigmoid_(__params__, unob_view_list_, [1, 0.3]);
if (__params__.terminated) { return __params__.model;}

__modules__.attrib.Set(__params__.model, coll_buildings_, 'score',  mean(unob_view_score_values_) );

__modules__.attrib.Set( __params__.model, facade_pgons_, "unob_view_score", unob_view_score_values_, 'many_values' );

__modules__.visualize.Gradient( __params__.model, facade_pgons_, "unob_view_score", null, 'false_color' );

__modules__.attrib.Set(__params__.model, coll_buildings_, 'analysis_type',  "view" );
__modules__._model.__postprocess__( __params__.model);
break; }
return __params__.model;
}



function exec_eaEval_node_a6r0zg7rf2e_sigmoid_(__params__, values_, minmax_) {

let new_values_ = [];

for (let  value_ of values_){

let mapped_value_ = remap(value_, minmax_, [-6, 6]);

let e_pow_ = exp(mapped_value_);

__modules__.list.Add( new_values_, e_pow_ / (e_pow_ + 1), 'to_end' );
}

return new_values_;
}

function exec_eaEval_node_a6r0zg7rf2e(__params__){
while (true) {
__modules__._model.__preprocess__( __params__.model);

let coll_buildings_ = __modules__.collection.Get( __params__.model, "buildings" );

let coll_obstructions_ = __modules__.collection.Get( __params__.model, "obstructions" );

let coll_buildings_obstructions_ = __modules__.collection.Get( __params__.model, "buildings_obstructions" );

let facade_pgons_ = __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'pg', coll_buildings_), ['type', null], '==', "facade");

let results_ = __modules__.analyze.Sky( __params__.model, __modules__.attrib.Get(__params__.model, facade_pgons_, 'ray'), 1, coll_obstructions_, 500, 'weighted' );

__modules__.attrib.Set( __params__.model, facade_pgons_, "sky_exposure", results_['exposure'], 'many_values' );

__modules__.visualize.Gradient( __params__.model, facade_pgons_, "sky_exposure", [0, 0.5], 'false_color' );

__modules__.modify.Delete( __params__.model, coll_buildings_, 'keep_selected' );

__modules__.modify.Move( __params__.model, __modules__.query.Get(__params__.model, 'pg', null), [0, 300, 0] );

let sky_exposure_list_ = __modules__.attrib.Get(__params__.model, facade_pgons_, 'sky_exposure');

let sky_exposure_score_values_ = exec_eaEval_node_a6r0zg7rf2e_sigmoid_(__params__, sky_exposure_list_, [0.3, 0.1]);
if (__params__.terminated) { return __params__.model;}

__modules__.attrib.Set(__params__.model, coll_buildings_, 'score',  mean(sky_exposure_score_values_) );

__modules__.attrib.Set( __params__.model, facade_pgons_, "sky_exposure_score", sky_exposure_score_values_, 'many_values' );

__modules__.visualize.Gradient( __params__.model, facade_pgons_, "sky_exposure_score", null, 'false_color' );

__modules__.attrib.Set(__params__.model, coll_buildings_, 'analysis_type',  "sky" );
__modules__._model.__postprocess__( __params__.model);
break; }
return __params__.model;
}



function exec_eaEval_node_1mb1vkrgun2_radarChart_(__params__, values_, origin_, radius_) {

let posis_ = [];

let coll_ = __modules__.collection.Create( __params__.model, [], "radar_plot" );

for (let  i_ of range(len(values_))){

let ray_ = rayRot([origin_, [radius_ * 1.1, 0, 0]], [origin_, [0, 0, 1]], i_ * 2 * JSON.parse(JSON.stringify(PI)) / len(values_));

let axis_ = __modules__.visualize.Ray( __params__.model, ray_, radius_ / 10 );

let posi_ = __modules__.make.Position( __params__.model, vecAdd(origin_, vecSetLen(ray_[pythonList(1, ray_.length)], values_[pythonList(i_, values_.length)] * radius_)) );

__modules__.list.Add( posis_, posi_, 'to_end' );
}

let radar_pgon_ = __modules__.make.Polygon( __params__.model, posis_ );

__modules__.collection.Add( __params__.model, coll_, radar_pgon_ );

origin_[pythonList(2, origin_.length)] = origin_[pythonList(2, origin_.length)] + 0.1;

for ( i_ of range(1, 11)){

let arc_ = __modules__.pattern.Arc( __params__.model, origin_, radius_ * (i_ / 10), len(values_), null );

let pline_ = __modules__.make.Polyline( __params__.model, arc_, 'close' );

__modules__.collection.Add( __params__.model, coll_, pline_ );
}

return coll_;
}

function exec_eaEval_node_1mb1vkrgun2(__params__){
while (true) {
__modules__._model.__preprocess__( __params__.model);

let coll_noise_ = __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'co', null), ['analysis_type', null], '==', "noise");

coll_noise_ = coll_noise_[pythonList(0, coll_noise_.length)];

let coll_sun_ = __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'co', null), ['analysis_type', null], '==', "sun");

coll_sun_ = coll_sun_[pythonList(0, coll_sun_.length)];

let coll_sky_ = __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'co', null), ['analysis_type', null], '==', "sky");

coll_sky_ = coll_sky_[pythonList(0, coll_sky_.length)];

let coll_view_ = __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'co', null), ['analysis_type', null], '==', "view");

coll_view_ = coll_view_[pythonList(0, coll_view_.length)];

let scores_ = [ __modules__.attrib.Get(__params__.model, coll_noise_, 'score'),  __modules__.attrib.Get(__params__.model, coll_sun_, 'score'),  __modules__.attrib.Get(__params__.model, coll_sky_, 'score'),  __modules__.attrib.Get(__params__.model, coll_view_, 'score')];

let coll_radar_ = exec_eaEval_node_1mb1vkrgun2_radarChart_(__params__, scores_, [0, 0, 0], 30);
if (__params__.terminated) { return __params__.model;}

let coll_option_ = __modules__.collection.Create( __params__.model, [coll_noise_, coll_sun_, coll_sky_, coll_view_, coll_radar_], "option" );
printFunc(__params__.console,'coll_option', coll_option_);

let weight_noise_ = 25;

let weight_sun_ = 25;

let weight_sky_ = 25;

let weight_view_ = 25;

let score_noise_ = __modules__.attrib.Get(__params__.model, coll_noise_, 'score')* weight_noise_;

let score_sun_ = __modules__.attrib.Get(__params__.model, coll_sun_, 'score')* weight_sun_;

let score_sky_ = __modules__.attrib.Get(__params__.model, coll_sky_, 'score')* weight_sky_;

let score_view_ = __modules__.attrib.Get(__params__.model, coll_view_, 'score')* weight_view_;

__modules__.attrib.Set(__params__.model, coll_option_, 'score',  score_noise_ + score_sun_ + score_sky_ + score_view_ );
__modules__._model.__postprocess__( __params__.model);
break; }
return __params__.model;
}


function exec_eaEval_node_jth4gwendrl(__params__){
while (true) {
__modules__._model.__preprocess__( __params__.model);

let coll_option_ = __modules__.collection.Get( __params__.model, "option" );

let __return_value__ = __modules__._Output.Return(__params__.model, {"score":  __modules__.attrib.Get(__params__.model, coll_option_, 'score')});
return __return_value__;
break; }
}

var merged;
let result_exec_eaEval_node_8kffezb1g6x = __params__.model;

__params__.model = duplicateModel(result_exec_eaEval_node_8kffezb1g6x);
let result_exec_eaEval_node_kociohlzb0k = exec_eaEval_node_kociohlzb0k(__params__);

__params__.model = duplicateModel(result_exec_eaEval_node_8kffezb1g6x);
let result_exec_eaEval_node_rj519f8s6gk = exec_eaEval_node_rj519f8s6gk(__params__);

__params__.model = duplicateModel(result_exec_eaEval_node_8kffezb1g6x);
let result_exec_eaEval_node_jlerhmfoswa = exec_eaEval_node_jlerhmfoswa(__params__);

__params__.model = mergeInputs([result_exec_eaEval_node_rj519f8s6gk, result_exec_eaEval_node_jlerhmfoswa]);
let result_exec_eaEval_node_776hci9slfu = exec_eaEval_node_776hci9slfu(__params__);

__params__.model = result_exec_eaEval_node_8kffezb1g6x;
let result_exec_eaEval_node_ld2d02szfkf = exec_eaEval_node_ld2d02szfkf(__params__);

__params__.model = mergeInputs([result_exec_eaEval_node_kociohlzb0k, result_exec_eaEval_node_776hci9slfu, result_exec_eaEval_node_ld2d02szfkf]);
let result_exec_eaEval_node_1i6abp0v46m = exec_eaEval_node_1i6abp0v46m(__params__);

__params__.model = mergeInputs([result_exec_eaEval_node_776hci9slfu, result_exec_eaEval_node_ld2d02szfkf]);
let result_exec_eaEval_node_b5rb851zbfb = exec_eaEval_node_b5rb851zbfb(__params__);

__params__.model = mergeInputs([result_exec_eaEval_node_776hci9slfu, result_exec_eaEval_node_ld2d02szfkf]);
let result_exec_eaEval_node_hs2ugutprhf = exec_eaEval_node_hs2ugutprhf(__params__);

__params__.model = mergeInputs([result_exec_eaEval_node_776hci9slfu, result_exec_eaEval_node_ld2d02szfkf]);
let result_exec_eaEval_node_a6r0zg7rf2e = exec_eaEval_node_a6r0zg7rf2e(__params__);

__params__.model = mergeInputs([result_exec_eaEval_node_1i6abp0v46m, result_exec_eaEval_node_b5rb851zbfb, result_exec_eaEval_node_hs2ugutprhf, result_exec_eaEval_node_a6r0zg7rf2e]);
let result_exec_eaEval_node_1mb1vkrgun2 = exec_eaEval_node_1mb1vkrgun2(__params__);

__params__.model = result_exec_eaEval_node_1mb1vkrgun2;
let result_exec_eaEval_node_jth4gwendrl = exec_eaEval_node_jth4gwendrl(__params__);

return result_exec_eaEval_node_jth4gwendrl;
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
__params__["model"].setData(JSON.parse(__model__))
}
__params__["model"].debug = __debug__;
__params__["console"] = [];
__params__["modules"] = __modules__;
const result = exec_eaEval(__params__);
if (result === __params__.model) { return { "model": __params__.model, "result": null };}
return {"model": __params__.model, "result": result};
/** * **/

}

module.exports = eaEval;
