# MAKE    

## Position  
* **Description:** Adds a new position to the model.  
* **Parameters:**  
  * *coords:* XYZ coordinates as a list of three numbers.  
* **Returns:** New position, or a list of new positions, or a list of lists of new positions .  
* **Examples:**  
  * position1 = make.Position([1,2,3])  
    Creates a position with coordinates x=1, y=2, z=3.  
* **Example URLs:**  
  1. [make.Position.mob](https://mobius.design-automation.net/flowchart?file=https://raw.githubusercontent.com/design-automation/mobius-parametric-modeller/master/src/assets/gallery/function_examples/make.Position.mob&node=1
)  
  
## Point  
* **Description:** Adds a new point to the model. If a list of positions is provided as the input, then a list of points is generated.  
* **Parameters:**  
  * *positions:* Position of point.  
* **Returns:** New point or a list of new points.  
* **Examples:**  
  * point1 = make.Point(position1)  
    Creates a point at position1.  
* **Example URLs:**  
  1. [make.Point.mob](https://mobius.design-automation.net/flowchart?file=https://raw.githubusercontent.com/design-automation/mobius-parametric-modeller/master/src/assets/gallery/function_examples/make.Point.mob&node=1
)  
  
## Polyline  
* **Description:** Adds a new polyline to the model.  
* **Parameters:**  
  * *positions:* List of positions.  
  * *close:* Enum of 'close' or 'open'.  
* **Returns:** New polyline.  
* **Examples:**  
  * polyline1 = make.Polyline([position1,position2,position3], close)  
    Creates a closed polyline with vertices position1, position2, position3 in sequence.  
* **Example URLs:**  
  1. [make.Polyline.mob](https://mobius.design-automation.net/flowchart?file=https://raw.githubusercontent.com/design-automation/mobius-parametric-modeller/master/src/assets/gallery/function_examples/make.Polyline.mob&node=1
)  
  
## Polygon  
* **Description:** Adds a new polygon to the model.  
* **Parameters:**  
  * *positions:* List of positions.  
* **Returns:** New polygon.  
* **Examples:**  
  * polygon1 = make.Polygon([position1,position2,position3])  
    Creates a polygon with vertices position1, position2, position3 in sequence.  
* **Example URLs:**  
  1. [make.Polygon.mob](https://mobius.design-automation.net/flowchart?file=https://raw.githubusercontent.com/design-automation/mobius-parametric-modeller/master/src/assets/gallery/function_examples/make.Polygon.mob&node=1
)  
  
## Collection  
* **Description:** Adds a new collection to the model.  
* **Parameters:**  
  * *parent_coll:* Collection  
  * *geometry:* List of points, polylines, polygons.  
* **Returns:** New collection.  
* **Examples:**  
  * collection1 = make.Collection([point1,polyine1,polygon1])  
    Creates a collection containing point1, polyline1, polygon1.  
* **Example URLs:**  
  1. [make.Collection.mob](https://mobius.design-automation.net/flowchart?file=https://raw.githubusercontent.com/design-automation/mobius-parametric-modeller/master/src/assets/gallery/function_examples/make.Collection.mob&node=1
)  
  
## Copy  
* **Description:** Adds a new copy of specified entities to the model.  
* **Parameters:**  
  * *entities:* Position, point, polyline, polygon, collection to be copied.  
  * *copy_attributes:* Enum to copy attributes or to have no attributes copied.  
* **Returns:** The copied entity or a list of copied entities.  
* **Examples:**  
  * copy1 = make.Copy([position1,polyine1,polygon1], copy_positions, copy_attributes)  
    Creates a list containing a copy of the entities in sequence of input.
  
  
## Hole  
* **Description:** Makes one or more holes in a polygon.
Each hole is defined by a list of positions.
The positions must be on the polygon, i.e. they must be co-planar with the polygon and
they must be within the boundary of the polygon.
If the list of positions consists of a single list, then one hole will be generated.
If the list of positions consists of a list of lists, then multiple holes will be generated.  
* **Parameters:**  
  * *face:* A polygon or a face to make holes in.  
  * *positions:* A list of positions defining the wires of the holes.  
* **Returns:** List of wires resulting from the hole(s).  
  
## Loft  
* **Description:** Lofts between edges.  
* **Parameters:**  
  * *entities:* Edges (or wires, polylines or polygons with the same number of edges).  
  * *method:* Enum, if 'closed', then close the loft back to the first edge in the input.  
* **Returns:** List of new polygons resulting from the loft.  
* **Examples:**  
  * surface1 = make.Loft([polyline1,polyline2,polyline3], closed)  
    Creates a list of polygons lofting between polyline1, polyline2, polyline3, and polyline1.
  
  
## Extrude  
* **Description:** Extrudes geometry by distance (in default direction = z-axis) or by vector.
- Extrusion of a position, vertex, or point produces polylines;
- Extrusion of edge, wire, or polyline produces polygons;
- Extrusion of face or polygon produces polygons, also capped at the top.  
* **Parameters:**  
  * *entities:* Vertex, edge, wire, face, position, point, polyline, polygon, collection.  
  * *distance:* Number or vector. If number, assumed to be [0,0,value] (i.e. extrusion distance in z-direction).  
  * *divisions:* Number of divisions to divide extrusion by. Minimum is 1.  
* **Returns:** List of new polygons resulting from the extrude.  
* **Examples:**  
  * extrusion1 = make.Extrude(point1, 10, 2)  
    Creates a list of 2 lines of total length 10 (length 5 each) in the z-direction.
If point1 = [0,0,0], extrusion1[0] is a line between [0,0,0] and [0,0,5]; extrusion1[1] is a line between [0,0,5] and [0,0,10].  
  * extrusion2 = make.Extrude(polygon1, [0,5,0], 1)  
    Extrudes polygon1 by 5 in the y-direction, creating a list of surfaces.
  
  
## Divide  
* **Description:** Divides edge, wire or polyline by length or by number of segments.
~
If the 'by length' method is selected, length of last segment will be the remainder.
~  
* **Parameters:**  
  * *edge:* Edge, wire, or polyline(s) to be divided.  
  * *divisor:* Segment length or number of segments.  
  * *method:* Enum, select the method for dividing edges.  
* **Returns:** List of new edges resulting from the divide.  
* **Examples:**  
  * segments1 = make.Divide(edge1, 5, by_number)  
    Creates a list of 5 equal segments from edge1.  
  * segments2 = make.Divide(edge1, 5, by_length)  
    If edge1 has length 13, creates from edge a list of two segments of length 5 and one segment of length 3.
  
  
## Unweld  
* **Description:** Unweld vertices so that they do not share positions.
For the vertices of the specified entities, if they share positions with other entities in the model,
then those positions will be replaced with new positions.
This function performs a simple unweld.
That is, the vertices within the set of specified entities are not unwelded.  
* **Parameters:**  
  * *entities:* Vertex, edge, wire, face, point, polyline, polygon, collection.  
* **Returns:** List of new positions resulting from the unweld.  
* **Examples:**  
  * mod.Unweld(polyline1)  
    Unwelds polyline1 from all ther entities that shares the same position.
  
  
