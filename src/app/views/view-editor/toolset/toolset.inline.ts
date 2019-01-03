export const inline_query_expr = [
    '# @name == value',
    '# @name != value',
    '# @name > value',
    '# @name >= value',
    '# @name < value',
    '# @name <= value'
];

const lists = [
    'range(start, end)',
    'length(list)'
];

const conversion = [
    'boolean(value)',
    'number(value)',
    'string(value)'
];

const random = [
    'random([min, max])',
    'randomInt([min, max]))',
    'pickRandom(list)'
]

const arithmetic = [
    'abs(number)',
    'square(number)',
    'cube(number)',
    'pow(number, power)',
    'sqrt(number)',
    'exp(number)',
    'log(number)',
    'round(number)',
    'ceil(number)',
    'floor(number)',
    'mod(number, number)',
    'sum(list)',
    'prod(list)',
    'hypot(list)',
    'norm(list)',
    'distance(list, list)'
];

const statistics = [
    'min(list)',
    'max(list)',
    'mad(list)',
    'mean(list)',
    'median(list)',
    'mode(list)',
    'std(list)',
    'vari(list)'
]
const trigonometry = [
    'PI',
    'sin(radians)',
    'asin(number)',
    'sinh(radians)',
    'asinh(number)',
    'cos(radians)',
    'acos(number)',
    'cosh(radians)',
    'acosh(number)',
    'tan(radians)',
    'atan(number)',
    'tanh(radians)',
    'atanh(number)',
    'atan2(number)'
];

const str = [
    'replace()'
];

export const inline_func = [
    ['lists', lists],
    ['conversion', conversion],
    ['arithmetic', arithmetic],
    ['statistics', statistics],
    ['trigonometry', trigonometry]
];
