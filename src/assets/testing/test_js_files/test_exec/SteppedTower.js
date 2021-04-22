/**
 * to use this code: import SteppedTower from this js file as well as the GI module
 * run SteppedTower with the GI module as input along with other start node input
 * e.g.:
 * const SteppedTower = require('./SteppedTower.js').SteppedTower
 * const module = require('gi-module')
 * const result = await SteppedTower(module, start_input_1, start_input_2, ...);
 *
 * returns: a json object:
 *   _ result.model -> gi model of the flowchart
 *   _ result.result -> returned output of the flowchart, if the flowchart does not return any value, result.result is the model of the flowchart
 */

// Parameter: {"name":"COMM_GFA","value":"22957.899","type":0}
// Parameter: {"name":"MIXED_GFA","value":"72793.36575","type":0}
// Parameter: {"name":"RESI_RATIO","value":"0.6","type":0}
// Parameter: {"name":"GEOJSON","value":"\\"___LONG_STRING_DATA___\\"","type":0}
// Parameter: {"name":"COLORS","value":"{\\"color1\\": [0.9, 0.5, 0.5],\\"color2\\": [0.9, 0.6, 0.5],\\"color3\\": [0.9, 0.7, 0.5],\\"green\\": [0.7, 0.9, 0.7],\\"openings\\": [0.8, 0.8, 0.9]}","type":0}
// Parameter: {"name":"DETAILED","value":false,"type":2}


async function SteppedTower(__modules__, COMM_GFA, MIXED_GFA, RESI_RATIO, GEOJSON, COLORS, DETAILED) {

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

async function exec_SteppedTower_makeOpening(__params__, QUADS_, W_INSETS_, H_INSETS_, EXTRUDE_DIST_, EXTRUDE_NSPLITS_){

async function exec_SteppedTower_makeOpening_node_ukahp3i4ish(__params__, QUADS_, W_INSETS_, H_INSETS_, EXTRUDE_DIST_, EXTRUDE_NSPLITS_){
__modules__._model.__preprocess__( __params__.model);

let result_coll_ = __modules__.collection.Create( __params__.model, [], "make_opening_result" );

let clones_ = __modules__.make.Clone( __params__.model, QUADS_ );

for (let  quad_ of clones_){

let posis_ = __modules__.query.Get(__params__.model, 'ps', quad_);

let edges_ = __modules__.query.Get(__params__.model, '_e', quad_);

__modules__.attrib.Push( __params__.model, posis_, ["xyz", 2, "z"], '_e', 'average' );

let min_e_z_i_ = listFind(__debug__, edges_, ( __modules__.query.Filter(__params__.model, edges_, ['z', null], '==', min(__debug__,  __modules__.attrib.Get(__params__.model, edges_, 'z'))))[pythonList(0, ( __modules__.query.Filter(__params__.model, edges_, ['z', null], '==', min(__debug__,  __modules__.attrib.Get(__params__.model, edges_, 'z')))).length)]);

__modules__.edit.Shift( __params__.model, quad_, min_e_z_i_ );

let pln_ = __modules__.calc.Plane( __params__.model, quad_ );

let hole_ = __modules__.make.Copy( __params__.model, quad_, null );

let lengths_ = __modules__.calc.Length( __params__.model, __modules__.query.Get(__params__.model, '_e', quad_) );

let scale_x_ = (lengths_[pythonList(0, lengths_.length)] - sum(__debug__, W_INSETS_)) / lengths_[pythonList(0, lengths_.length)];

let scale_y_ = (lengths_[pythonList(1, lengths_.length)] - sum(__debug__, H_INSETS_)) / lengths_[pythonList(1, lengths_.length)];

__modules__.modify.Scale( __params__.model, hole_, pln_, [scale_x_, scale_y_, 1] );

let dist_x_ = (W_INSETS_[pythonList(0, W_INSETS_.length)] - W_INSETS_[pythonList(1, W_INSETS_.length)]) / 2;

let dist_y_ = (H_INSETS_[pythonList(0, H_INSETS_.length)] - H_INSETS_[pythonList(1, H_INSETS_.length)]) / 2;

let vec_x_ = vecSetLen(__debug__, pln_[pythonList(1, pln_.length)], dist_x_);

let vec_y_ = vecSetLen(__debug__, pln_[pythonList(2, pln_.length)], dist_y_);

__modules__.modify.Move( __params__.model, hole_, vecAdd(__debug__, vec_x_, vec_y_) );

let wire_ = __modules__.edit.Hole( __params__.model, quad_, hole_ );

let normal_ = __modules__.calc.Normal( __params__.model, quad_, EXTRUDE_DIST_ );

let ex_ = __modules__.make.Extrude( __params__.model, hole_, normal_, 1, 'quads' );

let sides_ = ex_.slice(0, -1);

let glass_ = ex_[pythonList(-1, ex_.length)];

__modules__.edit.Delete( __params__.model, hole_, 'delete_selected' );

if (sum(__debug__, EXTRUDE_NSPLITS_) > 0){

let glass_edges_ = __modules__.query.Get(__params__.model, '_e', glass_);

let plines_ = __modules__.make.Polyline( __params__.model, [glass_edges_[pythonList(0, glass_edges_.length)], glass_edges_[pythonList(2, glass_edges_.length)]], 'open' );

__modules__.edit.Reverse( __params__.model, plines_[pythonList(1, plines_.length)] );

let div_ = __modules__.edit.Divide( __params__.model, plines_, EXTRUDE_NSPLITS_[pythonList(0, EXTRUDE_NSPLITS_.length)] + 1, 'by_number' );

let split_glass_ = __modules__.make.Loft( __params__.model, plines_, EXTRUDE_NSPLITS_[pythonList(1, EXTRUDE_NSPLITS_.length)] + 1, 'open_quads' );

__modules__.edit.Delete( __params__.model, [glass_, plines_], 'delete_selected' );

glass_ = split_glass_;
}

__modules__.attrib.Set(__params__.model, sides_, 'component',  'sides' );

__modules__.attrib.Set(__params__.model, glass_, 'component',  'glass' );

__modules__.collection.Add( __params__.model, result_coll_, [sides_, glass_, quad_] );
}
__modules__._model.__postprocess__( __params__.model);
}


async function exec_SteppedTower_makeOpening_node_tjwivu6ssu(__params__, QUADS_, W_INSETS_, H_INSETS_, EXTRUDE_DIST_, EXTRUDE_NSPLITS_){
__modules__._model.__preprocess__( __params__.model);

let result_coll_ = __modules__.collection.Get( __params__.model, "make_opening_result" );

__modules__.util.Select( __params__.model, result_coll_ );

let result_pgons_ = __modules__.query.Get(__params__.model, 'pg', result_coll_);

__modules__.collection.Remove( __params__.model, result_coll_, result_pgons_ );

__modules__.edit.Delete( __params__.model, result_coll_, 'delete_selected' );

let __return_value__ = __modules__._Output.Return(__params__.model, result_pgons_);
return __return_value__;
}

var merged;
let ssid_exec_SteppedTower_makeOpening_node_ovwarr68k1k = __params__.model.getActiveSnapshot();

let ssid_exec_SteppedTower_makeOpening_node_ukahp3i4ish = ssid_exec_SteppedTower_makeOpening_node_ovwarr68k1k;

await exec_SteppedTower_makeOpening_node_ukahp3i4ish(__params__, QUADS_, W_INSETS_, H_INSETS_, EXTRUDE_DIST_, EXTRUDE_NSPLITS_);

let ssid_exec_SteppedTower_makeOpening_node_tjwivu6ssu = __params__.model.nextSnapshot([ssid_exec_SteppedTower_makeOpening_node_ukahp3i4ish]);

return await exec_SteppedTower_makeOpening_node_tjwivu6ssu(__params__, QUADS_, W_INSETS_, H_INSETS_, EXTRUDE_DIST_, EXTRUDE_NSPLITS_);
}

async function exec_SteppedTower(__params__, COMM_GFA_, MIXED_GFA_, RESI_RATIO_, GEOJSON_, COLORS_, DETAILED_){

async function exec_SteppedTower_node_vkb6pu6js2(__params__, COMM_GFA_, MIXED_GFA_, RESI_RATIO_, GEOJSON_, COLORS_, DETAILED_){
__modules__._model.__preprocess__( __params__.model);

__modules__.attrib.Set(__params__.model, null, 'geolocation',  {"latitude": 1.284778,"longitude": 103.845553} );
__modules__._model.__postprocess__( __params__.model);
}


async function exec_SteppedTower_node_p6l06ti8zo(__params__, COMM_GFA_, MIXED_GFA_, RESI_RATIO_, GEOJSON_, COLORS_, DETAILED_){
__modules__._model.__preprocess__( __params__.model);

let boundary_geojson_ = '{"crs": {"properties": {"name": "urn:ogc:def:crs:OGC:2:84"}, "type": "name"}, "type": "FeatureCollection", "features": [{"properties": {"UUID": "0dcc8d90-3a2c-41a3-ad22-d07e718b0658", "name": "boundary"}, "type": "Feature", "geometry": {"coordinates": [[[103.8449396183202, 1.2844658480423194], [103.84558145066937, 1.2856327418710998], [103.84670769753889, 1.2849888809015289], [103.84606286828624, 1.2838498371548899], [103.8449396183202, 1.2844658480423194]]], "type": "Polygon", "bbox": [103.8449396183202, 1.2838498371548899, 103.84670769753889, 1.2856327418710998]}}], "bbox": [103.8449396183202, 1.2838498371548899, 103.84670769753889, 1.2856327418710998]}';

let geojson_coll_ = await __modules__.io.Import( __params__.model, GEOJSON_, 'geojson' );

let boundary_coll_ = await __modules__.io.Import( __params__.model, boundary_geojson_, 'geojson' );
__modules__._model.__postprocess__( __params__.model);
}



async function exec_SteppedTower_node_8zfdnb5jze9_polygon_at_height_(__params__, polygon_, angle_, height_) {

let offset_ = height_ * tan(__debug__, degToRad(__debug__, angle_));

let expanded_ = __modules__.poly2d.OffsetMitre( __params__.model, polygon_, offset_, offset_, 'square_end' );

return expanded_;
}


async function exec_SteppedTower_node_8zfdnb5jze9_slabs_at_height_(__params__, boundary_, carve_pieces_, min_area_, remaining_gfa_) {

let slabs_ = __modules__.poly2d.Boolean( __params__.model, boundary_, carve_pieces_, 'difference' );

let ret_list_ = [];

for (let  slab_ of slabs_){

let area_ = __modules__.calc.Area( __params__.model, slab_ );

if (remaining_gfa_ - area_ > 0 && area_ >= min_area_){

__modules__.list.Add( ret_list_, slab_, 'to_end' );

__modules__.attrib.Set(__params__.model, slab_, 'area',  area_ );
}

else {

let larger_minarea_ = area_ >= min_area_;

let after_gfa_ = remaining_gfa_ - area_;

__modules__.list.Add( ret_list_, null, 'to_end' );
}
}

return ret_list_;
}


async function exec_SteppedTower_node_8zfdnb5jze9_merge_carve_pieces_(__params__, carve_pieces_, expand_dist_) {

let offset_ = __modules__.poly2d.OffsetMitre( __params__.model, carve_pieces_, expand_dist_, expand_dist_, 'square_end' );

let union_ = __modules__.poly2d.Union( __params__.model, offset_ );

offset_ = __modules__.poly2d.OffsetMitre( __params__.model, union_, -expand_dist_, expand_dist_, 'square_end' );

return offset_;
}


async function exec_SteppedTower_node_8zfdnb5jze9_small_angle_ps_(__params__, entity_) {

let positions_ = __modules__.query.Get(__params__.model, 'ps', entity_);

let n_ps_ = len(__debug__, positions_);

let ret_lst_ = [];

for (let  ps_i_ of range(__debug__, 0, n_ps_)){

let edges_ = __modules__.query.Get(__params__.model, '_e', positions_[pythonList(ps_i_, positions_.length)]);

let vec1_ = __modules__.calc.Vector( __params__.model, edges_[pythonList(0, edges_.length)] );

let vec2_ = __modules__.calc.Vector( __params__.model, edges_[pythonList(1, edges_.length)] );

let bisect_ = vecNorm(__debug__, vecAdd(__debug__, vec1_, vec2_));

let y_vec_ = vecCross(__debug__, [0, 0, 1], bisect_);

let plane_ = [ __modules__.attrib.Get(__params__.model, positions_[pythonList(ps_i_, positions_.length)], 'xyz'), bisect_, y_vec_];

let angle_ = radToDeg(__debug__, vecAng(__debug__, vec1_, vecMult(__debug__, vec2_, -1)));

__modules__.attrib.Set(__params__.model, positions_[pythonList(ps_i_, positions_.length)], 'plane',  plane_ );

__modules__.attrib.Set(__params__.model, positions_[pythonList(ps_i_, positions_.length)], 'angle',  angle_ );

if (angle_ < 80){

__modules__.list.Add( ret_lst_, positions_[pythonList(ps_i_, positions_.length)], 'to_end' );
}
}

return ret_lst_;
}

async function exec_SteppedTower_node_8zfdnb5jze9(__params__, COMM_GFA_, MIXED_GFA_, RESI_RATIO_, GEOJSON_, COLORS_, DETAILED_){
__modules__._model.__preprocess__( __params__.model);

let boundary_ = __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'pg', null), ['name', null], '==', "boundary");

let polygons_ = __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'pg', null), ['name', null], '!=', "boundary");

__modules__.edit.Delete( __params__.model, [polygons_, boundary_], 'keep_selected' );

let rem_comm_gfa_ = (1 - RESI_RATIO_) * MIXED_GFA_ + COMM_GFA_;

let rem_resi_gfa_ = RESI_RATIO_ * MIXED_GFA_;

let rem_gfa_ = [rem_comm_gfa_, rem_resi_gfa_];

let floor_hts_ = [5, 3.5];

let colors_ = [[1, 1, 0], [1, 0, 0]];

let gfa_i_ = 0;

let max_floors_ = 20;

let move_i_ = [];

let move_i_comm_ = [];

let all_slabs_ = [];

let ground_floor_carve_ = null;

let covered_height_ = 8;

let min_area_ = 2000;

let max_depth_ = 11;

for (let  floor_i_ of range(__debug__, 1, max_floors_ + 1)){

if (gfa_i_ < len(__debug__, rem_gfa_)){

if (rem_gfa_[pythonList(gfa_i_, rem_gfa_.length)] <= min_area_ && gfa_i_ < len(__debug__, rem_gfa_) - 1){

gfa_i_ = gfa_i_ + 1;
}
}

else {

break;
}

let comm_min_i_ = (min(__debug__, move_i_comm_) + 1);

if (comm_min_i_ == Infinity){

comm_min_i_ = 1;
}

let height_ = comm_min_i_ * floor_hts_[pythonList(0, floor_hts_.length)] + (floor_i_ - comm_min_i_) * floor_hts_[pythonList(1, floor_hts_.length)];

let carve_list_ = [];

for (let  polygon_ of polygons_){

let to_carve_ = null;

if (__modules__.attrib.Get(__params__.model, polygon_, 'extrHeight')== "max"){

to_carve_ = await exec_SteppedTower_node_8zfdnb5jze9_polygon_at_height_(__params__, polygon_, __modules__.attrib.Get(__params__.model, polygon_, 'angle'), height_);
if (__params__.terminated) { return __params__.model;}
}

else {

if (height_ <  __modules__.attrib.Get(__params__.model, polygon_, 'extrHeight')){

to_carve_ = await exec_SteppedTower_node_8zfdnb5jze9_polygon_at_height_(__params__, polygon_, __modules__.attrib.Get(__params__.model, polygon_, 'angle'), height_);
if (__params__.terminated) { return __params__.model;}
}
}

if (to_carve_ != null){

__modules__.list.Add( carve_list_, to_carve_, 'to_end' );
}
}

let merged_pieces_ = await exec_SteppedTower_node_8zfdnb5jze9_merge_carve_pieces_(__params__, listFlat(__debug__, carve_list_), 3);
if (__params__.terminated) { return __params__.model;}

if (floor_i_ == 1){

ground_floor_carve_ = merged_pieces_;

__modules__.attrib.Set(__params__.model, ground_floor_carve_, 'name',  "ground_carve" );
}

let slabs_ = await exec_SteppedTower_node_8zfdnb5jze9_slabs_at_height_(__params__, boundary_, merged_pieces_, min_area_, rem_gfa_[pythonList(gfa_i_, rem_gfa_.length)]);
if (__params__.terminated) { return __params__.model;}

let slabs__ = listCull(__debug__, slabs_.slice());

let total_area_ = sum(__debug__,  __modules__.attrib.Get(__params__.model, slabs__, 'area'));

rem_gfa_[pythonList(gfa_i_, rem_gfa_.length)] = rem_gfa_[pythonList(gfa_i_, rem_gfa_.length)] - total_area_;

for (let  slab_i_ of range(__debug__, 0, len(__debug__, slabs_))){

let curr_slab_ = slabs_[pythonList(slab_i_, slabs_.length)];

if (move_i_[pythonList(slab_i_, move_i_.length)] == undefined){

move_i_[pythonList(slab_i_, move_i_.length)] = 0;
}

if (move_i_comm_[pythonList(slab_i_, move_i_comm_.length)] == undefined){

move_i_comm_[pythonList(slab_i_, move_i_comm_.length)] = 0;
}

if (curr_slab_ != null){

let curr_slab_area_ = __modules__.attrib.Get(__params__.model, curr_slab_, 'area');

move_i_[pythonList(slab_i_, move_i_.length)] = move_i_[pythonList(slab_i_, move_i_.length)] + 1;

if (gfa_i_ == 1){

let hole_pg_ = __modules__.poly2d.OffsetMitre( __params__.model, curr_slab_, -max_depth_, max_depth_, 'square_end' );

let wire_ = __modules__.edit.Hole( __params__.model, curr_slab_, hole_pg_ );

let small_positions_ = await exec_SteppedTower_node_8zfdnb5jze9_small_angle_ps_(__params__, wire_);
if (__params__.terminated) { return __params__.model;}

let cutaway_pgons_ = [];

for (let  ps_ of small_positions_){

let min_opening_width_ = 5;

let depth_ = min_opening_width_ / 2 / tan(__debug__, degToRad(__debug__,  __modules__.attrib.Get(__params__.model, ps_, 'angle')/ 2));

let rec_ps_ = __modules__.pattern.Rectangle( __params__.model, __modules__.attrib.Get(__params__.model, ps_, 'plane'), [depth_ * 2, depth_ * 2] );

let rec_pg_ = __modules__.make.Polygon( __params__.model, rec_ps_ );

__modules__.list.Add( cutaway_pgons_, rec_pg_, 'to_end' );
}

for (let  cutaway_ of cutaway_pgons_){

let curr_copy_ = __modules__.make.Clone( __params__.model, curr_slab_ );

let cut_pgs_ = __modules__.poly2d.Boolean( __params__.model, curr_copy_, cutaway_, 'difference' );

let area_ = __modules__.calc.Area( __params__.model, cut_pgs_ );

__modules__.attrib.Set( __params__.model, cut_pgs_, "area", area_, 'many_values' );

cut_pgs_ = __modules__.query.Sort( __params__.model, cut_pgs_, "area", 'descending' );

curr_slab_ = cut_pgs_[pythonList(0, cut_pgs_.length)];
}

for (let  position_ of __modules__.query.Get(__params__.model, 'ps', curr_slab_)){

let dist_ = __modules__.calc.Distance( __params__.model, position_, hole_pg_, 'ps_to_w_distance' );

__modules__.attrib.Set(__params__.model, position_, 'dist_to_hole',  round(__debug__, dist_, 5) );
}

__modules__.attrib.Push( __params__.model, __modules__.query.Get(__params__.model, 'ps', curr_slab_), "dist_to_hole", '_e', 'average' );

for (let  curr_e_ of __modules__.query.Get(__params__.model, '_e', curr_slab_)){

if (__modules__.attrib.Get(__params__.model, curr_e_, 'dist_to_hole')== 0){

__modules__.attrib.Set(__params__.model, curr_e_, 'st_fronting',  true );
}
}

__modules__.attrib.Set(__params__.model, curr_slab_, 'type',  "residential" );

let curr_area_ = __modules__.calc.Area( __params__.model, curr_slab_ );

rem_gfa_[pythonList(gfa_i_, rem_gfa_.length)] = rem_gfa_[pythonList(gfa_i_, rem_gfa_.length)] + curr_slab_area_ - curr_area_;
}

else {

__modules__.attrib.Set(__params__.model, curr_slab_, 'type',  "commercial" );

move_i_comm_[pythonList(slab_i_, move_i_comm_.length)] = move_i_comm_[pythonList(slab_i_, move_i_comm_.length)] + 1;
}

let move_dist_ = move_i_comm_[pythonList(slab_i_, move_i_comm_.length)] * floor_hts_[pythonList(0, floor_hts_.length)] + (move_i_[pythonList(slab_i_, move_i_.length)] - move_i_comm_[pythonList(slab_i_, move_i_comm_.length)]) * floor_hts_[pythonList(1, floor_hts_.length)];

__modules__.modify.Move( __params__.model, curr_slab_, [0, 0, move_dist_] );

__modules__.attrib.Set(__params__.model, curr_slab_, 'floor_i',  move_i_[pythonList(slab_i_, move_i_.length)] );

__modules__.attrib.Set(__params__.model, curr_slab_, 'slab_i',  slab_i_ );

__modules__.attrib.Set(__params__.model, curr_slab_, 'name',  "slab" );

__modules__.list.Add( all_slabs_, curr_slab_, 'to_end' );
}
}
}

__modules__.edit.Delete( __params__.model, listFlat(__debug__, [all_slabs_, ground_floor_carve_]), 'keep_selected' );

let slab_i_set_ = setMake(__debug__,  __modules__.attrib.Get(__params__.model,  __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'pg', null), ['type', null], '==', "commercial"), 'slab_i'));

let resi_pgs_ = __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'pg', null), ['type', null], '==', "residential");

for (let  slab_i_ of slab_i_set_){

let slab_resi_ = __modules__.query.Filter(__params__.model, resi_pgs_, ['slab_i', null], '==', slab_i_);

let sorted_resi_ = __modules__.query.Sort( __params__.model, slab_resi_, "floor_i", 'ascending' );

__modules__.attrib.Set(__params__.model, sorted_resi_[pythonList(0, sorted_resi_.length)], 'type',  "residential_ground" );
}
__modules__._model.__postprocess__( __params__.model);
}


async function exec_SteppedTower_node_qjzy1pvnkx9(__params__, COMM_GFA_, MIXED_GFA_, RESI_RATIO_, GEOJSON_, COLORS_, DETAILED_){
__modules__._model.__preprocess__( __params__.model);

if (!DETAILED_){

__modules__.edit.Delete( __params__.model, [ __modules__.query.Get(__params__.model, 'pg', null),  __modules__.query.Get(__params__.model, 'pl', null),  __modules__.query.Get(__params__.model, 'pt', null),  __modules__.query.Get(__params__.model, 'co', null)], 'delete_selected' );

return;
}

let slab_pgs_ = __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'pg', null), ['name', null], '==', "slab");

let ground_edges_ = __modules__.query.Get(__params__.model, '_e',  __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'pg', null), ['name', null], '==', "ground_carve"));

slab_pgs_ = __modules__.make.Clone( __params__.model, slab_pgs_ );

let slab_ht_ = 0.3;

for (let  slab_pg_ of slab_pgs_){

if (__modules__.attrib.Get(__params__.model, slab_pg_, 'type')== "commercial"){

for (let  slab_edge_ of __modules__.query.Get(__params__.model, '_e', slab_pg_)){

for (let  edge_ of ground_edges_){

let vec1_ = __modules__.calc.Vector( __params__.model, slab_edge_ );

let vec2_ = __modules__.calc.Vector( __params__.model, edge_ );

let dot_ = round(__debug__, abs(__debug__, vecDot(__debug__, vecNorm(__debug__, vec1_), vecNorm(__debug__, vec2_))), 5);

let slab_edge_ps_ = __modules__.query.Get(__params__.model, 'ps', slab_edge_);

if (dot_ == 1){

let d_ = __modules__.calc.Distance( __params__.model, __modules__.query.Get(__params__.model, 'ps', slab_edge_), edge_, 'ps_to_ps_distance' );

if (abs(__debug__, d_[pythonList(1, d_.length)] - d_[pythonList(0, d_.length)]) <= 1){

__modules__.attrib.Set(__params__.model, slab_edge_, 'st_fronting',  true );
}
}
}
}
}

let floor_ht_ = 5;

if (__modules__.attrib.Get(__params__.model, slab_pg_, 'type')!= 'commercial'){

floor_ht_ = 3.5;
}

let slab_edges_ = __modules__.query.Get(__params__.model, '_e', slab_pg_);

let divided_e_ = __modules__.edit.Divide( __params__.model, slab_pg_, 3, 'by_min_length' );

let prev_ = 0;

for (let  edge_i_ of range(__debug__, 0, len(__debug__, slab_edges_))){

let current_ = slab_edges_[pythonList(edge_i_, slab_edges_.length)];

let next_new_ = listFind(__debug__, divided_e_, slab_edges_[pythonList(edge_i_ + 1, slab_edges_.length)]);

let chunk_ = divided_e_.slice(prev_, next_new_);

if (next_new_ == null){

chunk_ = divided_e_.slice(prev_);
}

let chunk_ps_ = __modules__.query.Get(__params__.model, 'ps', chunk_);

if (__modules__.attrib.Get(__params__.model, current_, 'st_fronting')){

__modules__.attrib.Set(__params__.model, chunk_ps_, 'st_fronting',  true );
}

else {

__modules__.attrib.Set(__params__.model, chunk_ps_, 'st_fronting',  false );
}

prev_ = next_new_;
}

let slab_cpy_ = __modules__.make.Copy( __params__.model, slab_pg_, [0, 0, -floor_ht_] );

let slab_ = __modules__.make.Extrude( __params__.model, slab_pg_, -slab_ht_, 1, 'quads' );

let wall_ = __modules__.make.Extrude( __params__.model, divided_e_, -(floor_ht_ - slab_ht_), 1, 'quads' );

__modules__.attrib.Push( __params__.model, __modules__.query.Get(__params__.model, 'ps', divided_e_), "st_fronting", 'pg', 'first' );

let unwelded_ = __modules__.edit.Weld( __params__.model, wall_, 'break_weld' );

__modules__.edit.Reverse( __params__.model, listFlat(__debug__, [slab_, wall_]) );

__modules__.modify.Move( __params__.model, wall_, [0, 0, -slab_ht_] );

__modules__.attrib.Set(__params__.model, slab_, 'name',  'slab' );

__modules__.attrib.Set(__params__.model, slab_pg_, 'name',  'slab_top' );

__modules__.attrib.Set(__params__.model, wall_, 'name',  'wall' );

__modules__.attrib.Set(__params__.model, wall_, 'type',  __modules__.attrib.Get(__params__.model, slab_pg_, 'type') );

__modules__.attrib.Set(__params__.model, wall_, 'st_height',  ( __modules__.attrib.Get(__params__.model,  __modules__.query.Get(__params__.model, 'ps', slab_pg_), 'xyz'))[pythonList(0, ( __modules__.attrib.Get(__params__.model,  __modules__.query.Get(__params__.model, 'ps', slab_pg_), 'xyz')).length)][pythonList(2, ( __modules__.attrib.Get(__params__.model,  __modules__.query.Get(__params__.model, 'ps', slab_pg_), 'xyz'))[pythonList(0, ( __modules__.attrib.Get(__params__.model,  __modules__.query.Get(__params__.model, 'ps', slab_pg_), 'xyz')).length)].length)] - floor_ht_ );
}

__modules__.edit.Delete( __params__.model, [ __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'pg', null), ['name', null], '==', "slab"),  __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'pg', null), ['name', null], '==', "wall"),  __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'pg', null), ['name', null], '==', "slab_top")], 'keep_selected' );
__modules__._model.__postprocess__( __params__.model);
}



async function exec_SteppedTower_node_iihe0mulmrd_regularWindow_(__params__, quads_, floor_ht_) {

__params__.console.push('<div style="margin: 5px 0px 5px 10px; border: 1px solid #E6E6E6"><p><b> Global Function: makeOpening</b></p>');
__params__.curr_ss.node_iihe0mulmrd = __params__.model.prepGlobalFunc([quads_]);
let facade_coll_ = await exec_SteppedTower_makeOpening(__params__, quads_, [0.3, 0.3], [1, floor_ht_ - 2.1], -0.2, [0, 0]);
__params__.model.postGlobalFunc(__params__.curr_ss.node_iihe0mulmrd)
__params__.console.push('</div>')

return facade_coll_;
}


async function exec_SteppedTower_node_iihe0mulmrd_fullWindow_(__params__, quads_, floor_ht_) {

__params__.console.push('<div style="margin: 5px 0px 5px 10px; border: 1px solid #E6E6E6"><p><b> Global Function: makeOpening</b></p>');
__params__.curr_ss.node_iihe0mulmrd = __params__.model.prepGlobalFunc([quads_]);
let facade_coll_ = await exec_SteppedTower_makeOpening(__params__, quads_, [0.2, 0.2], [0.2, floor_ht_ - 2.1], -0.3, [0, 0]);
__params__.model.postGlobalFunc(__params__.curr_ss.node_iihe0mulmrd)
__params__.console.push('</div>')

return facade_coll_;
}


async function exec_SteppedTower_node_iihe0mulmrd_entryDoor_(__params__, quads_, floor_ht_) {

__params__.console.push('<div style="margin: 5px 0px 5px 10px; border: 1px solid #E6E6E6"><p><b> Global Function: makeOpening</b></p>');
__params__.curr_ss.node_iihe0mulmrd = __params__.model.prepGlobalFunc([quads_]);
let facade_coll_ = await exec_SteppedTower_makeOpening(__params__, quads_, [0.5, 0.5], [0.05, floor_ht_ - 2.1], -0.5, [1, 0]);
__params__.model.postGlobalFunc(__params__.curr_ss.node_iihe0mulmrd)
__params__.console.push('</div>')

return facade_coll_;
}

async function exec_SteppedTower_node_iihe0mulmrd(__params__, COMM_GFA_, MIXED_GFA_, RESI_RATIO_, GEOJSON_, COLORS_, DETAILED_){
__modules__._model.__preprocess__( __params__.model);

__modules__.edit.Delete( __params__.model, __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'pg', null), ['type', null], '==', "commercial"), 'keep_selected' );

let podium_facades_ = __modules__.make.Clone( __params__.model, __modules__.query.Filter(__params__.model,  __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'pg', null), ['type', null], '==', "commercial"), ['name', null], '==', "wall") );

let cnt_ = 0;

__modules__.attrib.Add( __params__.model, 'pg', 'string', "opening" );

for (let  facade_ of podium_facades_){

let height_ = __modules__.attrib.Get(__params__.model, facade_, 'st_height');

if (__modules__.attrib.Get(__params__.model, facade_, 'st_fronting')|| height_ > 0){

__modules__.attrib.Set(__params__.model, facade_, 'st_opening',  'full' );
}

if (height_ == 0){

if (cnt_ % 5 == 3){

__modules__.attrib.Set(__params__.model, facade_, 'st_opening',  'entry' );
}
}

else {

if (cnt_ % 5 == 3 || cnt_ % 5 == 4 || cnt_ % 5 == 2){

if (__modules__.attrib.Get(__params__.model, facade_, 'st_fronting')){

__modules__.attrib.Set(__params__.model, facade_, 'st_opening',  'window' );
}

else {

__modules__.attrib.Set(__params__.model, facade_, 'st_opening',  '' );
}
}
}

cnt_ = cnt_ + 1;
}

let floor_ht_ = 4.5;

let door_pgs_ = __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'pg', podium_facades_), ['st_opening', null], '==', 'entry');

let f_window_pgs_ = __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'pg', podium_facades_), ['st_opening', null], '==', 'full');

let r_window_pgs_ = __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'pg', podium_facades_), ['st_opening', null], '==', 'window');

let doors_ = await exec_SteppedTower_node_iihe0mulmrd_entryDoor_(__params__, door_pgs_, floor_ht_);
if (__params__.terminated) { return __params__.model;}

let full_windows_ = await exec_SteppedTower_node_iihe0mulmrd_fullWindow_(__params__, f_window_pgs_, floor_ht_);
if (__params__.terminated) { return __params__.model;}

let reg_windows_ = await exec_SteppedTower_node_iihe0mulmrd_regularWindow_(__params__, r_window_pgs_, floor_ht_);
if (__params__.terminated) { return __params__.model;}

__modules__.edit.Delete( __params__.model, [door_pgs_, f_window_pgs_, r_window_pgs_], 'delete_selected' );
__modules__._model.__postprocess__( __params__.model);
}



async function exec_SteppedTower_node_h0scs89r1vr_regularWindow_(__params__, quads_, floor_ht_) {

__params__.console.push('<div style="margin: 5px 0px 5px 10px; border: 1px solid #E6E6E6"><p><b> Global Function: makeOpening</b></p>');
__params__.curr_ss.node_h0scs89r1vr = __params__.model.prepGlobalFunc([quads_]);
let facade_coll_ = await exec_SteppedTower_makeOpening(__params__, quads_, [0.3, 0.3], [1, floor_ht_ - 2.1], -0.2, [1, 0]);
__params__.model.postGlobalFunc(__params__.curr_ss.node_h0scs89r1vr)
__params__.console.push('</div>')

return facade_coll_;
}


async function exec_SteppedTower_node_h0scs89r1vr_fullWindow_(__params__, quads_, floor_ht_) {

__params__.console.push('<div style="margin: 5px 0px 5px 10px; border: 1px solid #E6E6E6"><p><b> Global Function: makeOpening</b></p>');
__params__.curr_ss.node_h0scs89r1vr = __params__.model.prepGlobalFunc([quads_]);
let facade_coll_ = await exec_SteppedTower_makeOpening(__params__, quads_, [0.2, 0.2], [0.2, floor_ht_ - 2.1], -0.3, [0, 0]);
__params__.model.postGlobalFunc(__params__.curr_ss.node_h0scs89r1vr)
__params__.console.push('</div>')

return facade_coll_;
}


async function exec_SteppedTower_node_h0scs89r1vr_entryDoor_(__params__, quads_, floor_ht_) {

__params__.console.push('<div style="margin: 5px 0px 5px 10px; border: 1px solid #E6E6E6"><p><b> Global Function: makeOpening</b></p>');
__params__.curr_ss.node_h0scs89r1vr = __params__.model.prepGlobalFunc([quads_]);
let facade_coll_ = await exec_SteppedTower_makeOpening(__params__, quads_, [0.5, 0.5], [0.05, floor_ht_ - 2.1], -0.5, [1, 0]);
__params__.model.postGlobalFunc(__params__.curr_ss.node_h0scs89r1vr)
__params__.console.push('</div>')

return facade_coll_;
}

async function exec_SteppedTower_node_h0scs89r1vr(__params__, COMM_GFA_, MIXED_GFA_, RESI_RATIO_, GEOJSON_, COLORS_, DETAILED_){
__modules__._model.__preprocess__( __params__.model);

__modules__.edit.Delete( __params__.model, __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'pg', null), ['type', null], '!=', "commercial"), 'keep_selected' );

let tower_facades_ = __modules__.make.Clone( __params__.model, __modules__.query.Filter(__params__.model,  __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'pg', null), ['type', null], '!=', "commercial"), ['name', null], '==', "wall") );

let cnt_ = 0;

__modules__.attrib.Add( __params__.model, 'pg', 'string', "opening" );

for (let  facade_ of tower_facades_){

let height_ = __modules__.attrib.Get(__params__.model, facade_, 'st_height');

if (__modules__.attrib.Get(__params__.model, facade_, 'st_fronting')&&  __modules__.attrib.Get(__params__.model, facade_, 'type')== "residential_ground"){

if (cnt_ % 5 == 3){

__modules__.attrib.Set(__params__.model, facade_, 'st_opening',  'entry' );
}

else {
if(cnt_ % 5 == 2 || cnt_ % 5 == 1){

__modules__.attrib.Set(__params__.model, facade_, 'st_opening',  'full' );
}
}
}

else {

__modules__.attrib.Set(__params__.model, facade_, 'st_opening',  'window' );

if (cnt_ % 5 == 1 || cnt_ % 5 == 0 || cnt_ % 5 == 2){

__modules__.attrib.Set(__params__.model, facade_, 'st_opening',  '' );
}
}

cnt_ = cnt_ + 1;
}

let floor_ht_ = 3;

let door_pgs_ = __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'pg', tower_facades_), ['st_opening', null], '==', 'entry');

let f_window_pgs_ = __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'pg', tower_facades_), ['st_opening', null], '==', 'full');

let r_window_pgs_ = __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'pg', tower_facades_), ['st_opening', null], '==', 'window');

let doors_ = await exec_SteppedTower_node_h0scs89r1vr_entryDoor_(__params__, door_pgs_, floor_ht_);
if (__params__.terminated) { return __params__.model;}

let full_windows_ = await exec_SteppedTower_node_h0scs89r1vr_fullWindow_(__params__, f_window_pgs_, floor_ht_);
if (__params__.terminated) { return __params__.model;}

let reg_windows_ = await exec_SteppedTower_node_h0scs89r1vr_regularWindow_(__params__, r_window_pgs_, floor_ht_);
if (__params__.terminated) { return __params__.model;}

__modules__.edit.Delete( __params__.model, [door_pgs_, f_window_pgs_, r_window_pgs_], 'delete_selected' );
__modules__._model.__postprocess__( __params__.model);
}



async function exec_SteppedTower_node_n9bdlq402cb_simple_extrude_(__params__, polygon_, floor_height_) {

let extr_ = __modules__.make.Extrude( __params__.model, polygon_, [0, 0, -floor_height_], 1, 'quads' );

__modules__.edit.Reverse( __params__.model, extr_ );

return extr_;
}

async function exec_SteppedTower_node_n9bdlq402cb(__params__, COMM_GFA_, MIXED_GFA_, RESI_RATIO_, GEOJSON_, COLORS_, DETAILED_){
__modules__._model.__preprocess__( __params__.model);

let all_slabs_ = __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'pg', null), ['name', null], '==', "slab");

let extr_ = [];

for (let  slab_ of all_slabs_){

let floor_ht_ = 5;

if (__modules__.attrib.Get(__params__.model, slab_, 'type')== 'residential' ||  __modules__.attrib.Get(__params__.model, slab_, 'type')== 'residential_ground'){

floor_ht_ = 3.5;
}

let floor_ = await exec_SteppedTower_node_n9bdlq402cb_simple_extrude_(__params__, slab_, floor_ht_);
if (__params__.terminated) { return __params__.model;}

__modules__.attrib.Set(__params__.model, floor_, 'type',  __modules__.attrib.Get(__params__.model, slab_, 'type') );

__modules__.list.Add( extr_, listFlat(__debug__, [slab_, floor_]), 'extend_end' );
}

__modules__.edit.Delete( __params__.model, extr_, 'keep_selected' );

let coll_ = __modules__.collection.Create( __params__.model, extr_, "extrusions" );

await __modules__.io.Export( __params__.model, coll_, "simple_extrusions.gi", 'gi', 'Save to Local Storage' );
__modules__._model.__postprocess__( __params__.model);
}


async function exec_SteppedTower_node_e66qp6j359u(__params__, COMM_GFA_, MIXED_GFA_, RESI_RATIO_, GEOJSON_, COLORS_, DETAILED_){
__modules__._model.__preprocess__( __params__.model);

let polygons_ = __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'pg', null), ['name', null], '!=', "boundary");

__modules__.edit.Delete( __params__.model, polygons_, 'keep_selected' );

for (let  polygon_ of polygons_){

__modules__.visualize.Color( __params__.model, polygon_, [ __modules__.attrib.Get(__params__.model, polygon_, 'red'),  __modules__.attrib.Get(__params__.model, polygon_, 'green'),  __modules__.attrib.Get(__params__.model, polygon_, 'blue')] );
}

await __modules__.io.Export( __params__.model, polygons_, "cutout.gltf", 'gltf', 'Save to Local Storage' );
__modules__._model.__postprocess__( __params__.model);
}


async function exec_SteppedTower_node_3p2raklwohv(__params__, COMM_GFA_, MIXED_GFA_, RESI_RATIO_, GEOJSON_, COLORS_, DETAILED_){
__modules__._model.__preprocess__( __params__.model);

let boundary_ = __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'pg', null), ['name', null], '==', "boundary");

let covered_list_ = __modules__.query.Filter(__params__.model,  __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'pg', null), ['extrHeight', null], '!=', "max"), ['name', null], '!=', "boundary");

__modules__.edit.Delete( __params__.model, [covered_list_, boundary_], 'keep_selected' );

let cell_size_ = 10;

let obb_ = __modules__.poly2d.BBoxPolygon( __params__.model, boundary_, 'obb' );

let bb_edges_ = __modules__.query.Get(__params__.model, '_e', obb_);

let plines_ = __modules__.make.Polyline( __params__.model, [bb_edges_[pythonList(0, bb_edges_.length)], bb_edges_[pythonList(2, bb_edges_.length)]], 'open' );

let div_ = __modules__.edit.Divide( __params__.model, plines_, cell_size_, 'by_max_length' );

let width_ = __modules__.calc.Length( __params__.model, bb_edges_[pythonList(1, bb_edges_.length)] );

__modules__.edit.Reverse( __params__.model, plines_[pythonList(1, plines_.length)] );

let grid_ = __modules__.make.Loft( __params__.model, plines_, round(__debug__, width_ / cell_size_), 'open_quads' );

for (let  covered_ of covered_list_){

let a_grid_ = __modules__.poly2d.Boolean( __params__.model, grid_, covered_, 'intersect' );

for (let  ps_ of __modules__.query.Get(__params__.model, 'ps', a_grid_)){

let dist_ = __modules__.calc.Distance( __params__.model, ps_, covered_, 'ps_to_w_distance' );

if (dist_ > 0.01){

let arc_ps_ = __modules__.pattern.Arc( __params__.model, __modules__.attrib.Get(__params__.model, ps_, 'xyz'), 0.3, 6, 2 * JSON.parse(JSON.stringify(PI)) );

let pgon_ = __modules__.make.Polygon( __params__.model, arc_ps_ );

let column_ = __modules__.make.Extrude( __params__.model, pgon_, __modules__.attrib.Get(__params__.model, covered_, 'extrHeight'), 1, 'quads' );

__modules__.list.Add( column_, pgon_, 'to_start' );

let coll_ = __modules__.collection.Create( __params__.model, column_, 'column' );

__modules__.attrib.Set(__params__.model, coll_, 'height',  __modules__.attrib.Get(__params__.model, covered_, 'extrHeight') );

__modules__.attrib.Set(__params__.model, coll_, 'xyz',  __modules__.attrib.Get(__params__.model, ps_, 'xyz') );
}
}
}

__modules__.edit.Delete( __params__.model, __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'co', null), ['name', null], '==', 'column'), 'keep_selected' );
__modules__._model.__postprocess__( __params__.model);
}


async function exec_SteppedTower_node_u3dvjov77n(__params__, COMM_GFA_, MIXED_GFA_, RESI_RATIO_, GEOJSON_, COLORS_, DETAILED_){
__modules__._model.__preprocess__( __params__.model);

if (!DETAILED_){

__modules__.edit.Delete( __params__.model, [ __modules__.query.Get(__params__.model, 'pg', null),  __modules__.query.Get(__params__.model, 'pl', null),  __modules__.query.Get(__params__.model, 'pt', null),  __modules__.query.Get(__params__.model, 'co', null)], 'delete_selected' );

return;
}

let commercial_ = __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'pg', null), ['type', null], '==', "commercial");

let residential_ = [ __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'pg', null), ['type', null], '==', "residential"),  __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'pg', null), ['type', null], '==', "residential_ground")];

let slabs_ = __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'pg', null), ['name', null], '==', "slab");

let columns_ = __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'co', null), ['name', null], '==', "column");

let slab_tops_ = __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'pg', null), ['name', null], '==', "slab_top");

let glass_ = __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'pg', null), ['component', null], '==', "glass");

let sides_ = __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'pg', null), ['component', null], '==', "sides");

__modules__.visualize.Color( __params__.model, residential_, COLORS_["color2"] );

__modules__.visualize.Color( __params__.model, commercial_, COLORS_["color3"] );

__modules__.visualize.Color( __params__.model, [slabs_, columns_, sides_], COLORS_["color1"] );

__modules__.visualize.Color( __params__.model, glass_, COLORS_["openings"] );

__modules__.visualize.Color( __params__.model, slab_tops_, COLORS_["green"] );

let all_pgs_ = __modules__.collection.Create( __params__.model, __modules__.query.Get(__params__.model, 'pg', null), "detailed" );
__modules__._model.__postprocess__( __params__.model);
}


async function exec_SteppedTower_node_00hpvna04t1q(__params__, COMM_GFA_, MIXED_GFA_, RESI_RATIO_, GEOJSON_, COLORS_, DETAILED_){
__modules__._model.__preprocess__( __params__.model);

let commercial_ = __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'pg', null), ['type', null], '==', "commercial");

let residential_ = [ __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'pg', null), ['type', null], '==', "residential"),  __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'pg', null), ['type', null], '==', "residential_ground")];

let columns_ = __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'co', null), ['name', null], '==', "column");

__modules__.visualize.Color( __params__.model, residential_, COLORS_["color2"] );

__modules__.visualize.Color( __params__.model, commercial_, COLORS_["color3"] );

__modules__.visualize.Color( __params__.model, columns_, COLORS_["color1"] );

let all_pgs_ = __modules__.collection.Create( __params__.model, __modules__.query.Get(__params__.model, 'pg', null), "simple" );
__modules__._model.__postprocess__( __params__.model);
}


async function exec_SteppedTower_node_ecyv06at21h(__params__, COMM_GFA_, MIXED_GFA_, RESI_RATIO_, GEOJSON_, COLORS_, DETAILED_){
__modules__._model.__preprocess__( __params__.model);

await __modules__.io.Export( __params__.model, __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'co', null), ['name', null], '==', "simple"), "simple.gltf", 'gltf', 'Save to Local Storage' );

if (DETAILED_){

await __modules__.io.Export( __params__.model, __modules__.query.Filter(__params__.model,  __modules__.query.Get(__params__.model, 'co', null), ['name', null], '==', "detailed"), "detailed.gltf", 'gltf', 'Save to Local Storage' );
}
__modules__._model.__postprocess__( __params__.model);
}


async function exec_SteppedTower_node_68lxdiq8rn5(__params__, COMM_GFA_, MIXED_GFA_, RESI_RATIO_, GEOJSON_, COLORS_, DETAILED_){
__modules__._model.__preprocess__( __params__.model);

let analysis_gi_ = await __modules__.io.Read( __params__.model, "simple_extrusions.gi" );

let simple_ = await __modules__.io.Read( __params__.model, "simple.gltf" );

let cutout_ = await __modules__.io.Read( __params__.model, "cutout.gltf" );

let ret_ = {"analysis_gi": analysis_gi_,"simple": simple_,"detailed": null,"cutout": cutout_};

if (DETAILED_){

let detailed_gltf_ = await __modules__.io.Read( __params__.model, "detailed.gltf" );

ret_["detailed"] = detailed_gltf_;
}

let __return_value__ = __modules__._Output.Return(__params__.model, ret_);
return __return_value__;
}

var merged;
let ssid_exec_SteppedTower_node_dcrn6zzjy5i = __params__.model.getActiveSnapshot();

let ssid_exec_SteppedTower_node_vkb6pu6js2 = ssid_exec_SteppedTower_node_dcrn6zzjy5i;

await exec_SteppedTower_node_vkb6pu6js2(__params__, COMM_GFA_, MIXED_GFA_, RESI_RATIO_, GEOJSON_, COLORS_, DETAILED_);

let ssid_exec_SteppedTower_node_p6l06ti8zo = ssid_exec_SteppedTower_node_vkb6pu6js2;

await exec_SteppedTower_node_p6l06ti8zo(__params__, COMM_GFA_, MIXED_GFA_, RESI_RATIO_, GEOJSON_, COLORS_, DETAILED_);

let ssid_exec_SteppedTower_node_8zfdnb5jze9 = __params__.model.nextSnapshot([ssid_exec_SteppedTower_node_p6l06ti8zo]);

await exec_SteppedTower_node_8zfdnb5jze9(__params__, COMM_GFA_, MIXED_GFA_, RESI_RATIO_, GEOJSON_, COLORS_, DETAILED_);

let ssid_exec_SteppedTower_node_qjzy1pvnkx9 = __params__.model.nextSnapshot([ssid_exec_SteppedTower_node_8zfdnb5jze9]);

await exec_SteppedTower_node_qjzy1pvnkx9(__params__, COMM_GFA_, MIXED_GFA_, RESI_RATIO_, GEOJSON_, COLORS_, DETAILED_);

let ssid_exec_SteppedTower_node_iihe0mulmrd = __params__.model.nextSnapshot([ssid_exec_SteppedTower_node_qjzy1pvnkx9]);

await exec_SteppedTower_node_iihe0mulmrd(__params__, COMM_GFA_, MIXED_GFA_, RESI_RATIO_, GEOJSON_, COLORS_, DETAILED_);

let ssid_exec_SteppedTower_node_h0scs89r1vr = __params__.model.nextSnapshot([ssid_exec_SteppedTower_node_qjzy1pvnkx9]);

await exec_SteppedTower_node_h0scs89r1vr(__params__, COMM_GFA_, MIXED_GFA_, RESI_RATIO_, GEOJSON_, COLORS_, DETAILED_);

let ssid_exec_SteppedTower_node_n9bdlq402cb = __params__.model.nextSnapshot([ssid_exec_SteppedTower_node_8zfdnb5jze9]);

await exec_SteppedTower_node_n9bdlq402cb(__params__, COMM_GFA_, MIXED_GFA_, RESI_RATIO_, GEOJSON_, COLORS_, DETAILED_);

let ssid_exec_SteppedTower_node_e66qp6j359u = __params__.model.nextSnapshot([ssid_exec_SteppedTower_node_p6l06ti8zo]);

await exec_SteppedTower_node_e66qp6j359u(__params__, COMM_GFA_, MIXED_GFA_, RESI_RATIO_, GEOJSON_, COLORS_, DETAILED_);

let ssid_exec_SteppedTower_node_3p2raklwohv = __params__.model.nextSnapshot([ssid_exec_SteppedTower_node_p6l06ti8zo]);

await exec_SteppedTower_node_3p2raklwohv(__params__, COMM_GFA_, MIXED_GFA_, RESI_RATIO_, GEOJSON_, COLORS_, DETAILED_);

let ssid_exec_SteppedTower_node_u3dvjov77n = __params__.model.nextSnapshot([ssid_exec_SteppedTower_node_iihe0mulmrd, ssid_exec_SteppedTower_node_h0scs89r1vr, ssid_exec_SteppedTower_node_3p2raklwohv]);

await exec_SteppedTower_node_u3dvjov77n(__params__, COMM_GFA_, MIXED_GFA_, RESI_RATIO_, GEOJSON_, COLORS_, DETAILED_);

let ssid_exec_SteppedTower_node_00hpvna04t1q = __params__.model.nextSnapshot([ssid_exec_SteppedTower_node_n9bdlq402cb, ssid_exec_SteppedTower_node_3p2raklwohv]);

await exec_SteppedTower_node_00hpvna04t1q(__params__, COMM_GFA_, MIXED_GFA_, RESI_RATIO_, GEOJSON_, COLORS_, DETAILED_);

let ssid_exec_SteppedTower_node_ecyv06at21h = __params__.model.nextSnapshot([ssid_exec_SteppedTower_node_u3dvjov77n, ssid_exec_SteppedTower_node_00hpvna04t1q]);

await exec_SteppedTower_node_ecyv06at21h(__params__, COMM_GFA_, MIXED_GFA_, RESI_RATIO_, GEOJSON_, COLORS_, DETAILED_);

let ssid_exec_SteppedTower_node_68lxdiq8rn5 = __params__.model.nextSnapshot([ssid_exec_SteppedTower_node_e66qp6j359u, ssid_exec_SteppedTower_node_ecyv06at21h]);

return await exec_SteppedTower_node_68lxdiq8rn5(__params__, COMM_GFA_, MIXED_GFA_, RESI_RATIO_, GEOJSON_, COLORS_, DETAILED_);
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
const result = await exec_SteppedTower(__params__, COMM_GFA, MIXED_GFA, RESI_RATIO, GEOJSON, COLORS, DETAILED);
if (result === __params__.model) { return { "model": __params__.model, "result": null };}
return {"model": __params__.model, "result": result};
/** * **/

}

module.exports = SteppedTower;
