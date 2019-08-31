# QUERY    

## Get  
* **Description:** Get entities from a list of entities.
For example, you can get the position entities from a list of polygon entities.
~
The result will always be a list of entities, even if there is only one entity.
In a case where you want only one entity, remember to get the first item in the list.
~
The resulting list of entities will not contain duplicate entities.
~  
* **Parameters:**  
  * *ent_type_enum:* Enum, the type of entity to get.  
  * *entities:* Optional, list of entities to get entities from, or null to get all entities in the model.  
* **Returns:** Entities, a list of entities.  
* **Examples:**  
  * positions = query.Get('positions', [polyline1, polyline2])  
    Returns a list of positions that are part of polyline1 and polyline2.
  
  
## Filter  
* **Description:** Filter entities based on a query.
~
The result will always be a list of entities, even if there is only one entity.
In a case where you want only one entity, remember to get the first item in the list.
~
The filter expression can use the following format: ab#@name == value, where
'ab' is the two letter identifier of the entity type ('ps', '_v', '_e', '_w', '_f', 'pt', 'pl', 'pg', 'co')
'name' is the attribute name, and
'value' is the attribute value that you are searching for.
~
If the attribute value is a string, then in must be in quotes, e.g.: pg#@name == 'str_value'.
~
If the attribute value is a number, then any comparison operator can be used: ==, !=, >, >=, <, =<.
~
If the attribute value is a list, then a list index can be used, e.g.: ps#@xyz[2] > 10.
~  
* **Parameters:**  
  * *entities:* List of entities to filter, or null..  
  * *name:* The attribute name to use for filtering.  
  * *index:* Optional, attribute index to use for filtering (for attributes that are lists), or null to filter all entities the model.  
  * *operator_enum:* Enum, the operator to use for filtering  
  * *value:* The attribute value to use for filtering.  
* **Returns:** Entities, a list of entities that match the conditions specified in 'expr'.  
* **Examples:**  
  * positions = query.Get(polyline1, ps#@xyz[2]>10)  
    Returns a list of positions that are part of polyline1 where the z-coordinate is more than 10.  
  * positions = query.Get(null, ps#@xyz[2]>10)  
    Returns a list of positions in the model where the z-coordinate is more than 10.  
  * positions = query.Get(polyline1, ps#)  
    Returns a list of all of the positions that are part of polyline1.  
  * polylines = query.Get(position1, pl#)  
    Returns a list of all of the polylines that use position1.  
  * collections = query.Get(null, co#@type=="floors")  
    Returns a list of all the collections that have an attribute called "type" with a value "floors".
  
  
## Invert  
* **Description:** Returns a list of entities that are not part of the specified entities.
For example, you can get the position entities that are not part of a list of polygon entities.
~
This function does the opposite of query.Get().
While query.Get() gets entities that are part of of the list of entities,
this function gets the entities that are not part of the list of entities.
~  
* **Parameters:**  
  * *ent_type_enum:* Enum, specifies what type of entities will be returned.  
  * *entities:* List of entities to be excluded.  
* **Returns:** Entities, a list of entities that match the type specified in 'ent_type_enum', and that are not in entities.  
* **Examples:**  
  * positions = query.Invert('positions', [polyline1, polyline2])  
    Returns a list of positions that are not part of polyline1 and polyline2.
  
  
## Sort  
* **Description:** Sorts entities based on a sort expression.
~
The sort expression should use the following format: #@name, where 'name' is the attribute name.
Entities can be sorted using multiple sort expresssions as follows: #@name1 && #@name2.
~
If the attribute is a list, and index can also be specified as follows: #@name1[index].
~  
* **Parameters:**  
  * *entities:* List of two or more entities to be sorted, all of the same entity type.  
  * *name:* Attribute name to use for sorting.  
  * *idx_or_key:* Optional, attribute index to use for sorting (for attributes that are lists), or null.  
  * *method_enum:* Enum, sort descending or ascending.  
* **Returns:** Entities, a list of sorted entities.  
* **Examples:**  
  * sorted_list = query.Sort( [pos1, pos2, pos3], #@xyz[2], descending)  
    Returns a list of three positions, sorted according to the descending z value.
  
  
## Perimeter  
* **Description:** Returns a list of perimeter entities. In order to qualify as a perimeter entity,
entities must be part of the set of input entities and must have naked edges.
~  
* **Parameters:**  
  * *ent_type:* Enum, select the types of entities to return  
  * *entities:* List of entities.  
* **Returns:** Entities, a list of perimeter entities.  
* **Examples:**  
  * mod.Perimeter('edges', [polygon1,polygon2,polygon])  
    Returns list of edges that are at the perimeter of polygon1, polygon2, or polygon3.
  
  
## Neighbor  
* **Description:** Returns a list of neighboring entities. In order to qualify as a neighbor,
entities must not be part of the set of input entities, but must be welded to one or more entities in the input.
~  
* **Parameters:**  
  * *ent_type_enum:* Enum, select the types of neighbors to return  
  * *entities:* List of entities.  
* **Returns:** Entities, a list of welded neighbors  
* **Examples:**  
  * mod.neighbor('edges', [polyline1,polyline2,polyline3])  
    Returns list of edges that are welded to polyline1, polyline2, or polyline3.
  
  
## Type  
* **Description:** Checks the type of an entity.
~
For is_used_posi, returns true if the entity is a posi, and it is used by at least one vertex.
For is_unused_posi, it returns the opposite of is_used_posi.
For is_object, returns true if the entity is a point, a polyline, or a polygon.
For is_topology, returns true if the entity is a vertex, an edge, a wire, or a face.
For is_point_topology, is_polyline_topology, and is_polygon_topology, returns true
if the entity is a topological entity, and it is part of an object of the specified type.
~
For is_open, returns true if the entity is a wire or polyline and is open. For is_closed, it returns the opposite of is_open.
For is_hole, returns ture if the entity is a wire, and it defines a hole in a face.
For has_holes, returns true if the entity is a face or polygon, and it has holes.
For has_no_holes, it returns the opposite of has_holes.  
* **Parameters:**  
  * *entities:* An entity, or a list of entities.  
  * *type_query_enum:* Enum, select the conditions to test agains.  
* **Returns:** Boolean or list of boolean in input sequence.  
* **Examples:**  
  * query.Type([polyline1, polyline2, polygon1], is_polyline )  
    Returns a list [true, true, false] if polyline1 and polyline2 are polylines but polygon1 is not a polyline.
  
  
