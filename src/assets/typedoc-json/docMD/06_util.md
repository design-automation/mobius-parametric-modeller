# UTIL    

## ReadData  
* **Description:** Read data from a Url or from local storage.  
* **Parameters:**  
  * *data:* The data to be read (from URL or from Local Storage).  
* **Returns:** the data.  
  
## WriteData  
* **Description:** Save data to the hard disk or to the local storage.  
* **Parameters:**  
  * *data:* The data to be saved (can be the url to the file).  
  * *file_name:* The name to be saved in the file system (file extension should be included).  
  * *data_target:* Enum, where the data is to be exported to.  
* **Returns:** whether the data is successfully saved.  
  
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
This will result in a popup in your browser, asking you to save the file.  
* **Parameters:**  
  * *entities:* Optional. Entities to be exported. If null, the whole model will be exported.  
  * *filename:* Name of the file as a string.  
  * *data_format:* Enum, the file format.  
  * *data_target:* Enum, where the data is to be exported to.  
* **Returns:** Boolean.  
* **Examples:**  
  * util.ExportData ('my_model.obj', obj)  
    Exports all the data in the model as an OBJ.
  
  
## ExportIO  
* **Description:** Export data from the model as a file.
This will result in a popup in your browser, asking you to save the filel.  
* **Parameters:**  
  * *__console__:* undefined  
  * *__fileName__:* undefined  
  * *filename:* Name of the file as a string.  
  * *exportParams:* Enum.  
  * *exportContent:* Enum.  
* **Returns:** Boolean.  
* **Examples:**  
  * util.ExportIO('my_model.json')  
    Exports all the data in the model as an OBJ.
  
  
## convertString  
* **Description:** undefined  
* **Parameters:**  
  * *value:* undefined  
  
## ParamInfo  
* **Description:** Returns a text summary of the contents of this model  
* **Parameters:**  
* **Returns:** Text that summarises what is in the model.  
  
## ModelInfo  
* **Description:** Returns a text summary of the contents of this model  
* **Parameters:**  
* **Returns:** Text that summarises what is in the model, click print to see this text.  
  
## ModelCompare  
* **Description:** Compare the GI data in this model to the GI data in another model.
~
For specifying the location of the GI Model, you can either specify a URL,
or the name of a file in LocalStorage.
In the latter case, you do not specify a path, you just specify the file name, e.g. 'my_model.gi'  
* **Parameters:**  
  * *gi_model:* The location of the GI Model to compare this model to.  
  * *method:* Enum, method used to compare this model to the other model specified in the gi_model parameter.  
* **Returns:** Text that summarises the comparison between the two models.  
  
## ModelCheck  
* **Description:** Check the internal consistency of the model.  
* **Parameters:**  
* **Returns:** Text that summarises what is in the model, click print to see this text.  
  
## saveResource  
* **Description:** Functions for saving and loading resources to file system.  
* **Parameters:**  
  * *file:* undefined  
  * *name:* undefined  
  
## saveToFS  
* **Description:** undefined  
* **Parameters:**  
  * *fs:* undefined  
  
