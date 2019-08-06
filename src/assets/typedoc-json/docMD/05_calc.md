# CALC    

## Distance  
* **Description:** Calculates the distance between two positions.  
* **Parameters:**  
  * *entities1:* First position.  
  * *entities2:* Second position, or list of positions.  
  * *method:* Enum; distance or min_distance.  
* **Returns:** Distance, or list of distances (if position2 is a list).  
* **Examples:**  
  * distance1 = calc.Distance (position1, position2, p_to_p_distance)  
    position1 = [0,0,0], position2 = [[0,0,10],[0,0,20]], Expected value of distance is [10,20].
  
  
## Length  
* **Description:** Calculates the length of a line or a list of lines.  
* **Parameters:**  
  * *entities:* Edge, wire or polyline.  
* **Returns:** Length.  
* **Examples:**  
  * length1 = calc.Length (line1)
  
  
## Area  
* **Description:** Calculates the area of a surface or a list of surfaces.  
* **Parameters:**  
  * *entities:* A polygon, a face, a closed polyline, or a closed wire.  
* **Returns:** Area.  
* **Examples:**  
  * area1 = calc.Area (surface1)
  
  
## Vector  
* **Description:** Returns a vector along an edge.  
* **Parameters:**  
  * *entities:* An edge  
* **Returns:** The vector [x, y, z] from the start point of an edge to the end point of an edge.  
  
## Centroid  
* **Description:** Calculates the centroid of a list of any entity.  
* **Parameters:**  
  * *entities:* List of positions, vertices, points, edges, wires, polylines, faces, polygons, or collections.  
* **Returns:** The centroid [x, y, z] of the entities. (No position is created in the model.)  
* **Examples:**  
  * centroid1 = calc.Centroid (polygon1)
  
  
## Normal  
* **Description:** Calculates the normal vector of an entity or list of entities.
~
For polygons, faces, and face wires the normal is calculated by taking the average of all the normals of the face triangles.
For polylines and polyline wires, the normal is calculated by triangulating the positions, and then
taking the average of all the normals of the triangles.
For edges, the normal is calculated by takingthe avery of teh normals of the two vertices.
For vertices, the normal is calculated by creating a triangle out of the two adjacent edges,
and then calculating the normal of the triangle.
(If there is only one edge, or if the two adjacent edges are colinear, the the normal of the wire is returned.)
For positions, the normal is calculated by taking the average of the normals of all the vertices linked to the position.
For points and positions with no vertices, the normal is [0, 0, 0].  
* **Parameters:**  
  * *entities:* An entity, or list of entities.  
  * *scale:* The scale factor for the normal vector. (This is equivalent to the length of the normal vector.)  
* **Returns:** The normal vector [x, y, z].  
* **Examples:**  
  * normal1 = calc.Normal (polygon1, 1)  
    If the input is non-planar, the output vector will be an average of all normals vector of the polygon triangles.
  
  
## Eval  
* **Description:** Calculates the xyz location on an entity, given a parameter.  
* **Parameters:**  
  * *entities:* Edge, wire, or polyline.  
  * *param:* A value between 0 to 1.  
* **Returns:** The coordinates of the location, [x, y, z]. (No position is created in the model.)  
* **Examples:**  
  * coord1 = calc.ParamTToXyz (polyline1, 0.23)
  
  
