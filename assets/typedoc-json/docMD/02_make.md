# MAKE    

## Position  
* **Description:** Adds a new position to the model.  
* **Parameters:**  
  * *coords:* XYZ coordinates as a list of three numbers.  
* **Returns:** Entities, new position, or a list of new positions, or a list of lists of new positions .  
* **Examples:**  
  * position1 = make.Position([1,2,3])  
    Creates a position with coordinates x=1, y=2, z=3.  
* **Example URLs:**  
  1. [make.Position.mob](https://design-automation.github.io/mobius-parametric-modeller-0-4-34/flowchart?file=https://raw.githubusercontent.com/design-automation/mobius-parametric-modeller/master/src/assets/gallery/function_examples/make.Position.mob&node=1
)  
  
## Point  
* **Description:** Adds a new point to the model. If a list of positions is provided as the input, then a list of points is generated.  
* **Parameters:**  
  * *positions:* Position of point, or other entities from which positions will be extracted.  
* **Returns:** Entities, new point or a list of new points.  
* **Examples:**  
  * point1 = make.Point(position1)  
    Creates a point at position1.  
* **Example URLs:**  
  1. [make.Point.mob](https://design-automation.github.io/mobius-parametric-modeller-0-4-34/flowchart?file=https://raw.githubusercontent.com/design-automation/mobius-parametric-modeller/master/src/assets/gallery/function_examples/make.Point.mob&node=1
)  
  
## Polyline  
* **Description:** Adds one or more new polylines to the model.  
* **Parameters:**  
  * *entities:* List of positions, or list of lists of positions, or entities from which positions can be extracted.  
  * *close:* Enum, 'open' or 'close'.  
* **Returns:** Entities, new polyline, or a list of new polylines.  
* **Examples:**  
  * polyline1 = make.Polyline([position1,position2,position3], close)  
    Creates a closed polyline with vertices position1, position2, position3 in sequence.  
* **Example URLs:**  
  1. [make.Polyline.mob](https://design-automation.github.io/mobius-parametric-modeller-0-4-34/flowchart?file=https://raw.githubusercontent.com/design-automation/mobius-parametric-modeller/master/src/assets/gallery/function_examples/make.Polyline.mob&node=1
)  
  
## Polygon  
* **Description:** Adds one or more new polygons to the model.  
* **Parameters:**  
  * *entities:* List of positions, or list of lists of positions, or entities from which positions can be extracted.  
* **Returns:** Entities, new polygon, or a list of new polygons.  
* **Examples:**  
  * polygon1 = make.Polygon([position1,position2,position3])  
    Creates a polygon with vertices position1, position2, position3 in sequence.  
* **Example URLs:**  
  1. [make.Polygon.mob](https://design-automation.github.io/mobius-parametric-modeller-0-4-34/flowchart?file=https://raw.githubusercontent.com/design-automation/mobius-parametric-modeller/master/src/assets/gallery/function_examples/make.Polygon.mob&node=1
)  
  
## Collection  
* **Description:** Adds a new collection to the model.  
* **Parameters:**  
  * *parent_coll:* Collection  
  * *geometry:* List of points, polylines, polygons.  
* **Returns:** Entities, new collection, or a list of new collections.  
* **Examples:**  
  * collection1 = make.Collection([point1,polyine1,polygon1])  
    Creates a collection containing point1, polyline1, polygon1.  
* **Example URLs:**  
  1. [make.Collection.mob](https://design-automation.github.io/mobius-parametric-modeller-0-4-34/flowchart?file=https://raw.githubusercontent.com/design-automation/mobius-parametric-modeller/master/src/assets/gallery/function_examples/make.Collection.mob&node=1
)  
  
## Copy  
* **Description:** Adds a new copy of specified entities to the model.  
* **Parameters:**  
  * *entities:* Position, point, polyline, polygon, collection to be copied.  
  * *copy_attributes:* Enum to copy attributes or to have no attributes copied.  
* **Returns:** Entities, the copied entity or a list of copied entities.  
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
~
The hole positions should lie within the polygon surface.  
* **Parameters:**  
  * *face:* A polygon or a face to make holes in.  
  * *positions:* List of positions, or list of lists of positions, or entities from which positions can be extracted.  
* **Returns:** Entities, a list of wires resulting from the hole(s).  
  
## Loft  
* **Description:** Lofts between entities.
~
The geometry that is generated depends on the method that is selected.
The 'loft_quads' methods will generate polygons.
The 'loft_stringers' and 'loft_ribs' methods will generate polylines.  
* **Parameters:**  
  * *entities:* List of entities, or list of lists of entities.  
  * *divisions:* undefined  
  * *method:* Enum, if 'closed', then close the loft back to the first entity in the list.  
* **Returns:** Entities, a list of new polygons or polylines resulting from the loft.  
* **Examples:**  
  * quads = make.Loft([polyline1,polyline2,polyline3], 1, 'open_quads')  
    Creates quad polygons lofting between polyline1, polyline2, polyline3.  
  * quads = make.Loft([polyline1,polyline2,polyline3], 1, 'closed_quads')  
    Creates quad polygons lofting between polyline1, polyline2, polyline3, and back to polyline1.  
  * quads = make.Loft([ [polyline1,polyline2], [polyline3,polyline4] ] , 1, 'open_quads')  
    Creates quad polygons lofting first between polyline1 and polyline2, and then between polyline3 and polyline4.
  
  
## Extrude  
* **Description:** Extrudes geometry by distance or by vector.
- Extrusion of a position, vertex, or point produces polylines;
- Extrusion of an edge, wire, or polyline produces polygons;
- Extrusion of a face or polygon produces polygons, capped at the top.  
* **Parameters:**  
  * *entities:* Vertex, edge, wire, face, position, point, polyline, polygon, collection.  
  * *distance:* Number or vector. If number, assumed to be [0,0,value] (i.e. extrusion distance in z-direction).  
  * *divisions:* Number of divisions to divide extrusion by. Minimum is 1.  
  * *method:* Enum, when extruding edges, select quads, stringers, or ribs  
* **Returns:** Entities, a list of new polygons or polylines resulting from the extrude.  
* **Examples:**  
  * extrusion1 = make.Extrude(point1, 10, 2, 'quads')  
    Creates a polyline of total length 10 (with two edges of length 5 each) in the z-direction.
In this case, the 'quads' setting is ignored.  
  * extrusion2 = make.Extrude(polygon1, [0,5,0], 1, 'quads')  
    Extrudes polygon1 by 5 in the y-direction, creating a list of quad surfaces.
  
  
## Divide  
* **Description:** Divides edges in a set of shorter edges.
~
If the 'by_number' method is selected, then each edge is divided into a fixed number of equal length shorter edges.
If the 'by length' method is selected, then each edge is divided into shorter edges of the specified length.
The length of the last segment will be the remainder.
If the 'by_min_length' method is selected,
then the edge is divided into the maximum number of shorter edges
that have a new length that is equal to or greater than the minimum.
~  
* **Parameters:**  
  * *edges:* Edges, or entities from which edges can be extracted.  
  * *divisor:* Segment length or number of segments.  
  * *method:* Enum, select the method for dividing edges.  
* **Returns:** Entities, a list of new edges resulting from the divide.  
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
* **Returns:** Entities, a list of new positions resulting from the unweld.  
* **Examples:**  
  * mod.Unweld(polyline1)  
    Unwelds polyline1 from all ther entities that shares the same position.
  
  
