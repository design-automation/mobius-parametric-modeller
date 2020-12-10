The `#XX` expression  is used to get a list of connected entities. 

The `XX` is a two letter code that specifies the type of entity that is required. They are as folows:
* `ps`: positions
* `_v`: vertices (topology)
* `_e`: edges (topology)
* `_w`: wires (topology)
* `pt`: points (objects)
* `pl`: polylines (objects)
* `pg`: polygons (objects)
* `co`: collections (groups of objects)

The expression will return a list of entities of the given type. For example:

* `#ps` gets all the positions in the model
* `1#pg` gets all the polygons in the model.
