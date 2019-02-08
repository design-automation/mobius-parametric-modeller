# CALC    

## Distance  
* **Description:** Calculates the distance between two positions.  
* **Parameters:**  
  * *position1:* First position.  
  * *position2:* Second position, or list of positions.  
  * *method:* Enum; distance or min_distance.  
* **Returns:** Distance, or list of distances (if position2 is a list).  
* **Examples:**  
  * distance1 = calc.Distance (position1, position2, p_to_p_distance)  
    position1 = [0,0,0], position2 = [[0,0,10],[0,0,20]], Expected value of distance is [10,20].
  
  
## Length  
* **Description:** Calculates the length of a line or a list of lines.  
* **Parameters:**  
  * *lines:* Edge, wire or polyline.  
* **Returns:** Length.  
* **Examples:**  
  * length1 = calc.Length (line1)
  
  
## Area  
* **Description:** Calculates the area of a surface or a list of surfaces.
TODO: allow for a list of surfaces  
* **Parameters:**  
  * *entities:* A polygon, a face, a closed polyline, or a closed wire.  
* **Returns:** Area.  
* **Examples:**  
  * area1 = calc.Area (surface1)
  
  
## Vector  
* **Description:** Returns a vector along an edge.  
* **Parameters:**  
  * *edge:* An edge  
* **Returns:** The vector [x, y, z] from the start point of an edge to the end point of an edge.  
  
## Centroid  
* **Description:** Calculates the centroid of a list of any entity.  
* **Parameters:**  
  * *entities:* List of positions, vertices, points, edges, wires, polylines, faces, polygons, or collections.  
* **Returns:** The centroid [x, y, z] of the entities. (No position is created in the model.)  
* **Examples:**  
  * centroid1 = calc.Centroid (polygon1)
  
  
## Normal  
* **Description:** Calculates the normal of a list of positions, a polygon, a face, a closed polyline, a closed wire, or a plane..  
* **Parameters:**  
  * *entities:* List of positions, a polygon, a face, a closed polyline, a closed wire, or a plane.  
* **Returns:** The normal vector [x, y, z].  
* **Examples:**  
  * normal1 = calc.Normal (polygon1)  
    If the input is non-planar, the output vector will be an average of all normal vector of the triangulated surfaces.
  
  
## ParamTToXyz  
* **Description:** Calculates the location on a linear entity, given a t parameter.  
* **Parameters:**  
  * *line:* Edge, wire, or polyline.  
  * *t_param:* A value between 0 to 1.  
* **Returns:** The coordinates of the location, [x, y, z]. (No position is created in the model.)  
* **Examples:**  
  * coord1 = calc.ParamTToXyz (polyline1, 0.23)
  
  
