import {__new__, __merge__} from './Model';

export const _parameterTypes = {
    constList: '__constList__',
    model: '__model__',
    input: '__input__',

    new: 'Model.__new__',
    newFn: __new__,

    merge: 'Model.__merge__',
    mergeFn: __merge__,

    preprocess: 'Model.__preprocess__',
    postprocess: 'Model.__postprocess__'
};
