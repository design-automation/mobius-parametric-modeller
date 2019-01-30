# PATTERN    

## Arc  
* **Description:** Creates positions in an arc pattern, and returns the list of new positions.
If the angle of the arc is set to null, then circular patterns will be created.
For circular patterns, duplicates at start and end are automatically removed.  
* **Parameters:**  
  * *origin:* XYZ coordinates as a list of three numbers.  
  * *radius:* Radius of circle as a number.  
  * *num_positions:* Number of positions distributed equally along the arc.  
  * *arc_angle:* Angle of arc (in radians).  
* **Returns:** A list of positions.  
* **Examples:**  
  * coordinates1 = pattern.Arc([0,0,0], 10, 12, PI)  
    Creates a list of 12 XYZ coordinates distributed equally along a semicircle of radius 10.
  
  
## Grid  
* **Description:** Creates positions in a grid pattern, and returns the list (or list of lists) of new positions.  
* **Parameters:**  
  * *origin:* XYZ coordinates as a list of three numbers.  
  * *size:* Size of grid. If number, assume square grid of that length; if list of two numbers, x and y lengths respectively.  
  * *num_positions:* Number of positions.  
  * *method:* Enum, define the way the coords will be return as lists.
If integer, same number for x and y; if list of two numbers, number for x and y respectively.  
* **Returns:** A list of positions, or a list of lists of positions (depending on the 'method' setting).  
* **Examples:**  
  * coordinates1 = pattern.Grid([0,0,0], 10, 3)  
    Creates a list of 9 XYZ coordinates on a 3x3 square grid of length 10.  
  * coordinates1 = pattern.Grid([0,0,0], [10,20], [2,4])  
    Creates a list of 8 XYZ coordinates on a 2x4 grid of length 10 by 20.
  
  
## Rectangle  
* **Description:** Creates four positions in a rectangle pattern, and returns the list of new positions.  
* **Parameters:**  
  * *origin:* XYZ coordinates as a list of three numbers.  
  * *size:* Size of rectangle. If number, assume square of that length; if list of two numbers, x and y lengths respectively.  
* **Returns:** A list of four positions.  
* **Examples:**  
  * coordinates1 = pattern.Rectangle([0,0,0], 10)  
    Creates a list of 4 coords, being the vertices of a 10 by 10 square.  
  * coordinates1 = pattern.Rectangle([0,0,0], [10,20])  
    Creates a list of 4 coords, being the vertices of a 10 by 20 rectangle.
  
  
