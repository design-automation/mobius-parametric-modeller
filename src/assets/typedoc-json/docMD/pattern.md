# PATTERN    

## Arc  
* **Description:** Creates a list of XYZ coordinates in an arc arrangement.  
* **Parameters:**  
  * *origin:* XYZ coordinates as a list of three numbers.  
  * *radius:* Radius of circle as a number.  
  * *num_positions:* Number of positions distributed equally along the arc.  
  * *arc_angle:* Angle of arc (in radians).  
* **Returns:** XYZ coordinates if successful, null if unsuccessful or on error.  
* **Examples:**  
  * coordinates1 = pattern.Arc([0,0,0], 10, 12, PI)  
    Creates a list of 12 XYZ coordinates distributed equally along a semicircle of radius 10.
  
  
## Grid  
* **Description:** Creates a list of XYZ coordinates in a grid arrangement.  
* **Parameters:**  
  * *origin:* XYZ coordinates as a list of three numbers.  
  * *size:* Size of grid. If number, assume square grid of that length; if list of two numbers, x and y lengths respectively.  
  * *num_positions:* Number of positions.  
  * *method:* Enum, define the way the coords will be return as lists.
If integer, same number for x and y; if list of two numbers, number for x and y respectively.  
* **Returns:** XYZ coordinates if successful, null if unsuccessful or on error.  
* **Examples:**  
  * coordinates1 = pattern.Grid([0,0,0], 10, 3)  
    Creates a list of 9 XYZ coordinates on a 3x3 square grid of length 10.  
  * coordinates1 = pattern.Grid([0,0,0], [10,20], [2,4])  
    Creates a list of 8 XYZ coordinates on a 2x4 grid of length 10 by 20.
  
  
## Rectangle  
* **Description:** Creates a list of XYZ coordinates in a rectangular arrangement.  
* **Parameters:**  
  * *origin:* XYZ coordinates as a list of three numbers.  
  * *size:* Size of rectangle. If number, assume square of that length; if list of two numbers, x and y lengths respectively.  
* **Returns:** XYZ coordinates if successful, null if unsuccessful or on error.  
* **Examples:**  
  * coordinates1 = pattern.Rectangle([0,0,0], 10)  
    Creates a list of 4 coords, being the vertices of a 10 by 10 square.  
  * coordinates1 = pattern.Rectangle([0,0,0], [10,20])  
    Creates a list of 4 coords, being the vertices of a 10 by 20 rectangle.
  
  
