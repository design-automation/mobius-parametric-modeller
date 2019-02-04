# MODIFY    

## Move  
* **Description:** Moves entities by vector.  
* **Parameters:**  
  * *entities:* Position, vertex, edge, wire, face, point, polyline, polygon, collection.  
  * *vector:* List of three numbers.  
* **Returns:** void  
* **Examples:**  
  * modify.Move(position1, [1,1,1])  
    Moves position1 by [1,1,1].
  
  
## Rotate  
* **Description:** Rotates entities on plane by angle.  
* **Parameters:**  
  * *entities:* Vertex, edge, wire, face, plane, position, point, polyline, polygon, collection.  
  * *origin:* A list of three numbers (or a position, point, or vertex).  
  * *axis:* A list of three numbers.  
  * *angle:* Angle (in radians).  
* **Returns:** void  
* **Examples:**  
  * modify.Rotate(polyline1, plane1, PI)  
    Rotates polyline1 on plane1 by PI (i.e. 180 degrees).
  
  
## Scale  
* **Description:** Scales entities on plane by factor.  
* **Parameters:**  
  * *entities:* Vertex, edge, wire, face, plane, position, point, polyline, polygon, collection.  
  * *origin:* Position, point, vertex, list of three numbers, plane.  
  * *scale:* Scale factor.  
* **Returns:** void  
* **Examples:**  
  * modify.Scale(entities, plane1, 0.5)  
    Scales entities by 0.5 on plane1.
  
  
## Mirror  
* **Description:** Mirrors entities across plane.  
* **Parameters:**  
  * *entities:* Vertex, edge, wire, face, plane, position, point, polyline, polygon, collection.  
  * *origin:* Position, vertex, point, list of three numbers.  
  * *direction:* Vector or a list of three numbers.  
* **Returns:** void  
* **Examples:**  
  * modify.Mirror(polygon1, plane1)  
    Mirrors polygon1 across plane1.
  
  
## XForm  
* **Description:** Transforms entities from one construction plane to another.  
* **Parameters:**  
  * *entities:* Vertex, edge, wire, face, position, point, polyline, polygon, collection.  
  * *from:* Plane defining target construction plane.  
  * *to:* Plane defining destination construction plane.  
* **Returns:** void  
* **Examples:**  
  * modify.XForm(polygon1, plane1, plane2)  
    Transforms polygon1 from plane1 to plane2.
  
  
## Reverse  
* **Description:** Reverses direction of entities.  
* **Parameters:**  
  * *entities:* Wire, face, polyline, polygon.  
* **Returns:** void  
* **Examples:**  
  * modify.Reverse(face1)  
    Flips face1 and reverses its normal.  
  * modify.Reverse(polyline1)  
    Reverses the order of vertices to reverse the direction of the polyline.
  
  
## Shift  
* **Description:** Reverses direction of entities.  
* **Parameters:**  
  * *entities:* Wire, face, polyline, polygon.  
  * *offset:* undefined  
* **Returns:** void  
* **Examples:**  
  * modify.Reverse(face1)  
    Flips face1 and reverses its normal.  
  * modify.Reverse(polyline1)  
    Reverses the order of vertices to reverse the direction of the polyline.
  
  
## Close  
* **Description:** Closes polyline(s) if open.  
* **Parameters:**  
  * *lines:* Polyline(s).  
* **Returns:** void  
* **Examples:**  
  * modify.Close([polyline1,polyline2,...])  
    If open, polylines are changed to closed; if already closed, nothing happens.
  
  
## Delete  
* **Description:** Deletes geometric entities: positions, points, polylines, polygons, and collections.
When deleting positions, any topology that requires those positions will also be deleted.
(For example, any vertices linked to the deleted position will also be deleted,
which may in turn result in some edges being deleted, and so forth.)
For positions, the selection to delete or keep unused positions is ignored.
When deleting objects (point, polyline, and polygons), topology is also deleted.
When deleting collections, none of the objects in the collection are deleted.  
* **Parameters:**  
  * *entities:* Position, point, polyline, polygon, collection.  
  * *del_unused_posis:* Enum, delete or keep unused positions.  
* **Returns:** void  
* **Examples:**  
  * modify.Delete(polygon1)  
    Deletes polygon1 from the model.
  
  
## Keep  
* **Description:** Keeps the specified geometric entities: positions, points, polylines, polygons, and collections.
Everything else in the model is deleted.
When a collection is kept, all objects inside the collection are also kept.
When an object is kept, all positions used by the object are also kept.  
* **Parameters:**  
  * *entities:* Position, point, polyline, polygon, collection.  
* **Returns:** void  
* **Examples:**  
  * modify.Delete(polygon1)  
    Deletes polygon1 from the model.
  
  
