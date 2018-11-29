import {__new__, __merge__} from './functions';

export const _parameterTypes = {
    constList: '__constList__',
    model: '__model__',
    input: '__input__',

    new: 'functions.__new__',
    newFn: __new__,

    merge: 'functions.__merge__',
    mergeFn: __merge__,

    preprocess: 'functions.__preprocess__',
    postprocess: 'functions.__postprocess__'
};
