import {__new__, __merge__, __clone__} from './modules/_model';
import { GIMetaData } from '@assets/libs/geo-info/GIMetaData';

export const _parameterTypes = {
    constList: '__constList__',
    model: '__model__',
    input: '__input__',
    console: '__console__',
    fileName: '__fileName__',

    new: '_model.__new__',
    newFn: __new__,

    newMeta: GIMetaData,

    merge: '_model.__merge__',
    mergeFn: __merge__,
    cloneFn: __clone__,

    addData: '_model.addGiData',

    preprocess: '_model.__preprocess__',
    postprocess: '_model.__postprocess__',

    setattrib: 'attrib.Set',
    getattrib: 'attrib.Get',
    queryGet: 'query.Get',
    queryFilter: 'query.Filter',

    select: '_model.__select__',

    return: '_Output.Return',

    asyncFuncs: [
        'util.ModelCompare',
        'util.ModelMerge',
        'io.Write', 'io.Read',
        'io.Import', 'io.Export'
    ]
};

export const _varString = 
`PI = __modules__._constants.PI;
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
pow = __modules__._math.pow;
sqrt = __modules__._math.sqrt;
exp = __modules__._math.exp;
log = __modules__._math.log;
round = __modules__._math.round;
sigFig = __modules__._math.sigFig;
ceil = __modules__._math.ceil;
floor = __modules__._math.floor;
abs = __modules__._math.abs;
sin = __modules__._math.sin;
asin = __modules__._math.asin;
sinh = __modules__._math.sinh;
asinh = __modules__._math.asinh;
cos = __modules__._math.cos;
acos = __modules__._math.acos;
cosh = __modules__._math.cosh;
acosh = __modules__._math.acosh;
tan = __modules__._math.tan;
atan = __modules__._math.atan;
tanh = __modules__._math.tanh;
atanh = __modules__._math.atanh;
atan2 = __modules__._math.atan2;
boolean = __modules__._mathjs.boolean;
number = __modules__._mathjs.number;
string = __modules__._mathjs.string;
mad = __modules__._mathjs.mad;
mean = __modules__._mathjs.mean;
median = __modules__._mathjs.median;
mode = __modules__._mathjs.mode;
prod = __modules__._mathjs.prod;
std = __modules__._mathjs.std;
vari = __modules__._mathjs.vari;
sum = __modules__._mathjs.sum;
hypot = __modules__._mathjs.hypot;
norm = __modules__._mathjs.norm;
square = __modules__._mathjs.square;
cube = __modules__._mathjs.cube;
remap = __modules__._arithmetic.remap;
distance = __modules__._geometry.distance;
distanceM = __modules__._geometry.distanceM;
distanceMS = __modules__._geometry.distanceMS;
intersect = __modules__._geometry.intersect;
project = __modules__._geometry.project;
range = __modules__._list.range;
len = __modules__._common.len;
listCount = __modules__._list.listCount;
listCopy = __modules__._list.listCopy;
listRep = __modules__._list.listRep;
listLast = __modules__._list.listLast;
listGet = __modules__._list.listGet;
listFind = __modules__._list.listFind;
listHas = __modules__._list.listHas;
listJoin = __modules__._list.listJoin;
listFlat = __modules__._list.listFlat;
listRot = __modules__._list.listRot;
listSlice = __modules__._list.listSlice;
listRev = __modules__._list.listRev;
listCull = __modules__._list.listCull;
listSort = __modules__._list.listSort;
listZip = __modules__._list.listZip;
listEq = __modules__._list.listEq;
dictGet = __modules__._dict.dictGet;
dictKeys = __modules__._dict.dictKeys;
dictVals = __modules__._dict.dictVals;
dictHasKey = __modules__._dict.dictHasKey;
dictHasVal = __modules__._dict.dictHasVal;
dictFind = __modules__._dict.dictFind;
dictCopy = __modules__._dict.dictCopy;
dictEq = __modules__._dict.dictEq;
setMake = __modules__._set.setMake;
setUni = __modules__._set.setUni;
setInt = __modules__._set.setInt;
setDif = __modules__._set.setDif;
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
randPick = __modules__._rand.randPick;`;
