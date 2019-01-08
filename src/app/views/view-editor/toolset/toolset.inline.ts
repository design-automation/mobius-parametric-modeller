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


const lists = [
    ['range(start, end)', 'List of integers as a range'],
    ['length(list)', 'Returns the number of items in the list']
 ];

const conversion = [
    ['boolean(value)', 'Converts the value to a boolean'],
    ['number(value)', 'Converts the value to a number'],
    ['string(value)', 'Converts the value to a string']
];

const random = [
    ['random([min, max])', 'Returns a random number in the specified range'],
    ['randomInt([min, max]))', 'Returns a random integer in the specified range'],
    ['pickRandom(list)', 'Returns a random item from the list']
];

const arithmetic = [
    ['abs(number)', 'Returns the absolute value of the number'],
    ['square(number)', 'Returns the square of the number'],
    ['cube(number)', 'Returns the cube of the number'],
    ['pow(number, power)', 'Returns the number to the specified power'],
    ['sqrt(number)', 'Returns the square root of the number'],
    ['exp(number)', 'Returns the value of E to the power of the number'],
    ['log(number)', 'Returns the natural logarithm (base E) of the number'],
    ['round(number)', 'Returns the value of the number rounded to its nearest integer'],
    ['ceil(number)', 'Returns the value of the number rounded up to its nearest integer'],
    ['floor(number)', 'Returns the value of the number rounded down to its nearest integer'],
    ['mod(number, number)', 'Converts the value to a boolean'],
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
    ['sin(radians)', 'Returns the sine of a value (in radians)'],
    ['asin(number)', 'Returns the inverse sine of a value (in radians)'],
    ['sinh(radians)', 'Returns the hyperbolic sine of a value (in radians)'],
    ['asinh(number)', 'Returns the hyperbolic arcsine of a value (in radians)'],
    ['cos(radians)', 'Returns the cosine of a value (in radians)'],
    ['acos(number)', 'Returns the inverse cosine of a value (in radians)'],
    ['cosh(radians)', 'Returns the hyperbolic cosine of a value (in radians)'],
    ['acosh(number)', 'Returns the hyperbolic arccos of a value (in radians)'],
    ['tan(radians)', 'Returns the tangent of a value (in radians)'],
    ['atan(number)', 'Returns the inverse tangent of a value (in radians)'],
    ['tanh(radians)', 'Returns the hyperbolic tangent of a value (in radians)'],
    ['atanh(number)', 'Returns the hyperbolic arctangent of a value (in radians)'],
    ['atan2(number1, number2)', 'Returns the inverse tangent function with two arguments, number1/number2']
];

const str = [
    ['replace(string,search_str,new_str)', 'Replace all instances of specified search with a new string']
];

export const inline_func = [
    ['lists', lists],
    ['conversion', conversion],
    ['arithmetic', arithmetic],
    ['statistics', statistics],
    ['trigonometry', trigonometry]
];

// for (let i = 0; i < inline_func.length; i++) {
//     inline_func[i][1].forEach((arr) => {
//         arr[0].
//     });
// }
