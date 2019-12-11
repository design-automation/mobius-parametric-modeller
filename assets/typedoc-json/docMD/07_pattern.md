# PATTERN    

## Line  
* **Description:** Creates a row of positions in a line pattern. Returns a list of new positions.  
* **Parameters:**  
  * *origin:* XYZ coordinates as a list of three numbers.  
  * *size:* Size of the line.  
  * *num_positions:* undefined  
* **Returns:** Entities, a list of four positions.  
  
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
  * *size:* Size of grid. If number, assume equal lengths, i.e. a square grid.
If list of two numbers, specifies x and y lengths respectively.  
  * *num_positions:* Number of positions. If a number, assume equal number of positions.
If a list of two numbers, specifies x and y number of positions respectivley.  
  * *method:* Enum, define the way the coords will be return as lists.
If integer, same number for x and y; if list of two numbers, number for x and y respectively.  
* **Returns:** Entities, a list of positions, or a list of lists of positions (depending on the 'method' setting).  
* **Examples:**  
  * coordinates1 = pattern.Grid([0,0,0], 10, 3)  
    Creates a list of 9 XYZ coordinates on a 3x3 square grid of length 10.  
  * coordinates1 = pattern.Grid([0,0,0], [10,20], [2,4])  
    Creates a list of 8 XYZ coordinates on a 2x4 grid of length 10 by 20.
  
  
## Box  
* **Description:** Creates positions in a box pattern. Returns a list of new positions.  
* **Parameters:**  
  * *origin:* XYZ coordinates as a list of three numbers.  
  * *size:* Size of the box. If one number, assume equal lengths.
If list of two or three numbers, specifies x y z lengths respectively.  
  * *num_positions:* Number of positions. If number, assume equal number of positions.
If list of two or three numbers, specifies x y z numbers respectively.  
  * *method:* Enum  
* **Returns:** Entities, a list of 6 positions.  
  
## Polyhedron  
* **Description:** Creates positions in a polyhedron pattern. Returns a list of new positions.
~  
* **Parameters:**  
  * *origin:* XYZ coordinates as a list of three numbers.  
  * *radius:* xxx  
  * *detail:* xxx  
  * *method:* Enum  
* **Returns:** Entities, a list of positions.  
  
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
The input is a list of XYZ coordinates (three coords for quadratics, four coords for cubics).
The first and last coordinates in the list are the start and end positions of the Bezier curve.
The middle coordinates act as the control points for controlling the shape of the Bezier curve.
~
For the quadratic Bezier, three XYZ coordinates are required.
For the cubic Bezier, four XYZ coordinates are required.
~
For more information, see the wikipedia article: <a href="https://en.wikipedia.org/wiki/B%C3%A9zier_curve">B%C3%A9zier_curve</a>.
~  
* **Parameters:**  
  * *coords:* A list of XYZ coordinates (three coords for quadratics, four coords for cubics).  
  * *num_positions:* Number of positions to be distributed along the Bezier.  
* **Returns:** Entities, a list of positions.  
* **Examples:**  
  * coordinates1 = pattern.Bezier([[0,0,0], [10,0,50], [20,0,10]], 20)  
    Creates a list of 20 positions distributed along a Bezier curve pattern.
  
  
## Nurbs  
* **Description:** Creates positions in an NURBS curve pattern, by using the XYZ positions as control points.
Returns a list of new positions.
~
The positions are created along the curve at equal parameter values.
This means that the euclidean distance between the positions will not necessarily be equal.
~
The input is a list of XYZ coordinates that will act as control points for the curve.
If the curve is open, then the first and last coordinates in the list are the start and end positions of the curve.
~
The number of positions should be at least one greater than the degree of the curve.
~
The degree (between 2 and 5) of the urve defines how smooth the curve is.
Quadratic: degree = 2
Cubic: degree = 3
Quartic: degree = 4.
~  
* **Parameters:**  
  * *coords:* A list of XYZ coordinates (must be at least three XYZ coords).  
  * *degree:* The degree of the curve, and integer between 2 and 5.  
  * *close:* Enum, 'close' or 'open'  
  * *num_positions:* Number of positions to be distributed along the Bezier.  
* **Returns:** Entities, a list of positions.  
* **Examples:**  
  * coordinates1 = pattern.Nurbs([[0,0,0], [10,0,50], [20,0,10]], 20)  
    Creates a list of 20 positions distributed along a Bezier curve pattern.
  
  
## nurbsToPosis  
* **Description:** undefined  
* **Parameters:**  
  * *curve_verb:* undefined  
  * *degree:* undefined  
  * *closed:* undefined  
  * *num_positions:* undefined  
  * *start:* undefined  
  
## Interpolate  
* **Description:** Creates positions in an spline pattern. Returns a list of new positions.
The spline is created using the Catmull-Rom algorithm.
It is a type of interpolating spline (a curve that goes through its control points).
~
The input is a list of XYZ coordinates. These act as the control points for creating the Spline curve.
The positions that get generated will be divided equally between the control points.
For example, if you define 4 control points for a cosed spline, and set 'num_positions' to be 40,
then you will get 8 positions between each pair of control points,
irrespective of the distance between the control points.
~
The spline curve can be created in three ways: 'centripetal', 'chordal', or 'catmullrom'.
~
For more information, see the wikipedia article:
<a href="https://en.wikipedia.org/wiki/Centripetal_Catmull%E2%80%93Rom_spline">Catmull–Rom spline</a>.
~
<img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Catmull-Rom_examples_with_parameters..png"
alt="Curve types" width="100">
~  
* **Parameters:**  
  * *coords:* A list of XYZ coordinates.  
  * *type:* Enum, the type of interpolation algorithm.  
  * *tension:* Curve tension, between 0 and 1. This only has an effect when the 'type' is set to 'catmullrom'.  
  * *close:* Enum, 'open' or 'close'.  
  * *num_positions:* Number of positions to be distributed distributed along the spline.  
* **Returns:** Entities, a list of positions.  
* **Examples:**  
  * coordinates1 = pattern.Spline([[0,0,0], [10,0,50], [20,0,0], [30,0,20], [40,0,10]], 'chordal','close', 0.2, 50)  
    Creates a list of 50 positions distributed along a spline curve pattern.
  
  
