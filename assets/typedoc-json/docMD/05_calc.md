# CALC    

## Distance  
* **Description:** Calculates the minimum distance from one position to other entities in the model.
~  
* **Parameters:**  
  * *entities1:* Position to calculate distance from.  
  * *entities2:* List of entities to calculate distance to.  
  * *method:* Enum; distance method.  
* **Returns:** Distance, or list of distances (if position2 is a list).  
* **Examples:**  
  * distance1 = calc.Distance (position1, position2, p_to_p_distance)  
    position1 = [0,0,0], position2 = [[0,0,10],[0,0,20]], Expected value of distance is 10.
  
  
## Length  
* **Description:** Calculates the length of an entity.
~
The entity can be an edge, a wire, a polyline, or anything from which wires can be extracted.
This includes polylines, polygons, faces, and collections.
~
Given a list of edges, wires, or polylines, a list of lengths are returned.
~
Given any types of entities from which wires can be extracted, a list of lengths are returned.
For example, given a single polygon, a list of lengths are returned (since a polygon may have multiple wires).
~  
* **Parameters:**  
  * *entities:* Single or list of edges, wires, or polylines, or other entities from which wires can be extracted.  
* **Returns:** Lengths, a number or list of numbers.  
* **Examples:**  
  * length1 = calc.Length(line1)
  
  
## Area  
* **Description:** Calculates the area of en entity.
~
The entity can be a polygon, a face, a closed polyline, a closed wire, or a collection.
~
Given a list of entities, a list of areas are returned.
~  
* **Parameters:**  
  * *entities:* Single or list of polygons, faces, closed polylines, closed wires, collections.  
* **Returns:** Area.  
* **Examples:**  
  * area1 = calc.Area (surface1)
  
  
## Vector  
* **Description:** Returns a vector along an edge, from the start position to the end position.
The vector is not normalized.
~
Given a single edge, a single vector will be returned. Given a list of edges, a list of vectors will be returned.
~
Given any entity that has edges (collection, polygons, polylines, faces, and wires),
a list of edges will be extracted, and a list of vectors will be returned.
~  
* **Parameters:**  
  * *entities:* Single or list of edges, or any entity from which edges can be extracted.  
* **Returns:** The vector [x, y, z] or a list of vectors.  
  
## Centroid  
* **Description:** Calculates the centroid of an entity.
~
If 'ps_average' is selected, the centroid is the average of the positions that make up that entity.
~
If 'center_of_mass' is selected, the centroid is the centre of mass of the faces that make up that entity.
Note that only faces are deemed to have mass.
~
Given a list of entities, a list of centroids will be returned.
~
Given a list of positions, a single centroid that is the average of all those positions will be returned.
~  
* **Parameters:**  
  * *entities:* Single or list of entities. (Can be any type of entities.)  
  * *method:* Enum, the method for calculating the centroid.  
* **Returns:** A centroid [x, y, z] or a list of centroids.  
* **Examples:**  
  * centroid1 = calc.Centroid (polygon1)
  
  
## Normal  
* **Description:** Calculates the normal vector of an entity or list of entities. The vector is normalised, and scaled
by the specified scale factor.
~
Given a single entity, a single normal will be returned. Given a list of entities, a list of normals will be returned.
~
For polygons, faces, and face wires the normal is calculated by taking the average of all the normals of the face triangles.
~
For polylines and polyline wires, the normal is calculated by triangulating the positions, and then
taking the average of all the normals of the triangles.
~
For edges, the normal is calculated by takingthe avery of the normals of the two vertices.
~
For vertices, the normal is calculated by creating a triangle out of the two adjacent edges,
and then calculating the normal of the triangle.
(If there is only one edge, or if the two adjacent edges are colinear, the the normal of the wire is returned.)
~
For positions, the normal is calculated by taking the average of the normals of all the vertices linked to the position.
~
If the normal cannot be calculated, [0, 0, 0] will be returned.  
* **Parameters:**  
  * *entities:* Single or list of entities. (Can be any type of entities.)  
  * *scale:* The scale factor for the normal vector. (This is equivalent to the length of the normal vector.)  
* **Returns:** The normal vector [x, y, z] or a list of normal vectors.  
* **Examples:**  
  * normal1 = calc.Normal (polygon1, 1)  
    If the input is non-planar, the output vector will be an average of all normals vector of the polygon triangles.
  
  
## Eval  
* **Description:** Calculates the xyz coord along an edge, wire, or polyline given a t parameter.
~
The 't' parameter varies between 0 and 1, where 0 indicates the start and 1 indicates the end.
For example, given a polyline,
evaluating at t=0 gives that xyz at the start,
evaluating at t=0.5 gives the xyz halfway along the polyline,
evaluating at t=1 gives the xyz at the end of the polyline.
~
Given a single edge, wire, or polyline, a single xyz coord will be returned.
~
Given a list of edges, wires, or polylines, a list of xyz coords will be returned.
~
Given any entity that has wires (faces, polygons and collections),
a list of wires will be extracted, and a list of coords will be returned.
~  
* **Parameters:**  
  * *entities:* Single or list of edges, wires, polylines, or faces, polygons, or collections.  
  * *t_param:* A value between 0 to 1.  
* **Returns:** The coordinates [x, y, z], or a list of coordinates.  
* **Examples:**  
  * coord1 = calc.Eval (polyline1, 0.23)
  
  
## Ray  
* **Description:** Returns a ray for an edge, a face, or a polygons. For edges, it returns a ray along the edge, from teh start vertex to the end vertex
For a face or polygon, it returns the ray that is the z-axis of the plane.
~
For an edge, the ray vector is not normalised. For a face or polygon, the ray vector is normalised.  
* **Parameters:**  
  * *entities:* An edge, a face, or a polygon, or a list.  
* **Returns:** The ray.  
  
## Plane  
* **Description:** Returns a plane from a polygon, a face, a polyline, or a wire.
For polylines or wires, there must be at least three non-colinear vertices.
~
The winding order is counter-clockwise.
This means that if the vertices are ordered counter-clockwise relative to your point of view,
then the z axis of the plane will be pointing towards you.  
* **Parameters:**  
  * *entities:* Any entities  
* **Returns:** The plane.  
  
## BBox  
* **Description:** Returns the bounding box of the entities.
The bounding box is an imaginary box that completley contains all the geometry.
The box is always aligned with the global x, y, and z axes.
The bounding box consists of a list of lists, as follows [[x, y, z], [x, y, z], [x, y, z], [x, y, z]].
- The first [x, y, z] is the coordinates of the centre of the bounding box.
- The second [x, y, z] is the corner of the bounding box with the lowest x, y, z values.
- The third [x, y, z] is the corner of the bounding box with the highest x, y, z values.
- The fourth [x, y, z] is the dimensions of the bounding box.
~  
* **Parameters:**  
  * *entities:* The etities for which to calculate the bounding box.  
* **Returns:** The bounding box consisting of a list of four lists.  
  
