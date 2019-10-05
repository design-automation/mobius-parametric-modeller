# PATTERN    

## Rectangle  
* **Description:** Creates four positions in a rectangle pattern. Returns a list of new positions.  
* **Parameters:**  
  * *origin:* XYZ coordinates as a list of three numbers.  
  * *size:* Size of rectangle. If number, assume square of that length; if list of two numbers, x and y lengths respectively.  
* **Returns:** Entities, a list of four positions.  
* **Examples:**  
  * coordinates1 = pattern.Rectangle([0,0,0], 10)  
    Creates a list of 4 coords, being the vertices of a 10 by 10 square.  
  * coordinates1 = pattern.Rectangle([0,0,0], [10,20])  
    Creates a list of 4 coords, being the vertices of a 10 by 20 rectangle.
  
  
## Grid  
* **Description:** Creates positions in a grid pattern. Returns a list (or list of lists) of new positions.  
* **Parameters:**  
  * *origin:* XYZ coordinates as a list of three numbers.  
  * *size:* Size of grid. If number, assume square grid of that length; if list of two numbers, x and y lengths respectively.  
  * *num_positions:* Number of positions.  
  * *method:* Enum, define the way the coords will be return as lists.
If integer, same number for x and y; if list of two numbers, number for x and y respectively.  
* **Returns:** Entities, a list of positions, or a list of lists of positions (depending on the 'method' setting).  
* **Examples:**  
  * coordinates1 = pattern.Grid([0,0,0], 10, 3)  
    Creates a list of 9 XYZ coordinates on a 3x3 square grid of length 10.  
  * coordinates1 = pattern.Grid([0,0,0], [10,20], [2,4])  
    Creates a list of 8 XYZ coordinates on a 2x4 grid of length 10 by 20.
  
  
## Arc  
* **Description:** Creates positions in an arc pattern. Returns a list of new positions.
If the angle of the arc is set to null, then circular patterns will be created.
For circular patterns, duplicates at start and end are automatically removed.  
* **Parameters:**  
  * *origin:* XYZ coordinates as a list of three numbers.  
  * *radius:* Radius of circle as a number.  
  * *num_positions:* Number of positions to be distributed equally along the arc.  
  * *arc_angle:* Angle of arc (in radians).  
* **Returns:** Entities, a list of positions.  
* **Examples:**  
  * coordinates1 = pattern.Arc([0,0,0], 10, 12, PI)  
    Creates a list of 12 positions distributed equally along a semicircle of radius 10.
  
  
## Bezier  
* **Description:** Creates positions in an Bezier curve pattern. Returns a list of new positions.
The Bezier is created as either a qadratic or cubic Bezier. It is always an open curve.
~
The input is a list of XYZ coordinates. These act as the control points for creating the Bezier curve.
~
For the quadratic Bezier, three XYZ coordinates are required.
For the cubic Bezier, four XYZ coordinates are required.
~  
* **Parameters:**  
  * *coords:* A list of XYZ coordinates (three coords for quadratics, four coords for cubics).  
  * *type:* Enum, the type of Catmull-Rom curve.  
  * *num_positions:* Number of positions to be distributed along the Bezier.  
* **Returns:** Entities, a list of positions.  
* **Examples:**  
  * coordinates1 = pattern.Bezier([[0,0,0], [10,0,50], [20,0,10]], 'quadratic', 20)  
    Creates a list of 20 positions distributed along a Bezier curve pattern.
  
  
## Spline  
* **Description:** Creates positions in an spline pattern. Returns a list of new positions.
The spline is created using the Catmull-Rom algorithm.
~
The input is a list of XYZ coordinates. These act as the control points for creating the Spline curve.
~
The spline curve can be created in three ways: 'centripetal', 'chordal', or 'catmullrom'.
<img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Catmull-Rom_examples_with_parameters..png"
alt="Curve types" width="100">
~  
* **Parameters:**  
  * *coords:* A list of XYZ coordinates.  
  * *type:* Enum, the type of Catmull-Rom curve.  
  * *close:* Enum, 'open' or 'close'.  
  * *tension:* Curve tension, between 0 and 1. This only has an effect when the 'type' is set to 'catmullrom'.  
  * *num_positions:* Number of positions to be distributed distributed along the spline.  
* **Returns:** Entities, a list of positions.  
* **Examples:**  
  * coordinates1 = pattern.Spline([[0,0,0], [10,0,50], [20,0,0], [30,0,20], [40,0,10]], 'chordal','close', 0.2, 50)  
    Creates a list of 50 positions distributed along a spline curve pattern.
  
  
