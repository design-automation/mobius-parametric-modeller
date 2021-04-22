# POLY2D  
  
## Voronoi  
  
  
**Description:** Create a voronoi subdivision of one or more polygons.

  
  
**Parameters:**  
  * *pgons:* A list of polygons, or entities from which polygons can be extracted.  
  * *entities:* A list of positions, or entities from which positions can be extracted.  
  
**Returns:** A list of new polygons.  
  
  
## Delaunay  
  
  
**Description:** Create a delaunay triangulation of set of positions.

  
  
**Parameters:**  
  * *entities:* A list of positions, or entities from which positions can be extracted.  
  
**Returns:** A list of new polygons.  
  
  
## ConvexHull  
  
  
**Description:** Create a voronoi subdivision of a polygon.  
  
**Parameters:**  
  * *entities:* A list of positions, or entities from which positions can bet extracted.  
  
**Returns:** A new polygons, the convex hull of the positions.  
  
  
## BBoxPolygon  
  
  
**Description:** Create a polygon that is a 2D bounding box of the entities.


For the method, 'aabb' generates an Axis Aligned Bounding Box, and 'obb' generates an Oriented Bounding Box.

  
  
**Parameters:**  
  * *entities:* A list of positions, or entities from which positions can bet extracted.  
  * *method:* Enum, the method for generating the bounding box.  
  
**Returns:** A new polygon, the bounding box of the positions.  
  
  
## Union  
  
  
**Description:** Create the union of a set of polygons.  
  
**Parameters:**  
  * *entities:* A list of polygons, or entities from which polygons can bet extracted.  
  
**Returns:** A list of new polygons.  
  
  
## Boolean  
  
  
**Description:** Perform a boolean operation on polylines or polygons.


The entities in A can be either polyline or polygons.
The entities in B must be polygons.
The polygons in B are first unioned before the operation is performed.
The boolean operation is then performed between each polyline or polygon in A, and the unioned B polygons.


If A is an empty list, then an empty list is returned.
If B is an empty list, then the A list is returned.

  
  
**Parameters:**  
  * *a_entities:* A list of polyline or polygons, or entities from which polyline or polygons can be extracted.  
  * *b_entities:* A list of polygons, or entities from which polygons can be extracted.  
  * *method:* Enum, the boolean operator to apply.  
  
**Returns:** A list of new polylines and polygons.  
  
  
## OffsetMitre  
  
  
**Description:** Offset a polyline or polygon, with mitered joints.  
  
**Parameters:**  
  * *entities:* A list of pollines or polygons, or entities from which polylines or polygons can be extracted.  
  * *dist:* Offset distance  
  * *limit:* Mitre limit  
  * *end_type:* Enum, the type of end shape for open polylines'.  
  
**Returns:** A list of new polygons.  
  
  
## OffsetChamfer  
  
  
**Description:** Offset a polyline or polygon, with chamfered joints.  
  
**Parameters:**  
  * *entities:* A list of pollines or polygons, or entities from which polylines or polygons can be extracted.  
  * *dist:* Offset distance  
  * *end_type:* Enum, the type of end shape for open polylines'.  
  
**Returns:** A list of new polygons.  
  
  
## OffsetRound  
  
  
**Description:** Offset a polyline or polygon, with round joints.  
  
**Parameters:**  
  * *entities:* A list of pollines or polygons, or entities from which polylines or polygons can be extracted.  
  * *dist:* Offset distance  
  * *tolerance:* The tolerance for the rounded corners.  
  * *end_type:* Enum, the type of end shape for open polylines'.  
  
**Returns:** A list of new polygons.  
  
  
## Stitch  
  
  
**Description:** Adds vertices to polyline and polygons at all locations where egdes intersect one another.
The vertices are welded.
This can be useful for creating networks that can be used for shortest path calculations.
~
The input polyline and polygons are copied.
~  
  
**Parameters:**  
  * *entities:* A list polylines or polygons, or entities from which polylines or polygons can be extracted.  
  * *tolerance:* The tolerance for extending open plines if they are almost intersecting.  
  
**Returns:** Copies of the input polyline and polygons, stiched.  
  
  
## Clean  
  
  
**Description:** Clean a polyline or polygon.


Vertices that are closer together than the specified tolerance will be merged.
Vertices that are colinear within the tolerance distance will be deleted.

  
  
**Parameters:**  
  * *entities:* A list of polylines or polygons, or entities from which polylines or polygons can be extracted.  
  * *tolerance:* The tolerance for deleting vertices from the polyline.  
  
**Returns:** A list of new polygons.  
  
  
