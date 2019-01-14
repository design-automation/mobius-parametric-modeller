#GIATTRIBSQUERY    

##_parse_name_str  
* **Description:** Parese the attribute name. Handles names with indexes, e.g. 'name[2]'
Split the name into the string name and the numeric index  
* **Parameters:**  
  * *value_str:* undefined  
  
##_parse_query_component  
* **Description:** Parse a query component string.  
* **Parameters:**  
  * *query_component:* undefined  
  
##_parse_sort_component  
* **Description:** Parse a query component string.  
* **Parameters:**  
  * *sort_component:* undefined  
  
##_parse_value_str  
* **Description:** Parse the attribute value. Handles sting with quotes, e.g. 'this' and "that".
Remove quotes from value string  
* **Parameters:**  
  * *value_str:* undefined  
  
##parseQuery  
* **Description:** Parse a query string.
&& takes precedence over ||
[ [ query1 && query2 ] || [ query3 && query4 ] ]  
* **Parameters:**  
  * *query_str:* undefined  
  
##parseSort  
* **Description:** Parse a sort string. #@name1 && #@name2
Rerurns an array,[ query1, query2 ]  
* **Parameters:**  
  * *sort_str:* undefined  
  
