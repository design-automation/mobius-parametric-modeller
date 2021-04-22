# COLLECTION  
  
## Create  
  
  
**Description:** Create a new collection.  
  
**Parameters:**  
  * *entities:* List or nested lists of points, polylines, polygons, and other colletions, or null.  
  * *name:* The name to give to this collection, resulting in an attribute called `name`. If `null`, no attribute will be created.  
  
**Returns:** Entities, new collection, or a list of new collections.  
**Examples:**  
  * collection1 = collection.Create([point1,polyine1,polygon1], 'my_coll')  
    Creates a collection containing point1, polyline1, polygon1, with an attribute `name = 'my_coll'`.
  
  
  
## Get  
  
  
**Description:** Get one or more collections from the model, given a name or list of names.
Collections with an attribute called 'name' and with a value that matches teh given vale will be returned.


The value for name can include wildcards: '?' matches any single character and '*' matches any sequence of characters.
For example, 'coll?' will match 'coll1' and 'colla'. 'coll*' matches any name that starts with 'coll'.


If a single collection is found, the collection will be returned as a single item (not a list).
This is a convenience so that there is no need to get the first item out of the returned list.


If no collections are found, then an empty list is returned.

  
  
**Parameters:**  
  * *names:* A name or list of names. May include wildcards, '?' and '*'.  
  
**Returns:** The collection, or a list of collections.  
  
  
## Add  
  
  
**Description:** Addes entities to a collection.

  
  
**Parameters:**  
  * *coll:* The collection to be updated.  
  * *entities:* Points, polylines, polygons, and collections to add.  
  
**Returns:** void  
  
  
## Remove  
  
  
**Description:** Removes entities from a collection.

  
  
**Parameters:**  
  * *coll:* The collection to be updated.  
  * *entities:* Points, polylines, polygons, and collections to add. Or null to empty the collection.  
  
**Returns:** void  
  
  
## Delete  
  
  
**Description:** Deletes a collection without deleting the entities in the collection.

  
  
**Parameters:**  
  * *coll:* The collection or list of collections to be deleted.  
  
**Returns:** void  
  
  
