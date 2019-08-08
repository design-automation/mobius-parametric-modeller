import {__new__, __merge__} from './modules/_model';

export const _parameterTypes = {
    constList: '__constList__',
    model: '__model__',
    input: '__input__',
    console: '__console__',
    fileName: '__fileName__',

    new: '_model.__new__',
    newFn: __new__,

    merge: '_model.__merge__',
    mergeFn: __merge__,

    addData: '_model.addGiData',

    preprocess: '_model.__preprocess__',
    postprocess: '_model.__postprocess__',

    setattrib: 'attrib.Set',
    getattrib: 'attrib.Get',
    queryGet: 'query.Get',
    queryFilter: 'query.Filter',

    select: '_model.__select__',

    return: '_Output.Return',

    urlFunctions: ['util.WriteData', 'util.ReadData', 'util.ImportData', 'util.ModelCompare']
};

export const _varString = `
PI = Math.PI;
XY = __modules__._constants.XY;
YZ = __modules__._constants.YZ;
ZX = __modules__._constants.ZX;
YX = __modules__._constants.YX;
ZY = __modules__._constants.ZY;
XZ = __modules__._constants.XZ;
approx = __modules__._util.approx;
min = __modules__._math.min;
max = __modules__._math.max;
pow = Math.pow;
sqrt = Math.sqrt;
exp = Math.exp;
log = Math.log;
round = Math.round;
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
distance = __modules__._calc.distance;
intersect = __modules__._calc.intersect;
project = __modules__._calc.project;
range = __modules__._list.range;
isList = __modules__._list.isList;
len = __modules__._list.listLen;
listLen = __modules__._list.listLen;
listCount = __modules__._list.listCount;
listCopy = __modules__._list.listCopy;
listLast = __modules__._list.listLast;
listGet = __modules__._list.listGet;
listFind = __modules__._list.listFind;
listHas = __modules__._list.listHas;
listJoin = __modules__._list.listJoin;
listFlat = __modules__._list.listFlat;
listSlice = __modules__._list.listSlice;
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
colFalse = __modules__._colors.colFalse;
radToDeg = __modules__._conversion.radToDeg;
degToRad = __modules__._conversion.degToRad;
rand = __modules__._rand.rand;
randInt = __modules__._rand.randInt;
randPick = __modules__._rand.randPick;
setattr = __modules__._model.__setAttrib__;
getattr = __modules__._model.__getAttrib__;
`;
