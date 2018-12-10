import {__new__, __merge__} from './Model';

export const _parameterTypes = {
    constList: '__constList__',
    model: '__model__',
    input: '__input__',

    new: 'Model.__new__', // TODO - make this genric
    newFn: __new__,

    merge: 'Model.__merge__', // TODO - make this genric
    mergeFn: __merge__,

    preprocess: 'Model.__preprocess__', // TODO - make this genric
    postprocess: 'Model.__postprocess__' // TODO - make this genric
};
