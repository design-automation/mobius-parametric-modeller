
/**
 * 
 * @param fn_name
 * @param args
 * @param expected
 */
export function checkNumArgs(fn_name: string, args: IArguments, max: number, min?: number) {
    if (min === undefined ) {
        if (args.length !== (max + 1)) {
            throw new Error(
                'Inline function "' + fn_name + '()": wrong number of arguments. ' +
                'The required number of arguments is ' + max + '. ' +
                'but ' + (args.length - 1) + ' arguments were given.' +
                'Please check the documentation for the "' + fn_name + '()" function.'
            );
        }
    } else {
        if (args.length > max + 1) {
            throw new Error(
                'Inline function "' + fn_name + '()": too many arguments. ' +
                'The maximum number of arguments is ' + max + '. ' +
                'but ' + (args.length - 1) + ' arguments were given.' +
                'Please check the documentation for the "' + fn_name + '()" function.'
            );
        }
        if (args.length < min + 1) {
            throw new Error(
                'Inline function "' + fn_name + '()": too few arguments. ' +
                'The minimum number of arguments is ' + max + '. ' +
                'but ' + (args.length - 1) + ' arguments were given. ' +
                'Please check the documentation for the "' + fn_name + '()" function.'
            );
        }
    }
}
/**
 * 
 * @param fn_name
 * @param args
 */
export function checkListsSameLen(fn_name: string, args: IArguments) {
    for (let i = 1; i < args.length; i++) {
        if (!Array.isArray(args[i])) {
            throw new Error(
                'Inline function "' + fn_name + '()": invalid arguments. ' +
                'The arguments must all be lists. ' +
                'The following argument is not a list: ' + JSON.stringify(args[i])  +
                'Please check the documentation for the "' + fn_name + '()" function.'
            );
        }
        if (i > 1) {
            if (args[1].length !== args[i].length) {
                throw new Error(
                    'Inline function "' + fn_name + '()": invalid arguments. ' +
                    'The arguments must all be lists of the same length. ' +
                    'The following argument has a length that does not match the first list: ' + JSON.stringify(args[i])  +
                    'Please check the documentation for the "' + fn_name + '()" function.'
                );
            }
        }
    }
}
