# VISUALIZE  
  
## Color  
  
  
**Description:** Sets color by creating a vertex attribute called 'rgb' and setting the value.

  
  
**Parameters:**  
  * *entities:* The entities for which to set the color.  
  * *color:* The color, [0,0,0] is black, [1,1,1] is white.  
  
**Returns:** void  
  
  
## Gradient  
  
  
**Description:** Generates a colour range based on a numeric attribute.
Sets the color by creating a vertex attribute called 'rgb' and setting the value.

  
  
**Parameters:**  
  * *entities:* The entities for which to set the color.  
  * *attrib:* The numeric attribute to be used to create the gradient.
You can spacify an attribute with an index. For example, ['xyz', 2] will create a gradient based on height.  
  * *range:* The range of the attribute, [minimum, maximum].
If only one number, it defaults to [0, maximum]. If null, then the range will be auto-calculated.  
  * *method:* Enum, the colour gradient to use.  
  
**Returns:** void  
  
  
## Edge  
  
  
**Description:** Controls how edges are visualized by setting the visibility of the edge.


The method can either be 'visible' or 'hidden'.
'visible' means that an edge line will be visible.
'hidden' means that no edge lines will be visible.

  
  
**Parameters:**  
  * *entities:* A list of edges, or other entities from which edges can be extracted.  
  * *method:* Enum, visible or hidden.  
  
**Returns:** void  
  
  
## Mesh  
  
  
**Description:** Controls how polygon meshes are visualized by creating normals on vertices.


The method can either be 'faceted' or 'smooth'.
'faceted' means that the normal direction for each vertex will be perpendicular to the polygon to which it belongs.
'smooth' means that the normal direction for each vertex will be the average of all polygons welded to this vertex.

  
  
**Parameters:**  
  * *entities:* Vertices belonging to polygons, or entities from which polygon vertices can be extracted.  
  * *method:* Enum, the types of normals to create, faceted or smooth.  
  
**Returns:** void  
  
  
## Ray  
  
  
**Description:** Visualises a ray or a list of rays by creating a polyline with an arrow head.  
  
**Parameters:**  
  * *rays:* Polylines representing the ray or rays.  
  * *scale:* Scales the arrow head of the vector.  
  
**Returns:** entities, a line with an arrow head representing the ray.  
**Examples:**  
  * ray1 = visualize.Ray([[1,2,3],[0,0,1]])
  
  
  
## Plane  
  
  
**Description:** Visualises a plane or a list of planes by creating polylines.  
  
**Parameters:**  
  * *planes:* undefined  
  * *scale:* undefined  
  
**Returns:** Entities, a square plane polyline and three axis polyline.  
**Examples:**  
  * plane1 = visualize.Plane(position1, vector1, [0,1,0])  
    Creates a plane with position1 on it and normal = cross product of vector1 with y-axis.
  
  
  
## BBox  
  
  
**Description:** Visualises a bounding box by adding geometry to the model.  
  
**Parameters:**  
  * *bboxes:* A list of lists.  
  
**Returns:** Entities, twelve polylines representing the box.  
**Examples:**  
  * bbox1 = virtual.viBBox(position1, vector1, [0,1,0])  
    Creates a plane with position1 on it and normal = cross product of vector1 with y-axis.
  
  
  
