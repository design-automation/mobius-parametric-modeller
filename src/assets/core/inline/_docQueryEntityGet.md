The `entity#XX` expression is used to get a list of connected entities. 

The `XX` is a two letter code that specifies the type of entity that is required. They are as folows:
* `ps`: positions
* `_v`: vertices (topology)
* `_e`: edges (topology)
* `_w`: wires (topology)
* `pt`: points (objects)
* `pl`: polylines (objects)
* `pg`: polygons (objects)
* `co`: collections (groups of objects)

The expression will return a list of entities of the given type.

Examples going down the entity hierarchy:

* `pline1#ps` gets all the positions for the polyline that is stored in the variable `pline1`.
* `pgon1#_e` gets the edges from the polygon that is stored in the variable `pgon1`.

Examples going up the entity hierarchy:

* `posi1#pl` gets all the polylines that include the position that is stored in the variable `posi1`.
* `edge1#pg` gets the polygons that include the edge stored in the variable `edge1`.

Note that the `#` shorcut will always return a list of entities, even when only a single entity is returned. If you require just a single entity, then index notation can be used as follows:

* `edge1#pg[0]` gets the first polygon that includes the edge stored in the variable `edge1`.
