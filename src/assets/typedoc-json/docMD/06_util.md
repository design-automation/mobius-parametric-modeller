# UTIL    

## ImportData  
* **Description:** Imports data into the model.
In order to get the model data from a file, you need to define the File or URL parameter
in the Start node of the flowchart.  
* **Parameters:**  
  * *model_data:* The model data  
  * *data_format:* Enum, the file format.  
* **Returns:** A list of the positions, points, polylines, polygons and collections added to the model.  
* **Examples:**  
  * util.ImportData (file1_data, obj)  
    Imports the data from file1 (defining the .obj file uploaded in 'Start' node).
  
  
## ExportData  
* **Description:** Export data from the model as a file.
This will result in a popup in your browser, asking you to save the filel.  
* **Parameters:**  
  * *filename:* Name of the file as a string.  
  * *data_format:* Enum, the file format.  
* **Returns:** Boolean.  
* **Examples:**  
  * util.ExportData ('my_model.obj', obj)  
    Exports all the data in the model as an OBJ.
  
  
