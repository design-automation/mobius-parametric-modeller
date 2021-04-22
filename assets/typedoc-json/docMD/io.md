# IO  
  
## Read  
  
  
**Description:** Read data from a Url or from local storage.  
  
**Parameters:**  
  * *data:* The data to be read (from URL or from Local Storage).  
  
**Returns:** the data.  
  
  
## Write  
  
  
**Description:** Write data to the hard disk or to the local storage.  
  
**Parameters:**  
  * *data:* The data to be saved (can be the url to the file).  
  * *file_name:* The name to be saved in the file system (file extension should be included).  
  * *data_target:* Enum, where the data is to be exported to.  
  
**Returns:** whether the data is successfully saved.  
  
  
## Import  
  
  
**Description:** Imports data into the model.


There are two ways of specifying the file location to be imported:
- A url, e.g. "https://www.dropbox.com/xxxx/my_data.obj"
- A file name in the local storage, e.g. "my_data.obj".


To place a file in local storage, go to the Mobius menu, and select 'Local Storage' from the dropdown.
Note that a codescript using a file in local storage may fail when others try to open the file.

  
  
**Parameters:**  
  * *input_data:* undefined  
  * *data_format:* Enum, the file format.  
  
**Returns:** A list of the positions, points, polylines, polygons and collections added to the model.  
**Examples:**  
  * io.Import ("my_data.obj", obj)  
    Imports the data from my_data.obj, from local storage.
  
  
  
## Export  
  
  
**Description:** Export data from the model as a file.


If you expore to your  hard disk,
it will result in a popup in your browser, asking you to save the file.


If you export to Local Storage, there will be no popup.

  
  
**Parameters:**  
  * *entities:* Optional. Entities to be exported. If null, the whole model will be exported.  
  * *file_name:* Name of the file as a string.  
  * *data_format:* Enum, the file format.  
  * *data_target:* Enum, where the data is to be exported to.  
  
**Returns:** void.  
**Examples:**  
  * io.Export (#pg, 'my_model.obj', obj)  
    Exports all the polgons in the model as an OBJ.
  
  
  
## saveResource  
  
  
**Description:** Functions for saving and loading resources to file system.  
  
**Parameters:**  
  * *file:* undefined  
  * *name:* undefined  
  
  
## getURLContent  
  
  
**Description:** undefined  
  
**Parameters:**  
  * *url:* undefined  
  
  
## openZipFile  
  
  
**Description:** undefined  
  
**Parameters:**  
  * *zipFile:* undefined  
  
  
## loadFromFileSystem  
  
  
**Description:** undefined  
  
**Parameters:**  
  * *filecode:* undefined  
  
  
