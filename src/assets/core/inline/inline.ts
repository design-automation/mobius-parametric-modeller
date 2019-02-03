
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

const lists = [
    ['range(start, end)', 'Generates a list of integers as a range, from start to end'],
    ['isList(list)', 'Returns true if this is a list, false otherwise.'],
    ['listLen(list)', 'Returns the number of items in the list'],
    ['listCopy(list)', 'Returns a copy of the list'],
    ['listFind(list, val)', 'Returns the index of the first occurence of the value in the list, or -1 if not found'],
    ['listHas(list, val)', 'Returns true if the list contains the value, false otherwise'],
    ['listJoin(list1, list2)', 'Joins two lists into a single list'],
    ['listFlat(list, depth?)', 'Returns a copy of the nested list, flattened to the specified depth'],
    ['listSlice(start, end?)', 'Return a sub-list from the list'],
    ['listZip(lists)', 'Converts a set of lists from rows into columns, based on the shortest list'],
    ['lisZip2(lists)', 'Converts a set of lists from rows into columns, based on the longest list']
 ];

 const vectors = [
    ['vecAdd(v1, v2)', 'Adds two vectors'],
    ['vecSub(v1, v2)', 'Subtracts vec2 from vec1'],
    ['vecDiv(v, num)', 'Divides a vector by a number'],
    ['vecMult(v, num)', 'Multiplies a vector by a number'],
    ['vecLen(v)', 'Calculates the magnitude of a vector'],
    ['vecSetLen(v, num)', 'Sets the magnitude of a vector'],
    ['vecNorm(v)', 'Sets the magnitude of a vector to 1'],
    ['vecRev(v)', 'Reverses the direction of a vector'],
    ['vecFromTo(pt1, pt2)', 'Creates a vector between two points'],
    ['vecAng(v1, v2)', 'Calculate the angle (0 to PI) between two vectors'],
    ['vecAng2(v1, v2, n)', 'Calculate the angle (0 to 2PI) between two vectors, relative to the plane normal'],
    ['vecDot(v1, v2)', 'Calculates the cross product of thre vectors'],
    ['vecCross(v1, v2)', 'Calculates the dot product of two vectors'],
    ['vecEqual(v1, v2, tol)', 'Returns true if the difference between two vectors is smaler than a specified tolerance']
];

const conversion = [
    ['boolean(val)', 'Converts the value to a boolean'],
    ['number(val)', 'Converts the value to a number'],
    ['string(val)', 'Converts the value to a string'],
    ['radToDeg(rad)', 'Converts radians to degrees'],
    ['degToRad(deg)', 'Converts degrees to radians']
];

const random = [
    ['rand(min, max)', 'Returns a random number in the specified range'],
    ['randInt(min, max)', 'Returns a random integer in the specified range'],
    ['randPick(list, num)', 'Returns a random set of items from the list']
];

const arithmetic = [
    ['abs(num)', 'Returns the absolute value of the number'],
    ['square(num)', 'Returns the square of the number'],
    ['cube(num)', 'Returns the cube of the number'],
    ['pow(numb, pow)', 'Returns the number to the specified power'],
    ['sqrt(num)', 'Returns the square root of the number'],
    ['exp(num)', 'Returns the value of E to the power of the number'],
    ['log(num)', 'Returns the natural logarithm (base E) of the number'],
    ['round(num)', 'Returns the value of the number rounded to its nearest integer'],
    ['ceil(num)', 'Returns the value of the number rounded up to its nearest integer'],
    ['floor(num)', 'Returns the value of the number rounded down to its nearest integer'],
    ['mod(num, num)', 'Converts the value to a boolean'],
    ['sum(list)', 'Returns the sum of all values in a list'],
    ['prod(list)', 'Returns the product of all values in a list'],
    ['hypot(list)', 'Returns the hypothenuse of all values in a list'],
    ['norm(list)', 'Returns the norm of a vector'],
    ['distance(list, list)', 'Returns the Eucledian distance between two locations (each as a list of xyz coordinates)']
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

const str = [
    ['replace(string,search_str,new_str)', 'Replace all instances of specified search with a new string']
];

export const inline_func = [
    ['constants', constants],
    ['random', random],
    ['lists', lists],
    ['conversion', conversion],
    ['vectors', vectors],
    ['arithmetic', arithmetic],
    ['statistics', statistics],
    ['trigonometry', trigonometry]
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
