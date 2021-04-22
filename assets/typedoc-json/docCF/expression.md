# EXPRESSION  
  
**Description:** Opens up a dialog box for creating expressions.
 
An expression is a combination of one or more constants, variables, functions, and operators that can be evaluated to produce another value.
 
**Simple Expressions**
 
example of simple expressions are `2 + 2`, which evaluates to `4`, and `1 ** 2`, which evaluates to `false`. Expressions can also contain variables, for exaple is the variable `x` exists in the current scope, and has a value of `10`, then the expression `x + 2` will evaluate to `12`. 
 
**Expressions with Functions**
 
An expression can also contain inline functions, such as `sqrt(9)` which evaluates to `3`. Functions can also be nested inside one another, for example, `round(sqrt(20))` evaluates to `4`. 
 
Note that all inline functions return a value. 
 
**Expressions with Spatial Information Queries** 
 
The Obi language also supports a number of shortcus for querying entities in the spatial information model. 
 
 * The `#XX` and `entity#XX` expressions are used to get a list of entities from the model.
 * The `entity@name` expression is used to get attributes from entities in the model.
 * The `?@name ** value` expression is used to filter a list of entities based on attribute values.  
  
  