# CALC  
  
## Distance  
  
  
**Description:** Calculates the minimum distance from one position to other entities in the model.  
  
**Parameters:**  
  * *entities1:* Position to calculate distance from.  
  * *entities2:* List of entities to calculate distance to.  
  * *method:* Enum; distance method.  
  
**Returns:** Distance, or list of distances (if position2 is a list).  
**Examples:**  
  * distance1 = calc.Distance (position1, position2, p_to_p_distance)  
    position1 = [0,0,0], position2 = [[0,0,10],[0,0,20]], Expected value of distance is 10.
  
  
  
## Length  
  
  
**Description:** Calculates the length of an entity.  
  
**Parameters:**  
  * *entities:* Single or list of edges or wires or other entities from which wires can be extracted.  
  
**Returns:** Lengths, a number or list of numbers.  
**Examples:**  
  * length1 = calc.Length(line1)
  
  
  
## Area  
  
  
**Description:** Calculates the area of en entity.  
  
**Parameters:**  
  * *entities:* Single or list of polygons, closed polylines, closed wires, collections.  
  
**Returns:** Area.  
**Examples:**  
  * area1 = calc.Area (surface1)
  
  
  
## Vector  
  
  
**Description:** Returns a vector along an edge, from the start position to the end position.
The vector is not normalized.  
  
**Parameters:**  
  * *entities:* Single or list of edges, or any entity from which edges can be extracted.  
  
**Returns:** The vector [x, y, z] or a list of vectors.  
  
  
## Centroid  
  
  
**Description:** Calculates the centroid of an entity.  
  
**Parameters:**  
  * *entities:* Single or list of entities. (Can be any type of entities.)  
  * *method:* Enum, the method for calculating the centroid.  
  
**Returns:** A centroid [x, y, z] or a list of centroids.  
**Examples:**  
  * centroid1 = calc.Centroid (polygon1)
  
  
  
## Normal  
  
  
**Description:** Calculates the normal vector of an entity or list of entities. The vector is normalised, and scaled
by the specified scale factor.  
  
**Parameters:**  
  * *entities:* Single or list of entities. (Can be any type of entities.)  
  * *scale:* The scale factor for the normal vector. (This is equivalent to the length of the normal vector.)  
  
**Returns:** The normal vector [x, y, z] or a list of normal vectors.  
**Examples:**  
  * normal1 = calc.Normal (polygon1, 1)  
    If the input is non-planar, the output vector will be an average of all normals vector of the polygon triangles.
  
  
  
## Eval  
  
  
**Description:** Calculates the xyz coord along an edge, wire, or polyline given a t parameter.  
  
**Parameters:**  
  * *entities:* Single or list of edges, wires, polylines, or faces, polygons, or collections.  
  * *t_param:* A value between 0 to 1.  
  
**Returns:** The coordinates [x, y, z], or a list of coordinates.  
**Examples:**  
  * coord1 = calc.Eval (polyline1, 0.23)
  
  
  
## Ray  
  
  
**Description:** Returns a ray for an edge or a polygons.  
  
**Parameters:**  
  * *entities:* An edge, a wirea polygon, or a list.  
  
**Returns:** The ray.  
  
  
## Plane  
  
  
**Description:** Returns a plane from a polygon, a face, a polyline, or a wire.
For polylines or wires, there must be at least three non-colinear vertices.  
  
**Parameters:**  
  * *entities:* Any entities  
  
**Returns:** The plane.  
  
  
## BBox  
  
  
**Description:** Returns the bounding box of the entities.
The bounding box is an imaginary box that completley contains all the geometry.
The box is always aligned with the global x, y, and z axes.
The bounding box consists of a list of lists, as follows [[x, y, z], [x, y, z], [x, y, z], [x, y, z]].  
  
**Parameters:**  
  * *entities:* The etities for which to calculate the bounding box.  
  
**Returns:** The bounding box consisting of a list of four lists.  
  
  
