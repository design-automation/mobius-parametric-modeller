Opens up a dialog box for creating expressions.

An expression is a combination of one or more constants, variables, functions, and operators that can be evaluated to produce another value.

== Simple Expressions ==

Examples of simple expressions are `2 + 2`, which evaluates to `4`, and `1 == 2`, which evaluates to `false`. Expressions can also contain variables, for exaple is the variable `x` exists in the current scope, and has a value of `10`, then the expression `x + 2` will evaluate to `12`. 

== Expressions with Functions ==

An expression can also contain inline functions, such as `sqrt(9)` which evaluates to `3`. Functions can also be nested inside one another, for example, `round(sqrt(20))` evaluates to `4`. 

Note that all inline functions return a value. 

== Expressions with Spatial Information Queries == 

The Obi language also supports a number of shortcus for querying entities in the spatial information model. 

The `#` character is used to get a list of entities from the model. For example:

* `#pg` gets all polygons in the model.
* `pgon1#_e` gets the edges from the polygon that is stored in the variable `pgon1`.

Note that the `#` shorcut will always return a list of entities.

The `@` character is used to get attributes from entities in the model. For example:

* `pgon1@abc` gets the value of an attribute called `abc` from the polygon that is stored in the variable `pgon1`. (Note that if an attribute with that name does not exist, then an error will be thrown.)
* `posi1@xyz` gets the value of an attribute called `xyz` from the position that is stored in the variable `posi1`. ((Note that the `xyz` attribute is a built in attribute that stores the location of a position.)

The `?@` pair of characters is used to filter a list of entities based on attribute values. The `?@` characters can be read as 'where attribute'. For example:

* `#pg ?@abc == 10` gets all the polygons in the model, and then filters them, returning only the polygons where the attribute `abc` has a value of `10`.
* `pgon1#ps ?@xyz[2] > 10` gets the positions from the polygon that is stored in the variable `pgon1`, and then filters the positions, returning only the positions where teh Z value is greater than 10.
