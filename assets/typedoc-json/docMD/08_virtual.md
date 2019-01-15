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
  * *plane:* Plane or list of planes.  
* **Returns:** Ray or list of rays.  
  
## GetRay  
* **Description:** Returns a plane of a face.  
* **Parameters:**  
  * *edge:* The id of an edge  
* **Returns:** The face plane.  
  
## GetPlane  
* **Description:** Returns a plane from a set of positions.  
* **Parameters:**  
  * *entities:* Any entities  
* **Returns:** The plane.  
  
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
  * *plane:* A list of lists  
  * *scale:* undefined  
* **Returns:** A points, a polygon and two polyline representing the plane. (The point is the origin of the plane.)  
* **Examples:**  
  * plane1 = virtual.visPlane(position1, vector1, [0,1,0])  
    Creates a plane with position1 on it and normal = cross product of vector1 with y-axis.
  
  
