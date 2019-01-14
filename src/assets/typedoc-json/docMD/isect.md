# ISECT    

## Intersect  
* **Description:** Adds positions by intersecting polylines, planes, and polygons.  
* **Parameters:**  
  * *entities1:* First polyline, plane, face, or polygon.  
  * *entities2:* Second polyline, plane face, or polygon.  
* **Returns:** List of positions.  
* **Examples:**  
  * intersect1 = isect.Intersect (object1, object2)  
    Returns a list of positions at the intersections between both objects.
  
  
## Knife  
* **Description:** Separates a list of points, polylines or polygons into two lists with a plane.  
* **Parameters:**  
  * *geometry:* List of points, polylines or polygons.  
  * *plane:* Knife.  
  * *keep:* Keep above, keep below, or keep both lists of separated points, polylines or polygons.  
* **Returns:** List, or list of two lists, of points, polylines or polygons.  
* **Examples:**  
  * knife1 = isect.Knife ([p1,p2,p3,p4,p5], plane1, keepabove)  
    Returns [[p1,p2,p3],[p4,p5]] if p1, p2, p3 are points above the plane and p4, p5 are points below the plane.
  
  
## Split  
* **Description:** Splits a polyline or polygon with a polyline.  
* **Parameters:**  
  * *geometry:* A list of polylines or polygons to be split.  
  * *polyline:* Splitter.  
* **Returns:** List of two lists containing polylines or polygons.  
* **Examples:**  
  * splitresult = isect.Split (pl1, pl2)  
    Returns [[pl1A],[pl1B]], where pl1A and pl1B are polylines resulting from the split occurring where pl1 and pl2 intersect.
  
  
