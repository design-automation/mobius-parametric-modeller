The `?@name == value` expression is used to filter a list of entities based on attribute values. The `?@` characters can be read as 'where attribute'. 

Any of the  following comparators can be used: `==`, `!=`, `>`, `>=`, `<`, `<=`.

The `?@name == value` exxpression is often compined with the `#XX` expression. For example:

* `#pg ?@abc == 10` gets all the polygons in the model, and then filters them, returning only the polygons where the attribute `abc` has a value of `10`.
* `pgon1#ps ?@xyz[2] > 10` gets the positions from the polygon that is stored in the variable `pgon1`, and then filters the positions, returning only the positions where the Z value is greater than 10.
