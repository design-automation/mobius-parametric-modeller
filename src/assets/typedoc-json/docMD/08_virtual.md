# VIRTUAL    

## Ray  
* **Description:** Creates a ray, centered at the origin.
A ray is defined by a list of two lists, as follows: [origin, direction_vector].  
* **Parameters:**  
  * *origin:* Origin of ray: Position, Vertex, Point, or a list of three numbers  
  * *dir_vec:* Direction of Ray: Vector, or list of three numbers  
* **Returns:** : [[x,y,z],[x',y',z']]  
* **Examples:**  
  * virtual.Ray([1,2,3],[4,3,2])  
    Creates a ray from [1,2,3] with the vector [4,3,2].

  
  
## Plane  
* **Description:** Creates a plane, centered at the origin.
A plane is define by a list of three lists, as folows: [origin, x_vector, y_vector].  
* **Parameters:**  
  * *origin:* Origin of plane: Position, Vertex, Point, or a list of three numbers  
  * *x_vec:* X vector of the plane: List of three numbers  
  * *xy_vec:* A vector in the xy plane (parallel to teh x vector): List of three numbers  
* **Returns:** : [[x,y,z],[x',y',z'],[x",y",z"]]  
* **Examples:**  
  * virtual.Plane ([1,2,3],[4,3,2],[3,3,9])  
    Creates a plane with its origin positioned at [1,2,3] and two vectors [4,3,2] and [3,3,9] lie on it.
  
  
## RayFromPlane  
* **Description:** Create a ray, from a plane.
The direction will be along the z axis.
A plane is define by a list of three lists, as folows: [origin, x_vector, y_vector].
A ray is defined by a list of two lists, as follows: [origin, direction_vector].  
* **Parameters:**  
  * *planes:* undefined  
* **Returns:** Ray or list of rays.  
  
## GetRay  
* **Description:** Returns a ray for an edge, a face, or a polygons. For edges, it returns a ray along the edge, from teh start vertex to the end vertex
For a face or polygon, it returns the ray that is the z-axis of the plane.
~
For an edge, the ray vector is not normalised. For a face or polygon, the ray vector is normalised.  
* **Parameters:**  
  * *entities:* An edge, a face, or a polygon, or a list.  
* **Returns:** The ray.  
  
## GetPlane  
* **Description:** Returns a plane from a polygon, a face, a polyline, or a wire.
For polylines or wires, there must be at least three non-colinear vertices.
~
The winding order is counter-clockwise.
This means that if the vertices are ordered counter-clockwise relative to your point of view,
then the z axis of the plane will be pointing towards you.  
* **Parameters:**  
  * *entities:* Any entities  
* **Returns:** The plane.  
  
## GetBBox  
* **Description:** Returns the bounding box of the entities.
The bounding box is an imaginary box that completley contains all the geometry.
The box is always aligned with the global x, y, and z axes.
The bounding box consists of a list of lists, as follows [[x, y, z], [x, y, z], [x, y, z], [x, y, z]].
- The first [x, y, z] is the coordinates of the centre of the bounding box.
- The second [x, y, z] is the corner of the bounding box with the lowest x, y, z values.
- The third [x, y, z] is the corner of the bounding box with the highest x, y, z values.
- The fourth [x, y, z] is the dimensions of the bounding box.  
* **Parameters:**  
  * *entities:* The etities for which to calculate the bounding box.  
* **Returns:** The bounding box consisting of a list of four lists.  
  
## VisRay  
* **Description:** Visualises a ray by adding geometry to the model.  
* **Parameters:**  
  * *ray:* A list of two list of three coordinates [origin, vector]: [[x,y,z],[x',y',z']]  
  * *scale:* undefined  
* **Returns:** A points and a line representing the ray. (The point is tha start point of the ray.)  
* **Examples:**  
  * ray1 = virtual.visRay([[1,2,3],[0,0,1]])
  
  
## VisPlane  
* **Description:** Visualises a plane by adding geometry to the model.  
* **Parameters:**  
  * *planes:* undefined  
  * *scale:* undefined  
* **Returns:** A points, a polygon and two polyline representing the plane. (The point is the origin of the plane.)  
* **Examples:**  
  * plane1 = virtual.visPlane(position1, vector1, [0,1,0])  
    Creates a plane with position1 on it and normal = cross product of vector1 with y-axis.
  
  
## visBBox  
* **Description:** Visualises a bounding box by adding geometry to the model.  
* **Parameters:**  
  * *bbox:* A list of lists.  
* **Returns:** Twelve polylines representing the box.  
* **Examples:**  
  * bbox1 = virtual.viBBox(position1, vector1, [0,1,0])  
    Creates a plane with position1 on it and normal = cross product of vector1 with y-axis.
  
  
