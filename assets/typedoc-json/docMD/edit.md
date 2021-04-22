# EDIT  
  
## Divide  
  
  
**Description:** Divides edges into a set of shorter edges.


- If the `by_number` method is selected, then each edge is divided into
a fixed number of equal length shorter edges.
- If the `by_length` method is selected, then each edge is divided into
shorter edges of the specified length.
- The length of the last segment will be the remainder.
- If the `by_min_length` method is selected,
then the edge is divided into the number of shorter edges
with lengths equal to or greater than the minimum length specified.
- If the `by_max_length` method is selected,
then the edge is divided into the number of shorter edges
with lengths equal to or less than the maximum length specified.

  
  
**Parameters:**  
  * *entities:* Edges, or entities from which edges can be extracted.  
  * *divisor:* Segment length or number of segments.  
  * *method:* Enum, select the method for dividing edges.  
  
**Returns:** Entities, a list of new edges resulting from the divide operation.  
**Examples:**  
  * `segments1 = make.Divide(edge1, 5, by_number)`  
    Creates a list of 5 equal length edges from edge1.  
  * `segments2 = make.Divide(edge1, 5, by_length)`  
    If edge1 has length 13, creates two new edges of length 5 and one new edge of length 3.
  
  
  
## Hole  
  
  
**Description:** Makes one or more holes in a polygon.


The holes are specified by lists of positions.
The positions must be on the polygon, i.e. they must be co-planar with the polygon and
they must be within the boundary of the polygon. (Even positions touching the edge of the polygon
can result in no hole being generated.)


Multiple holes can be created.
- If the positions is a single list, then a single hole will be generated.
- If the positions is a list of lists, then multiple holes will be generated.

  
  
**Parameters:**  
  * *pgon:* A polygon to make holes in.  
  * *entities:* List of positions, or nested lists of positions, or entities from which positions
can be extracted.  
  
**Returns:** Entities, a list of wires resulting from the hole(s).  
  
  
## Weld  
  
  
**Description:** Make or break welds between vertices.
If two vertices are welded, then they share the same position.


- When making a weld between vertices, a new position is created. The new position is calculate
as the average of all the existing positions of the vertices. The vertices will then be linked
to the new position. This means that if the position is later moved, then all vertices will be
affected. The new position is returned. The positions that become shared are returned.
- When breaking a weld between vetices, existing positions are duplicated. Each vertex is then
linked to one of these duplicate positions. If these positions are later moved, then only one
vertex will be affected.  The new positions that get generated are returned.

  
  
**Parameters:**  
  * *entities:* Entities, a list of vertices, or entities from which vertices can be extracted.  
  * *method:* Enum; the method to use, either `make_weld` or `break_weld`.  
  
**Returns:** void  
  
  
## Fuse  
  
  
**Description:** Fuse positions that lie within a certain tolerance of one another.
New positions will be created.


The existing positions are analysed and clustered into groups of positions that lie with the
tolerance distance from one another. For each cluster, a new position is created at the centre
of the cluster. The xyz coordinates of the new position will be calculated as the average of all
the existing positions in the cluster.


If the positions that are fuse have vertices attached, then the vertices will become welded.
(Note that when using the `edit.Weld()` function, there is no threshold tolerance. Even vertices
that are far apart can be welded together. Fusing allows only vertices that are close together
to be welded.)


In some cases, if edges are shorter than the tolerance, this can result in edges being deleted.
The deletion of edges may also result in polylines or polygons being deleted. (It is therefore
advisable to filter out deleted entities after applying the `edit.Fuse()` function. For example,
if you have a list of polygons, after fusing, you can filter the list like this:
`pgons = pgons#pg`.)


The new positions that get generated are returned.

  
  
**Parameters:**  
  * *entities:* Entities, a list of positions, or entities from which positions can be extracted.  
  * *tolerance:* The distance tolerance for fusing positions.  
  
**Returns:** void  
  
  
## Ring  
  
  
**Description:** Opens or closes a polyline.


A polyline can be open or closed. A polyline consists of a sequence of vertices and edges.
Edges connect pairs of vertices.
- An open polyline has no edge connecting the first and last vertices. Closing a polyline
adds this edge.
- A closed polyline has an edge connecting the first and last vertices. Opening a polyline
deletes this edge.

  
  
**Parameters:**  
  * *entities:* Polyline(s).  
  * *method:* Enum; the method to use, either `open` or `close`.  
  
**Returns:** void  
**Examples:**  
  * `edit.Ring([polyline1,polyline2,...], method='close')`  
    If open, polylines are changed to closed; if already closed, nothing happens.
  
  
  
## Shift  
  
  
**Description:** Shifts the order of the edges in a closed wire.


In a closed wire (either a closed polyline or polygon), the edges form a closed ring. Any edge
(or vertex) could be the first edge of the ring. In some cases, it is useful to have an edge in
a particular position in a ring. This function allows the edges to be shifted either forwards or
backwards around the ring. The order of the edges in the ring will remain unchanged.


- An offset of zero has no effect.
- An offset of 1 will shift the edges so that the second edge becomes the first edge.
- An offset of 2 will shift the edges so that the third edge becomes the first edge.
- An offset of -1 will shift the edges so that the last edge becomes the first edge.

  
  
**Parameters:**  
  * *entities:* Wire, face, polyline, polygon.  
  * *offset:* The offset, a positive or negative integer.  
  
**Returns:** void  
**Examples:**  
  * `modify.Shift(polygon1, 1)`  
    Shifts the edges in the polygon wire, so that the every edge moves back by one position
in the ring. The first edge will become the last edge.  
  * `edit.Shift(polyline1, -1)`  
    Shifts the edges in the closed polyline wire, so that every edge moves up by one position
in the ring. The last edge will become the first edge.
  
  
  
## Reverse  
  
  
**Description:** Reverses direction of wires, polylines or polygons.


The order of vertices and edges in the wires will be reversed.


For polygons this also means that they will face in the opposite direction. The back face and
front face will be flipped. If the normal is calculated, it will face in the opposite direction.

  
  
**Parameters:**  
  * *entities:* Wire,polyline, polygon.  
  
**Returns:** void  
**Examples:**  
  * `modify.Reverse(polygon1)`  
    Flips polygon and reverses its normal.  
  * `edit.Reverse(polyline1)`  
    Reverses the order of vertices and edges in the polyline.
  
  
  
## Delete  
  
  
**Description:** Deletes geometric entities: positions, points, polylines, polygons, and collections.


- When deleting positions, any topology that requires those positions will also be deleted.
(For example, any vertices linked to the deleted position will also be deleted,
which may in turn result in some edges being deleted, and so forth.)
- When deleting objects (points, polylines, and polygons), topology is also deleted.
- When deleting collections, the objects and other collections in the collection are also deleted.


Topological entities inside objects  (wires, edges, vertices) cannot be deleted.
If a topological entity needs to be deleted, then the current approach is create a new object
with the desired topology, and then to delete the original object.

  
  
**Parameters:**  
  * *entities:* Positions, points, polylines, polygons, collections.  
  * *method:* Enum, delete or keep unused positions.  
  
**Returns:** void  
**Examples:**  
  * `edit.Delete(polygon1, 'delete_selected')`  
    Deletes `polygon1` from the model. The topology for
`polygon1` will be deleted. In addition, any positions being used by `polygon1` will be deleted
only if they are not being used by other objects.  
  * `edit.Delete(polygon1, 'keep_selected')`  
    Deletes everything except `polygon1` from the model. The topology and positions for
`polygon1` will not be deleted.
  
  
  
