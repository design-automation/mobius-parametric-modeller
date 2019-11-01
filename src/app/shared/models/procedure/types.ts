export enum ProcedureTypes {
    Variable,   // 0
    If,         // 1
    Elseif,     // 2
    Else,       // 3
    Foreach,    // 4
    While,      // 5
    Break,      // 6
    Continue,   // 7

    MainFunction,   // 8
    globalFuncCall,   // 9

    Constant,   // 10
    Return,     // 11

    AddData,    // 12 !Obsolete!

    Blank,      // 13

    Comment,    // 14
    Terminate,  // 15

    LocalFuncDef,  // 16
    LocalFuncReturn, // 17
    LocalFuncCall, // 18
}

