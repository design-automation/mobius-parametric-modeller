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
* **Example URLs:**  
  1. [calc_Distance.mob](https://mobius.design-automation.net/flowchart?file=https://raw.githubusercontent.com/design-automation/mobius-parametric-modeller/master/src/assets/gallery/function_examples/calc_Distance.mob
)  
  
## Length  
* **Description:** Calculates the length of a line or a list of lines.  
* **Parameters:**  
  * *lines:* Edge, wire or polyline.  
* **Returns:** Length.  
* **Examples:**  
  * length1 = calc.Length (line1)  
* **Example URLs:**  
  1. [calc_Length.mob](https://mobius.design-automation.net/flowchart?file=https://raw.githubusercontent.com/design-automation/mobius-parametric-modeller/master/src/assets/gallery/function_examples/calc_Length.mob
)  
  
## Area  
* **Description:** Calculates the area of a surface or a list of surfaces.
TODO: allow for a list of surfaces  
* **Parameters:**  
  * *entities:* A polygon, a face, a closed polyline, or a closed wire.  
* **Returns:** Area.  
* **Examples:**  
  * area1 = calc.Area (surface1)  
* **Example URLs:**  
  1. [calc_Area.mob](https://mobius.design-automation.net/flowchart?file=https://raw.githubusercontent.com/design-automation/mobius-parametric-modeller/master/src/assets/gallery/function_examples/calc_Area.mob
)  
  
## Vector  
* **Description:** Returns a vector along an edge.  
* **Parameters:**  
  * *edge:* An edge  
* **Returns:** The vector from the start point of an edge to the end point of an edge  
* **Example URLs:**  
  1. [calc_Vectore.mob](https://mobius.design-automation.net/flowchart?file=https://raw.githubusercontent.com/design-automation/mobius-parametric-modeller/master/src/assets/gallery/function_examples/calc_Vectore.mob
)  
  
## Centroid  
* **Description:** Calculates the centroid of a list of any entity.  
* **Parameters:**  
  * *entities:* List of positions, vertices, points, edges, wires, polylines, faces, polygons, or collections.  
* **Returns:** Centroid.  
* **Examples:**  
  * centroid1 = calc.Centroid (polygon1)  
* **Example URLs:**  
  1. [calc_Centroid.mob](https://mobius.design-automation.net/flowchart?file=https://raw.githubusercontent.com/design-automation/mobius-parametric-modeller/master/src/assets/gallery/function_examples/calc_Centroid.mob
)  
  
## Normal  
* **Description:** Calculates the normal of a list of positions, a polygon, a face, a closed polyline, a closed wire, or a plane..  
* **Parameters:**  
  * *entities:* List of positions, a polygon, a face, a closed polyline, a closed wire, or a plane.  
* **Returns:** Vector.  
* **Examples:**  
  * normal1 = calc.Normal (polygon1)  
    If the input is non-planar, the output vector will be an average of all normal vector of the triangulated surfaces.  
* **Example URLs:**  
  1. [calc_Normal.mob](https://mobius.design-automation.net/flowchart?file=https://raw.githubusercontent.com/design-automation/mobius-parametric-modeller/master/src/assets/gallery/function_examples/calc_Normal.mob
)  
  
## ParamTToXyz  
* **Description:** Calculates the position on a linear entity, given a t parameter.  
* **Parameters:**  
  * *line:* Edge, wire, or polyline.  
  * *t_param:* A value between 0 to 1.  
* **Returns:** Set of XYZ coordinates.  
* **Examples:**  
  * coord1 = calc.ParamTToXyz (polyline1, 0.23)  
* **Example URLs:**  
  1. [calc_ParamTToXyz.mob](https://mobius.design-automation.net/flowchart?file=https://raw.githubusercontent.com/design-automation/mobius-parametric-modeller/master/src/assets/gallery/function_examples/calc_ParamTToXyz.mob
)  
  
## ParamXyzToT  
* **Description:** Calculates a location on a line to get t parameter.  
* **Parameters:**  
  * *lines:* List of edges, wires, or polylines.  
  * *locations:* List of positions, vertices, points, or coordinates.  
* **Examples:**  
  * coord1 = calc.ParamXyzToT (polyline1, [1,2,3])  
* **Example URLs:**  
  1. [calc_ParamXyzToT.mob](https://mobius.design-automation.net/flowchart?file=https://raw.githubusercontent.com/design-automation/mobius-parametric-modeller/master/src/assets/gallery/function_examples/calc_ParamXyzToT.mob
)  
  
