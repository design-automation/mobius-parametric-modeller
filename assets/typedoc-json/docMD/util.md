# UTIL  
  
## Select  
  
  
**Description:** Select entities in the model.  
  
**Parameters:**  
  * *entities:* undefined  
  
**Returns:** void  
  
  
## ParamInfo  
  
  
**Description:** Returns am html string representation of the parameters in this model  
  
**Parameters:**  
  
**Returns:** Text that summarises what is in the model.  
  
  
## EntityInfo  
  
  
**Description:** Returns an html string representation of one or more entities in the model.  
  
**Parameters:**  
  * *entities:* One or more objects ot collections.  
  
**Returns:** void  
  
  
## ModelInfo  
  
  
**Description:** Returns an html string representation of the contents of this model  
  
**Parameters:**  
  
**Returns:** Text that summarises what is in the model, click print to see this text.  
  
  
## ModelCheck  
  
  
**Description:** Checks the internal consistency of the model.  
  
**Parameters:**  
  
**Returns:** Text that summarises what is in the model, click print to see this text.  
  
  
## ModelCompare  
  
  
**Description:** Compares two models.
Checks that every entity in this model also exists in the input_data.  
  
**Parameters:**  
  * *input_data:* The location of the GI Model to compare this model to.  
  
**Returns:** Text that summarises the comparison between the two models.  
  
  
## ModelMerge  
  
  
**Description:** Merges data from another model into this model.
This is the same as importing the model, except that no collection is created.  
  
**Parameters:**  
  * *input_data:* The location of the GI Model to import into this model to.  
  
**Returns:** Text that summarises the comparison between the two models.  
  
  
## SendData  
  
  
**Description:** Post a message to the parent window.  
  
**Parameters:**  
  * *data:* The data to send, a list or a dictionary.  
  
**Returns:** Text that summarises what is in the model, click print to see this text.  
  
  
