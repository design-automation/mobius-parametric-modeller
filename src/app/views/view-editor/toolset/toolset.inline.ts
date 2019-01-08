export const inline_query_expr = [
    ['#@name == value', 'Search attributes equal to a given value'],
    ['#@name[i] == value', 'Search attribute index i equal to a given value'],
    ['#@name != value', 'Search attributes not equal to a given value'],
    ['#@name[i] != value', 'Search attribute index not equal to a given value'],
    ['#@name > value', 'Search attributes greater than a given value'],
    ['#@name[i] > value', 'Search attribute index greater than a given value'],
    ['#@name >= value', 'Search attributes greater than or equal to a given value'],
    ['#@name[i] >= value', 'Search attribute index greater than or equal to a given value'],
    ['#@name < value', 'Search attributes less than a given value'],
    ['#@name[i] < value', 'Search attribute index less than a given value'],
    ['#@name <= value', 'Search attributes less than or equal to a given value'],
    ['#@name[i] <= value', 'Search attribute index less than or equal to a given value']
];

export const inline_sort_expr = [
    ['#@name', 'Sort based on attribute value'],
    ['#@name[i]', 'Sort based on attribute index value']
];

const lists = [
    ['range(start, end)', 'Generates a list of integers as a range'],
    ['length(list)', 'Returns the number of items in the list']
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
    ['vecDot(v1, v2)', 'Calculates the cross product of thre vectors'],
    ['vecCross(v1, v2)', 'Calculates the dot product of two vectors']
];

const conversion = [
    ['boolean(val)', 'Converts the value to a boolean'],
    ['number(val)', 'Converts the value to a number'],
    ['string(val)', 'Converts the value to a string'],
    ['radToDeg(rad)', 'Converts radians to degrees'],
    ['degToRad(deg)', 'Converts degrees to radians']
];

const random = [
    ['random([min, max])', 'Returns a random number in the specified range'],
    ['randomInt([min, max]))', 'Returns a random integer in the specified range'],
    ['pickRandom(list)', 'Returns a random item from the list']
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
    ['PI', 'Returns the value of pi'],
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
    ['lists', lists],
    ['conversion', conversion],
    ['vectors', vectors],
    ['arithmetic', arithmetic],
    ['statistics', statistics],
    ['trigonometry', trigonometry]
];
