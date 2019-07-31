# QUERY    

## Get  
* **Description:** Returns a list of entities based on a query expression.
The result will always be a list of entities, even if there is only one entity.
In a case where you want only one entity, remember to get the first item in the list.
~
The query expression can use the following format: #@name == value,
where 'name' is the attribute name, and 'value' is the attribute value that you are searching for.
~
If the attribute value is a string, then in must be in quotes, as follows: #@name == 'str_value'.
~
If the attribute value is a number, then any comparison operator can be used: ==, !=, >, >=, <, =<.
~  
* **Parameters:**  
  * *select:* Enum, specifies what type of entities will be returned.  
  * *entities:* List of entities to be searched. If 'null' (without quotes), all entities in the model will be searched.  
  * *query_expr:* Attribute condition. If 'null' (without quotes), no condition is set; all found entities are returned.  
* **Returns:** Entities, a list of entities that match the type specified in 'select' and the conditions specified in 'query_expr'.  
* **Examples:**  
  * positions = query.Get(positions, polyline1, #@xyz[2]>10)  
    Returns a list of positions that are part of polyline1 where the z-coordinate is more than 10.  
  * positions = query.Get(positions, null, #@xyz[2]>10)  
    Returns a list of positions in the model where the z-coordinate is more than 10.  
  * positions = query.Get(positions, polyline1, null)  
    Returns a list of all of the positions that are part of polyline1.  
  * polylines = query.Get(polylines, position1, null)  
    Returns a list of all of the polylines that use position1.  
  * collections = query.Get(collections, null, #@type=="floors")  
    Returns a list of all the collections that have an attribute called "type" with a value "floors".
  
  
## Invert  
* **Description:** Returns a list of entities excluding the specified entities.  
* **Parameters:**  
  * *select:* Enum, specifies what type of entities will be returned.  
  * *entities:* List of entities to be excluded.  
* **Returns:** Entities, a list of entities that match the type specified in 'select'.  
* **Examples:**  
  * objects = query.Get(objects, polyline1, null)  
    Returns a list of all the objects in the model except polyline1.
  
  
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
  * *sort_expr:* Attribute condition. If 'null' (without quotes), entities will be sorted based on their ID.  
  * *method:* Enum, sort descending or ascending.  
* **Returns:** Entities, a list of sorted entities.  
* **Examples:**  
  * sorted_list = query.Sort( [pos1, pos2, pos3], #@xyz[2], descending)  
    Returns a list of three positions, sorted according to the descending z value.
  
  
## Count  
* **Description:** Returns the number of entities based on a query expression.
~
The query expression can use the following format: #@name == value,
where 'name' is the attribute name, and 'value' is the attribute value that you are searching for.
~
If the attribute value is a string, then in must be in quotes, as follows: #@name == 'str_value'.
~
If the attribute value is a number, then any comparison operator can be used: ==, !=, >, >=, <, =<.  
* **Parameters:**  
  * *select:* Enum, specifies what type of entities are to be counted.  
  * *entities:* List of entities to be searched. If 'null' (without quotes), list of all entities in the model.  
  * *query_expr:* Attribute condition. If 'null' (without quotes), no condition is set; list of all search entities is returned.  
* **Returns:** Number of entities.  
* **Examples:**  
  * num_ents = query.Count(positions, polyline1, #@xyz[2]>10)  
    Returns the number of positions defined by polyline1 where the z-coordinate is more than 10.
  
  
## Perimeter  
* **Description:** Returns a list of perimeter entities. In order to qualify as a perimeter entity,
entities must be part of the set of input entities and must have naked edges.
~  
* **Parameters:**  
  * *select:* Enum, select the types of entities to return  
  * *entities:* List of entities.  
* **Returns:** Entities, a list of perimeter entities.  
* **Examples:**  
  * mod.Perimeter('edges', [polygon1,polygon2,polygon])  
    Returns list of edges that are at the perimeter of polygon1, polygon2, or polygon3.
  
  
## Neighbour  
* **Description:** Returns a list of neighbouring entities. In order to qualify as a neighbour,
entities must not be part of the set of input entities, but must be welded to one or more entities in the input.
~  
* **Parameters:**  
  * *select:* Enum, select the types of neighbours to return  
  * *entities:* List of entities.  
* **Returns:** Entities, a list of welded neighbours  
* **Examples:**  
  * mod.Neighbour('edges', [polyline1,polyline2,polyline3])  
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
  * *query_ent_type:* Enum, select the conditions to test agains.  
* **Returns:** Boolean or list of boolean in input sequence.  
* **Examples:**  
  * query.Type([polyline1, polyline2, polygon1], is_polyline )  
    Returns a list [true, true, false] if polyline1 and polyline2 are polylines but polygon1 is not a polyline.
  
  
