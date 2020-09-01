
export const inline_query_expr = [
    ['#@name == value', 'Search for entities with attributes equal to a given value'],
    ['#@name[i] == value', 'Search for entities with attributes with index equal to a given value'],
    ['#@name != value', 'Search for entities with attributes not equal to a given value'],
    ['#@name[i] != value', 'Search for entities with attributes with index not equal to a given value'],
    ['#@name > value', 'Search for entities with attributes greater than a given value'],
    ['#@name[i] > value', 'Search for entities with attributes with index greater than a given value'],
    ['#@name >= value', 'Search for entities with attributes greater than or equal to a given value'],
    ['#@name[i] >= value', 'Search for entities with attributes with index greater than or equal to a given value'],
    ['#@name < value', 'Search for entities with attributes less than a given value'],
    ['#@name[i] < value', 'Search for entities with attributes with index less than a given value'],
    ['#@name <= value', 'Search for entities with attributes less than or equal to a given value'],
    ['#@name[i] <= value', 'Search for entities with attributes with index less than or equal to a given value']
];

export const inline_sort_expr = [
    ['#@name', 'Sort based on attribute value'],
    ['#@name[i]', 'Sort based on attribute index value']
];

const constants = [
    ['PI', 'The mathematical constant PI, 3.141... '],
    ['XY', 'A plane at the origin, aligned with the XY plane'],
    ['YZ', 'A plane at the origin, aligned with the YZ plane'],
    ['ZX', 'A plane at the origin, aligned with the ZX plane'],
    ['YX', 'A plane at the origin, aligned with the YX plane'],
    ['ZY', 'A plane at the origin, aligned with the ZY plane'],
    ['XZ', 'A plane at the origin, aligned with the XZ plane']
 ];

 const types = [
    ['isNum(v)', 'Returns true if the value is a number, false otherwise.'],
    ['isInt(v)', 'Returns true if the value is a integer, false otherwise.'],
    ['isFlt(v)', 'Returns true if the value is a floating point number, false otherwise.'],
    ['isBool(v)', 'Returns true if the value is a boolean, false otherwise.'],
    ['isStr(v)', 'Returns true if the value is a string, false otherwise.'],
    ['isList(v)', 'Returns true if the value is a list, false otherwise.'],
    ['isDict(v)', 'Returns true if the value is a dictionary, false otherwise.'],
    ['isVec2(v)', 'Returns true if the value is a list of two numbers, false otherwise.'],
    ['isVec3(v)', 'Returns true if the value is a list of three numbers, false otherwise.'],
    ['isCol(v)', 'Returns true if the value is a list of three numbers in the range [0, 1], false otherwise.'],
    ['isRay(v)', 'Returns true if the value is a ray, false otherwise.'],
    ['isPln(v)', 'Returns true if the value is a plane, false otherwise.'],
    ['isNaN(v)', 'Returns true is the value is not a number (NaN), false otherwise.'],
    ['isNull(v)', 'Returns true is the value is null, false otherwise.'],
    ['isUndef(v)', 'Returns true is the value is undefined, false otherwise.']
];

const conversion = [
    ['boolean(v)', 'Converts the value to a boolean'],
    ['number(v)', 'Converts the value to a number'],
    ['string(v)', 'Converts the value to a string'],
    ['numToStr(n)', 'Converts the number to a string, with commas, e.g. 1,234,567'],
    ['numToStr(n, d)', 'Converts the number to a string, with commas, where "d" specifies the number of fraction digits, e.g. 1,234.00.'],
    ['numToStr(n, d, l)', 'Converts the number to a string, where "d" specifies the number of fraction digits, and "l" specifies the locale, e.g. "en-GB", "fi-FI", "in-IN", "pt-BR", etc'],
    ['radToDeg(rad)', 'Converts radians to degrees'],
    ['degToRad(deg)', 'Converts degrees to radians']
];

const strings = [
    ['len(s)', 'Returns the number of characters in the string'],
    ['strRepl(s, search, new)', 'Replace all instances of specified search string with a new string. The search string can be a regular expression.'],
    ['strUpp(s)', 'Converts all the alphabetic characters in a string to uppercase.'],
    ['strLow(s)', 'Converts all the alphabetic characters in a string to lowercase.'],
    ['strTrim(s)', 'Removes the leading and trailing white space and line terminator characters from a string.'],
    ['strTrimL(s)', 'Removes whitespace from the left end of a string.'],
    ['strTrimR(s)', 'Removes whitespace from the right end of a string.'],
    ['strPadL(s1, m)', 'Pads the start of the s1 string with white spaces so that the resulting string reaches a given length.'],
    ['strPadL(s1, m, s2)', 'Pads the start of the s1 string with the s2 string so that the resulting string reaches a given length.'],
    ['strPadR(s1, m)', 'Pads the end of the s1 string with white spaces so that the resulting string reaches a given length.'],
    ['strPadR(s1, m, s2)', 'Pads the end of the s1 string with the s2 string so that the resulting string reaches a given length.'],
    ['strSub(s, from)', 'Gets a substring beginning at the specified location.'],
    ['strSub(s, from, length)', 'Gets a substring beginning at the specified location and having the specified length.'],
    ['strStarts(s1, s2)', 'Returns true if the string s1 starts with s2, false otherwise.'],
    ['strEnds(s1, s2)', 'Returns true if the string s1 ends with s2, false otherwise.']
];

const lists = [
    ['range(start, end)', 'Generates a list of integers, from start to end, with a step size of 1'],
    ['range(start, end, step?)', 'Generates a list of integers, from start to end, with a specified step size'],
    ['len(list)', 'Returns the number of items in the list'],
    ['listLast(list)', 'Returns the last item in a list'],
    ['listGet(list, index)', 'Returns the item in the list specified by index, either a positive or negative integer'],
    ['listFind(list, val)', 'Returns the index of the first occurence of the value in the list, or -1 if not found'],
    ['listHas(list, val)', 'Returns true if the list contains the value, false otherwise'],
    ['listCount(list, val)', 'Returns the number of times the value is in the list'],
    ['listCopy(list)', 'Returns a copy of the list'],
    ['listRep(list, n)', 'Returns a new list that repeats the contents of the input list n times.'],
    ['listJoin(list1, list2)', 'Joins two lists into a single list'],
    ['listFlat(list)', 'Returns a copy of the nested list, flattened to a depth of 1'],
    ['listFlat(list, depth)', 'Returns a copy of the nested list, reduced to the specified depth'],
    ['listSlice(list, start, end?)', 'Return a sub-list from the list'],
    ['listCull(list)', 'Returns a new list of all the values that evaluate to true.'],
    ['listCull(list1, list2)', 'Returns a new list of all the values in list1 that evaluate to true in list2.'],
    ['listZip(lists)', 'Converts a set of lists from rows into columns, based on the shortest list'],
    ['listZip2(lists)', 'Converts a set of lists from rows into columns, based on the longest list']
 ];

 const sets = [
    ['setMake(list)', 'Generates a list of unique items.'],
    ['setUni(list1, list2)', 'Generates a list of unique items from the union of the two input lists.'],
    ['setInt(list1, list2)', 'Generates a list of unique items from the intersection of the two input lists.'],
    ['setDif(list1, list2)', 'Generates a list of unique items from the difference of the two input lists.']
 ];

 const vectors = [
    ['vecAdd(v1, v2)', 'Adds two vectors'],
    ['vecSub(v1, v2)', 'Subtracts vec2 from vec1'],
    ['vecDiv(v, num)', 'Divides a vector by a number'],
    ['vecMult(v, num)', 'Multiplies a vector by a number'],
    ['vecSum(...v)', 'Add multiple vectors'],
    ['vecLen(v)', 'Calculates the magnitude of a vector'],
    ['vecSetLen(v, num)', 'Sets the magnitude of a vector'],
    ['vecNorm(v)', 'Sets the magnitude of a vector to 1'],
    ['vecRev(v)', 'Reverses the direction of a vector'],
    ['vecFromTo(pt1, pt2)', 'Creates a vector between two points'],
    ['vecAng(v1, v2)', 'Calculate the angle (0 to PI) between two vectors'],
    ['vecAng2(v1, v2, n)', 'Calculate the angle (0 to 2PI) between two vectors, relative to the plane normal'],
    ['vecDot(v1, v2)', 'Calculates the dot product of two vectors'],
    ['vecCross(v1, v2)', 'Calculates the cross product of two vectors'],
    ['vecEqual(v1, v2, tol)', 'Returns true if the difference between two vectors is smaller than a specified tolerance'],
    ['vecLtoG(v, p)', 'Transforms a vector from a local coordinate system define by plane "p" to the global coordinate system.'],
    ['vecGtoL(v, p)', 'Transforms a vector from the global coordinate system to a local coordinate system define by plane "p".']
];

const colors = [
    ['colFalse(val, min, max)', 'Creates a colour from a value in the range between min and max.'],
    ['colScale(val, min, max, sc)', 'Creates a colour from a value in the range between min and max, given a Brewer color scale.']
];

const planes = [
    ['plnMake(o, x, xy)', 'Creates a plane from an origin "o", an "x" axis vector, and any other vector in the "xy" plane.'],
    ['plnCopy(p)', 'Make a copy of the plane "p"'],
    ['plnMove(p, v)', 'Move the plane "p" relative to the global X, Y, and Z axes, by vector "v".'],
    ['plnRot(p, r, a)', 'Rotate the plane "p" around the ray "r", by angle "a" (in radians).'],
    ['plnLMove(p, v)', 'Move the plane "p" relative to the local X, Y, and Z axes, by vector "v".'],
    ['plnLRotX(p, a)', 'Rotate the plane "p" around the local X axis, by angle "a" (in radians).'],
    ['plnLRotY(p, a)', 'Rotate the plane "p" around the local Y axis, by angle "a" (in radians).'],
    ['plnLRotZ(p, a)', 'Rotate the plane "p" around the local Z axis, by angle "a" (in radians).']
];

const rays = [
    ['rayMake(o, d)', 'Creates a ray from an origin "o" and a direction vector "d".'],
    ['rayMake(o, d, l)', 'Creates a ray from an origin "o", a direction vector "d", and length "l".'],
    ['rayCopy(r)', 'Make a copy of the ray "r"'],
    ['rayMove(r, v)', 'Move the ray "r" relative to the global X, Y, and Z axes, by vector "v".'],
    ['rayRot(r1, r2, a)', 'Rotate the ray "r1" around the ray "r2", by angle "a" (in radians).'],
    ['rayLMove(r, d)', 'Move the ray "r" relative to the ray direction vector, by distance "d".'],
    ['rayFromPln(p)', 'Create a ray from a plane "p", with the same origin and with a direction along the plane z axis.'],
    ['rayLtoG(v, p)', 'Transforms a ray from a local coordinate system define by plane "p" to the global coordinate system.'],
    ['rayGtoL(v, p)', 'Transforms a ray from the global coordinate system to a local coordinate system define by plane "p".']
];

const random = [
    ['rand(min, max)', 'Returns a random number in the specified range'],
    ['rand(min, max, seed)', 'Returns a random number in the specified range, given a numeric seed'],
    ['randInt(min, max)', 'Returns a random integer in the specified range'],
    ['randInt(min, max, seed)', 'Returns a random integer in the specified range, given a numeric seed'],
    ['randPick(list, num)', 'Returns a random set of items from the list'],
    ['randPick(list, num, seed)', 'Returns a random set of items from the list, given a numeric seed']
];

const arithmetic = [
    ['isApprox(v1, v2, tol)', 'Returns true if the absolute difference between the two numbers is less than the tolerance, t'],
    ['isIn(v1, v2, v3)', 'Returns v1 < v2 < v3.'],
    ['isWithin(v1, v2, v3)', 'Returns v1 <= v2 <= v3.'],
    ['abs(n)', 'Returns the absolute value of the number'],
    ['square(n)', 'Returns the square of the number'],
    ['cube(n)', 'Returns the cube of the number'],
    ['pow(n, pow)', 'Returns the number to the specified power'],
    ['sqrt(n)', 'Returns the square root of the number'],
    ['exp(n)', 'Returns the value of E to the power of the number'],
    ['log(n)', 'Returns the natural logarithm (base E) of the number'],
    ['round(n)', 'Returns the value of the number rounded to its nearest integer'],
    ['round(n, d)', 'Returns the value of the number rounded to the specified number of decimal places.'],
    ['sigFig(n, f)', 'Returns the value of the number converted to the specified number of significant figures.'],
    ['ceil(n)', 'Returns the value of the number rounded up to its nearest integer'],
    ['floor(n)', 'Returns the value of the number rounded down to its nearest integer'],
    ['mod(n1, n2)', 'Returns the remainder after division of num1 by num2'],
    ['remap(n, d1, d2)', 'Maps a number from the d1 domain to the d2 domain.'],
    ['sum(list)', 'Returns the sum of all values in a list'],
    ['prod(list)', 'Returns the product of all values in a list'],
    ['hypot(list)', 'Returns the hypotenuse of all values in a list'],
    ['norm(list)', 'Returns the norm of a list']
];

const geometry = [
    ['distance(c1, c2)', 'Returns the Euclidean distance between two xyzs, c1 and c2'],
    ['distance(c, r)', 'Returns the Euclidean distance between an xyz c and an infinite ray r'],
    ['distance(c, p)', 'Returns the Euclidean distance between an xyz c and an infinite plane p'],
    ['distanceM(c1, c2)', 'Returns the Manhattan distance between two xyzs, c1 and c2'],
    ['distanceM(c, r)', 'Returns the Manhattan distance between an xyz c and an infinite ray r'],
    ['distanceM(c, p)', 'Returns the Manhattan distance between an xyz c and an infinite plane p'],
    ['distanceMS(c1, c2)', 'Returns the Manhattan squared distance between two xyzs, c1 and c2'],
    ['distanceMS(c, r)', 'Returns the Manhattan squared distance between an xyz c and an infinite ray r'],
    ['distanceMS(c, p)', 'Returns the Manhattan squared distance between an xyz c and an infinite plane p'],
    ['intersect(r1, r2)', 'Returns the intersection xyz between two infinite rays'],
    ['intersect(r1, r2, m)', 'Returns the intersection xyz between two rays, where ' +
        'if m=2, rays are infinite in both directions, ' +
        'if m=1 rays are infinite in one direction, ' +
        'and if m=0, rays are not infinite.'],
    ['intersect(r, p)', 'Returns the intersection xyz between an infinite ray r and an infinite plane p'],
    ['intersect(r, p, m)', 'Returns the intersection xyz between a ray r and an infinite plane p, where ' +
        'if m=2, the ray is infinite in both directions, ' +
        'if m=1 the ray is infinite in one direction, ' +
        'and if m=0, the ray is not infinite.'],
    ['project(c, r)', 'Returns the xyz from projecting an xyz c onto an infinite ray r'],
    ['project(c, r, m)', 'Returns the xyz from projecting an xyz c onto an infinite ray r, where ' +
        'if m=2, the ray is infinite in both directions, ' +
        'if m=1 the ray is infinite in one direction, ' +
        'and if m=0, the ray is not infinite.'],
    ['project(c, p)', 'Returns the xyz from projecting an xyz c onto an infinite plane p']
];

const statistics = [
    ['min(list)', 'Returns the number with the lowest value'],
    ['max(list)', 'Returns the number with the highest value'],
    ['mad(list)', 'Returns the median absolute deviation of the list'],
    ['mean(list)', 'Returns the mean value of the list'],
    ['median(list)', 'Returns the median of the list'],
    ['mode(list)', 'Returns the mode of the list'],
    ['std(list)', 'Returns the standard deviation of the list'],
    ['vari(list)', 'Returns the variance of the list']
];

const trigonometry = [
    ['sin(rad)', 'Returns the sine of a value (in radians)'],
    ['asin(num)', 'Returns the inverse sine of a value (in radians)'],
    ['sinh(rad)', 'Returns the hyperbolic sine of a value (in radians)'],
    ['asinh(num)', 'Returns the hyperbolic arcsine of a value (in radians)'],
    ['cos(rad)', 'Returns the cosine of a value (in radians)'],
    ['acos(num)', 'Returns the inverse cosine of a value (in radians)'],
    ['cosh(rad)', 'Returns the hyperbolic cosine of a value (in radians)'],
    ['acosh(num)', 'Returns the hyperbolic arccos of a value (in radians)'],
    ['tan(rad)', 'Returns the tangent of a value (in radians)'],
    ['atan(num)', 'Returns the inverse tangent of a value (in radians)'],
    ['tanh(rad)', 'Returns the hyperbolic tangent of a value (in radians)'],
    ['atanh(num)', 'Returns the hyperbolic arctangent of a value (in radians)'],
    ['atan2(number1, number2)', 'Returns the inverse tangent function with two arguments, number1/number2']
];

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

// const inline_func_lst: string[][][] = inline_func.map(x => x[1]);
// const inline_func_lst = [
//     lists,
//     conversion,
//     arithmetic,
//     statistics,
//     trigonometry
// ];

// const inline_fn_names = [];
// for (let i = 0; i < inline_func_lst.length; i++) {
//     inline_func_lst[i].forEach((arr) => {
//         const mtch = arr[0].match(/^\w*(?=\()/);
//         let ret;
//         if (mtch !== null) {
//             ret = mtch[0];
//         } else {
//             ret = arr[0];
//         }
//         inline_fn_names.push(ret);
//     });
// }
// export const inline_fn_regEx = RegExp(inline_fn_names.join('|'), 'g');
