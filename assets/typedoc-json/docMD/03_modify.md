# MODIFY    

## Move  
* **Description:** Moves entities. The directio and distance if movement is specified as a vector.
~
If only one vector is given, then all entities are moved by the same vector.
If a list of vectors is given, the each entity will be moved by a different vector.
In this case, the number of vectors should be equal to the number of entities.
~
If a position is shared between entites that are being moved by different vectors,
then the position will be moved by the average of the vectors.
~  
* **Parameters:**  
  * *entities:* An entity or list of entities to move.  
  * *vectors:* undefined  
* **Returns:** void  
* **Examples:**  
  * modify.Move(pline1, [1,2,3])  
    Moves pline1 by [1,2,3].  
  * modify.Move([pos1, pos2, pos3], [[0,0,1], [0,0,1], [0,1,0]] )  
    Moves pos1 by [0,0,1], pos2 by [0,0,1], and pos3 by [0,1,0].  
  * modify.Move([pgon1, pgon2], [1,2,3] )  
    Moves both pgon1 and pgon2 by [1,2,3].
  
  
## Rotate  
* **Description:** Rotates entities on plane by angle.
~  
* **Parameters:**  
  * *entities:* An entity or list of entities to rotate.  
  * *ray:* A ray to rotate around. \
Given a plane, a ray will be created from the plane z axis. \
Given an `xyz` location, a ray will be generated with an origin at this location, and a direction `[0, 0, 1]`. \
Given any entities, the centroid will be extracted, \
and a ray will be generated with an origin at this centroid, and a direction `[0, 0, 1]`.  
  * *angle:* Angle (in radians).  
* **Returns:** void  
* **Examples:**  
  * modify.Rotate(polyline1, plane1, PI)  
    Rotates polyline1 around the z-axis of plane1 by PI (i.e. 180 degrees).
  
  
## Scale  
* **Description:** Scales entities relative to a plane.
~  
* **Parameters:**  
  * *entities:* An entity or list of entities to scale.  
  * *plane:* A plane to scale around. \
Given a ray, a plane will be generated that is perpendicular to the ray. \
Given an `xyz` location, a plane will be generated with an origin at that location and with axes parallel to the global axes. \
Given any entities, the centroid will be extracted, \
and a plane will be generated with an origin at the centroid, and with axes parallel to the global axes.  
  * *scale:* Scale factor, a single number to scale equally, or [scale_x, scale_y, scale_z] relative to the plane.  
* **Returns:** void  
* **Examples:**  
  * modify.Scale(entities, plane1, 0.5)  
    Scales entities by 0.5 on plane1.  
  * modify.Scale(entities, plane1, [0.5, 1, 1])  
    Scales entities by 0.5 along the x axis of plane1, with no scaling along the y and z axes.
  
  
## Mirror  
* **Description:** Mirrors entities across a plane.
~  
* **Parameters:**  
  * *entities:* An entity or list of entities to mirros.  
  * *plane:* A plane to scale around. \
Given a ray, a plane will be generated that is perpendicular to the ray. \
Given an `xyz` location, a plane will be generated with an origin at that location and with axes parallel to the global axes. \
Given any entities, the centroid will be extracted, \
and a plane will be generated with an origin at the centroid, and with axes parallel to the global axes.  
* **Returns:** void  
* **Examples:**  
  * modify.Mirror(polygon1, plane1)  
    Mirrors polygon1 across plane1.
  
  
## XForm  
* **Description:** Transforms entities from a source plane to a target plane.
~  
* **Parameters:**  
  * *entities:* Vertex, edge, wire, face, position, point, polyline, polygon, collection.  
  * *from_plane:* Plane defining source plane for the transformation. \
Given a ray, a plane will be generated that is perpendicular to the ray. \
Given an `xyz` location, a plane will be generated with an origin at that location and with axes parallel to the global axes. \
Given any entities, the centroid will be extracted, \
and a plane will be generated with an origin at the centroid, and with axes parallel to the global axes.  
  * *to_plane:* Plane defining target plane for the transformation. \
Given a ray, a plane will be generated that is perpendicular to the ray. \
Given an `xyz` location, a plane will be generated with an origin at that location and with axes parallel to the global axes. \
Given any entities, the centroid will be extracted, \
and a plane will be generated with an origin at the centroid, and with axes parallel to the global axes.  
* **Returns:** void  
* **Examples:**  
  * modify.XForm(polygon1, plane1, plane2)  
    Transforms polygon1 from plane1 to plane2.
  
  
## Offset  
* **Description:** Offsets wires.
~  
* **Parameters:**  
  * *entities:* Edges, wires, faces, polylines, polygons, collections.  
  * *dist:* The distance to offset by, can be either positive or negative  
* **Returns:** void  
* **Examples:**  
  * modify.Offset(polygon1, 10)  
    Offsets the wires inside polygon1 by 10 units. Holes will also be offset.
  
  
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
* **Description:** Shifts the order of the edges in a closed wire.
~
In a closed wire, any edge (or vertex) could be the first edge of the ring.
In some cases, it is useful to have an edge in a particular position in a ring.
This function allows the edges to be shifted either forwards or backwards around the ring.
The order of the edges in the ring will remain unchanged.  
* **Parameters:**  
  * *entities:* Wire, face, polyline, polygon.  
  * *offset:* undefined  
* **Returns:** void  
* **Examples:**  
  * modify.Shift(face1, 1)  
    Shifts the edges in the face wire, so that the every edge moves up by one position
in the ring. The last edge will become the first edge .  
  * modify.Shift(polyline1, -1)  
    Shifts the edges in the closed polyline wire, so that every edge moves back by one position
in the ring. The first edge will become the last edge.
  
  
## Ring  
* **Description:** Opens or closes a polyline.
~  
* **Parameters:**  
  * *entities:* undefined  
  * *method:* undefined  
* **Returns:** void  
* **Examples:**  
  * modify.Close([polyline1,polyline2,...], method='close')  
    If open, polylines are changed to closed; if already closed, nothing happens.
  
  
## Weld  
* **Description:** Unweld vertices so that they do not share positions.
~  
* **Parameters:**  
  * *entities:* Entities, a list of vertices, or entities from which vertices can be extracted.  
  * *method:* Enum; the method to use for welding.  
* **Returns:** void  
  
## Fuse  
* **Description:** Fuse positions that lie within a certain tolerance of one another.
New positions will be created.
If the positions that are fuse have vertices attached, then the vertices will become welded.
~
In some cases, if edges are shorter than the tolerance, this can result in edges being deleted.
The deletion of edges may also result in polylines or polygpns being deleted.
~  
* **Parameters:**  
  * *entities:* Entities, a list of positions, or entities from which positions can be extracted.  
  * *tolerance:* The distance tolerance for fusing positions.
 @returns void
  
  
## Remesh  
* **Description:** Remesh a face or polygon.
~
When a face or polygon is deformed, the triangles that make up that face will sometimes become incorrect.
Remeshing will regenerate the triangulated mesh for the face.
Remeshing is not performed automatically as it would degrade performance.
Instead, it is left up to the user to remesh only when it is actually required.
~  
* **Parameters:**  
  * *entities:* Single or list of faces, polygons, collections.  
* **Returns:** void  
* **Examples:**  
  * modify.Remesh(polygon1)  
    Remeshs the face of the polygon.
  
  
## Delete  
* **Description:** Deletes geometric entities: positions, points, polylines, polygons, and collections.
~
When deleting positions, any topology that requires those positions will also be deleted.
(For example, any vertices linked to the deleted position will also be deleted,
which may in turn result in some edges being deleted, and so forth.)
~
When deleting objects (point, polyline, and polygons), topology is also deleted.
~
When deleting collections, the objects and other collections in the collection are also deleted.
~  
* **Parameters:**  
  * *entities:* Positions, points, polylines, polygons, collections.  
  * *method:* Enum, delete or keep unused positions.  
* **Returns:** void  
* **Examples:**  
  * modify.Delete(polygon1, 'delete_selected')  
    Deletes polygon1 from the model.
  
  
