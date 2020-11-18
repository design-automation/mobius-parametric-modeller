export enum ProcedureTypes {
    Variable,   // 0
    If,         // 1
    Elseif,     // 2
    Else,       // 3
    Foreach,    // 4
    While,      // 5
    Break,      // 6
    Continue,   // 7

    MainFunction,   // 8 (previously Function)
    globalFuncCall,   // 9 (previously Imported)

    Constant,   // 10
    EndReturn,     // 11

    AddData,    // 12 !Obsolete!

    Blank,      // 13

    Comment,    // 14
    Terminate,  // 15

    LocalFuncDef,  // 16
    Return, // 17
    LocalFuncCall, // 18

    Error // 19
}

