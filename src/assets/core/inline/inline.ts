
export const inline_query_expr = [
    '#@name == value',
    '#@name[i] == value',
    '#@name != value',
    '#@name[i] != value',
    '#@name > value',
    '#@name[i] > value',
    '#@name >= value',
    '#@name[i] >= value',
    '#@name < value',
    '#@name[i] < value',
    '#@name <= value',
    '#@name[i] <= value'
];

export const inline_sort_expr = [
    '#@name',
    '#@name[i]'
];

const constants = [
    'PI',
    'XY',
    'YZ',
    'ZX',
    'YX',
    'ZY',
    'XZ'
];

 const types = [
    'isNum(val)',
    'isInt(val)',
    'isFlt(val)',
    'isBool(val)',
    'isStr(val)',
    'isList(val)',
    'isDict(val)',
    'isVec2(val)',
    'isVec3(val)',
    'isCol(val)',
    'isRay(val)',
    'isPln(val)',
    'isNaN(val)',
    'isNull(val)',
    'isUndef(val)'
];

const conversion = [
    'boolean(val)',
    'number(val)',
    'string(val)',
    'numToStr(num)',
    'radToDeg(rad)',
    'degToRad(deg)'
];

const strings = [
    'len(s)',
    'strUpp(s)',
    'strLow(s)',
    'strTrim(s)',
    'strTrimL(s)',
    'strTrimR(s)',
    'strPadL(s1, m)',
    'strPadR(s1, m)',
    'strRepl(s1, s2, s3)',
    'strSub(s, from)',
    'strStarts(s1, s2)',
    'strEnds(s1, s2)'
];

const lists = [
    'len(list)',
    'range(start, end)',
    'listLast(list)',
    'listGet(list, index)',
    'listFind(list, val)',
    'listHas(list, val)',
    'listCount(list, val)',
    'listCopy(list)',
    'listRep(list, n)',
    'listJoin(list1, list2)',
    'listFlat(list)',
    'listSlice(list, start, end?)',
    'listCull(list)',
    'listZip(lists)',
    'listZip2(lists)'
];

 const sets = [
    'setMake(list)',
    'setUni(list1, list2)',
    'setInt(list1, list2)',
    'setDif(list1, list2)'
];

 const vectors = [
    'vecAdd(v1, v2)',
    'vecSub(v1, v2)',
    'vecDiv(v, num)',
    'vecMult(v, num)',
    'vecSum(...v)',
    'vecLen(v)',
    'vecSetLen(v, num)',
    'vecNorm(v)',
    'vecRev(v)',
    'vecFromTo(pt1, pt2)',
    'vecAng(v1, v2)',
    'vecAng2(v1, v2, n)',
    'vecDot(v1, v2)',
    'vecCross(v1, v2)',
    'vecEqual(v1, v2, tol)',
    'vecLtoG(v, p)',
    'vecGtoL(v, p)'
];

const colors = [
    'colFalse(val, min, max)',
    'colScale(val, min, max, sc)'
];

const planes = [
    'plnMake(o, x, xy)',
    'plnCopy(p)',
    'plnMove(p, v)',
    'plnLMove(p, v)',
    'plnRot(p, r, ang)',
    'plnLRotX(p, ang)',
    'plnLRotY(p, ang)',
    'plnLRotZ(p, ang)'
];

const rays = [
    'rayMake(o, d)',
    'rayCopy(r)',
    'rayMove(r, v)',
    'rayRot(r1, r2, a)',
    'rayLMove(r, d)',
    'rayFromPln(p)',
    'rayLtoG(v, p)',
    'rayGtoL(v, p)'
];

const random = [
    'rand(min, max)',
    'randInt(min, max)',
    'randPick(list, num)'
];

const arithmetic = [
    'isApprox(num1, num2, tol)',
    'isIn(num1, num2, num3)',
    'isWithin(num1, num2, num3)',
    'abs(num)',
    'square(num)',
    'cube(num)',
    'pow(num, pow)',
    'sqrt(num)',
    'exp(num)',
    'log(num)',
    'round(num)',
    'sigFig(num, f)',
    'ceil(num)',
    'floor(num)',
    'remap(num, d1, d2)',
    'sum(list)',
    'prod(list)',
    'hypot(list)',
    'norm(list)'];

const geometry = [
    'distance(a, b)',
    'distanceM(a, b)',
    'distanceMS(a, b)',
    'intersect(a, b)',
    'project(a, b)'
]

const statistics = [
    'min(list)',
    'max(list)',
    'mad(list)',
    'mean(list)',
    'median(list)',
    'mode(list)',
    'std(list)',
    'vari(list)'];

const trigonometry = [
    'sin(rad)',
    'asin(num)',
    'sinh(rad)',
    'asinh(num)',
    'cos(rad)',
    'acos(num)',
    'cosh(rad)',
    'acosh(num)',
    'tan(rad)',
    'atan(num)',
    'tanh(rad)',
    'atanh(num)',
    'atan2(num1, num2)'];

export const inline_func = [
    ['constants', constants],
    ['types', types],
    ['conversion', conversion],
    ['strings', strings],
    ['random', random],
    ['lists', lists],
    ['sets', sets],
    ['vectors', vectors],
    ['rays', rays],
    ['planes', planes],
    ['colors', colors],
    ['arithmetic', arithmetic],
    ['statistics', statistics],
    ['trigonometry', trigonometry],
    ['geometry', geometry],
];
